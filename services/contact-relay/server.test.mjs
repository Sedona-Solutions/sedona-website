// Tests du relais (node --test) : aucun appel réel à Brevo, fetch est simulé.
import { test } from "node:test";
import assert from "node:assert/strict";
import { creerServeur, lireConfig, valider } from "./server.mjs";

const ORIGINE = "https://sedona.fr";
const config = lireConfig({
  BREVO_API_KEY: "cle-de-test",
  CONTACT_FROM_EMAIL: "site@sedona.fr",
  CONTACT_TO: "contact@sedona.fr",
  CONTACT_TO_POSTULER: "rh@sedona.fr",
  ALLOWED_ORIGINS: `${ORIGINE},https://preview.sedona.fr`,
  RATE_LIMIT_MAX: "3",
});

async function demarrer(fetchImpl) {
  const appels = [];
  const fauxFetch = fetchImpl ?? (async (url, init) => (appels.push({ url, corps: JSON.parse(init.body), init }), new Response("{}", { status: 201 })));
  const serveur = creerServeur(config, { fetchImpl: fauxFetch, log: {} });
  await new Promise((r) => serveur.listen(0, r));
  const base = `http://127.0.0.1:${serveur.address().port}`;
  const post = (corps, { origine = ORIGINE, ip = "1.1.1.1" } = {}) =>
    fetch(`${base}/contact`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: origine, "x-forwarded-for": ip },
      body: JSON.stringify(corps),
    });
  return { serveur, base, post, appels };
}

const projet = {
  type: "projet",
  nom: "Dupont",
  prenom: "Jean",
  email: "jean@example.com",
  entreprise: "ACME",
  offre: "IA Forge",
  message: "Bonjour <script>alert(1)</script>",
};

test("demande projet : e-mail envoyé via Brevo au bon destinataire, avec reply-to et HTML échappé", async () => {
  const { serveur, post, appels } = await demarrer();
  const r = await post(projet);
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("access-control-allow-origin"), ORIGINE);
  assert.equal(appels.length, 1);
  const { url, corps, init } = appels[0];
  assert.match(url, /\/smtp\/email$/);
  assert.equal(init.headers["api-key"], "cle-de-test");
  assert.deepEqual(corps.to, [{ email: "contact@sedona.fr" }]);
  assert.deepEqual(corps.replyTo, { email: "jean@example.com", name: "Jean Dupont" });
  assert.match(corps.subject, /Projet — IA Forge — Jean Dupont \(ACME\)/);
  assert.ok(!corps.htmlContent.includes("<script>"));
  serveur.close();
});

test("candidature : routée vers CONTACT_TO_POSTULER", async () => {
  const { serveur, post, appels } = await demarrer();
  const r = await post({ type: "postuler", nom: "Martin", prenom: "Léa", email: "lea@example.com", poste: "Data Engineer" });
  assert.equal(r.status, 200);
  assert.deepEqual(appels[0].corps.to, [{ email: "rh@sedona.fr" }]);
  serveur.close();
});

test("origine non autorisée : 403, rien n'est envoyé", async () => {
  const { serveur, post, appels } = await demarrer();
  const r = await post(projet, { origine: "https://pirate.example" });
  assert.equal(r.status, 403);
  assert.equal(appels.length, 0);
  serveur.close();
});

test("pot de miel rempli : succès simulé, rien n'est envoyé", async () => {
  const { serveur, post, appels } = await demarrer();
  const r = await post({ ...projet, website_url: "http://spam" });
  assert.equal(r.status, 200);
  assert.equal(appels.length, 0);
  serveur.close();
});

test("champs manquants ou e-mail invalide : 400", async () => {
  const { serveur, post } = await demarrer();
  assert.equal((await post({ ...projet, message: "" })).status, 400);
  assert.equal((await post({ ...projet, email: "pas-un-email" })).status, 400);
  assert.equal((await post({ ...projet, type: "inconnu" })).status, 400);
  serveur.close();
});

test("limitation par IP : 429 au-delà de RATE_LIMIT_MAX", async () => {
  const { serveur, post } = await demarrer();
  const statuts = [];
  for (let i = 0; i < 4; i++) statuts.push((await post(projet, { ip: "9.9.9.9" })).status);
  assert.deepEqual(statuts, [200, 200, 200, 429]);
  serveur.close();
});

test("Brevo en erreur : 502 avec message lisible", async () => {
  const { serveur, post } = await demarrer(async () => new Response('{"message":"unauthorized"}', { status: 401 }));
  const r = await post(projet);
  assert.equal(r.status, 502);
  assert.match((await r.json()).erreur, /contact@sedona\.fr/);
  serveur.close();
});

test("préflight CORS et healthz", async () => {
  const { serveur, base } = await demarrer();
  const pre = await fetch(`${base}/contact`, { method: "OPTIONS", headers: { origin: ORIGINE } });
  assert.equal(pre.status, 204);
  assert.equal(pre.headers.get("access-control-allow-origin"), ORIGINE);
  assert.equal((await fetch(`${base}/healthz`)).status, 200);
  serveur.close();
});

test("valider : champ trop long refusé", () => {
  assert.ok(valider({ ...projet, message: "x".repeat(5001) }).erreur);
});
