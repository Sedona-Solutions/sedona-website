// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkManualHighlight from './src/utils/remarkManualHighlight.mjs';
import remarkImageCaptionLink from './src/utils/remarkImageCaptionLink.mjs';
import remarkVideoEmbed from './src/utils/remarkVideoEmbed.mjs';
import pruneUnusedImages from './src/utils/astroPruneImages.mjs';

// https://astro.build/config
// Both deploy targets are served at the domain root (custom domains), so no `base`.
// Only the canonical/sitemap host differs -> overridable via SITE_URL in CI.
export default defineConfig({
  site: process.env.SITE_URL || 'https://preview.sedona.fr',
  integrations: [pruneUnusedImages()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkManualHighlight, remarkImageCaptionLink, remarkVideoEmbed],
    }),
  },
});
