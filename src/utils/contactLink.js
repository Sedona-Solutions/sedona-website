// Ajoute `?offre=<nom>` à un lien vers /contact, pour préremplir le champ
// "Offre souhaitée" du formulaire (cf. src/pages/contact.astro).
export function withOffre(href, offre) {
  if (!href || !offre) return href;
  const [path, query] = href.split("?");
  if (path !== "/contact") return href;
  const params = new URLSearchParams(query);
  params.set("offre", offre);
  return `${path}?${params.toString()}`;
}
