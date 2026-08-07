import { readFileSync, statSync, unlinkSync, rmdirSync, readdirSync } from "node:fs";
import { join, relative, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { RASTER, RASTER_ALTERNATION, walk, humanBytes } from "./uploads.mjs";

// Les images de public/uploads/ doivent rester à leur place pour TinaCMS (le media
// manager les y écrit et les y relit), mais elles n'ont aucune raison d'être publiées
// telles quelles : Media.astro en sert des versions optimisées depuis _astro/.
//
// Deux sources de doublons dans le build :
//   - public/uploads/ est copié intégralement par Astro, migré ou non ;
//   - Rollup émet dans _astro/ tout fichier atteint par le glob de Media.astro,
//     y compris les originaux dont seules les variantes sont réellement servies.
//
// Cette intégration supprime, après build, les images matricielles qu'aucun fichier
// produit ne référence. On ne touche ni aux SVG, ni aux PDF, ni aux vidéos, et on
// s'interdit tout dossier autre que uploads/ et _astro/.

const SCANNED = new Set([".html", ".css", ".js", ".mjs", ".json", ".xml", ".txt"]);
const PRUNABLE = ["uploads", "_astro"];

// Ancré sur le `/` initial : sans cela, la classe gourmande parcourt puis retrace
// chaque suite de caractères du CSS et du JS minifiés — 55 fois plus lent pour un
// ensemble de références identique.
const IMAGE_REF = new RegExp(`/[^"'()\\s,]*?\\.(?:${RASTER_ALTERNATION})`, "gi");

/** Supprime récursivement les dossiers devenus vides sous `root`. */
function removeEmptyDirs(root, dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) removeEmptyDirs(root, join(dir, entry.name));
  }
  if (dir !== root && readdirSync(dir).length === 0) rmdirSync(dir);
}

export default function pruneUnusedImages() {
  return {
    name: "prune-unused-images",
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const files = walk(outDir);

        // Toute chaîne ressemblant à un chemin d'image, quel que soit l'attribut qui
        // la porte (src, srcset, href, url(), ou une URL construite en JS).
        const referenced = new Set();
        for (const file of files) {
          if (!SCANNED.has(extname(file).toLowerCase())) continue;
          for (const m of readFileSync(file, "utf-8").matchAll(IMAGE_REF)) {
            referenced.add(decodeURIComponent(m[0]).replace(/^\//, ""));
          }
        }

        let removed = 0;
        let freed = 0;
        for (const file of files) {
          if (!RASTER.has(extname(file).toLowerCase())) continue;
          const rel = relative(outDir, file);
          if (!PRUNABLE.includes(rel.split(sep)[0])) continue;
          if (referenced.has(rel.split(sep).join("/"))) continue;
          freed += statSync(file).size;
          unlinkSync(file);
          removed++;
        }

        if (removed > 0) {
          removeEmptyDirs(outDir, outDir);
          logger.info(`${removed} images non référencées retirées du build (${humanBytes(freed)})`);
        }
      },
    },
  };
}
