import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Les collections Astro lisent les MÊMES fichiers que TinaCMS édite (dossier content/).
// Astro = rendu statique (source de vérité), Tina = interface d'édition.

const titreSegmentSchema = z.object({
  t: z.string().optional(),
  pill: z.boolean().optional(),
  br: z.boolean().optional(),
});

// Segments de titre colorables (cf. `titreSegments` dans tina/config.ts), utilisés
// par les différents champs "ctaFinal" (home, offre, expertise…).
const titreSegmentsColorables = z.object({
  texte: z.string().optional(),
  couleur: z.string().optional(),
  italique: z.boolean().optional(),
});

const expertise = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/expertises" }),
  schema: z.object({
    titre: z.string(),
    accroche: z.string().optional(),
    illustration: z.string().optional(),
    pillWord: z.string().optional(),
    affichage: z
      .object({
        ordre: z.number().optional(),
        icone: z.string().optional(),
        resume: z.string().optional(),
      })
      .optional(),
    tags: z.array(z.string()).optional(),
    ticker: z.array(z.string()).optional(),
    projets: z
      .object({
        eyebrow: z.string().optional(),
        titre: z.array(titreSegmentSchema).optional(),
        layout: z.enum(["image", "texte"]).optional(),
        projetsMisEnAvant: z.array(z.object({ projet: z.string().optional() })).optional(),
        cartesTexte: z
          .array(z.object({ titre: z.string().optional(), texte: z.string().optional(), client: z.string().optional() }))
          .optional(),
      })
      .optional(),
    methode: z
      .object({
        eyebrow: z.string().optional(),
        titre: z.array(titreSegmentSchema).optional(),
        sousTitre: z.string().optional(),
        phases: z.array(z.object({ titre: z.string().optional(), texte: z.string().optional() })).optional(),
        technosTitre: z.string().optional(),
        technos: z
          .array(z.object({ nom: z.string().optional(), logo: z.string().optional(), badge: z.string().optional() }))
          .optional(),
      })
      .optional(),
    cqnf: z
      .object({
        eyebrow: z.string().optional(),
        titre: z.array(titreSegmentSchema).optional(),
        intro: z.string().optional(),
        layout: z.enum(["accordion", "cards"]).optional(),
        items: z
          .array(
            z.object({
              label: z.string().optional(),
              icone: z.string().optional(),
              texte: z.any().optional(),
              client: z.string().optional(),
              tags: z.array(z.string()).optional(),
              images: z.array(z.string()).optional(),
            }),
          )
          .optional(),
      })
      .optional(),
    articlesSection: z
      .object({
        tagsLies: z.array(z.string()).optional(),
      })
      .optional(),
    ctaFinal: z
      .object({
        titre: z.array(titreSegmentsColorables).optional(),
        description: z.string().optional(),
        ctaLabel: z.string().optional(),
        ctaHref: z.string().optional(),
      })
      .optional(),
  }),
});

const projet = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/projets" }),
  schema: z.object({
    titre: z.string(),
    client: z.string().optional(),
    couverture: z.string().optional(),
    bannerDetail: z.string().optional(),
    tags: z.array(z.string()).optional(),
    resume: z.string().optional(),
    accroche: z.string().optional(),
    annee: z.string().optional(),
    technos: z.array(z.object({ nom: z.string(), logo: z.string().optional() })).optional(),
    // Couleur d'accent du hero / des cartes ("red-rock" par défaut, "sunshine", "ovni"…).
    accent: z.enum(["red-rock", "canyon", "sunshine", "cactus", "sky", "ovni"]).optional(),
    // Section « Le contexte » : intro + colonnes (Le défi / L'enjeu / Notre rôle) + mockups.
    contexte: z
      .object({
        eyebrow: z.string().optional(),
        titre: z.string().optional(),
        intro: z.string().optional(),
        media: z.string().optional(),
        images: z.array(z.string()).optional(),
        colonnes: z.array(z.object({ titre: z.string(), texte: z.string().optional() })).optional(),
      })
      .optional(),
    defis: z
      .object({
        eyebrow: z.string().optional(),
        titre: z.string().optional(),
        intro: z.string().optional(),
        points: z.array(z.object({ titre: z.string(), texte: z.string().optional() })).optional(),
        media: z.string().optional(),
        images: z.array(z.string()).optional(),
      })
      .optional(),
    // Bande de chiffres clés (fond sombre).
    stats: z
      .object({
        eyebrow: z.string().optional(),
        titre: z.string().optional(),
        items: z
          .array(z.object({ prefixe: z.string().optional(), valeur: z.string(), suffixe: z.string().optional(), label: z.string().optional() }))
          .optional(),
      })
      .optional(),
    approche: z
      .object({
        eyebrow: z.string().optional(),
        titre: z.string().optional(),
        intro: z.string().optional(),
        note: z.string().optional(),
        points: z.array(z.object({ titre: z.string(), texte: z.string().optional(), icone: z.string().optional() })).optional(),
        galerie: z.array(z.string()).optional(),
      })
      .optional(),
    temoignage: z
      .object({
        citation: z.string(),
        auteur: z.string().optional(),
        role: z.string().optional(),
        avatar: z.string().optional(),
      })
      .optional(),
    galerie: z.array(z.string()).optional(),
    date: z.coerce.date().optional(),
  }),
});

