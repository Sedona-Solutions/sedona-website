// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkManualHighlight from './src/utils/remarkManualHighlight.mjs';
import remarkImageCaptionLink from './src/utils/remarkImageCaptionLink.mjs';
import remarkVideoEmbed from './src/utils/remarkVideoEmbed.mjs';

// https://astro.build/config
export default defineConfig({
  markdown: {
    processor: unified({
      remarkPlugins: [remarkManualHighlight, remarkImageCaptionLink, remarkVideoEmbed],
    }),
  },
});
