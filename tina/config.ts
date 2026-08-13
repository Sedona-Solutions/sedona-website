import { defineConfig } from "tinacms";
import { ColorSwatchDropdown } from "./fields/ColorSwatchDropdown";
import { ProjectsLayoutToggle } from "./fields/ProjectsLayoutToggle";
import { LogoActiveToggle } from "./fields/LogoActiveToggle";

// Branche utilisée par Tina Cloud (laisser "main" en local).
const branch =
  process.env.TINA_BRANCH || process.env.GITHUB_BRANCH || process.env.HEAD || "main";

// Palette de marque réutilisée pour les mises en avant (mots surlignés, etc.).
const COULEURS = [
  { value: "none", label: "Aucune" },
  { value: "red-rock", label: "Red Rock (rouge)", color: "#f8b3a9" },
  { value: "canyon", label: "Canyon (orange)", color: "#e9b189" },
  { value: "sunshine", label: "Sunshine (jaune)", color: "#f8d98b" },
  { value: "cactus", label: "Cactus (vert)", color: "#a7e9d1" },
  { value: "sky", label: "Sky (cyan)", color: "#a9e7e4" },
  { value: "ovni", label: "Ovni (violet)", color: "#b3b5ee" },
];

// Palette dédiée aux pastilles de fond des membres de l'équipe (photos gérées
// depuis la page Carrières, réutilisées aussi sur Notre histoire) — reprend les
// tokens de couleur Figma (accent-color-1..6 + variants), triée par ordre
// alphabétique de libellé.
const TEAM_TINTS = [
  { value: "none", label: "Aucune" },
  { value: "cactus", label: "Cactus", color: "#a7e9d1" },
  { value: "cactus-light", label: "Cactus light", color: "#d4f4e7" },
  { value: "canyon", label: "Canyon", color: "#e9b189" },
  { value: "canyon-light", label: "Canyon light", color: "#fae9db" },
  { value: "ovni", label: "Ovni", color: "#b3b5ee" },
  { value: "ovni-light", label: "Ovni light", color: "#e5e7fa" },
  { value: "red-rock", label: "Red rock", color: "#f8b3a9" },
  { value: "red-rock-light", label: "Red rock light", color: "#fbd3cd" },
  { value: "red-rock-strong", label: "Red rock strong", color: "#f18878" },
  { value: "sky", label: "Sky", color: "#a9e7e4" },
  { value: "sky-light", label: "Sky light", color: "#d4f3f0" },
  { value: "sunshine", label: "Sunshine", color: "#f8d98b" },
  { value: "sunshine-light", label: "Sunshine light", color: "#fdeec9" },
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
      ui: { component: ColorSwatchDropdown },
      options: COULEURS,
    },
    { type: "boolean" as const, name: "italique", label: "Italique" },
  ],
};

/** Champ réutilisable : le titre de section en texte simple (une seule chaîne),
 * à coupler avec `titreAccent` ci-dessous pour le mot/la phrase à mettre en avant. */
const titreTexte = {
  type: "string" as const,
  name: "titre",
  label: "Titre",
};

/** Champ réutilisable : le mot ou la phrase à mettre en avant dans `titre`
 * (doit être une sous-chaîne exacte de `titre`). Si vide ou introuvable, c'est
 * le dernier mot du titre qui est surligné par défaut. */
const titreAccentTexte = {
  type: "string" as const,
  name: "titreAccent",
  label: "Mot surligné dans le titre (optionnel)",
  description: "Par défaut, c'est le dernier mot du Titre qui est surligné.",
};

/** Champ réutilisable : la couleur du surlignage pour `titreTexte`/`titreAccentTexte`,
 * choisie une fois par section (pas par page, pas segment par segment). */
