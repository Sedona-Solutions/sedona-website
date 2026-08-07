import { readFileSync, statSync, unlinkSync, rmdirSync, readdirSync } from "node:fs";
import { join, relative, extname, sep, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { RASTER, walk, humanBytes } from "./uploads.mjs";

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

// On cherche le nom de fichier littéralement dans le texte produit, plutôt que d'y
// reconnaître une forme d'URL : les noms venant du CMS contiennent apostrophes,
// virgules ou parenthèses, qu'aucune classe de caractères ne délimite proprement.
// Un nom mal reconnu passerait pour non référencé et l'image serait supprimée du
// build — un 404 en production. À noms identiques dans deux dossiers, on conserve
// les deux : mieux vaut publier une image de trop qu'en perdre une.
const isReferenced = (haystack, file) => {
  const name = basename(file);
  return haystack.includes(name) || haystack.includes(encodeURIComponent(name));
};

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

        // Tout le texte produit par le build, quel que soit l'attribut qui porte la
        // référence : src, srcset, href, url() en CSS, ou une URL construite en JS.
        const haystack = files
          .filter((f) => SCANNED.has(extname(f).toLowerCase()))
          .map((f) => readFileSync(f, "utf-8"))
          .join("\n");

        let removed = 0;
        let freed = 0;
        for (const file of files) {
          if (!RASTER.has(extname(file).toLowerCase())) continue;
          const rel = relative(outDir, file);
          if (!PRUNABLE.includes(rel.split(sep)[0])) continue;
          if (isReferenced(haystack, file)) continue;
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
