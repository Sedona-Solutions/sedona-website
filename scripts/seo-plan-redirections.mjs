// Construit le plan de redirection WordPress -> Astro à partir de l'export du sitemap Yoast.
// ⚠️ Écrase le plan existant : les corrections manuelles faites dans le CSV seront perdues.
// Usage : node scripts/seo-plan-redirections.mjs <urls-wordpress.csv> . docs/seo/plan-redirections.csv
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [csvPath, root, outPath] = process.argv.slice(2);
const ids = (dir) =>
  readdirSync(join(root, "content", dir))
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, "").toLowerCase());

const statutOf = (f) => (readFileSync(join(root, "content", "articles", f + ".md"), "utf8").match(/^statut:s*(.+)$/m)?.[1] ?? "").trim();
const articles = ids("articles").filter((a) => !["Brouillon", "Archivé"].includes(statutOf(a)));
const articlesNonPublies = ids("articles").filter((a) => !articles.includes(a));
// Appariements manuels (slug différent entre WordPress et Astro)
const articleAlias = {
  "sveltekit-votre-prochain-framework-web": ["sveltekit-et-si-c-etait-votre-prochain-framework-web", "OK"],
  "a-la-decouverte-de-swiftcharts-sur-ios": ["a-la-decouverte-de-swift-charts-sur-ios", "OK"],
  "swift-connection-2024-deux-jours-de-partage-autour-de-swift-2eme-partie": ["swift-connection-2024-deux-jours-de-partage-autour-de-swift-2e-partie", "OK"],
  "interview-client-nicolas-sallaberry-saint-gobain-distribution-france": ["rencontre-avec-nicolas-sallaberry-dsi-de-saint-gobain-distribution-france", "OK"],
  "llm-ia-sedona-advent-mcp-api-agent-anthropic-claude": ["mcp-kezako", "OK"],
  "advent-of-sedona-traduction-weblate-developpement-anglais-francais-sedona-translations": ["simplifier-gestion-traductions", "OK"],
  "advent-of-code-4-gestion-des-identites-avec-keycloak-iam-ciam-federation-identite": ["gestion-identites-keycloak", "OK"],
  "advent-of-sedona-5-mobile-accessibility": ["accessibilite-sur-mobile-aussi", "OK"],
  "advent-of-sedona-6-css-html-classes-advent": ["specificite-selecteurs-css", "OK"],
  "advent-of-sedona-7-les-outils-mcp": ["focus-outils-mcp", "OK"],
  "advent-of-sedona-8-parlons-finops": ["ia-applications-web-symfony", "OK"],
  "android-makers-des-sessions-enrichissantes-pour-nos-consultants": ["android-makers-avril-2026", "OK"],
  "nouvelle-version-de-keycloak-v25-0-edition-de-juin": ["keycloak-v25", "À valider"],
  "dernieres-nouvelles-keycloak-2025": ["keycloak-v25", "À valider"],
  "27802": ["retours-de-nos-consultants-sur-l-evenement-rivieradev-2026", "À valider"],
  "notre-equipe-toulonnaise-est-presente-au-riviera-dev": ["retours-de-nos-consultants-sur-l-evenement-rivieradev-2026", "À valider"],
};
const projets = ids("projets");

