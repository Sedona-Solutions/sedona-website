const iconModules = import.meta.glob("../../public/icons/*.svg", { query: "?raw", import: "default", eager: true });

const iconsByName = Object.fromEntries(
  Object.entries(iconModules).map(([path, content]) => [path.replace("../../public/icons/", "").replace(".svg", ""), content]),
);

// Couleurs structurelles à ne jamais recolorer (contours, fonds blancs "papier"...).
const KEEP = new Set(["#fff", "#ffffff", "white", "none", "#42140d", "#000", "#000000", "black", "currentcolor"]);

/** Contenu brut d'une icône de public/icons/, ou `null` si elle n'existe pas. */
export function readIcon(iconName) {
  return iconsByName[iconName] ?? null;
}

/** Lit un icône dans public/icons/ et recolore ses teintes d'accent avec `accentColor`.
 *  Retourne `null` (au lieu de planter le build) si le fichier n'existe pas —
 *  certaines références d'icônes dans le contenu ne correspondent plus aux
 *  fichiers présents après une réorganisation de public/icons/. */
export function recolorIcon(iconName, accentColor) {
  let svg = readIcon(iconName);
  if (svg == null) return null;
  svg = svg.replace(/(fill|stroke)="([^"]+)"/g, (match, attr, color) => {
    if (KEEP.has(color.toLowerCase())) return match;
    return `${attr}="${accentColor}"`;
  });
  // Les attributs width/height fixes de l'export Figma entrent en conflit avec le
  // CSS qui pilote la taille réelle (cf. même correctif que NumberBadge.astro).
  svg = svg.replace(/ width="[^"]*"/, "").replace(/ height="[^"]*"/, "");
  return svg;
}
