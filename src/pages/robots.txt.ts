// robots.txt généré selon l'environnement : tout est bloqué hors production
// (preview.sedona.fr, localhost) pour éviter l'indexation d'un doublon du site.
import type { APIRoute } from "astro";
import { estIndexable } from "../utils/seo";

// Robots des moteurs IA, autorisés explicitement (recherche ET entraînement).
// « User-agent: * » les couvre déjà ; les nommer rend le choix visible et les
// garde dans le même groupe de règles (un robot nommé dans un groupe à part
// ignorerait celles de « * », dont Disallow: /admin/).
const ROBOTS_IA = [
  // OpenAI : recherche ChatGPT, navigation à la demande, entraînement
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  // Anthropic
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google (Gemini, Vertex AI) et Apple (Apple Intelligence)
  "Google-Extended",
  "Applebot-Extended",
  // Microsoft Copilot passe par Bingbot ; Meta, Mistral, Common Crawl
  "Meta-ExternalAgent",
  "MistralAI-User",
  "CCBot",
];

export const GET: APIRoute = ({ site }) => {
  const corps = estIndexable(site)
    ? [
        "User-agent: *",
        ...ROBOTS_IA.map((robot) => `User-agent: ${robot}`),
        "Allow: /",
        "Disallow: /admin/",
        "",
        `Sitemap: ${new URL("/sitemap.xml", site).href}`,
      ]
    : ["# Environnement de préproduction : indexation désactivée.", "User-agent: *", "Disallow: /"];
  return new Response(corps.join("\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
