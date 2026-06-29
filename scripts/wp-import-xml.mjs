// @ts-check
/**
 * Import des articles depuis un export WordPress WXR (.xml) → content/articles/*.md
 *
 * Lit le fichier exporté via « Outils → Exporter → Articles » de WordPress,
 * filtre les articles publiés de l'année voulue, convertit le HTML en Markdown,
 * télécharge les images de couverture (URLs publiques) et écrit un .md par
 * article au format attendu par Astro / TinaCMS.
 *
 * Pré-requis :  npm i -D turndown
 *
 * Utilisation :
 *   node scripts/wp-import-xml.mjs --file=sedona.wordpress.2026.xml --annee=2026
 *   node scripts/wp-import-xml.mjs --file=export.xml --annee=2026 --dry      (aperçu)
 *   node scripts/wp-import-xml.mjs --file=export.xml --annee=2026 --no-images
 */

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n, d) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split("=")[1] ?? d;
const has = (n) => process.argv.includes(`--${n}`);

const FILE = arg("file");
const ANNEE = Number(arg("annee", "2026"));
const DRY = has("dry");
const NO_IMG = has("no-images");

if (!FILE) {
  console.error("\n✖ Indiquez le fichier d'export WXR :\n  node scripts/wp-import-xml.mjs --file=export.xml --annee=2026\n");
  process.exit(1);
}

/** turndown (HTML → Markdown) avec fallback minimal. */
let toMarkdown;
try {
  const Turndown = (await import("turndown")).default;
  const td = new Turndown({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });
  toMarkdown = (html) => td.turndown(html || "");
} catch {
  console.warn("⚠ turndown introuvable (npm i -D turndown) — conversion HTML basique utilisée.");
  toMarkdown = (html) =>
    (html || "").replace(/<\/(p|div|h[1-6]|li)>/gi, "\n\n").replace(/<li[^>]*>/gi, "- ").replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim();
}

const cdata = (s = "") => s.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
const stripHtml = (s = "") =>
  cdata(s).replace(/<[^>]+>/g, "").replace(/&hellip;/g, "…").replace(/&#8217;|&#039;|&apos;/g, "'").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const slugify = (s = "") =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const yaml = (v) => {
  const s = String(v ?? "");
  return /[:#"'\n]|^\s|\s$/.test(s) ? `"${s.replace(/"/g, '\\"')}"` : s;
};
const get = (xml, tag) => {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return m ? cdata(m[1]) : "";
};
const all = (xml, re) => { const out = []; let m; while ((m = re.exec(xml))) out.push(m[1]); return out; };
const tempsLecture = (html) => `${Math.max(1, Math.round(stripHtml(html).split(/\s+/).filter(Boolean).length / 200))} min de lecture`;

async function dl(url, destRel) {
  if (!url || NO_IMG) return "";
  try {
    const ext = (extname(new URL(url).pathname) || ".jpg").split("?")[0];
    const rel = `${destRel}${ext}`;
    if (!DRY) {
      const abs = resolve(ROOT, "public" + rel);
      await mkdir(dirname(abs), { recursive: true });
      const r = await fetch(url);
      if (!r.ok) throw new Error(`${r.status}`);
      await writeFile(abs, Buffer.from(await r.arrayBuffer()));
    }
    return rel;
  } catch (e) {
    console.warn(`  ⚠ image non téléchargée (${url}) : ${e.message}`);
    return "";
  }
}

async function main() {
  const xml = await readFile(resolve(process.cwd(), FILE), "utf8");
  const items = xml.match(/<item\b[\s\S]*?<\/item>/g) ?? [];

  // Table des auteurs : login → nom affiché (en-tête du WXR).
  const auteurs = new Map();
  for (const a of xml.match(/<wp:author>[\s\S]*?<\/wp:author>/g) ?? []) {
    const login = get(a, "wp:author_login");
    const nom = get(a, "wp:author_display_name");
    if (login) auteurs.set(login, nom || login);
  }

  // 1) Table des pièces jointes : post_id → URL (pour résoudre l'image à la une).
  const attach = new Map();
  for (const it of items) {
    if (get(it, "wp:post_type") === "attachment") {
      const id = get(it, "wp:post_id");
      const url = get(it, "wp:attachment_url");
      if (id && url) attach.set(id, url);
    }
  }

  console.log(`\n📥 Import des articles ${ANNEE} depuis ${FILE}\n`);
  let total = 0;

  for (const it of items) {
    if (get(it, "wp:post_type") !== "post") continue;
    if (get(it, "wp:status") !== "publish") continue;
    const date = get(it, "wp:post_date") || get(it, "pubDate");
    if (new Date(date).getFullYear() !== ANNEE) continue;

    const titre = stripHtml(get(it, "title"));
    const slug = get(it, "wp:post_name") || slugify(titre);
    const login = get(it, "dc:creator");
    const auteur = auteurs.get(login) || login;
    const cats = all(it, /<category domain="category"[^>]*>([\s\S]*?)<\/category>/g).map(cdata);
    const tags = all(it, /<category domain="post_tag"[^>]*>([\s\S]*?)<\/category>/g).map(cdata);

    // image à la une via _thumbnail_id → table des pièces jointes
    let media = "";
    const metas = it.match(/<wp:postmeta>[\s\S]*?<\/wp:postmeta>/g) ?? [];
    for (const meta of metas) {
      if (get(meta, "wp:meta_key") === "_thumbnail_id") media = attach.get(get(meta, "wp:meta_value")) ?? "";
    }

    const couverture = media ? await dl(media, `/uploads/articles/wp/${slug}`) : "";
    const body = toMarkdown(get(it, "content:encoded"));

    // Extrait : celui de WP sinon repli sur le début du contenu.
    let extrait = stripHtml(get(it, "excerpt:encoded"));
    if (!extrait) {
      const t = stripHtml(get(it, "content:encoded"));
      extrait = t.length > 160 ? t.slice(0, 160).replace(/\s+\S*$/, "") + "…" : t;
    }

    const fm = [
      "---",
      `titre: ${yaml(titre)}`,
      `date: ${new Date(date).toISOString()}`,
      couverture && `couverture: ${couverture}`,
      `extrait: ${yaml(extrait)}`,
      auteur && `auteur: ${yaml(auteur)}`,
      `tempsLecture: ${yaml(tempsLecture(get(it, "content:encoded")))}`,
      cats[0] && `categorie: ${yaml(cats[0])}`,
      tags.length && `tags:\n${tags.map((t) => `  - ${yaml(t)}`).join("\n")}`,
      "---",
      "",
      body,
      "",
    ].filter(Boolean).join("\n");

    if (DRY) console.log(`  • ${slug}  «${titre}»  ${tags.length} tags${couverture ? ", couverture" : ""}`);
    else { await writeFile(resolve(ROOT, "content/articles", `${slug}.md`), fm, "utf8"); console.log(`  ✓ content/articles/${slug}.md`); }
    total++;
  }

  console.log(`\n${DRY ? "👀 Aperçu" : "✔ Import terminé"} : ${total} article(s) ${ANNEE}.${DRY ? " (rien écrit)" : ""}\n`);
}

main().catch((e) => { console.error("\n✖", e.message ?? e); process.exit(1); });
