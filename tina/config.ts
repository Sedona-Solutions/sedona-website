import { defineConfig } from "tinacms";

// Branche utilisée par Tina Cloud (laisser "main" en local).
const branch =
  process.env.TINA_BRANCH || process.env.GITHUB_BRANCH || process.env.HEAD || "main";

// Palette de marque réutilisée pour les mises en avant (mots surlignés, etc.).
const COULEURS = [
  { value: "none", label: "Aucune" },
  { value: "red-rock", label: "Red Rock (rouge)" },
  { value: "canyon", label: "Canyon (orange)" },
  { value: "sunshine", label: "Sunshine (jaune)" },
  { value: "cactus", label: "Cactus (vert)" },
  { value: "sky", label: "Sky (cyan)" },
  { value: "ovni", label: "Ovni (violet)" },
];

/** Champ réutilisable : un titre composé de segments, chacun colorable. */
const titreSegments = {
  type: "object" as const,
  name: "titre",
  label: "Titre (segments colorables)",
  list: true,
  ui: {
    itemProps: (item: { texte?: string }) => ({ label: item?.texte || "Segment" }),
  },
  fields: [
    { type: "string" as const, name: "texte", label: "Texte" },
    {
      type: "string" as const,
      name: "couleur",
      label: "Surlignage",
      options: COULEURS,
    },
    { type: "boolean" as const, name: "italique", label: "Italique" },
  ],
};

