// Convertit le plan de redirection (docs/seo/plan-redirections.csv, éditable dans Excel)
// en src/data/redirections.json, lu par astro.config.mjs (option `redirects`).
//
// Sur GitHub Pages, Astro génère pour chaque ancienne URL une page HTML avec
// <meta http-equiv="refresh" content="0"> + <link rel="canonical"> + noindex,
// que Google interprète comme une redirection permanente.
//
// Usage : npm run seo:redirections
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const SOURCE = resolve(ROOT, "docs/seo/plan-redirections.csv");
const CIBLE = resolve(ROOT, "src/data/redirections.json");

// Parse un CSV (séparateur ; ou , — Excel FR réenregistre en ;) avec champs entre guillemets.
function parseCsv(texte) {
  texte = texte.replace(/^﻿/, "");
  const sep = texte.split(/\r?\n/, 1)[0].includes(";") ? ";" : ",";
  const lignes = [];
  let champ = "", ligne = [], guillemets = false;
  for (let i = 0; i < texte.length; i++) {
    const c = texte[i];
    if (guillemets) {
      if (c === '"' && texte[i + 1] === '"') { champ += '"'; i++; }
      else if (c === '"') guillemets = false;
      else champ += c;
    } else if (c === '"') guillemets = true;
    else if (c === sep) { ligne.push(champ); champ = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && texte[i + 1] === "\n") i++;
      ligne.push(champ); lignes.push(ligne); ligne = []; champ = "";
    } else champ += c;
  }
  if (champ || ligne.length) { ligne.push(champ); lignes.push(ligne); }
  const [entete, ...corps] = lignes.filter((l) => l.some((c) => c.trim()));
  return corps.map((l) => Object.fromEntries(entete.map((h, i) => [h.trim(), (l[i] ?? "").trim()])));
}

// Clé sans slash final (Astro génère /ancienne-url/index.html), cible avec slash final
// (évite un saut supplémentaire de GitHub Pages /x -> /x/).
const normaliserSource = (p) => (p.length > 1 ? p.replace(/\/+$/, "") : p);
const normaliserCible = (p) => (p.endsWith("/") || p.includes("#") || p.includes("?") ? p : `${p}/`);

const redirections = {};
const erreurs = [];
for (const r of parseCsv(readFileSync(SOURCE, "utf8"))) {
  const de = r.ancienne_url, vers = r.nouvelle_url;
  if (!de || !vers) continue;
  if (!de.startsWith("/") || !vers.startsWith("/")) { erreurs.push(`Chemin invalide : ${de} -> ${vers}`); continue; }
  const source = normaliserSource(de), cible = normaliserCible(vers);
  if (source === normaliserSource(cible)) continue; // URL identique : rien à rediriger
  if (redirections[source] && redirections[source] !== cible) erreurs.push(`Doublon contradictoire : ${source}`);
  redirections[source] = cible;
  // URL avec caractères encodés (%c2%b2…) : le serveur cherche le dossier décodé.
  if (source.includes("%")) redirections[decodeURIComponent(source)] = cible;
}

// Pas de chaîne de redirections (A -> B -> C).
for (const [source, cible] of Object.entries(redirections)) {
  if (redirections[normaliserSource(cible)]) erreurs.push(`Chaîne de redirection : ${source} -> ${cible} -> ${redirections[normaliserSource(cible)]}`);
}

if (erreurs.length) {
  console.error(erreurs.join("\n"));
  process.exit(1);
}

const trie = Object.fromEntries(Object.entries(redirections).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(CIBLE, JSON.stringify(trie, null, 2) + "\n", "utf8");
console.log(`✓ ${Object.keys(trie).length} redirections écrites dans src/data/redirections.json`);
