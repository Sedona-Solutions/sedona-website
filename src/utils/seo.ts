// Utilitaires SEO partagés par <Seo /> (src/components/Seo.astro), robots.txt et le sitemap.
import global from "../../content/global/index.json";
import type { Auteur } from "./auteurs";

export const NOM_SITE = "Sedona";
export const DESCRIPTION_DEFAUT =
  "Sedona, ESN technologique à Paris, Lyon et Toulon : conseil, développement, data, IA, cloud et sécurité.";
/** Image de partage par défaut (1200×630), générée par scripts/og-default.mjs. */
export const IMAGE_DEFAUT = { src: "/og-default.png", width: 1200, height: 630 };
export const LOGO = "/logo-sedona.png";
export const TWITTER = "@SedonaFR";

/**
 * Le site n'est indexable que sur le domaine de production : la preview
 * (preview.sedona.fr), localhost et toute URL de test restent en noindex.
 * Le domaine est piloté par SITE_URL (astro.config.mjs / .env.production).
 */
export const estIndexable = (site?: URL) =>
  !!site && /^(www\.)?sedona\.fr$/.test(site.hostname);

/** URL absolue avec slash final (forme servie par GitHub Pages, sans redirection). */
export function urlCanonique(chemin: string, site: URL) {
  let p = chemin.replace(/\/index\.html$/, "/");
  if (!p.endsWith("/") && !/\.[a-z0-9]+$/i.test(p)) p += "/";
  return new URL(p, site).href;
}

/** Texte brut sur une ligne, coupé proprement vers 160 caractères (limite d'affichage Google). */
export function resumer(texte?: string | null, max = 160) {
  if (!texte) return undefined;
  const plat = texte
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_`#>\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (plat.length <= max) return plat || undefined;
  const coupe = plat.slice(0, max - 1);
  return coupe.slice(0, coupe.lastIndexOf(" ")).replace(/[\s,;:.–—-]+$/, "") + "…";
}

/** Premier vrai paragraphe d'un corps Markdown, en texte brut (description de secours). */
export function introDepuisMarkdown(md?: string) {
  if (!md) return undefined;
  const paragraphe = md
    .split(/\n\s*\n/)
    .map((b) =>
      b
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // liens -> texte
        .replace(/<[^>]+>/g, " ")
        .replace(/==/g, "") // surlignage ==texte== (remarkManualHighlight)
        .trim()
    )
    .find((b) => b.length > 60 && !/^(#|>|\||-{3}|```|https?:)/.test(b));
  return resumer(paragraphe);
}

/** Champs SEO saisis dans Tina (groupe « SEO » de chaque collection). */
export interface ChampsSeo {
  titre?: string | null;
  description?: string | null;
  image?: string | null;
  noindex?: boolean | null;
}

// ---------------------------------------------------------------------------
// Données structurées (JSON-LD)
// ---------------------------------------------------------------------------

export function organisation(site: URL) {
  const adresses = (global.agences ?? []).map((a: { ville?: string; adresse?: string }) => {
    const [rue, ligne2 = ""] = (a.adresse ?? "").split("\n");
    const cp = ligne2.match(/^\d{5}/)?.[0];
    return {
      "@type": "PostalAddress",
      streetAddress: rue,
      postalCode: cp,
      addressLocality: a.ville,
      addressCountry: "FR",
    };
  });
  const agence = global.agences?.[0] as { telephone?: string; email?: string } | undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": new URL("/#organisation", site).href,
    name: NOM_SITE,
    url: new URL("/", site).href,
    logo: new URL(LOGO, site).href,
    description: DESCRIPTION_DEFAUT,
    email: global.email ?? agence?.email,
    telephone: agence?.telephone ? `+33 ${agence.telephone.replace(/^0/, "")}` : undefined,
    address: adresses,
    sameAs: (global.reseaux ?? []).map((r: { url?: string }) => r.url).filter(Boolean),
  };
}