export default defineConfig({
  branch,
  // Renseigner pour Tina Cloud ; vides = mode local (édition sur les fichiers).
  clientId: process.env.PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      // ---------------------------------------------------------------
      // Réglages globaux (navigation, pied de page, agences, contact)
      // ---------------------------------------------------------------
      {
        name: "global",
        label: "Réglages du site",
        path: "content/global",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "navigation",
            label: "Navigation",
            list: true,
            ui: { itemProps: (i: { label?: string }) => ({ label: i?.label }) },
            fields: [
              { type: "string", name: "label", label: "Libellé" },
              { type: "string", name: "href", label: "Lien" },
              {
                type: "object",
                name: "sousMenu",
                label: "Sous-menu (déroulant)",
                list: true,
                ui: { itemProps: (i: { label?: string }) => ({ label: i?.label }) },
                fields: [
                  { type: "string", name: "label", label: "Libellé" },
                  { type: "string", name: "href", label: "Lien" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "agences",
            label: "Agences",
            list: true,
            ui: { itemProps: (i: { ville?: string }) => ({ label: i?.ville }) },
            fields: [
              { type: "string", name: "ville", label: "Ville" },
              { type: "string", name: "adresse", label: "Adresse", ui: { component: "textarea" } },
              { type: "string", name: "telephone", label: "Téléphone" },
            ],
          },
          { type: "string", name: "email", label: "E-mail de contact" },
          {
            type: "object",
            name: "reseaux",
            label: "Réseaux sociaux",
            list: true,
            ui: { itemProps: (i: { plateforme?: string }) => ({ label: i?.plateforme }) },
            fields: [
              { type: "string", name: "plateforme", label: "Plateforme" },
              { type: "string", name: "url", label: "URL" },
            ],
          },
        ],
      },

      // ---------------------------------------------------------------
      // Page d'accueil (contenu structuré, singleton)
      // ---------------------------------------------------------------
      {
        name: "home",
        label: "Page d'accueil",
        path: "content/home",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { ...titreSegments },
              {
                type: "object",
                name: "motsCles",
                label: "Mots-clés flottants",
                list: true,
                ui: { itemProps: (i: { label?: string }) => ({ label: i?.label }) },
                fields: [
                  { type: "string", name: "label", label: "Libellé" },
                  { type: "string", name: "couleur", label: "Couleur", options: COULEURS },
                ],
              },
              { type: "string", name: "sousTitre", label: "Sous-titre", ui: { component: "textarea" } },
              { type: "string", name: "ctaLabel", label: "Bouton — libellé" },
              { type: "string", name: "ctaHref", label: "Bouton — lien" },
            ],
          },
          {
            type: "string",
            name: "ticker",
            label: "Bandeau défilant (slogans)",
            list: true,
          },
          { type: "string", name: "intro", label: "Phrase d'introduction", ui: { component: "textarea" } },
          {
            type: "string",
            name: "chips",
            label: "Mots-clés (Créativité, Innovation…)",
            list: true,
          },
          {
            type: "object",
            name: "stats",
            label: "Chiffres clés",
            list: true,
            ui: { itemProps: (i: { valeur?: string }) => ({ label: i?.valeur }) },
            fields: [
              { type: "string", name: "valeur", label: "Valeur (ex. 25+)" },
              { type: "string", name: "label", label: "Libellé" },
            ],
          },
          {
            type: "object",
            name: "statsCta",
            label: "Lien sous les chiffres",
            fields: [
              { type: "string", name: "label", label: "Libellé" },
              { type: "string", name: "href", label: "Lien" },
            ],
          },
          {
            type: "object",
            name: "expertisesSection",
            label: "Section Expertises",
            fields: [
              { ...titreSegments },
              { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "projetsSection",
            label: "Section Projets",
            fields: [
              { ...titreSegments },
              { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
              {
                type: "object",
                name: "projetsMisEnAvant",
                label: "Projets mis en avant",
                list: true,
                fields: [
                  {
                    type: "reference",
                    name: "projet",
                    label: "Projet",
                    collections: ["projet"],
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "temoignagesSection",
            label: "Section Témoignages",
            fields: [
              { ...titreSegments },
              { type: "string", name: "intro", label: "Sous-titre", ui: { component: "textarea" } },
              {
                type: "object",
                name: "temoignages",
                label: "Témoignages",
                list: true,
                ui: { itemProps: (i: { auteur?: string }) => ({ label: i?.auteur }) },
                fields: [
                  { type: "string", name: "citation", label: "Citation", ui: { component: "textarea" } },
                  { type: "string", name: "auteur", label: "Auteur" },
                  { type: "string", name: "role", label: "Rôle / société" },
                  { type: "image", name: "avatar", label: "Avatar" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "clientsSection",
            label: "Bandeau clients",
            fields: [
              { type: "string", name: "titre", label: "Titre" },
              {
                type: "object",
                name: "logos",
                label: "Logos clients",
                list: true,
                ui: { itemProps: (i: { nom?: string }) => ({ label: i?.nom }) },
                fields: [
                  { type: "string", name: "nom", label: "Nom" },
                  { type: "image", name: "logo", label: "Logo" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "ctaFinal",
            label: "Bandeau d'appel final",
            fields: [
              { ...titreSegments },
              { type: "string", name: "ctaLabel", label: "Bouton — libellé" },
              { type: "string", name: "ctaHref", label: "Bouton — lien" },
            ],
          },
        ],
      },

      // ---------------------------------------------------------------
      // Expertises / Domaines
      // ---------------------------------------------------------------
      {
        name: "expertise",
        label: "Expertises (Domaines)",
        path: "content/expertises",
        format: "md",
        fields: [
          { type: "string", name: "titre", label: "Titre", isTitle: true, required: true },
          { type: "string", name: "numero", label: "Numéro (ex. 01)" },
          {
            type: "string",
            name: "icone",
            label: "Icône",
            options: [
              { value: "produits", label: "Produits digitaux (design)" },
              { value: "data", label: "Data & IA (base de données)" },
              { value: "infra", label: "Infra & Sécurité (cloud)" },
            ],
          },
          { type: "string", name: "resume", label: "Description", ui: { component: "textarea" } },
          { type: "string", name: "accroche", label: "Accroche (sous-titre de la page Domaine)", ui: { component: "textarea" } },
          { type: "image", name: "illustration", label: "Illustration du hero (page Domaine)" },
          { type: "string", name: "tags", label: "Tags", list: true },
          { type: "number", name: "ordre", label: "Ordre d'affichage" },
          { type: "rich-text", name: "body", label: "Contenu", isBody: true },
        ],
      },

      // ---------------------------------------------------------------
      // Projets / Références (études de cas)
      // ---------------------------------------------------------------
      {
        name: "projet",
        label: "Projets / Références",
        path: "content/projets",
        format: "md",
        fields: [
          { type: "string", name: "titre", label: "Titre", isTitle: true, required: true },
          { type: "string", name: "client", label: "Client" },
          { type: "image", name: "couverture", label: "Image de couverture" },
          { type: "string", name: "tags", label: "Tags", list: true },
          { type: "string", name: "resume", label: "Résumé", ui: { component: "textarea" } },
          { type: "string", name: "accroche", label: "Accroche (sous le titre)", ui: { component: "textarea" } },
          { type: "string", name: "annee", label: "Année (ex. 2019 - Aujourd'hui)" },
          { type: "string", name: "accent", label: "Couleur d'accent (hero/cartes)", options: ["salmon", "sunshine", "lavande"] },
          {
            type: "object", name: "technos", label: "Stack technique", list: true,
            ui: { itemProps: (i: { nom?: string }) => ({ label: i?.nom }) },
            fields: [
              { type: "string", name: "nom", label: "Nom" },
              { type: "image", name: "logo", label: "Logo" },
            ],
          },
          {
            type: "object", name: "contexte", label: "Le contexte",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { type: "string", name: "titre", label: "Titre" },
              { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
              { type: "image", name: "media", label: "Visuel unique (cluster)" },
              { type: "image", name: "images", label: "Mockups (2, si pas de visuel unique)", list: true },
              {
                type: "object", name: "colonnes", label: "Colonnes (Le défi / L'enjeu / Notre rôle)", list: true,
                ui: { itemProps: (i: { titre?: string }) => ({ label: i?.titre }) },
                fields: [
                  { type: "string", name: "titre", label: "Titre" },
                  { type: "string", name: "texte", label: "Texte", ui: { component: "textarea" } },
                ],
              },
            ],
          },
          {
            type: "object", name: "defis", label: "Défis techniques & métier",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { type: "string", name: "titre", label: "Titre" },
              { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
              { type: "image", name: "media", label: "Visuel unique (collage)" },
              { type: "image", name: "images", label: "Visuels (tablette + mobile, si pas de visuel unique)", list: true },
              {
                type: "object", name: "points", label: "Défis", list: true,
                ui: { itemProps: (i: { titre?: string }) => ({ label: i?.titre }) },
                fields: [
                  { type: "string", name: "titre", label: "Titre" },
                  { type: "string", name: "texte", label: "Texte", ui: { component: "textarea" } },
                ],
              },
            ],
          },
          {
            type: "object", name: "stats", label: "Impacts mesurables (bande sombre)",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { type: "string", name: "titre", label: "Titre" },
              {
                type: "object", name: "items", label: "Chiffres", list: true,
                ui: { itemProps: (i: { valeur?: string }) => ({ label: i?.valeur }) },
                fields: [
                  { type: "string", name: "prefixe", label: "Préfixe (ex. +)" },
                  { type: "string", name: "valeur", label: "Valeur (ex. 6M)" },
                  { type: "string", name: "suffixe", label: "Suffixe (ex. +)" },
                  { type: "string", name: "label", label: "Légende" },
                ],
              },
            ],
          },
          {
            type: "object", name: "approche", label: "Notre approche",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { type: "string", name: "titre", label: "Titre" },
              { type: "string", name: "intro", label: "Intro (paragraphe)", ui: { component: "textarea" } },
              { type: "string", name: "note", label: "Note (pastille inclinée)" },
              { type: "image", name: "galerie", label: "Galerie / montage (sous les cartes)", list: true },
              {
                type: "object", name: "points", label: "Points", list: true,
                ui: { itemProps: (i: { titre?: string }) => ({ label: i?.titre }) },
                fields: [
                  { type: "string", name: "titre", label: "Titre" },
                  { type: "string", name: "texte", label: "Texte", ui: { component: "textarea" } },
                  { type: "string", name: "icone", label: "Icône (nom de fichier dans /icons, sans .svg)" },
                ],
              },
            ],
          },
          {
            type: "object", name: "temoignage", label: "Témoignage",
            fields: [
              { type: "string", name: "citation", label: "Citation", ui: { component: "textarea" } },
              { type: "string", name: "auteur", label: "Auteur" },
              { type: "string", name: "role", label: "Fonction" },
              { type: "image", name: "avatar", label: "Photo" },
            ],
          },
          { type: "image", name: "galerie", label: "Galerie d'images", list: true },
          { type: "datetime", name: "date", label: "Date" },
          { type: "rich-text", name: "body", label: "Étude de cas", isBody: true },
        ],
      },

      // ---------------------------------------------------------------
      // Blog / Actualités
      // ---------------------------------------------------------------
      {
        name: "article",
        label: "Articles (Blog)",
        path: "content/articles",
        format: "md",
        ui: {
          filename: {
            slugify: (values: { titre?: string }) =>
              (values?.titre || "article")
                .toLowerCase()
                .normalize("NFD")
                .replace(/[̀-ͯ]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, ""),
          },
        },
        fields: [
          { type: "string", name: "titre", label: "Titre", isTitle: true, required: true },
          { type: "datetime", name: "date", label: "Date", required: true },
          { type: "image", name: "couverture", label: "Image de couverture" },
          { type: "string", name: "extrait", label: "Extrait", ui: { component: "textarea" } },
          { type: "string", name: "auteur", label: "Auteur" },
          { type: "image", name: "avatar", label: "Avatar auteur" },
          { type: "string", name: "tempsLecture", label: "Temps de lecture (ex. 5 min de lecture)" },
          { type: "boolean", name: "vedette", label: "Article à la une" },
          {
            type: "string",
            name: "categorie",
            label: "Catégorie (filtre)",
            options: [
              "BTP",
              "Banque",
              "Media",
              "Industrie & Défense",
              "Luxe",
              "Services publiques",
              "Santé",
              "Services",
            ],
          },
          { type: "string", name: "tags", label: "Tags", list: true },
          { type: "rich-text", name: "body", label: "Contenu", isBody: true },
        ],
      },
      // ---------------------------------------------------------------
      // Pages statiques / légales (mentions légales, confidentialité, RSE…)
      // ---------------------------------------------------------------
      {
        name: "page",
        label: "Pages statiques (légal…)",
        path: "content/pages",
        format: "md",
        fields: [
          { type: "string", name: "titre", label: "Titre", isTitle: true, required: true },
          { type: "string", name: "eyebrow", label: "Sur-titre (eyebrow)" },
          { type: "string", name: "intro", label: "Introduction", ui: { component: "textarea" } },
          { type: "string", name: "dateMaj", label: "Date de mise à jour (ex. Juin 2026)" },
          { type: "image", name: "fichier", label: "Fichier à télécharger (PDF)" },
          { type: "string", name: "fichierLabel", label: "Libellé du bouton de téléchargement" },
          { type: "rich-text", name: "body", label: "Contenu", isBody: true },
        ],
      },
    ],
  },
});
