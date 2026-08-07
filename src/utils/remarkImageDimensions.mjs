import { visit } from "unist-util-visit";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Les images insérées dans le corps d'un article par Tina sont du Markdown standard
// (`![alt](/uploads/...)`) : aucun composant ne s'interpose, donc elles échappent à
// Media.astro et au pipeline astro:assets.
//
// À défaut de pouvoir les convertir — `getImage()` n'est pas atteignable depuis un
// plugin, et passer les articles en MDX toucherait au flux d'édition — on leur ajoute
// au moins les dimensions réelles, qui suppriment les sauts de mise en page, et le
// chargement différé. Le format d'origine est conservé.

const PUBLIC_DIR = new URL("../../public/", import.meta.url);
const cache = new Map();

async function dimensions(publicPath) {
  if (cache.has(publicPath)) return cache.get(publicPath);
  const file = fileURLToPath(new URL(`.${publicPath}`, PUBLIC_DIR));
  let dims = null;
  if (existsSync(file)) {
    try {
      const { width, height } = await sharp(file).metadata();
      if (width && height) dims = { width, height };
    } catch {
      // Fichier illisible ou format non reconnu : on laisse l'image sans dimensions
      // plutôt que d'interrompre le build pour un article.
      dims = null;
    }
  }
  cache.set(publicPath, dims);
  return dims;
}

export default function remarkImageDimensions() {
  return async (tree) => {
    const targets = [];
    visit(tree, "image", (node) => {
      if (node.url?.startsWith("/uploads/")) targets.push(node);
    });

    await Promise.all(
      targets.map(async (node) => {
        const dims = await dimensions(node.url);
        node.data ??= {};
        node.data.hProperties = {
          ...node.data.hProperties,
          ...(dims ?? {}),
          loading: "lazy",
          decoding: "async",
        };
      }),
    );
  };
}
