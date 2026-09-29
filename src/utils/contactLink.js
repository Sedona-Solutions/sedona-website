// Ajoute `?offre=<nom>` (et, si fourni, `&sousOffre=<nom>`) à un lien vers
// /contact, pour préremplir le champ "Offre souhaitée" et adapter le
// placeholder du message (cf. src/pages/contact.astro) — `sousOffre` sert à
// distinguer un palier précis au sein d'une offre (ex. RUN / RUN+ / Audit pre-RUN).
export function withOffre(href, offre, sousOffre) {
  if (!href || !offre) return href;
  const [path, query] = href.split("?");
  if (path !== "/contact") return href;
  const params = new URLSearchParams(query);
  params.set("offre", offre);
  if (sousOffre) params.set("sousOffre", sousOffre);
  return `${path}?${params.toString()}`;
}
