# Site Sedona (Astro)

Site vitrine de Sedona — ESN technologique (Paris, Lyon, Toulon).
Stack : **Astro** (sortie statique) + **TinaCMS** (administration de contenu) + import des maquettes **Figma** via l'API.

## Démarrage

```bash
npm install
npm run dev      # serveur de développement → http://localhost:4321
npm run build    # build statique dans dist/
npm run preview  # prévisualise le build
```

## Récupération des maquettes Figma

1. Copier `.env.example` en `.env` et renseigner :
   - `FIGMA_TOKEN` — token d'accès personnel ([le créer ici](https://www.figma.com/developers/api#access-tokens), scope « File content » en lecture).
   - `FIGMA_FILE_KEY` — clé visible dans l'URL du fichier : `figma.com/design/<FILE_KEY>/...`.
2. Lancer les commandes d'export :

```bash
# Cartographier les pages et écrans (récupère les node-id)
node --env-file=.env scripts/figma-export.mjs list

# Extraire les design tokens (couleurs, typo) → src/styles/tokens.generated.css
node --env-file=.env scripts/figma-export.mjs tokens

# Exporter des assets (toutes les frames, ou des node-id précis)
node --env-file=.env scripts/figma-export.mjs assets
node --env-file=.env scripts/figma-export.mjs assets 123:456 --format=png --scale=2
```

> Les exports atterrissent dans `public/figma/`. Les tokens générés sont à reporter
> dans `src/styles/tokens.css` (valeurs de référence du thème).

## Structure

```
scripts/figma-export.mjs   Outil d'import Figma (list | tokens | assets)
src/layouts/               Gabarits de page (BaseLayout)
src/components/            Composants réutilisables (Header, Footer, …)
src/pages/                 Routes du site (une page = un fichier .astro)
src/styles/                Thème : tokens.css (variables) + global.css
public/                    Fichiers statiques (favicon, assets Figma)
```

## Contenu (TinaCMS)

Le contenu est stocké en fichiers dans `content/` (versionnés dans Git). Astro
les lit pour le rendu statique ; TinaCMS fournit l'interface d'édition.

```bash
npm run dev:cms   # Astro + admin Tina → http://localhost:4321/admin/index.html
```

Collections définies dans `tina/config.ts` :

| Collection | Dossier | Format | Contenu |
|---|---|---|---|
| Réglages du site | `content/global/` | json | navigation, agences, contact, réseaux |
| Page d'accueil | `content/home/` | json | hero, ticker, chiffres, sections |
| Expertises | `content/expertises/` | md | les 3 domaines |
| Projets | `content/projets/` | md | études de cas / références |
| Articles | `content/articles/` | md | blog / actualités |

> **Édition en local** : `npm run dev:cms`, aucune configuration requise.
> **Admin en ligne** : créer un projet sur [app.tina.io](https://app.tina.io),
> renseigner `PUBLIC_TINA_CLIENT_ID` / `TINA_TOKEN` dans `.env`, puis `npm run build:cms`.
