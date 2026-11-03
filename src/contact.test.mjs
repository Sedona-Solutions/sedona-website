import { test } from "node:test";
import assert from "node:assert/strict";
import { gererContact, valider } from "./contact.mjs";

const env = {
  BREVO_API_KEY: "cle-de-test",
  CONTACT_FROM_EMAIL: "site@sedona.fr",
  CONTACT_TO: "contact@sedona.fr",
  CONTACT_TO_POSTULER: "rh@sedona.fr",
  TURNSTILE_SECRET: "secret-de-test",
  TURNSTILE_HOSTNAMES: "sedona.fr,preview.sedona.fr",
};

function reponseTurnstile(token) {
  const ok = token === "token-ok";
  const corps = ok
    ? { success: true, action: "contact", hostname: "sedona.fr" }
    : { success: false, "error-codes": ["invalid-input-response"] };
  return new Response(JSON.stringify(corps), { status: 200, headers: { "content-type": "application/json" } });
}

function harnais(fetchImpl) {
  const appels = [];
  const fauxFetch =
    fetchImpl ??
    (async (url, init) => {
      if (String(url).includes("/turnstile/v0/siteverify")) {
        return reponseTurnstile(new URLSearchParams(init.body).get("response"));
      }
      appels.push({ url, corps: JSON.parse(init.body), init });
      return new Response("{}", { status: 201 });
    });
  const log = { info() {}, warn() {}, error() {} };
  const post = (corps, { origin = "https://sedona.fr", ip = "1.1.1.1" } = {}) =>
    gererContact(
      new Request("https://sedona.fr/contact", {
        method: "POST",
        headers: { "content-type": "application/json", origin, "cf-connecting-ip": ip },
        body: JSON.stringify(corps),
      }),
      env,
      { fetchImpl: fauxFetch, log },
    );
  return { post, appels };
}

const projet = {
  type: "projet",
  nom: "Dupont",
  prenom: "Jean",
  email: "jean@example.com",
  entreprise: "ACME",
  offre: "IA Forge",
  message: "Bonjour <script>alert(1)</script>",
  "cf-turnstile-response": "token-ok",
};

test("demande projet : e-mail envoyé via Brevo au bon destinataire, avec reply-to et HTML échappé", async () => {
  const { post, appels } = harnais();
  const r = await post(projet);
  assert.equal(r.status, 200);
  assert.equal(appels.length, 1);
  const { url, corps, init } = appels[0];
  assert.match(url, /\/smtp\/email$/);
  assert.equal(init.headers["api-key"], "cle-de-test");
  assert.deepEqual(corps.to, [{ email: "contact@sedona.fr" }]);
  assert.deepEqual(corps.replyTo, { email: "jean@example.com", name: "Jean Dupont" });
  assert.match(corps.subject, /Projet — IA Forge — Jean Dupont \(ACME\)/);
  assert.ok(!corps.htmlContent.includes("<script>"));
});

test("candidature : routée vers CONTACT_TO_POSTULER", async () => {
  const { post, appels } = harnais();
  const r = await post({
    type: "postuler",
    nom: "Martin",
    prenom: "Léa",
    email: "lea@example.com",
    poste: "Data Engineer",
    "cf-turnstile-response": "token-ok",
  });
  assert.equal(r.status, 200);
  assert.deepEqual(appels[0].corps.to, [{ email: "rh@sedona.fr" }]);
});

test("jeton Turnstile absent, refusé ou hors hôte : 403, rien n'est envoyé", async () => {
  const { post, appels } = harnais(async (url, init) => {
    if (String(url).includes("/turnstile/v0/siteverify")) {
      const token = new URLSearchParams(init.body).get("response");
      if (token === "mauvais-hote") {
        return new Response(JSON.stringify({ success: true, action: "contact", hostname: "evil.example" }), { status: 200 });
      }
      if (token === "mauvaise-action") {
        return new Response(JSON.stringify({ success: true, action: "login", hostname: "sedona.fr" }), { status: 200 });
      }
      return reponseTurnstile(token);
    }
    appels.push({ url, corps: JSON.parse(init.body) });
    return new Response("{}", { status: 201 });
  });
  const sansJeton = { ...projet };
  delete sansJeton["cf-turnstile-response"];
  assert.equal((await post(sansJeton)).status, 403);
  assert.equal((await post({ ...projet, "cf-turnstile-response": "mauvais" })).status, 403);
  assert.equal((await post({ ...projet, "cf-turnstile-response": "mauvais-hote" })).status, 403);
  assert.equal((await post({ ...projet, "cf-turnstile-response": "mauvaise-action" })).status, 403);
  assert.equal(appels.length, 0);
});

test("origine non autorisée : 403, rien n'est envoyé", async () => {
  const { post, appels } = harnais();
  const r = await post(projet, { origin: "https://pirate.example" });
  assert.equal(r.status, 403);
  assert.equal(appels.length, 0);
});

test("pot de miel rempli : succès simulé, rien n'est envoyé", async () => {
  const { post, appels } = harnais();
  const r = await post({ ...projet, website_url: "http://spam" });
  assert.equal(r.status, 200);
  assert.equal(appels.length, 0);
});

test("champs manquants ou e-mail invalide : 400", async () => {
  const { post } = harnais();
  assert.equal((await post({ ...projet, message: "" })).status, 400);
  assert.equal((await post({ ...projet, email: "pas-un-email" })).status, 400);
  assert.equal((await post({ ...projet, type: "inconnu" })).status, 400);
});

test("Brevo en erreur : 502 avec message lisible", async () => {
  const { post } = harnais(async (url) => {
    if (String(url).includes("/turnstile/v0/siteverify")) return reponseTurnstile("token-ok");
    return new Response('{"message":"unauthorized"}', { status: 401 });
  });
  const r = await post(projet);
  assert.equal(r.status, 502);
  assert.match((await r.json()).erreur, /contact@sedona\.fr/);
});

test("valider : champ trop long refusé", () => {
  assert.ok(valider({ ...projet, message: "x".repeat(5001) }).erreur);
});
