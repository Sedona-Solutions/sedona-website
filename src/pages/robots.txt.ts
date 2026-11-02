// robots.txt généré selon l'environnement : tout est bloqué hors production
// (preview.sedona.fr, localhost) pour éviter l'indexation d'un doublon du site.
import type { APIRoute } from "astro";
import { estIndexable } from "../utils/seo";

export const GET: APIRoute = ({ site }) => {
  const corps = estIndexable(site)
    ? ["User-agent: *", "Allow: /", "Disallow: /admin/", "", `Sitemap: ${new URL("/sitemap.xml", site).href}`]
    : ["# Environnement de préproduction : indexation désactivée.", "User-agent: *", "Disallow: /"];
  return new Response(corps.join("\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
