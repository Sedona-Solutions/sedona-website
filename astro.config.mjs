// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// Both deploy targets are served at the domain root (custom domains), so no `base`.
// Only the canonical/sitemap host differs -> overridable via SITE_URL in CI.
export default defineConfig({
  site: process.env.SITE_URL || 'https://preview.sedona.fr',
});
