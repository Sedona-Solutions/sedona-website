// Résout un chemin stocké par Tina (`/uploads/...`) vers l'ImageMetadata attendue par
// astro:assets. Les fichiers restent dans public/uploads/ pour le media manager ; c'est
// `import.meta.glob` qui les fait entrer dans le pipeline d'optimisation.
//
// Vite impose un littéral statique comme motif de glob : la résolution ne peut donc pas
// être paramétrée par dossier. Ce module est en revanche le point unique où le motif est
// écrit, pour Media.astro comme pour les composants qui doivent pré-calculer des
// variantes côté serveur (cf. Temoignages.astro et son carrousel).
//
// La liste d'extensions doit rester d'accord avec RASTER dans ./uploads.mjs.
const files = import.meta.glob("../../public/uploads/**/*.{png,jpg,jpeg,gif,webp,avif}", {
  eager: true,
  import: "default",
});

/** @returns {ImageMetadata | undefined} `undefined` si le chemin ne correspond à aucun fichier optimisable (SVG, image distante, chemin erroné). */
export function resolveUpload(src) {
  if (!src) return undefined;
  return files[`../../public/uploads/${src.replace(/^\/uploads\//, "")}`];
}
