import home from "../../content/home/index.json";

// L'article à la une est choisi à un seul endroit : champ « Article à la une »
// du bloc News de la page d'accueil dans Tina (référence « content/articles/xxx.md »).
// Un seul article possible par construction. Si le champ est vide ou désigne un
// article non publié, l'article le plus récent est utilisé.
const reference: string | undefined = (home as { blogSection?: { articleVedette?: string } }).blogSection?.articleVedette;
const slugVedette = reference?.split("/").pop()?.replace(/\.md$/, "");

/** `articles` : articles publiés, triés du plus récent au plus ancien. */
export const articleALaUne = <T extends { slug: string }>(articles: T[]): T | undefined =>
  articles.find((a) => a.slug === slugVedette) ?? articles[0];
