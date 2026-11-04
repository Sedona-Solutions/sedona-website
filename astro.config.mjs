// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkManualHighlight from './src/utils/remarkManualHighlight.mjs';
import remarkImageCaptionLink from './src/utils/remarkImageCaptionLink.mjs';
import remarkVideoEmbed from './src/utils/remarkVideoEmbed.mjs';
import remarkPublicImages from './src/utils/remarkPublicImages.mjs';
import pruneUnusedImages from './src/utils/astroPruneImages.mjs';
import sitemap from './src/utils/astroSitemap.mjs';
// Redirections des anciennes URL WordPress (généré par `npm run seo:redirections`
// depuis docs/seo/plan-redirections.csv).
import redirectionsBrutes from './src/data/redirections.json' with { type: 'json' };
import { readdirSync, readFileSync } from 'node:fs';

// Références masquées (statut « Brouillon » / « Archivé » dans Tina) : leur page
// /projets/<slug> n'est pas générée, donc une redirection vers elle mènerait à la
// 404. On redirige alors vers la liste /projets/ ; dès que la fiche est republiée,
// la redirection pointe de nouveau vers elle.
const projetsMasques = new Set(
  readdirSync('./content/projets')
    .filter((f) => f.endsWith('.md'))
    .filter((f) => {
      const entete = readFileSync(`./content/projets/${f}`, 'utf8').split(/^---\s*$/m)[1] ?? '';
      return /^statut:\s*['"]?(Brouillon|Archivé)['"]?\s*$/m.test(entete);
    })
    .map((f) => f.replace(/\.md$/, '').toLowerCase())
);
const redirections = Object.fromEntries(
  Object.entries(redirectionsBrutes).map(([source, cible]) => {
    const slug = /^\/projets\/([^/]+)\/?$/.exec(String(cible))?.[1]?.toLowerCase();
    return [source, slug && projetsMasques.has(slug) ? '/projets/' : cible];
  })
);

// https://astro.build/config
// Both deploy targets are served at the domain root (custom domains), so no `base`.
// Only the canonical/sitemap host differs -> overridable via SITE_URL.
export default defineConfig({
  site: process.env.SITE_URL || 'https://preview.sedona.fr',
  // SITE_URL pilote aussi l'indexation (src/utils/seo.ts) : seul https://sedona.fr
  // produit un robots.txt ouvert et des pages en index, la preview reste en noindex.
  integrations: [pruneUnusedImages(), sitemap()],
  redirects: redirections,
  image: { layout: 'constrained', breakpoints: [640, 960, 1280, 1600] },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkManualHighlight, remarkImageCaptionLink, remarkVideoEmbed, remarkPublicImages],
    }),
  },
});
