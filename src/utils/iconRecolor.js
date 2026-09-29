const iconModules = import.meta.glob("../../public/icons/*.svg", { query: "?raw", import: "default", eager: true });

const iconsByName = Object.fromEntries(
  Object.entries(iconModules).map(([path, content]) => [path.replace("../../public/icons/", "").replace(".svg", ""), content]),
);

const decoModules = import.meta.glob("../../public/deco/*.svg", { query: "?raw", import: "default", eager: true });

const decoByName = Object.fromEntries(
  Object.entries(decoModules).map(([path, content]) => [path.replace("../../public/deco/", "").replace(".svg", ""), content]),
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

// Couleurs structurelles des illustrations "mascotte" de public/deco/ (encre,
// blancs) : seules leurs teintes d'accent (ex. #F18878) doivent suivre le
// pillVariant de la page.
const KEEP_DECO = new Set(["#fff", "#ffffff", "white", "none", "#3b0800", "#000", "#000000", "black"]);

/** Contenu brut d'une illustration de public/deco/, ou `null` si elle n'existe pas. */
export function readDecoIllustration(name) {
  return decoByName[name] ?? null;
}

/** Lit une illustration dans public/deco/ et recolore ses teintes d'accent avec
 *  `accentColor` (même logique que recolorIcon, pour les illustrations "mascotte"
 *  multi-formes des cartes tarifs, dont l'accent était figé en rouge/rose à l'export). */
export function recolorDecoIllustration(name, accentColor) {
  let svg = readDecoIllustration(name);
  if (svg == null) return null;
  svg = svg.replace(/(fill|stroke)="([^"]+)"/g, (match, attr, color) => {
    if (KEEP_DECO.has(color.toLowerCase())) return match;
    return `${attr}="${accentColor}"`;
  });
  svg = svg.replace(/ width="[^"]*"/, "").replace(/ height="[^"]*"/, "");
  return svg;
}
