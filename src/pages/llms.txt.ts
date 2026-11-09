// /llms.txt (https://llmstxt.org) : plan du site en Markdown pour les moteurs IA.
// Généré au build depuis les mêmes collections que les pages : une offre, un
// domaine, une référence ou un article publié dans Tina y apparaît sans autre saisie.
// Les contenus en noindex (groupe SEO de Tina) et masqués (Brouillon, Archivé) en sont exclus.
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import global from "../../content/global/index.json";
import { DESCRIPTION_DEFAUT, NOM_SITE, estIndexable, introDepuisMarkdown, resumer, urlCanonique } from "../utils/seo";
import { estPublie } from "../utils/articleVisibility";

/** Texte d'une ligne de liste : échappements Markdown de Tina (« RUN\_et\_ ») retirés. */
const texte = (t?: string | null, max = 220) => resumer(t?.replace(/\\[_*]/g, " "), max);

const lien = (titre: string, chemin: string, site: URL, description?: string | null) =>
  `- [${titre.replace(/[[\]]/g, (c) => "\\" + c)}](${urlCanonique(chemin, site)})${texte(description) ? `: ${texte(description)}` : ""}`;

const visible = (d: { seo?: { noindex?: boolean | null } | null; statut?: string }) =>
  !d.seo?.noindex && estPublie(d.statut);

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error("llms.txt : `site` doit être défini dans astro.config.mjs");

  // Hors production, le fichier existe mais renvoie vers le vrai site.
  if (!estIndexable(site)) {
    return new Response("# Environnement de préproduction\n\n> Site de référence : https://sedona.fr/llms.txt\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const parOrdre = <T extends { data: { affichage?: { ordre?: number } } }>(a: T, b: T) =>
    (a.data.affichage?.ordre ?? 99) - (b.data.affichage?.ordre ?? 99);

  const domaines = (await getCollection("expertise", ({ data }) => visible(data))).sort(parOrdre);
  const offres = await getCollection("offre", ({ data }) => visible(data));
  const projets = (await getCollection("projet", ({ data }) => visible(data))).sort((a, b) =>
    a.data.titre.localeCompare(b.data.titre, "fr")
  );
  const articles = (await getCollection("article", ({ data }) => visible(data))).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  const villes = (global.agences ?? []).map((a: { ville?: string }) => a.ville).filter(Boolean);
  const jour = (d: Date) => d.toISOString().slice(0, 10);

  const lignes = [
    `# ${NOM_SITE}`,
    "",
    `> ${DESCRIPTION_DEFAUT}`,
    "",
    `${NOM_SITE} est une entreprise de services du numérique (ESN) française, implantée à ${villes.join(", ")}. ` +
      "Elle accompagne ses clients sur leurs produits digitaux (web, mobile), la data et l'intelligence artificielle, " +
      "l'infrastructure, le cloud et la sécurité, et propose des offres clé en main (Keycloak, Elastic, IA).",
    "",
    `Contact : ${global.email ?? "contact@sedona.fr"} · ${urlCanonique("/contact", site)}`,
    "",
    "## Domaines d'expertise",
    "",
    ...domaines.map((e) => lien(e.data.titre, `/domaines/${e.id}`, site, e.data.affichage?.resume || e.data.accroche)),
    "",
    "## Offres",
    "",
    ...offres.map((o) => lien(o.data.titre, `/offres/${o.id}`, site, o.data.enBref || o.data.accroche)),
    "",
    "## Références clients",
    "",
    ...projets.map((p) =>
      lien(p.data.client ? `${p.data.titre} (${p.data.client})` : p.data.titre, `/projets/${p.id}`, site, p.data.accroche)
    ),
    "",
    "## Articles",
    "",
    ...articles.map((a) => lien(`${a.data.titre} (${jour(a.data.date)})`, `/blog/${a.id}`, site, a.data.extrait || introDepuisMarkdown(a.body))),
    "",
    "## L'entreprise",
    "",
    lien("Notre histoire", "/histoire", site),
    lien("Carrières", "/carrieres", site, "Offres d'emploi et vie chez Sedona."),
    lien("Politique RSE", "/politique-rse", site),
    lien("Contact", "/contact", site),
    "",
    "## Optional",
    "",
    lien("Toutes les références", "/projets", site),
    lien("Tous les articles", "/blog", site),
    lien("Plan du site (XML)", "/sitemap.xml", site),
    "",
  ];

  return new Response(lignes.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
