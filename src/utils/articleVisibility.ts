// Les articles "Brouillon" ou "Archivé" restent éditables dans Tina mais ne
// doivent jamais apparaître sur le site public (listing, page détail, mises en avant…).
export const estArticlePublie = (statut?: string) => statut !== "Brouillon" && statut !== "Archivé";
