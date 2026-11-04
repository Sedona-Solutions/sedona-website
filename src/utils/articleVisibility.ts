// Les contenus "Brouillon" ou "Archivé" (articles, projets/références) restent
// éditables dans Tina mais ne doivent jamais apparaître sur le site public
// (listing, page détail, mises en avant…). Sans statut = publié.
export const estPublie = (statut?: string) => statut !== "Brouillon" && statut !== "Archivé";

export const estArticlePublie = estPublie;