const couleurTitre = {
  type: "string" as const,
  name: "titreCouleur",
  label: "Couleur section",
  description: "Couleur du mot mis en avant dans le titre de cette section.",
  ui: { component: ColorSwatchDropdown },
  options: COULEURS.filter((c) => c.value !== "none"),
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
              { type: "string", name: "label", label: "Sous-titre (ex. Agence Rhônes-Alpes)" },
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
                  { type: "string", name: "couleur", label: "Couleur", ui: { component: ColorSwatchDropdown }, options: COULEURS },
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
              { ...titreTexte },
              { ...titreAccentTexte },
              { ...couleurTitre },
              { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "offresSection",
            label: "Section Offres",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre (ex. Nos offres spéciales)" },
              { ...titreTexte },
              { ...titreAccentTexte },
              { ...couleurTitre },
              { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
              {
                type: "object",
                name: "offres",
                label: "Offres",
                list: true,
                ui: { itemProps: (i: { titre?: string }) => ({ label: i?.titre || "Offre" }) },
                fields: [
                  { type: "string", name: "titre", label: "Titre (badge)" },
                  { type: "string", name: "accroche", label: "Accroche (grand titre de carte)", ui: { component: "textarea" } },
                  { type: "string", name: "ctaHref", label: "Lien de la carte" },
                  {
                    type: "image",
                    name: "illustration",
                    label: "Illustration / capture d'écran (optionnel, sinon un espace vide est réservé)",
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "projetsSection",
            label: "Section Projets",
            fields: [
              { ...titreTexte },
              { ...titreAccentTexte },
              { ...couleurTitre },
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
              { ...titreTexte },
              { ...titreAccentTexte },
              { ...couleurTitre },
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
                ui: { itemProps: (i: { nom?: string; actif?: boolean }) => ({ label: i?.actif === false ? `${i?.nom} (masqué)` : i?.nom }) },
                fields: [
                  { type: "boolean", name: "actif", label: "Afficher sur la home" },
                  { type: "string", name: "nom", label: "Nom" },
                  { type: "image", name: "logo", label: "Logo" },
                ],
              },
              {
                type: "string",
                name: "_logosVisibilityToggle",
                label: "_logosVisibilityToggle",
                ui: { component: LogoActiveToggle },
              },
            ],
          },
          {
            type: "object",
            name: "ctaFinal",
            label: "Bandeau d'appel final",
            fields: [
              { ...titreTexte },
              { ...titreAccentTexte },
              { ...couleurTitre },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
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
          {
            type: "string",
            name: "pillWord",
            label: "Mot surligné dans le titre du hero (optionnel)",
            description: "Par défaut, c'est le dernier mot du Titre qui est surligné.",
          },
          {
            type: "object",
            name: "affichage",
            label: "Résumé (menu & cartes)",
            description: "Comment ce domaine apparaît dans le méga-menu et les autres listes du site.",
            fields: [
              { type: "number", name: "ordre", label: "Ordre d'affichage" },
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
            ],
          },
          { type: "string", name: "accroche", label: "Accroche (sous-titre de la page Domaine)", ui: { component: "textarea" } },
          { type: "image", name: "illustration", label: "Illustration du hero (page Domaine)" },
          { type: "string", name: "tags", label: "Tags", list: true },
          {
            type: "string",
            name: "ticker",
            label: "Bandeau défilant (slogans)",
            list: true,
            description: "Si vide, le bandeau défilant de la page d'accueil est utilisé par défaut.",
          },
          {
            type: "object",
            name: "projets",
            label: "Section « Projets »",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { ...titreTexte },
              { ...titreAccentTexte },
              {
                type: "string",
                name: "layout",
                label: "Style des cartes",
                description: "Avec image (comme sur la home) ou texte (badge numéroté, sans image — Produits digitaux vs Data & IA / Infra & Sécurité).",
                options: [
                  { value: "image", label: "Avec image" },
                  { value: "texte", label: "Texte (sans image)" },
                ],
              },
              {
                type: "object",
                name: "projetsMisEnAvant",
                label: "Sélection (4 projets max)",
                description: "Si vide, les 4 projets les plus récents sont affichés automatiquement. Visible uniquement si « Style des cartes » = Avec image.",
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
              {
                type: "object",
                name: "cartesTexte",
                label: "Cartes",
                description: "Cartes propres à cette section, indépendantes des fiches Projets. Visible uniquement si « Style des cartes » = Texte.",
                list: true,
                ui: { itemProps: (item: { titre?: string }) => ({ label: item?.titre || "Carte" }) },
                fields: [
                  { type: "string", name: "titre", label: "Titre" },
                  { type: "string", name: "texte", label: "Texte", ui: { component: "textarea" } },
                  { type: "string", name: "client", label: "Client (optionnel)" },
                ],
              },
              {
                type: "string",
                name: "_layoutToggle",
                label: "_layoutToggle",
                ui: { component: ProjectsLayoutToggle },
              },
            ],
          },
          {
            type: "object",
            name: "methode",
            label: "Section « Méthode »",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { ...titreTexte },
              { ...titreAccentTexte },
              { type: "string", name: "sousTitre", label: "Sous-titre", ui: { component: "textarea" } },
              {
                type: "object",
                name: "phases",
                label: "Phases",
                list: true,
                ui: { itemProps: (item: { titre?: string }) => ({ label: item?.titre || "Phase" }) },
                fields: [
                  { type: "string", name: "titre", label: "Titre" },
                  { type: "string", name: "texte", label: "Texte", ui: { component: "textarea" } },
                ],
              },
              { type: "string", name: "technosTitre", label: "Titre technos (optionnel)" },
              {
                type: "object",
                name: "technos",
                label: "Technos",
                list: true,
                ui: { itemProps: (item: { nom?: string }) => ({ label: item?.nom || "Techno" }) },
                fields: [
                  { type: "string", name: "nom", label: "Nom" },
                  { type: "image", name: "logo", label: "Logo" },
                  { type: "string", name: "badge", label: "Badge (optionnel, ex. Gold partner)" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "cqnf",
            label: "Section « Ce que nous faisons »",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { ...titreTexte },
              { ...titreAccentTexte },
              { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
              {
                type: "string",
                name: "layout",
                label: "Présentation",
                description: "Accordéon (défaut) ou grille de cas d'usage numérotés (cf. Data & IA).",
                options: [
                  { value: "accordion", label: "Accordéon" },
                  { value: "cards", label: "Grille de cas d'usage" },
                ],
              },
              {
                type: "object",
                name: "items",
                label: "Items",
                list: true,
                ui: { itemProps: (item: { label?: string }) => ({ label: item?.label || "Item" }) },
                fields: [
                  { type: "string", name: "label", label: "Titre" },
                  { type: "string", name: "icone", label: "Icône (nom de fichier dans /icons, sans .svg)" },
                  { type: "rich-text", name: "texte", label: "Texte" },
                  { type: "string", name: "client", label: "Client (optionnel, ex. « mutuelle ») — affiché en « Client : X », mode grille uniquement" },
                  { type: "string", name: "tags", label: "Tags (optionnel, mode accordéon uniquement)", list: true },
                  {
                    type: "image",
                    name: "images",
                    label: "Images (optionnel, mode accordéon uniquement — 3 maximum)",
                    list: true,
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "articlesSection",
            label: "Sélection d'articles",
            description: "Les articles publiés partageant au moins un de ces tags sont affichés automatiquement (les plus récents d'abord). Si vide, les articles les plus récents du blog sont affichés.",
            fields: [
              { type: "string", name: "tagsLies", label: "Tags associés au domaine", list: true },
            ],
          },
          {
            type: "object",
            name: "ctaFinal",
            label: "Bandeau d'appel final",
            description: "Chaque champ laissé vide reprend celui du bandeau d'appel final de la page d'accueil.",
            fields: [
              { ...titreTexte },
              { ...titreAccentTexte },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              { type: "string", name: "ctaLabel", label: "Bouton — libellé" },
              { type: "string", name: "ctaHref", label: "Bouton — lien" },
            ],
          },
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
          {
            type: "string",
            name: "accent",
            label: "Couleur d'accent de la page",
            ui: { component: ColorSwatchDropdown },
            options: [
              { value: "red-rock", label: "Red Rock (rose)", color: "#f8b3a9" },
              { value: "canyon", label: "Canyon (orange)", color: "#e9b189" },
              { value: "sunshine", label: "Sunshine (jaune)", color: "#f8d98b" },
              { value: "cactus", label: "Cactus (vert)", color: "#a7e9d1" },
              { value: "sky", label: "Sky (cyan)", color: "#a9e7e4" },
              { value: "ovni", label: "Ovni (violet)", color: "#d0d3f5" },
            ],
          },
          { type: "string", name: "client", label: "Client" },
          { type: "image", name: "couverture", label: "Image de couverture" },
          { type: "string", name: "accroche", label: "Accroche (sous le titre)", ui: { component: "textarea" } },
          { type: "image", name: "bannerDetail", label: "Bannière" },
          { type: "string", name: "tags", label: "Tags", list: true },
          { type: "string", name: "annee", label: "Année (ex. 2019 - Aujourd'hui)" },
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
          {
            type: "object", name: "technos", label: "Stack technique", list: true,
            ui: { itemProps: (i: { nom?: string }) => ({ label: i?.nom }) },
            fields: [
              { type: "string", name: "nom", label: "Nom" },
              { type: "image", name: "logo", label: "Logo" },
            ],
          },
          { type: "image", name: "galerie", label: "Galerie d'images", list: true },
          { type: "datetime", name: "date", label: "Date" },
        ],
      },

      // ---------------------------------------------------------------
      // Offres clé en main (pages détail, liées depuis le bloc Offres home)
      // ---------------------------------------------------------------
      {
        name: "offre",
        label: "Offres clé en main",
        path: "content/offres",
        format: "md",
        fields: [
          {
            type: "string",
            name: "pillVariant",
            label: "Couleur d'accent",
            ui: { component: ColorSwatchDropdown },
            options: [
              { value: "cactus", label: "Vert (cactus)", color: "#71d7b4" },
              { value: "ovni", label: "Violet (ovni)", color: "#b3b5ee" },
              { value: "red-rock", label: "Rose (red rock)", color: "#f8b3a9" },
              { value: "sunshine", label: "Jaune (sunshine)", color: "#f5c254" },
              { value: "sky", label: "Bleu (sky)", color: "#75d3d0" },
            ],
          },
          { type: "string", name: "titre", label: "Titre", isTitle: true, required: true },
          { type: "string", name: "eyebrow", label: "Sur-titre" },
          { type: "string", name: "accroche", label: "Accroche (grand titre du hero)", ui: { component: "textarea" } },
          {
            type: "string",
            name: "accrocheAccent",
            label: "Mot mis en avant (pill) dans l'accroche",
            description: "Doit être une sous-chaîne exacte de l'Accroche. Si vide, le Titre (nom de l'offre) est utilisé par défaut.",
          },
          { type: "string", name: "enBref", label: "En bref (paragraphe d'intro)", ui: { component: "textarea" } },
          { type: "image", name: "illustration", label: "Illustration du hero" },
          {
            type: "object", name: "heroProof", label: "Preuve sociale (sous le hero — page Brieff)",
            fields: [
              { type: "image", name: "avatars", label: "Avatars", list: true },
              { type: "string", name: "texte", label: "Texte (ex. chiffre à confirmer)" },
            ],
          },
          {
            type: "object", name: "pourQui", label: "Pour qui ?",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre (optionnel)" },
              { ...titreTexte },
              { ...titreAccentTexte },
              {
                type: "object", name: "items", label: "Profils", list: true,
                ui: { itemProps: (i: { titre?: string }) => ({ label: i?.titre }) },
                fields: [
                  { type: "string", name: "titre", label: "Rôle" },
                  { type: "string", name: "sousTitre", label: "Sous-titre (optionnel, ex. « 3–5 projets en parallèle »)" },
                  { type: "rich-text", name: "texte", label: "Texte" },
                ],
              },
            ],
          },
          {
            type: "object", name: "constat", label: "Le constat (avant / après, optionnel)",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { ...titreTexte },
              { ...titreAccentTexte },
              { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
              { type: "string", name: "colonneAvantTitre", label: "Titre colonne « avant »" },
              { type: "string", name: "colonneApresTitre", label: "Titre colonne « après »" },
              { type: "string", name: "avant", label: "Frictions (colonne « avant »)", list: true },
              { type: "string", name: "apres", label: "Changements (colonne « après »)", list: true },
            ],
          },
          {
            type: "object", name: "etapes", label: "Comment ça marche ?",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre (optionnel)" },
              { ...titreTexte },
              { ...titreAccentTexte },
              { type: "string", name: "sousTitre", label: "Sous-titre" },
              { type: "image", name: "image", label: "Capture d'écran (optionnel)" },
              {
                type: "object", name: "items", label: "Étapes", list: true,
                ui: { itemProps: (i: { titre?: string }) => ({ label: i?.titre }) },
                fields: [
                  { type: "string", name: "titre", label: "Titre" },
                  { type: "rich-text", name: "texte", label: "Texte" },
                ],
              },
            ],
          },
          {
            type: "object", name: "incoherence", label: "Détection (bloc 2 colonnes, optionnel)",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { ...titreTexte },
              { ...titreAccentTexte },
              { type: "rich-text", name: "texte", label: "Texte" },
              { type: "image", name: "illustration", label: "Illustration" },
            ],
          },
          {
            type: "object", name: "produits", label: "Les fonctionnalités",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre (optionnel)" },
              { ...titreTexte },
              { ...titreAccentTexte },
              { type: "string", name: "intro", label: "Intro (optionnel)", ui: { component: "textarea" } },
              {
                type: "object", name: "items", label: "Livrables", list: true,
                ui: { itemProps: (i: { titre?: string }) => ({ label: i?.titre }) },
                fields: [
                  { type: "string", name: "titre", label: "Titre" },
                  { type: "rich-text", name: "texte", label: "Texte" },
                  { type: "string", name: "icone", label: "Icône (nom de fichier dans /icons, sans .svg)" },
                  { type: "image", name: "image", label: "Image (optionnel, capture d'écran de la fonctionnalité)" },
                  { type: "string", name: "imageCaption", label: "Légende de l'image (optionnel)" },
                ],
              },
            ],
          },
          {
            type: "object", name: "benefices", label: "Vos bénéfices concrets",
            fields: [
              { ...titreTexte },
              { ...titreAccentTexte },
              {
                type: "object", name: "items", label: "Bénéfices", list: true,
                ui: { itemProps: (i: { titre?: string }) => ({ label: i?.titre }) },
                fields: [
                  { type: "string", name: "titre", label: "Titre" },
                  { type: "rich-text", name: "texte", label: "Texte" },
                  { type: "string", name: "icone", label: "Icône (nom de fichier dans /icons, sans .svg)" },
                ],
              },
            ],
          },
          {
            type: "object", name: "impacts", label: "Impacts mesurables (bande sombre, optionnel)",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { ...titreTexte },
              { ...titreAccentTexte },
              {
                type: "object", name: "items", label: "Chiffres", list: true,
                ui: { itemProps: (i: { valeur?: string }) => ({ label: i?.valeur }) },
                fields: [
                  { type: "string", name: "valeur", label: "Valeur (ex. -70%)" },
                  { type: "string", name: "label", label: "Légende" },
                  { type: "string", name: "note", label: "Note (optionnel)", ui: { component: "textarea" } },
                ],
              },
            ],
          },
          {
            type: "object", name: "temoignage", label: "Témoignage client (page Brieff)",
            description: "Si vide, un témoignage de la home est utilisé par défaut.",
            fields: [
              { type: "string", name: "citation", label: "Citation", ui: { component: "textarea" } },
              { type: "string", name: "auteur", label: "Auteur" },
              { type: "string", name: "role", label: "Fonction" },
              { type: "image", name: "avatar", label: "Photo" },
            ],
          },
          {
            type: "object", name: "raisons", label: "Infos complémentaires (section grid)",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre (optionnel)" },
              { ...titreTexte },
              { ...titreAccentTexte },
              { type: "string", name: "intro", label: "Intro (optionnel)", ui: { component: "textarea" } },
              {
                type: "object", name: "items", label: "Raisons", list: true,
                ui: { itemProps: (i: { titre?: string }) => ({ label: i?.titre }) },
                fields: [
                  { type: "string", name: "titre", label: "Titre" },
                  { type: "rich-text", name: "texte", label: "Texte" },
                  { type: "string", name: "icone", label: "Icône (optionnel, nom de fichier dans /icons, sans .svg)" },
                ],
              },
              { type: "string", name: "technosTitle", label: "Titre technos (optionnel)" },
              {
                type: "object", name: "technos", label: "Technos", list: true,
                ui: { itemProps: (i: { nom?: string }) => ({ label: i?.nom }) },
                fields: [
                  { type: "string", name: "nom", label: "Nom" },
                  { type: "image", name: "logo", label: "Logo" },
                ],
              },
              { type: "string", name: "technosNote", label: "Note technos (optionnel)", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object", name: "ctaFinal", label: "Bandeau d'appel final",
            fields: [
              { ...titreTexte },
              { ...titreAccentTexte },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              { type: "string", name: "ctaLabel", label: "Bouton — libellé" },
              { type: "string", name: "ctaHref", label: "Bouton — lien" },
            ],
          },
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
            name: "tags",
            label: "Tags",
            list: true,
            description: "La barre de filtre du blog affiche automatiquement les tags utilisés par plus de 5 articles.",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Contenu",
            isBody: true,
            description:
              "Astuce vidéo : collez le lien YouTube ou Vimeo seul sur sa propre ligne (texte brut, ou via le bouton Lien) pour l'intégrer automatiquement en lecteur vidéo.",
          },
          {
            type: "string",
            name: "statut",
            label: "Statut",
            options: ["Brouillon", "Publié", "Archivé"],
          },
        ],
      },
      // ---------------------------------------------------------------
      // Évènements (bandeau affiché sur l'accueil, entre le titre "News &
      // articles" et la grille d'articles, selon la période d'affichage)
      // ---------------------------------------------------------------
      {
        name: "evenement",
        label: "Évènements",
        path: "content/evenements",
        format: "md",
        ui: {
          filename: {
            slugify: (values: { titre?: string }) =>
              (values?.titre || "evenement")
                .toLowerCase()
                .normalize("NFD")
                .replace(/[̀-ͯ]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, ""),
          },
        },
        fields: [
          { type: "string", name: "titre", label: "Nom de l'évènement", isTitle: true, required: true },
          { type: "image", name: "image", label: "Image", required: true },
          {
            type: "string",
            name: "ctaLabel",
            label: "CTA — libellé du bouton",
            description: "Ex. S'inscrire à l'évènement",
          },
          { type: "string", name: "ctaHref", label: "CTA — lien" },
          {
            type: "string",
            name: "position",
            label: "Positionnement du bouton",
            options: [
              { value: "gauche", label: "Gauche" },
              { value: "centre", label: "Centre" },
              { value: "droite", label: "Droite" },
            ],
          },
          { type: "datetime", name: "dateDebut", label: "Date d'affichage — début", required: true },
          { type: "datetime", name: "dateFin", label: "Date d'affichage — fin", required: true },
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
          { type: "string", name: "eyebrow", label: "Sur-titre" },
          { type: "string", name: "intro", label: "Introduction", ui: { component: "textarea" } },
          { type: "string", name: "dateMaj", label: "Date de mise à jour (ex. Juin 2026)" },
          { type: "image", name: "fichier", label: "Fichier à télécharger (PDF)" },
          { type: "string", name: "fichierLabel", label: "Libellé du bouton de téléchargement" },
          { type: "rich-text", name: "body", label: "Contenu", isBody: true },
        ],
      },
      // ---------------------------------------------------------------
      // Page "Notre histoire" (contenu structuré, singleton)
      // ---------------------------------------------------------------
      {
        name: "histoire",
        label: "Page Notre histoire",
        path: "content/histoire",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { ...titreTexte },
              { ...titreAccentTexte },
              { ...couleurTitre },
              { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
              { type: "string", name: "ctaLabel", label: "Bouton — libellé" },
              { type: "string", name: "ctaHref", label: "Bouton — lien" },
            ],
          },
          { type: "image", name: "photoBand1", label: "Photo pleine largeur (sous le hero)" },
          {
            type: "object",
            name: "manifeste",
            label: "Manifeste des fondateurs",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { type: "string", name: "paragraphes", label: "Paragraphes", list: true, ui: { component: "textarea" } },
              { type: "string", name: "signatureRole", label: "Signature — rôle (ex. Les Co-fondateurs)" },
              { type: "string", name: "signatureNom", label: "Signature — noms" },
              { type: "string", name: "note", label: "Petite note manuscrite (ex. C'est nous là :))" },
            ],
          },
          {
            type: "object",
            name: "timeline",
            label: "Frise chronologique",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { type: "string", name: "titre", label: "Titre" },
              {
                type: "object",
                name: "items",
                label: "Étapes",
                list: true,
                ui: { itemProps: (i: { annee?: string; titre?: string }) => ({ label: `${i?.annee ?? ""} — ${i?.titre ?? ""}` }) },
                fields: [
                  { type: "string", name: "annee", label: "Année" },
                  { type: "string", name: "titre", label: "Titre" },
                  { type: "string", name: "texte", label: "Texte", ui: { component: "textarea" } },
                  { type: "string", name: "stat", label: "Chiffre (ex. 140 personnes / 14 M€ CA)" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "offices",
            label: "Agences",
            fields: [
              { ...titreTexte },
              { ...titreAccentTexte },
              { ...couleurTitre },
              {
                type: "object",
                name: "items",
                label: "Villes",
                list: true,
                ui: { itemProps: (i: { ville?: string }) => ({ label: i?.ville }) },
                fields: [
                  { type: "string", name: "ville", label: "Ville" },
                  { type: "string", name: "label", label: "Libellé (ex. Agence Rhônes-Alpes)" },
                  { type: "string", name: "adresse", label: "Adresse", ui: { component: "textarea" } },
                  { type: "string", name: "email", label: "E-mail de contact" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "engagements",
            label: "Nos engagements",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { ...titreTexte },
              { ...titreAccentTexte },
              { ...couleurTitre },
              { type: "string", name: "ceQuOnFaitTitre", label: "Titre colonne « Ce qu'on fait »" },
              {
                type: "object",
                name: "ceQuOnFait",
                label: "Ce qu'on fait",
                list: true,
                ui: { itemProps: (i: { titre?: string }) => ({ label: i?.titre }) },
                fields: [
                  { type: "string", name: "titre", label: "Titre" },
                  { type: "string", name: "texte", label: "Texte", ui: { component: "textarea" } },
                ],
              },
              { type: "string", name: "ceQuOnNeFaitPasTitre", label: "Titre colonne « Ce qu'on ne fait pas »" },
              {
                type: "object",
                name: "ceQuOnNeFaitPas",
                label: "Ce qu'on ne fait pas",
                list: true,
                ui: { itemProps: (i: { titre?: string }) => ({ label: i?.titre }) },
                fields: [
                  { type: "string", name: "titre", label: "Titre" },
                  { type: "string", name: "texte", label: "Texte", ui: { component: "textarea" } },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "team",
            label: "Notre tribu (équipe)",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { ...titreTexte },
              { ...titreAccentTexte },
              { ...couleurTitre },
              { type: "string", name: "intro", label: "Intro (2 lignes)", ui: { component: "textarea" } },
              { type: "string", name: "merciTitre", label: "Titre du remerciement" },
              { type: "string", name: "merciTexte", label: "Texte du remerciement", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "ctaFinal",
            label: "Bandeau d'appel final",
            fields: [
              { ...titreTexte },
              { ...titreAccentTexte },
              { ...couleurTitre },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              { type: "string", name: "ctaLabel", label: "Bouton — libellé" },
              { type: "string", name: "ctaHref", label: "Bouton — lien" },
            ],
          },
        ],
      },
      // ---------------------------------------------------------------
      // Page "Carrières" (contenu structuré, singleton)
      // ---------------------------------------------------------------
      {
        name: "carrieres",
        label: "Page Carrières",
        path: "content/carrieres",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { ...titreTexte },
              { ...titreAccentTexte },
              { ...couleurTitre },
              { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
              { type: "string", name: "ctaLabel", label: "Bouton — libellé" },
              { type: "string", name: "ctaHref", label: "Bouton — lien" },
              {
                type: "object",
                name: "membres",
                label: "Membres (photos)",
                list: true,
                ui: { itemProps: (i: { nom?: string }) => ({ label: i?.nom || "Membre" }) },
                fields: [
                  { type: "string", name: "nom", label: "Nom" },
                  { type: "string", name: "role", label: "Rôle / fonction" },
                  { type: "image", name: "photo", label: "Photo" },
                  { type: "string", name: "couleur", label: "Couleur de fond", ui: { component: ColorSwatchDropdown }, options: TEAM_TINTS },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "valeurs",
            label: "Nos valeurs",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { type: "string", name: "titre", label: "Titre" },
              {
                type: "object",
                name: "items",
                label: "Valeurs",
                list: true,
                ui: { itemProps: (i: { titre?: string }) => ({ label: i?.titre }) },
                fields: [
                  { type: "string", name: "titre", label: "Titre" },
                  { type: "string", name: "texte", label: "Texte", ui: { component: "textarea" } },
                  { type: "string", name: "icone", label: "Icône (nom du fichier dans /public/icons, sans .svg)" },
                  { type: "string", name: "couleur", label: "Couleur d'accent", ui: { component: ColorSwatchDropdown }, options: COULEURS },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "jobs",
            label: "Jobs à pourvoir",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { ...titreTexte },
              { ...titreAccentTexte },
              { ...couleurTitre },
              { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
              {
                type: "object",
                name: "items",
                label: "Postes",
                list: true,
                ui: { itemProps: (i: { titre?: string }) => ({ label: i?.titre }) },
                fields: [
                  { type: "string", name: "titre", label: "Intitulé du poste" },
                  { type: "string", name: "texte", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "lieu", label: "Lieu" },
                  { type: "string", name: "contrat", label: "Type de contrat (ex. CDI, Stage)" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "perks",
            label: "Ce qui t'attend concrètement",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { ...titreTexte },
              { ...titreAccentTexte },
              { ...couleurTitre },
              {
                type: "object",
                name: "items",
                label: "Avantages",
                list: true,
                ui: { itemProps: (i: { texte?: string }) => ({ label: i?.texte }) },
                fields: [{ type: "string", name: "texte", label: "Texte" }],
              },
            ],
          },
          {
            type: "object",
            name: "words",
            label: "Nos mots-valeurs",
            fields: [
              {
                type: "object",
                name: "items",
                label: "Mots",
                list: true,
                ui: { itemProps: (i: { texte?: string }) => ({ label: i?.texte }) },
                fields: [
                  { type: "string", name: "texte", label: "Mot" },
                  { type: "string", name: "couleur", label: "Couleur", ui: { component: ColorSwatchDropdown }, options: COULEURS },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "gallery",
            label: "La vie chez Sedona (galerie photo)",
            fields: [
              { type: "string", name: "eyebrow", label: "Sur-titre" },
              { ...titreTexte },
              { ...titreAccentTexte },
              { ...couleurTitre },
              { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
              { type: "image", name: "photos", label: "Photos", list: true },
            ],
          },
          {
            type: "object",
            name: "ctaFinal",
            label: "Bandeau d'appel final",
            fields: [
              { ...titreTexte },
              { ...titreAccentTexte },
              { ...couleurTitre },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              { type: "string", name: "ctaLabel", label: "Bouton — libellé" },
              { type: "string", name: "ctaHref", label: "Bouton — lien" },
            ],
          },
        ],
      },
    ],
  },
});
