// Banc de tests des liens du site : parcourt toutes les pages et signale les
// liens internes cassés (404), les ancres introuvables et, en option, les liens
// externes en erreur. Aucune dépendance : Node >= 22.
//
// Usage :
//   npm run test:liens                               → build local (dist/), après `npm run build`
//   npm run test:liens -- --externes                 → + vérifie les liens vers d'autres sites
//   npm run test:liens -- --url https://preview.sedona.fr
//                                                    → parcourt le site EN LIGNE (tel que servi par GitHub Pages)
//
// Code de sortie : 1 s'il existe au moins un lien interne cassé (bloquant en CI),
// 0 sinon. Ancres manquantes et liens externes = avertissements (non bloquants),
// sauf avec --strict.
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const option = (nom) => {
  const i = args.indexOf(nom);
  return i >= 0 ? (args[i + 1] ?? "") : undefined;
};
const URL_EN_LIGNE = option("--url")?.replace(/\/+$/, "");
const AVEC_EXTERNES = args.includes("--externes");
const STRICT = args.includes("--strict");
const RACINE = fileURLToPath(new URL("..", import.meta.url));
const DIST = path.resolve(RACINE, option("--dist") ?? "dist");

// Domaines considérés comme « le site » : un lien absolu vers l'un d'eux est
// vérifié comme un lien interne (ex. https://www.sedona.fr/ancienne-page → doit
// exister après la mise en production).
const HOTES_INTERNES = new Set(["sedona.fr", "www.sedona.fr", "preview.sedona.fr"]);
for (const u of [process.env.SITE_URL, URL_EN_LIGNE]) {
  if (u) HOTES_INTERNES.add(new URL(u).hostname);
}
const ORIGINE = "http://site.interne"; // origine fictive pour résoudre les chemins

const EXT_BINAIRES = /\.(png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|eot|pdf|mp4|webm|mp3|zip)$/i;
const UA = "Mozilla/5.0 (compatible; sedona-verifier-liens/1.0)";

// ---------------------------------------------------------------------------
// Extraction des liens d'une page HTML / d'une feuille CSS
// ---------------------------------------------------------------------------
const ENTITES = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
const decoderEntites = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) =>
    e[0] === "#"
      ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1)))
      : (ENTITES[e.toLowerCase()] ?? m)
  );

const ATTRIBUTS_PAR_BALISE = {
  a: ["href"],
  area: ["href"],
  link: ["href"],
  script: ["src"],
  img: ["src", "srcset"],
  source: ["src", "srcset"],
  video: ["src", "poster"],
  audio: ["src"],
  track: ["src"],
  iframe: ["src"],
  embed: ["src"],
  object: ["data"],
  form: ["action"],
  use: ["href", "xlink:href"],
  image: ["href", "xlink:href"],
};
const META_URL = new Set(["og:image", "og:url", "twitter:image", "og:image:url", "og:image:secure_url"]);
const LINK_IGNORES = new Set(["preconnect", "dns-prefetch"]);

function lireAttributs(chaine) {
  const attrs = {};
  for (const m of chaine.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g)) {
    attrs[m[1].toLowerCase()] = decoderEntites(m[2] ?? m[3] ?? m[4] ?? "");
  }
  return attrs;
}

