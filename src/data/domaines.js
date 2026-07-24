// Couleur d'accent unique par domaine (1 domaine = 1 couleur), confirmée par le
// Figma (node 3647:135158) : pillVariant pilote les pastilles <mark class="hl hl--X">,
// light/mid sont réutilisées pour les fonds de cartes et badges du domaine.
// Le reste du contenu (sections Projets / Méthode / Ce que nous faisons) est
// éditable dans Tina, sur la fiche de chaque domaine (collection "expertise").
export const ACCENTS = {
  "produits-digitaux": { pillVariant: "cactus", light: "#d4f4e7", mid: "#a7e9d1", squiggle: "#71d7b4" },
  "data-ia": { pillVariant: "ovni", light: "#e5e7fa", mid: "#b3b5ee", squiggle: "#b3b5ee" },
  "infra-securite": { pillVariant: "red-rock", light: "#fbd3cd", mid: "#f8b3a9", squiggle: "#e76450" },
};
