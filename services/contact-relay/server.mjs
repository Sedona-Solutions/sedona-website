// Relais du formulaire de contact sedona.fr -> API Brevo (e-mail transactionnel).
//
// Le site est statique (GitHub Pages) : il ne peut pas détenir la clé API Brevo,
// qui serait lisible par tous. Ce service, déployé sur le Kubernetes Sedona, reçoit
// le formulaire, le valide, puis envoie l'e-mail via Brevo avec la clé gardée en Secret.
//
// Aucune dépendance npm : Node >= 22 (fetch natif). Configuration par variables
// d'environnement (cf. README.md et k8s/configmap.yaml).
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";

const TYPES = {
  projet: { libelle: "Projet", requis: ["nom", "prenom", "email", "entreprise", "message"] },
  postuler: { libelle: "Candidature", requis: ["nom", "prenom", "email", "poste"] },
  autre: { libelle: "Autre demande", requis: ["nom", "prenom", "email", "message"] },
};

const CHAMPS = {
  nom: 100,
  prenom: 100,
  email: 200,
  telephone: 40,
  entreprise: 200,
  budget: 100,
  offre: 100,
  poste: 200,
  linkedin: 300,
  message: 5000,
  page: 300,
};

const EMAIL_RE = /^[^\s@<>()[\]",;:]+@[^\s@<>()[\]",;:]+\.[^\s@<>()[\]",;:]{2,}$/;

export function lireConfig(env = process.env) {
  const liste = (v) => (v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const config = {
    port: Number(env.PORT ?? 8080),
    brevoApiKey: env.BREVO_API_KEY ?? "",
    brevoApiUrl: (env.BREVO_API_URL ?? "https://api.brevo.com/v3").replace(/\/+$/, ""),
    expediteur: { email: env.CONTACT_FROM_EMAIL ?? "", name: env.CONTACT_FROM_NAME ?? "Site sedona.fr" },
    destinataires: {
      defaut: liste(env.CONTACT_TO),
      projet: liste(env.CONTACT_TO_PROJET),
      postuler: liste(env.CONTACT_TO_POSTULER),
      autre: liste(env.CONTACT_TO_AUTRE),
    },
    originesAutorisees: liste(env.ALLOWED_ORIGINS),
    listeBrevo: env.BREVO_LIST_ID ? Number(env.BREVO_LIST_ID) : null,
    attributNom: env.BREVO_ATTR_NOM ?? "NOM",
    attributPrenom: env.BREVO_ATTR_PRENOM ?? "PRENOM",
    limiteParIp: Number(env.RATE_LIMIT_MAX ?? 5),
    fenetreLimiteMs: Number(env.RATE_LIMIT_WINDOW_S ?? 600) * 1000,
  };
  const manquants = [
    !config.brevoApiKey && "BREVO_API_KEY",
    !config.expediteur.email && "CONTACT_FROM_EMAIL",
    !config.destinataires.defaut.length && "CONTACT_TO",
    !config.originesAutorisees.length && "ALLOWED_ORIGINS",
  ].filter(Boolean);
  if (manquants.length) throw new Error(`Configuration incomplète : ${manquants.join(", ")}`);
  return config;
}

const echapper = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** Valide et normalise la demande. Retourne { demande } ou { erreur }. */
export function valider(corps) {
  if (!corps || typeof corps !== "object") return { erreur: "Requête invalide." };
  const type = TYPES[corps.type] ? corps.type : null;
  if (!type) return { erreur: "Type de demande inconnu." };

  const demande = { type };
  for (const [champ, max] of Object.entries(CHAMPS)) {
    const v = corps[champ];
    if (v == null || v === "") continue;
    if (typeof v !== "string") return { erreur: `Champ invalide : ${champ}.` };
    const t = v.trim();
    if (t.length > max) return { erreur: `Champ trop long : ${champ}.` };
    if (t) demande[champ] = t;
  }
  const manquants = TYPES[type].requis.filter((c) => !demande[c]);
  if (manquants.length) return { erreur: `Champs obligatoires manquants : ${manquants.join(", ")}.` };
  if (!EMAIL_RE.test(demande.email)) return { erreur: "Adresse e-mail invalide." };
  if (demande.linkedin && !/^https?:\/\//i.test(demande.linkedin)) return { erreur: "Lien LinkedIn invalide." };
  return { demande };
}

export function construireEmail(demande, config) {
  const { libelle } = TYPES[demande.type];
  const qui = `${demande.prenom} ${demande.nom}`;
  const precision = demande.type === "projet" ? demande.offre : demande.type === "postuler" ? demande.poste : "";
  const sujet = ["[sedona.fr]", libelle, precision && `— ${precision}`, `— ${qui}`, demande.entreprise && `(${demande.entreprise})`]
    .filter(Boolean)
    .join(" ");

  const lignes = [
    ["Type de demande", libelle],
    ["Nom", demande.nom],
    ["Prénom", demande.prenom],
    ["E-mail", demande.email],
    ["Téléphone", demande.telephone],
    ["Entreprise", demande.entreprise],
    ["Offre souhaitée", demande.offre],
    ["Budget", demande.budget],
    ["Poste visé", demande.poste],
    ["LinkedIn", demande.linkedin],
    ["Page d'origine", demande.page],
  ].filter(([, v]) => v);

  const html = `<!doctype html><html lang="fr"><body style="font-family:Arial,sans-serif;color:#3b0800">
<h2 style="margin:0 0 16px">Nouvelle demande depuis sedona.fr — ${echapper(libelle)}</h2>
<table cellpadding="6" style="border-collapse:collapse">${lignes
    .map(([k, v]) => `<tr><td style="font-weight:bold;vertical-align:top">${echapper(k)}</td><td>${echapper(v)}</td></tr>`)
    .join("")}</table>
${demande.message ? `<h3 style="margin:24px 0 8px">Message</h3><p style="white-space:pre-wrap">${echapper(demande.message)}</p>` : ""}
<p style="color:#888;font-size:12px;margin-top:32px">Répondez directement à cet e-mail pour écrire à ${echapper(qui)}.</p>
</body></html>`;

  const texte = [...lignes.map(([k, v]) => `${k} : ${v}`), demande.message ? `\nMessage :\n${demande.message}` : ""].join("\n");

  const to = (config.destinataires[demande.type].length ? config.destinataires[demande.type] : config.destinataires.defaut).map(
    (email) => ({ email })
  );

  return {
    sender: config.expediteur,
    to,
    replyTo: { email: demande.email, name: qui },
    subject: sujet,
    htmlContent: html,
    textContent: texte,
    tags: ["site-contact", demande.type],
  };
}

async function appelBrevo(config, fetchImpl, chemin, corps) {
  const r = await fetchImpl(`${config.brevoApiUrl}${chemin}`, {
    method: "POST",
    headers: { "api-key": config.brevoApiKey, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(corps),
    signal: AbortSignal.timeout(10_000),
  });
  if (!r.ok) throw new Error(`Brevo ${chemin} : HTTP ${r.status} ${(await r.text()).slice(0, 300)}`);
}

/** Limitation simple par IP (mémoire du pod : suffisant contre le spam basique). */
function limiteur(max, fenetreMs) {
  const hits = new Map();
  return (ip) => {
    const maintenant = Date.now();
    const recents = (hits.get(ip) ?? []).filter((t) => maintenant - t < fenetreMs);
    recents.push(maintenant);
    hits.set(ip, recents);
    if (hits.size > 10_000) for (const [k, v] of hits) if (maintenant - v.at(-1) > fenetreMs) hits.delete(k);
    return recents.length <= max;
  };
}

function lireCorps(req, max = 32 * 1024) {
  return new Promise((resolve, reject) => {
    let taille = 0;
    const morceaux = [];
    req.on("data", (c) => {
      taille += c.length;
      if (taille > max) {
        reject(Object.assign(new Error("Requête trop volumineuse."), { statut: 413 }));
        req.destroy();
      } else morceaux.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(morceaux).toString("utf8")));
    req.on("error", reject);
  });
}

export function creerServeur(config, { fetchImpl = fetch, log = console } = {}) {
  const autoriser = limiteur(config.limiteParIp, config.fenetreLimiteMs);

  return createServer(async (req, res) => {
    const origine = req.headers.origin;
    const origineOk = origine && config.originesAutorisees.includes(origine);
    const repondre = (statut, corps) => {
      const entetes = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
      if (origineOk) Object.assign(entetes, { "access-control-allow-origin": origine, vary: "Origin" });
      res.writeHead(statut, entetes).end(corps === undefined ? undefined : JSON.stringify(corps));
    };

    const chemin = new URL(req.url ?? "/", "http://localhost").pathname;

    if (req.method === "GET" && chemin === "/healthz") return repondre(200, { ok: true });
    if (chemin !== "/contact") return repondre(404, { erreur: "Introuvable." });

    if (req.method === "OPTIONS") {
      if (!origineOk) return repondre(403, { erreur: "Origine non autorisée." });
      res.writeHead(204, {
        "access-control-allow-origin": origine,
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type",
        "access-control-max-age": "86400",
        vary: "Origin",
      });
      return res.end();
    }
    if (req.method !== "POST") return repondre(405, { erreur: "Méthode non autorisée." });
    if (!origineOk) return repondre(403, { erreur: "Origine non autorisée." });

    // Derrière l'Ingress : IP réelle du visiteur dans X-Forwarded-For.
    const ip = String(req.headers["x-forwarded-for"] ?? "").split(",")[0].trim() || req.socket.remoteAddress || "?";
    if (!autoriser(ip)) return repondre(429, { erreur: "Trop de demandes, réessayez dans quelques minutes." });

    let corps;
    try {
      if (!String(req.headers["content-type"] ?? "").includes("application/json")) {
        return repondre(415, { erreur: "Format attendu : JSON." });
      }
      corps = JSON.parse(await lireCorps(req));
    } catch (e) {
      return repondre(e.statut ?? 400, { erreur: e.statut ? e.message : "JSON invalide." });
    }

    // Champ piège : un robot le remplit, un humain ne le voit pas. On répond
    // « succès » sans rien envoyer pour ne pas l'aider à s'adapter.
    if (corps?.website_url) {
      log.info?.(`[contact] pot de miel déclenché (${ip})`);
      return repondre(200, { ok: true });
    }

    const { demande, erreur } = valider(corps);
    if (erreur) return repondre(400, { erreur });

    try {
      await appelBrevo(config, fetchImpl, "/smtp/email", construireEmail(demande, config));
    } catch (e) {
      log.error?.(`[contact] échec envoi : ${e.message}`);
      return repondre(502, { erreur: "L'envoi a échoué. Réessayez ou écrivez-nous à contact@sedona.fr." });
    }

    // Ajout du prospect dans une liste Brevo (optionnel, demandes « projet » seulement).
    // Non bloquant : l'e-mail est déjà parti.
    if (config.listeBrevo && demande.type === "projet") {
      appelBrevo(config, fetchImpl, "/contacts", {
        email: demande.email,
        attributes: { [config.attributNom]: demande.nom, [config.attributPrenom]: demande.prenom },
        listIds: [config.listeBrevo],
        updateEnabled: true,
      }).catch((e) => log.warn?.(`[contact] ajout liste Brevo impossible : ${e.message}`));
    }

    log.info?.(`[contact] demande « ${demande.type} » transmise`);
    return repondre(200, { ok: true });
  });
}

// Lancement direct : node server.mjs
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const config = lireConfig();
  const serveur = creerServeur(config);
  serveur.listen(config.port, () => console.log(`[contact] relais en écoute sur :${config.port}`));
  // Arrêt propre lors d'un rolling update Kubernetes.
  const arreter = () => serveur.close(() => process.exit(0));
  process.on("SIGTERM", arreter);
  process.on("SIGINT", arreter);
}