const rows = readFileSync(csvPath, "utf8")
  .replace(/^﻿/, "")
  .split(/\r?\n/)
  .slice(1)
  .filter(Boolean)
  .map((l) => l.split('","').map((c) => c.replace(/"/g, "")));

const tokens = (s) => new Set(s.split("-").filter((t) => t.length > 2));
const jaccard = (a, b) => {
  const A = tokens(a), B = tokens(b);
  const inter = [...A].filter((t) => B.has(t)).length;
  return inter / (A.size + B.size - inter || 1);
};

const pages = {
  "/": ["/", "OK"],
  "/en/": ["/", "OK"],
  "/nous-contactez/": ["/contact/", "OK"],
  "/en/contact-us/": ["/contact/", "OK"],
  "/mentions-legales/": ["/mentions-legales/", "Identique"],
  "/en/legal-notice/": ["/mentions-legales/", "OK"],
  "/offres-emplois/": ["/carrieres/", "OK"],
  "/en/open-positions/": ["/carrieres/", "OK"],
  "/jobs/": ["/carrieres/", "OK"],
  "/en/jobs/": ["/carrieres/", "OK"],
  "/blog/": ["/blog/", "Identique"],
  "/en/our-latest-news/": ["/blog/", "OK"],
  "/evenements/": ["/blog/", "À valider"],
  "/en/event/": ["/blog/", "À valider"],
  "/event-zest/": ["/blog/", "À valider"],
  "/en/projects/": ["/projets/", "OK"],
  "/decouvrez-nos-clients-et-nos-projets/": ["/projets/", "OK"],
  "/a-propos/": ["/histoire/", "OK"],
  "/en/about-us/": ["/histoire/", "OK"],
  "/devenons-votre-agence-de-conseil-numerique-et-technologique/": ["/", "À valider"],
  "/en/become-your-digital-and-technological-partner/": ["/", "À valider"],
  "/nos-experimentations/": ["/blog/", "À valider"],
  "/sedona-training/": ["/", "À valider"],
  "/move-2-cloud/": ["/domaines/infra-securite/", "À valider"],
  "/elastic/": ["/offres/elastic/", "OK"],
  "/keycloak-parametrage-optilisation-droits/": ["/offres/keycloak-run/", "OK"],
  "/sveltkit/": ["/blog/sveltekit-et-si-c-etait-votre-prochain-framework-web/", "À valider"],
};

const projetAlias = { "butagaz-click-collect": "butagaz", "nrj-radio": "groupe-nrj" };
const portfolioCat = {
  "cloud-devops": "/domaines/infra-securite/",
  "cloud-devops-en": "/domaines/infra-securite/",
  identite: "/domaines/infra-securite/",
  identity: "/domaines/infra-securite/",
};

const out = [];
for (const [sitemap, url] of rows) {
  const path = new URL(url).pathname;
  const segs = path.split("/").filter(Boolean);
  const last = segs.at(-1) ?? "";
  let to = "", statut = "", note = "";

  if (pages[path]) [to, statut] = pages[path];
  else if (sitemap === "post-sitemap.xml") {
    if (articleAlias[last] && articles.includes(articleAlias[last][0])) { to = `/blog/${articleAlias[last][0]}/`; statut = articleAlias[last][1]; note = "appariement manuel"; }
    else if (articles.includes(last)) { to = `/blog/${last}/`; statut = "OK"; }
    else {
      const best = articles.map((a) => [a, jaccard(a, last)]).sort((x, y) => y[1] - x[1])[0];
      if (best[1] >= 0.6) { to = `/blog/${best[0]}/`; statut = "À valider"; note = `slug proche (${best[1].toFixed(2)})`; }
      else { to = "/blog/"; statut = "Non migré"; note = "article absent du nouveau site : rediriger vers /blog/ ou migrer"; }
    }
  } else if (sitemap === "ohio_portfolio-sitemap.xml") {
    const p = projetAlias[last] ?? last;
    if (projets.includes(p)) { to = `/projets/${p}/`; statut = p === last ? "OK" : "À valider"; }
    else { to = "/projets/"; statut = "Non migré"; note = "projet absent du nouveau site"; }
  } else if (sitemap === "ohio_portfolio_category-sitemap.xml") {
    to = portfolioCat[last] ?? (last === "accompagnement" ? "/projets/" : "/domaines/produits-digitaux/");
    statut = "À valider";
  } else if (sitemap === "awsm_job_openings-sitemap.xml" || ["categorie-sitemap.xml", "type-sitemap.xml", "localisation-sitemap.xml"].includes(sitemap)) {
    to = "/carrieres/"; statut = "OK"; note = "offre/filtre emploi";
  } else if (sitemap === "agence-sitemap.xml") { to = "/contact/"; statut = "À valider"; }
  else if (sitemap === "category-sitemap.xml" || sitemap === "post_tag-sitemap.xml") {
    to = "/blog/"; statut = "OK"; note = "catégorie/étiquette";
    if (last === "offre-emploi") to = "/carrieres/";
  } else { to = "/"; statut = "À valider"; }

  if (path.startsWith("/en/") && statut === "OK" && sitemap === "post-sitemap.xml") note = "version anglaise";
  out.push({ sitemap, ancienne: path, nouvelle: to, statut, note });
}

const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
writeFileSync(
  outPath,
  "﻿" + ["sitemap;ancienne_url;nouvelle_url;statut;note", ...out.map((r) => [r.sitemap, r.ancienne, r.nouvelle, r.statut, r.note].map(esc).join(";"))].join("\r\n"),
  "utf8"
);

const count = (k) => out.reduce((m, r) => ((m[r[k]] = (m[r[k]] ?? 0) + 1), m), {});
console.log("Total", out.length, count("statut"));
const migratedPosts = new Set(out.filter((r) => r.nouvelle.startsWith("/blog/") && r.nouvelle !== "/blog/").map((r) => r.nouvelle));
console.log("Articles Astro publiés sans ancienne URL :", articles.filter((a) => !migratedPosts.has(`/blog/${a}/`)));
console.log("Articles Astro non publiés (brouillon/archivé) :", articlesNonPublies);
console.log(out.filter((r) => r.statut === "À valider" && r.sitemap === "post-sitemap.xml").map((r) => `${r.ancienne} -> ${r.nouvelle} ${r.note}`).join("\n"));
