import { readFileSync, statSync, unlinkSync, rmdirSync, readdirSync } from "node:fs";
import { join, relative, extname, sep, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { RASTER, walk, humanBytes } from "./uploads.mjs";

// Le glob de Media.astro fait entrer chaque image de public/uploads/ dans le graphe
// de build : Rollup en émet donc l'original dans _astro/, y compris pour les fichiers
// dont seules les variantes optimisées sont réellement servies, et pour ceux
// qu'aucune page n'affiche. Ces copies n'ont pas d'URL publique — elles portent un
// nom haché — et personne ne peut y faire référence.
//
// Cette intégration les retire après build. Astro en supprime déjà une partie de
// lui-même, mais seulement pour les images qu'il a transformées.

const SCANNED = new Set([".html", ".css", ".js", ".mjs", ".json", ".xml", ".txt"]);

// Uniquement _astro : ce que Rollup y émet en double est un artefact de build, sans
// URL publique promise à personne. `dist/uploads/` est en revanche la copie fidèle de
// public/, et doit le rester — c'est le contrat du dossier, dont dépendent les
// previews du media manager Tina en production (l'admin est déployé avec le site et
// les demande à /uploads/...), ainsi que tout lien direct vers une image.
const PRUNABLE = ["_astro"];

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
