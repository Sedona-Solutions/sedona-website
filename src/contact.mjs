// Formulaire /contact : validation, Turnstile, puis e-mail Brevo.
// Tourne dans le Worker sedona-website. Les secrets viennent de l'env du Worker.

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

const TAILLE_MAX = 32 * 1024;
const ACTION_TURNSTILE = "contact";
const EMAIL_RE = /^[^\s@<>()[\]",;:]+@[^\s@<>()[\]",;:]+\.[^\s@<>()[\]",;:]{2,}$/;

const liste = (v) => (v ?? "").split(",").map((s) => s.trim()).filter(Boolean);

export function lireConfig(env = {}) {
  const config = {
    brevoApiKey: env.BREVO_API_KEY ?? "",
    brevoApiUrl: (env.BREVO_API_URL ?? "https://api.brevo.com/v3").replace(/\/+$/, ""),
    expediteur: { email: env.CONTACT_FROM_EMAIL ?? "", name: env.CONTACT_FROM_NAME ?? "Site sedona.fr" },
    destinataires: {
      defaut: liste(env.CONTACT_TO),
      projet: liste(env.CONTACT_TO_PROJET),
      postuler: liste(env.CONTACT_TO_POSTULER),
      autre: liste(env.CONTACT_TO_AUTRE),
    },
    turnstileSecret: env.TURNSTILE_SECRET ?? "",
    turnstileHostnames: new Set(liste(env.TURNSTILE_HOSTNAMES)),
    listeBrevo: env.BREVO_LIST_ID ? Number(env.BREVO_LIST_ID) : null,
    attributNom: env.BREVO_ATTR_NOM ?? "NOM",
    attributPrenom: env.BREVO_ATTR_PRENOM ?? "PRENOM",
  };
  const manquants = [
    !config.brevoApiKey && "BREVO_API_KEY",
    !config.expediteur.email && "CONTACT_FROM_EMAIL",
    !config.destinataires.defaut.length && "CONTACT_TO",
    !config.turnstileSecret && "TURNSTILE_SECRET",
    !config.turnstileHostnames.size && "TURNSTILE_HOSTNAMES",
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

/** Jeton Turnstile à usage unique. Échoue fermé : réseau, secret, action ou hôte. */
export async function verifierTurnstile(config, fetchImpl, token, remoteip) {
  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 2048 ||
    !config.turnstileSecret ||
    config.turnstileHostnames.size === 0
  ) {
    return false;
  }
  let result;
  try {
    const body = new URLSearchParams({ secret: config.turnstileSecret, response: token });
    if (remoteip) body.set("remoteip", remoteip);
    const r = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
      body,
    });
    if (!r.ok) return false;
    result = await r.json();
  } catch {
    return false;
  }
  return result?.success === true && result.action === ACTION_TURNSTILE && config.turnstileHostnames.has(result.hostname);
}

async function appelBrevo(config, fetchImpl, chemin, corps, log) {
  const debut = Date.now();
  journal(log, "debug", {
    msg: "brevo request",
    path: chemin,
    sender: corps.sender?.email,
    to: Array.isArray(corps.to) ? corps.to.map((destinataire) => destinataire.email) : undefined,
    email: corps.email,
    listIds: corps.listIds,
  });
  const r = await fetchImpl(`${config.brevoApiUrl}${chemin}`, {
    method: "POST",
    headers: { "api-key": config.brevoApiKey, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(corps),
    signal: AbortSignal.timeout(10_000),
  });
  const duree = Date.now() - debut;
  if (!r.ok) {
    const detail = (await r.text()).slice(0, 300);
    journal(log, "debug", { msg: "brevo response", path: chemin, status: r.status, ms: duree, body: detail });
    throw new Error(`Brevo ${chemin} : HTTP ${r.status} ${detail}`);
  }
  journal(log, "debug", { msg: "brevo response", path: chemin, status: r.status, ms: duree });
}

function json(statut, corps) {
  return new Response(corps === undefined ? null : JSON.stringify(corps), {
    status: statut,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function journal(log, niveau, evenement) {
  const ligne = JSON.stringify(evenement);
  const methode = niveau === "error" ? "error" : niveau === "warn" ? "warn" : niveau === "debug" ? "debug" : "info";
  (log[methode] ?? console[methode])(ligne);
}

function hoteOrigine(origin) {
  try {
    return new URL(origin).hostname;
  } catch {
    return "";
  }
}

/** Traite POST /contact. Le reste du site est servi par les assets du Worker. */
export async function gererContact(request, env, { fetchImpl = fetch, log = console, ctx } = {}) {
  let config;
  try {
    config = lireConfig(env);
  } catch (e) {
    journal(log, "error", { msg: "contact config incomplete", error: e.message });
    return json(500, { erreur: "L'envoi a échoué. Réessayez ou écrivez-nous à contact@sedona.fr." });
  }

  const origin = request.headers.get("origin");
  if (origin && !config.turnstileHostnames.has(hoteOrigine(origin))) {
    return json(403, { erreur: "Origine non autorisée." });
  }

  const ip = request.headers.get("cf-connecting-ip") ?? "";
  if (!String(request.headers.get("content-type") ?? "").includes("application/json")) {
    return json(415, { erreur: "Format attendu : JSON." });
  }

  let corps;
  try {
    const texte = await request.text();
    if (texte.length > TAILLE_MAX) return json(413, { erreur: "Requête trop volumineuse." });
    corps = JSON.parse(texte);
  } catch {
    return json(400, { erreur: "JSON invalide." });
  }

  const jetonOk = await verifierTurnstile(config, fetchImpl, corps?.["cf-turnstile-response"], ip);
  if (!jetonOk) return json(403, { erreur: "Vérification anti-robot échouée. Réessayez." });

  // Champ piège : un robot le remplit, un humain ne le voit pas.
  if (corps?.website_url) {
    journal(log, "info", { msg: "contact honeypot" });
    return json(200, { ok: true });
  }

  const { demande, erreur } = valider(corps);
  if (erreur) return json(400, { erreur });

  try {
    await appelBrevo(config, fetchImpl, "/smtp/email", construireEmail(demande, config), log);
  } catch (e) {
    journal(log, "error", { msg: "contact send failed", error: e.message });
    return json(502, { erreur: "L'envoi a échoué. Réessayez ou écrivez-nous à contact@sedona.fr." });
  }

  if (config.listeBrevo && demande.type === "projet") {
    const ajout = appelBrevo(config, fetchImpl, "/contacts", {
      email: demande.email,
      attributes: { [config.attributNom]: demande.nom, [config.attributPrenom]: demande.prenom },
      listIds: [config.listeBrevo],
      updateEnabled: true,
    }, log).catch((e) => journal(log, "warn", { msg: "contact list failed", error: e.message }));
    if (ctx) ctx.waitUntil(ajout);
  }

  journal(log, "info", { msg: "contact sent", type: demande.type });
  return json(200, { ok: true });
}
