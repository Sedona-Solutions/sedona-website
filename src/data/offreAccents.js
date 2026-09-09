// Teintes d'accent par offre, alignées sur les couleurs déjà utilisées pour les
// cartes du carrousel "Offres" de la home (voir CARD_BG/BADGE_BG dans Offres.astro).
export const ACCENT_LIGHT = {
  cactus: "#d4f4e7",
  ovni: "#e5e7fa",
  "red-rock": "#fbd3cd",
  sunshine: "#fdeec9",
  sky: "#d4f3f0",
  canyon: "#fae9db",
};

export const ACCENT_MID = {
  cactus: "#71d7b4",
  ovni: "#b3b5ee",
  "red-rock": "#f8b3a9",
  // Contrairement aux autres familles, l'accent "sunshine" de référence (utilisé
  // partout ailleurs sur le site : Header, TeamMarquee, badges, mise en avant
  // .hl--sunshine…) est le palier 200 (#f8d98b), pas le 300 (trop orangé/saturé).
  sunshine: "#f8d98b",
  sky: "#75d3d0",
  canyon: "#de8959",
};

// Palier plus saturé (400), pour les traits d'icônes/illustrations qui ont besoin
// de plus de contraste que l'accent "plat" ACCENT_MID (ex. cartes tarifs).
export const ACCENT_DARK = {
  cactus: "#5ac5a4",
  ovni: "#9794e5",
  "red-rock": "#f18878",
  sunshine: "#f3aa2d",
  sky: "#5abfbf",
  canyon: "#d97445",
};

// Palier 300, pour les décorations "squiggle" du Hero (distinct d'ACCENT_MID,
// qui n'aligne pas toujours sur ce palier — cf. sunshine).
export const ACCENT_300 = {
  cactus: "#71d7b4",
  ovni: "#b3b5ee",
  "red-rock": "#f8b3a9",
  sunshine: "#f5c254",
  sky: "#75d3d0",
  canyon: "#e9b189",
};

// Palier 200 ("brand/accent-color-2" dans Figma), utilisé pour la grille de
// couverture Keycloak Run (cases actives + chiffres clés).
export const ACCENT_200 = {
  cactus: "#a7e9d1",
  ovni: "#d0d3f5",
  "red-rock": "#fbd3cd",
  sunshine: "#f8d98b",
  sky: "#a9e7e4",
  canyon: "#f1d1b7",
};