const article = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/articles" }),
  schema: z.object({
    titre: z.string(),
    date: z.coerce.date(),
    couverture: z.string().optional(),
    extrait: z.string().optional(),
    auteur: z.string().optional(),
    avatar: z.string().optional(),
    tempsLecture: z.string().optional(),
    vedette: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    statut: z.enum(["Brouillon", "Publié", "Archivé"]).optional(),
  }),
});

const offre = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/offres" }),
  schema: z.object({
    titre: z.string(),
    eyebrow: z.string().optional(),
    accroche: z.string().optional(),
    enBref: z.string().optional(),
    illustration: z.string().optional(),
    pillVariant: z.enum(["cactus", "ovni", "red-rock", "sunshine", "sky"]).optional(),
    heroProof: z
      .object({
        avatars: z.array(z.string()).optional(),
        texte: z.string().optional(),
      })
      .optional(),
    produits: z
      .object({
        eyebrow: z.string().optional(),
        titre: z.string().optional(),
        titreAccent: z.string().optional(),
        intro: z.string().optional(),
        items: z
          .array(
            z.object({
              titre: z.string(),
              texte: z.any().optional(),
              icone: z.string().optional(),
              image: z.string().optional(),
              imageCaption: z.string().optional(),
            }),
          )
          .optional(),
      })
      .optional(),
    benefices: z
      .object({
        titre: z.string().optional(),
        items: z.array(z.object({ titre: z.string(), texte: z.any().optional(), icone: z.string().optional() })).optional(),
      })
      .optional(),
    pourQui: z
      .object({
        eyebrow: z.string().optional(),
        titre: z.string().optional(),
        items: z.array(z.object({ titre: z.string(), sousTitre: z.string().optional(), texte: z.any().optional() })).optional(),
      })
      .optional(),
    raisons: z
      .object({
        eyebrow: z.string().optional(),
        titre: z.string().optional(),
        titreAccent: z.string().optional(),
        intro: z.string().optional(),
        items: z.array(z.object({ titre: z.string(), texte: z.any().optional(), icone: z.string().optional() })).optional(),
        technosTitle: z.string().optional(),
        technos: z.array(z.string()).optional(),
        technosNote: z.string().optional(),
      })
      .optional(),
    etapes: z
      .object({
        eyebrow: z.string().optional(),
        titre: z.string().optional(),
        titreAccent: z.string().optional(),
        sousTitre: z.string().optional(),
        image: z.string().optional(),
        items: z.array(z.object({ titre: z.string(), texte: z.any().optional() })).optional(),
      })
      .optional(),
    constat: z
      .object({
        eyebrow: z.string().optional(),
        titre: z.string().optional(),
        titreAccent: z.string().optional(),
        intro: z.string().optional(),
        colonneAvantTitre: z.string().optional(),
        colonneApresTitre: z.string().optional(),
        avant: z.array(z.string()).optional(),
        apres: z.array(z.string()).optional(),
      })
      .optional(),
    incoherence: z
      .object({
        eyebrow: z.string().optional(),
        titre: z.string().optional(),
        titreAccent: z.string().optional(),
        texte: z.any().optional(),
        illustration: z.string().optional(),
      })
      .optional(),
    impacts: z
      .object({
        eyebrow: z.string().optional(),
        titre: z.string().optional(),
        items: z.array(z.object({ valeur: z.string(), label: z.string().optional(), note: z.string().optional() })).optional(),
      })
      .optional(),
    ctaFinal: z
      .object({
        titre: z
          .array(z.object({ texte: z.string().optional(), couleur: z.string().optional(), italique: z.boolean().optional() }))
          .optional(),
        description: z.string().optional(),
        ctaLabel: z.string().optional(),
        ctaHref: z.string().optional(),
      })
      .optional(),
    ordre: z.number().optional(),
  }),
});

// Pages statiques / légales (mentions légales, confidentialité, RSE…) éditables dans Tina.
const page = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/pages" }),
  schema: z.object({
    titre: z.string(),
    eyebrow: z.string().optional(),
    intro: z.string().optional(),
    dateMaj: z.string().optional(),
    fichier: z.string().optional(),
    fichierLabel: z.string().optional(),
  }),
});

export const collections = { expertise, projet, article, page, offre };
