import { readdirSync } from "node:fs";
import { join } from "node:path";

// Vocabulaire commun aux trois mécanismes qui manipulent les médias du CMS
// (Media.astro, astroPruneImages.mjs, scripts/audit-images.mjs). Ces constantes
// doivent rester d'accord : une extension connue de l'un mais pas des autres produit
// des comportements contradictoires — image servie brute d'un côté, supprimée du
// build de l'autre.

/** Préfixe des chemins que Tina écrit dans le contenu (cf. media.mediaRoot). */
export const UPLOADS_PREFIX = "/uploads/";

/** Formats matriciels : convertibles par astro:assets, donc jamais servis tels quels. */
export const RASTER = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"]);

/** Tout média susceptible d'être référencé depuis une page, matriciel ou non. */
export const MEDIA = new Set([...RASTER, ".svg", ".ico", ".pdf", ".mp4", ".webm"]);

/** Alternative d'extensions dérivée de RASTER, pour composer des expressions régulières. */
export const RASTER_ALTERNATION = [...RASTER].map((e) => e.slice(1)).join("|");

/** Liste récursivement les fichiers d'un dossier. */
export function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

export function humanBytes(bytes) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / 1024 ** 2).toFixed(1)} Mo`;
}
