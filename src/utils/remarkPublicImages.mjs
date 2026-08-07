import { visit } from "unist-util-visit";
import { relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

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

export default function remarkPublicImages() {
  return (tree, file) => {
    const mdDir = dirname(file.path ?? file.history?.[0] ?? "");
    if (!mdDir) return;

    visit(tree, "image", (node) => {
      if (!node.url?.startsWith("/uploads/")) return;
      let rel = relative(mdDir, PUBLIC_DIR + node.url);
      // `relative` peut produire un chemin sans préfixe explicite ; Astro attend une
      // référence relative reconnaissable pour la traiter comme un asset local.
      if (!rel.startsWith(".")) rel = "./" + rel;
      node.url = rel;
    });
  };
}
