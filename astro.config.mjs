// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkManualHighlight from './src/utils/remarkManualHighlight.mjs';
import remarkImageCaptionLink from './src/utils/remarkImageCaptionLink.mjs';
import remarkVideoEmbed from './src/utils/remarkVideoEmbed.mjs';
import remarkPublicImages from './src/utils/remarkPublicImages.mjs';
import pruneUnusedImages from './src/utils/astroPruneImages.mjs';
// Redirections des anciennes URL WordPress (généré par `npm run seo:redirections`
// depuis docs/seo/plan-redirections.csv).
import redirections from './src/data/redirections.json' with { type: 'json' };

// https://astro.build/config
// Both deploy targets are served at the domain root (custom domains), so no `base`.
// Only the canonical/sitemap host differs -> overridable via SITE_URL in CI.
export default defineConfig({
  site: process.env.SITE_URL || 'https://preview.sedona.fr',
  integrations: [pruneUnusedImages()],
  redirects: redirections,
  image: { layout: 'constrained', breakpoints: [640, 960, 1280, 1600] },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkManualHighlight, remarkImageCaptionLink, remarkVideoEmbed, remarkPublicImages],
    }),
  },
});