export function siteWeb(site: URL) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": new URL("/#website", site).href,
    name: NOM_SITE,
    url: new URL("/", site).href,
    inLanguage: "fr-FR",
    publisher: { "@id": new URL("/#organisation", site).href },
  };
}

export interface EtapeAriane {
  nom: string;
  /** Chemin relatif ; omis pour la page courante. */
  chemin?: string;
}

export function filAriane(etapes: EtapeAriane[], site: URL, courante: string) {
  const toutes = [{ nom: "Accueil", chemin: "/" }, ...etapes];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: toutes.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.nom,
      item: e.chemin ? urlCanonique(e.chemin, site) : courante,
    })),
  };
}

const editeur = (site: URL) => ({
  "@type": "Organization",
  "@id": new URL("/#organisation", site).href,
  name: NOM_SITE,
  url: new URL("/", site).href,
  logo: { "@type": "ImageObject", url: new URL(LOGO, site).href, width: 512, height: 512 },
});

export interface InfosService {
  nom: string;
  /** Type de prestation, ex. « Support Keycloak » ou « Conseil data et IA ». */
  categorie?: string;
}

/** Offre ou domaine d'expertise : prestation fournie par Sedona (schema.org/Service). */
export function service(
  infos: InfosService,
  { description, image, canonique, site }: { description?: string; image: string; canonique: string; site: URL }
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonique}#service`,
    name: infos.nom,
    serviceType: infos.categorie ?? infos.nom,
    description,
    image,
    url: canonique,
    // Déclaré en entier : l'Organization complète n'est présente que sur l'accueil.
    provider: editeur(site),
    areaServed: { "@type": "Country", name: "France" },
    availableLanguage: "fr-FR",
  };
}

export interface QuestionFaq {
  question?: string | null;
  reponse?: string | null;
}

/** Questions complètes (question ET réponse renseignées), dans l'ordre saisi. */
export const faqValide = (items?: QuestionFaq[] | null) =>
  (items ?? []).filter((i): i is { question: string; reponse: string } => !!i.question?.trim() && !!i.reponse?.trim());

/** Questions fréquentes affichées sur la page (schema.org/FAQPage). */
export function pageFaq(items: QuestionFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqValide(items).map((i) => ({
      "@type": "Question",
      name: i.question.trim(),
      acceptedAnswer: { "@type": "Answer", text: i.reponse.trim().replace(/\s*\n\s*/g, " ") },
    })),
  };
}

export interface InfosArticle {
  publie?: Date;
  modifie?: Date;
  auteur?: Auteur;
  tags?: string[];
}

/** Auteur d'un article (schema.org/Person) : rôle, expertises et LinkedIn attestent sa légitimité. */
function personne(auteur: Auteur, site: URL) {
  return {
    "@type": "Person",
    name: auteur.nom,
    jobTitle: auteur.role || undefined,
    description: auteur.bio || undefined,
    // Les avatars génériques (/uploads/articles/avatar-N.png) ne représentent personne.
    image: auteur.photo && !/\/avatar-\d+\.png$/.test(auteur.photo) ? new URL(auteur.photo, site).href : undefined,
    sameAs: auteur.linkedin ? [auteur.linkedin] : undefined,
    knowsAbout: auteur.expertises?.length ? auteur.expertises : undefined,
    worksFor: { "@type": "Organization", "@id": new URL("/#organisation", site).href, name: NOM_SITE },
  };
}

export function article(
  infos: InfosArticle,
  { titre, description, image, canonique, site }: { titre: string; description?: string; image: string; canonique: string; site: URL }
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: titre.slice(0, 110),
    description,
    image: [image],
    datePublished: infos.publie?.toISOString(),
    dateModified: (infos.modifie ?? infos.publie)?.toISOString(),
    author: infos.auteur ? personne(infos.auteur, site) : editeur(site),
    // Déclaré en entier : l'Organization complète n'est présente que sur l'accueil.
    publisher: editeur(site),
    mainEntityOfPage: canonique,
    keywords: infos.tags?.join(", "),
    inLanguage: "fr-FR",
  };
}
