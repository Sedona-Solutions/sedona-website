import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Les collections Astro lisent les MÊMES fichiers que TinaCMS édite (dossier content/).
// Astro = rendu statique (source de vérité), Tina = interface d'édition.

const expertise = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/expertises" }),
  schema: z.object({
    titre: z.string(),
    numero: z.string().optional(),
    icone: z.string().optional(),
    resume: z.string().optional(),
    accroche: z.string().optional(),
    illustration: z.string().optional(),
    tags: z.array(z.string()).optional(),
    ordre: z.number().optional(),
  }),
});

const projet = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/projets" }),
  schema: z.object({
    titre: z.string(),
    client: z.string().optional(),
    couverture: z.string().optional(),
    tags: z.array(z.string()).optional(),
    resume: z.string().optional(),
    accroche: z.string().optional(),
    annee: z.string().optional(),
    technos: z.array(z.object({ nom: z.string(), logo: z.string().optional() })).optional(),
    // Couleur d'accent du hero / des cartes ("salmon" par défaut, "sunshine", "lavande"…).
    accent: z.enum(["salmon", "sunshine", "lavande"]).optional(),
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
    categorie: z.string().optional(),
    tags: z.array(z.string()).optional(),
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

export const collections = { expertise, projet, article, page };
