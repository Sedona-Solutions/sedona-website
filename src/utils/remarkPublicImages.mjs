import { visit } from "unist-util-visit";
import { relative, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import sharp from "sharp";
import { UPLOADS_PREFIX } from "./uploads.mjs";

// Tina écrit les images du corps d'un article en chemin absolu (`/uploads/...`), que
// le pipeline d'Astro laisse passer tel quel : servi brut, sans conversion ni
// dimensions. Or Astro optimise nativement les images Markdown référencées en chemin
// *relatif* au fichier.
//
// Ce plugin fait donc la traduction avant qu'Astro ne traite le nœud image. Aucune
// modification du contenu : la réécriture est faite en mémoire, à la compilation.
// Les fichiers restent dans public/uploads/ et les articles gardent leurs chemins
// `/uploads/...`, seuls compréhensibles par le media manager.
//
// Astro se charge ensuite du reste : WebP, srcset, width/height, lazy loading.

const PUBLIC_DIR = fileURLToPath(new URL("../../public", import.meta.url));

// Largeur de rendu de la colonne de texte d'un article. Sans elle, Astro retombe sur
// la largeur intrinsèque du fichier : une photo déposée en pleine résolution est alors
// servie telle quelle (5000px et 2,3 Mo pour la plus lourde du site). C'est le pendant
// du `width` que Media.astro passe pour les images de composants.
const LARGEUR_CORPS_ARTICLE = 1088;

// Une image plus petite que la colonne ne doit surtout pas être agrandie : la moitié
// des visuels d'articles vient de vignettes WordPress de 200 à 600 px, qu'un width
// fixe étirerait et rendrait floues.
const cache = new Map();
async function largeurSource(publicPath) {
  if (!cache.has(publicPath)) {
    const fichier = join(PUBLIC_DIR, publicPath);
    let largeur = null;
    if (existsSync(fichier)) {
      try {
        largeur = (await sharp(fichier).metadata()).width ?? null;
      } catch {
        largeur = null; // format illisible : on laisse Astro décider seul
      }
    }
    cache.set(publicPath, largeur);
  }
  return cache.get(publicPath);
}

export default function remarkPublicImages() {
  return async (tree, file) => {
    // Sans chemin de fichier, impossible de calculer une référence relative : la
    // réécriture produirait un chemin résolu depuis le répertoire courant, donc faux.
    const mdPath = file.path ?? file.history?.[0];
    if (!mdPath) return;
    const mdDir = dirname(mdPath);

    const cibles = [];
    visit(tree, "image", (node) => {
      if (node.url?.startsWith(UPLOADS_PREFIX)) cibles.push(node);
    });

    for (const node of cibles) {
      const source = await largeurSource(node.url);
      let rel = relative(mdDir, PUBLIC_DIR + node.url);
      // `relative` peut produire un chemin sans préfixe explicite ; Astro attend une
      // référence relative reconnaissable pour la traiter comme un asset local.
      if (!rel.startsWith(".")) rel = "./" + rel;
      node.url = rel;

      // rehype-images d'Astro reprend ces propriétés et les passe à getImage().
      node.data ??= {};
      const largeur = source ? Math.min(LARGEUR_CORPS_ARTICLE, source) : LARGEUR_CORPS_ARTICLE;
      node.data.hProperties = { width: largeur, ...node.data.hProperties };
    }
  };
}