const urlsCss = (css) =>
  [...css.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)|@import\s+(['"])([^'"]+)\3/g)].map((m) => (m[2] ?? m[4]).trim());

/** Retourne { liens: string[], ids: Set<string> } pour une page HTML. */
function analyserHtml(html) {
  // Contenu des <script> et commentaires : pas de vrais liens (gabarits JS, etc.).
  const propre = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, "$1</script>");
  const liens = [];
  const ids = new Set();

  for (const m of propre.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) liens.push(...urlsCss(m[1]));

  for (const m of propre.matchAll(/<([a-zA-Z][\w:-]*)\b([^>]*)>/g)) {
    const balise = m[1].toLowerCase();
    const attrs = lireAttributs(m[2]);
    if (attrs.id) ids.add(attrs.id);
    if (balise === "a" && attrs.name) ids.add(attrs.name);
    if (attrs.style) liens.push(...urlsCss(attrs.style));

    if (balise === "meta") {
      const prop = (attrs.property ?? attrs.name ?? "").toLowerCase();
      if (META_URL.has(prop) && attrs.content) liens.push(attrs.content);
      if ((attrs["http-equiv"] ?? "").toLowerCase() === "refresh") {
        const cible = /url\s*=\s*['"]?([^'"]+)/i.exec(attrs.content ?? "")?.[1];
        if (cible) liens.push(cible.trim());
      }
      continue;
    }
    if (balise === "link" && (attrs.rel ?? "").split(/\s+/).some((r) => LINK_IGNORES.has(r.toLowerCase()))) continue;

    for (const nom of ATTRIBUTS_PAR_BALISE[balise] ?? []) {
      const v = attrs[nom];
      if (!v) continue;
      if (nom === "srcset") {
        for (const morceau of v.split(/,\s+/)) {
          const u = morceau.trim().split(/\s+/)[0];
          if (u) liens.push(u);
        }
      } else liens.push(v.trim());
    }
  }
  return { liens, ids };
}

// ---------------------------------------------------------------------------
// Deux façons d'« obtenir » une URL interne : fichier de dist/ ou requête HTTP
// ---------------------------------------------------------------------------
async function estFichier(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

/** Mode local : reproduit la résolution de GitHub Pages sur dist/. */
async function obtenirLocal(chemin) {
  let rel;
  try {
    rel = decodeURIComponent(chemin);
  } catch {
    rel = chemin;
  }
  const base = path.join(DIST, rel);
  if (!base.startsWith(DIST)) return { statut: 404 };
  const candidats = rel.endsWith("/") ? [path.join(base, "index.html")] : [base, path.join(base, "index.html"), `${base}.html`];
  for (const f of candidats) {
    if (await estFichier(f)) {
      const type = f.endsWith(".html") ? "html" : f.endsWith(".css") ? "css" : f.endsWith(".xml") ? "xml" : "autre";
      return { statut: 200, type, contenu: type === "autre" ? undefined : await readFile(f, "utf8") };
    }
  }
  return { statut: 404 };
}

async function requete(url, methode) {
  return fetch(url, {
    method: methode,
    redirect: "follow",
    headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,*/*;q=0.8" },
    signal: AbortSignal.timeout(20_000),
  });
}

/** Mode en ligne : vraie requête sur le site déployé. */
async function obtenirEnLigne(chemin) {
  const url = URL_EN_LIGNE + chemin;
  try {
    if (EXT_BINAIRES.test(chemin)) {
      let r = await requete(url, "HEAD");
      if (r.status === 405) r = await requete(url, "GET");
      return { statut: r.status };
    }
    const r = await requete(url, "GET");
    const ct = r.headers.get("content-type") ?? "";
    const type = ct.includes("html") ? "html" : ct.includes("css") ? "css" : ct.includes("xml") ? "xml" : "autre";
    return { statut: r.status, type, contenu: r.ok && type !== "autre" ? await r.text() : undefined };
  } catch (e) {
    return { statut: 0, erreur: e.cause?.code ?? e.name };
  }
}

const obtenir = URL_EN_LIGNE ? obtenirEnLigne : obtenirLocal;

// ---------------------------------------------------------------------------
// Parcours
// ---------------------------------------------------------------------------
const resultats = new Map(); // chemin -> { statut, type, ids }
const references = new Map(); // chemin -> Map(page source -> Set(fragments))
const externes = new Map(); // url -> Set(pages sources)
const aTraiter = [];
const vus = new Set();

function enfiler(chemin) {
  if (!vus.has(chemin)) {
    vus.add(chemin);
    aTraiter.push(chemin);
  }
}

function noter(depuis, brut, baseUrl) {
  if (!brut || /^(mailto:|tel:|javascript:|data:|sms:|blob:|about:)/i.test(brut)) return;
  if (brut.startsWith("{") || brut.includes("${")) return; // gabarits non rendus
  let u;
  try {
    u = new URL(brut, baseUrl);
  } catch {
    return;
  }
  if (!/^https?:$/.test(u.protocol)) return;
  const interne = u.origin === ORIGINE || HOTES_INTERNES.has(u.hostname);
  if (!interne) {
    const cle = u.href.replace(/#.*$/, "");
    if (!externes.has(cle)) externes.set(cle, new Set());
    externes.get(cle).add(depuis);
    return;
  }
  const chemin = u.pathname || "/";
  if (!references.has(chemin)) references.set(chemin, new Map());
  const parSource = references.get(chemin);
  if (!parSource.has(depuis)) parSource.set(depuis, new Set());
  // Ancre à vérifier (sauf « fragments de texte » #:~:text=… gérés par le navigateur).
  if (u.hash.length > 1 && !u.hash.startsWith("#:~:")) {
    let f = u.hash.slice(1);
    try {
      f = decodeURIComponent(f);
    } catch {}
    parSource.get(depuis).add(f);
  }
  enfiler(chemin);
}

async function traiter(chemin) {
  const r = await obtenir(chemin);
  const info = { statut: r.statut, erreur: r.erreur, type: r.type };
  resultats.set(chemin, info);
  if (!r.contenu) return;
  const baseUrl = ORIGINE + chemin;
  if (r.type === "html") {
    const { liens, ids } = analyserHtml(r.contenu);
    info.ids = ids;
    for (const l of liens) noter(chemin, l, baseUrl);
  } else if (r.type === "css") {
    for (const l of urlsCss(r.contenu)) noter(chemin, l, baseUrl);
  } else if (r.type === "xml") {
    for (const m of r.contenu.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) noter(chemin, decoderEntites(m[1]), baseUrl);
  }
}

async function enParallele(limite, travail) {
  const actifs = new Set();
  while (aTraiter.length || actifs.size) {
    while (aTraiter.length && actifs.size < limite) {
      const p = travail(aTraiter.shift()).finally(() => actifs.delete(p));
      actifs.add(p);
    }
    if (actifs.size) await Promise.race(actifs);
  }
}

async function listerFichiers(dossier, filtre, acc = []) {
  for (const e of await readdir(dossier, { withFileTypes: true })) {
    const p = path.join(dossier, e.name);
    if (e.isDirectory()) await listerFichiers(p, filtre, acc);
    else if (filtre(e.name)) acc.push(p);
  }
  return acc;
}

// Points de départ : en local, TOUTES les pages et feuilles CSS du build (y compris
// celles qu'aucun lien n'atteint) ; en ligne, l'accueil + le sitemap.
const debut = Date.now();
enfiler("/");
enfiler("/sitemap.xml");
if (!URL_EN_LIGNE) {
  try {
    await stat(DIST);
  } catch {
    console.error(`Dossier ${DIST} introuvable : lancez d'abord « npm run build ».`);
    process.exit(2);
  }
  for (const f of await listerFichiers(DIST, (n) => /\.(html|css)$/.test(n))) {
    const rel = "/" + path.relative(DIST, f).split(path.sep).join("/");
    enfiler(rel.endsWith("/index.html") ? rel.slice(0, -"index.html".length) : rel);
  }
}
// Redirections SEO des anciennes URL WordPress : chaque ancienne URL doit répondre
// (page de redirection) et sa cible doit exister.
try {
  const redirections = JSON.parse(await readFile(path.join(RACINE, "src/data/redirections.json"), "utf8"));
  for (const [source, cible] of Object.entries(redirections)) {
    let src = source;
    try {
      src = encodeURI(decodeURI(source));
    } catch {}
    noter("(redirections.json)", src, ORIGINE + "/");
    noter(`(redirections.json) ${source}`, typeof cible === "string" ? cible : cible?.destination, ORIGINE + "/");
  }
} catch {}

console.log(`Vérification des liens — ${URL_EN_LIGNE ? `site en ligne ${URL_EN_LIGNE}` : `build local ${path.relative(RACINE, DIST) || DIST}`}…`);
await enParallele(URL_EN_LIGNE ? 8 : 32, traiter);

// ---------------------------------------------------------------------------
// Liens externes (optionnel)
// ---------------------------------------------------------------------------
const externesKo = [];
const externesBloques = [];
if (AVEC_EXTERNES) {
  console.log(`Vérification de ${externes.size} liens externes…`);
  const urls = [...externes.keys()];
  // Ressources techniques sans page à vérifier (polices Google, etc.).
  const ignorer = (u) => /^https:\/\/fonts\.(googleapis|gstatic)\.com\/?$/.test(u);
  let i = 0;
  const ouvrier = async () => {
    while (i < urls.length) {
      const url = urls[i++];
      if (ignorer(url)) continue;
      let statut, erreur;
      try {
        let r = await requete(url, "HEAD");
        if ([403, 404, 405, 501].includes(r.status)) r = await requete(url, "GET");
        statut = r.status;
      } catch (e) {
        erreur = e.cause?.code ?? e.name;
      }
      // LinkedIn (999), anti-robots (403/429) : la page existe sans doute, vérifier à la main.
      if (statut && [401, 403, 429, 999].includes(statut)) externesBloques.push({ url, statut });
      else if (!statut || statut >= 400) externesKo.push({ url, statut: statut ?? erreur });
    }
  };
  await Promise.all(Array.from({ length: 8 }, ouvrier));
}

// ---------------------------------------------------------------------------
// Rapport
// ---------------------------------------------------------------------------
const lister = (sources, max = 5) => {
  const l = [...sources];
  return l.slice(0, max).join(", ") + (l.length > max ? ` (+${l.length - max} autres)` : "");
};

const casses = [];
const ancresKo = [];
for (const [chemin, parSource] of references) {
  const r = resultats.get(chemin);
  if (!r) continue;
  if (r.statut < 200 || r.statut >= 400) {
    casses.push({ chemin, statut: r.statut || r.erreur, sources: parSource.keys() });
    continue;
  }
  if (!r.ids) continue;
  for (const [source, frags] of parSource) {
    for (const f of frags) if (!r.ids.has(f)) ancresKo.push({ cible: `${chemin}#${f}`, source });
  }
}
casses.sort((a, b) => a.chemin.localeCompare(b.chemin));

// « /blog » et « /blog/ » désignent la même page : on ne la compte qu'une fois.
const pages = new Set(
  [...resultats].filter(([, r]) => r.type === "html" && r.statut === 200).map(([c]) => c.replace(/(\/index\.html|\/)$/, ""))
).size;
let liensInternes = 0;
for (const parSource of references.values()) liensInternes += parSource.size;
console.log(`\n${pages} pages analysées, ${references.size} URL internes distinctes (${liensInternes} liens), ${externes.size} URL externes — ${((Date.now() - debut) / 1000).toFixed(1)} s\n`);

if (casses.length) {
  console.log(`✖ ${casses.length} lien(s) interne(s) cassé(s) :`);
  for (const c of casses) console.log(`  [${c.statut}] ${c.chemin}\n        ← ${lister(c.sources)}`);
  console.log();
} else console.log("✔ Aucun lien interne cassé.\n");

if (ancresKo.length) {
  console.log(`⚠ ${ancresKo.length} ancre(s) introuvable(s) (#section absente de la page cible) :`);
  for (const a of ancresKo.slice(0, 50)) console.log(`  ${a.cible}  ← ${a.source}`);
  if (ancresKo.length > 50) console.log(`  … et ${ancresKo.length - 50} autres`);
  console.log();
}

if (!URL_EN_LIGNE && !(await estFichier(path.join(DIST, "404.html")))) {
  console.log("⚠ Pas de page 404.html : GitHub Pages affichera sa page d'erreur générique.\n");
}

if (AVEC_EXTERNES) {
  if (externesKo.length) {
    console.log(`✖ ${externesKo.length} lien(s) externe(s) en erreur :`);
    for (const e of externesKo) console.log(`  [${e.statut}] ${e.url}\n        ← ${lister(externes.get(e.url))}`);
    console.log();
  } else console.log("✔ Aucun lien externe en erreur.\n");
  if (externesBloques.length) {
    console.log(`ℹ ${externesBloques.length} lien(s) externe(s) refusant les robots (à vérifier à la main si besoin) :`);
    for (const e of externesBloques) console.log(`  [${e.statut}] ${e.url}`);
    console.log();
  }
}

const echec = casses.length > 0 || (STRICT && (ancresKo.length > 0 || externesKo.length > 0));
process.exit(echec ? 1 : 0);
