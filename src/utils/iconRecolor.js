import fs from "node:fs";
import { fileURLToPath } from "node:url";

// Couleurs structurelles à ne jamais recolorer (contours, fonds blancs "papier"...).
const KEEP = new Set(["#fff", "#ffffff", "white", "none", "#42140d", "#000", "#000000", "black", "currentcolor"]);

/** Lit un icône dans public/icons/ et recolore ses teintes d'accent avec `accentColor`.
 *  Retourne `null` (au lieu de planter le build) si le fichier n'existe pas —
 *  certaines références d'icônes dans le contenu ne correspondent plus aux
 *  fichiers présents après une réorganisation de public/icons/. */
export function recolorIcon(iconName, accentColor) {
  const path = fileURLToPath(new URL(`../../public/icons/${iconName}.svg`, import.meta.url));
  if (!fs.existsSync(path)) return null;
  let svg = fs.readFileSync(path, "utf-8");
  svg = svg.replace(/(fill|stroke)="([^"]+)"/g, (match, attr, color) => {
    if (KEEP.has(color.toLowerCase())) return match;
    return `${attr}="${accentColor}"`;
  });
  // Les attributs width/height fixes de l'export Figma entrent en conflit avec le
  // CSS qui pilote la taille réelle (cf. même correctif que NumberBadge.astro).
  svg = svg.replace(/ width="[^"]*"/, "").replace(/ height="[^"]*"/, "");
  return svg;
}
