import { visit } from "unist-util-visit";

// Solution de repli pour le highlight : le bouton "Highlight" natif de l'éditeur
// TinaCMS (3.9.1 et 3.11.0 testés) fait disparaître le texte surligné à la sauvegarde
// (bug confirmé dans l'éditeur Slate/Plate de Tina, pas dans notre pipeline) — le bouton
// natif est masqué (patch tinacms) et remplacé par un bouton "Surlignage (fiable)" qui
// écrit cette même syntaxe directement en texte au lieu d'utiliser le marquage cassé :
//   ==mot==      -> Sunshine (par défaut)
//   ==mot==r     -> Red rock
//   ==mot==c     -> Cactus
//   ==mot==k     -> Sky
//   ==mot==n     -> Canyon
//   ==mot==o     -> Ovni
// Cette syntaxe ne passe jamais par le marquage cassé : elle est juste du texte tapé
// au clavier (ou inséré par le bouton), donc jamais perdue à la sauvegarde.
const PATTERN = /==([^=\n]+?)==([rckno])?/gi;

const COLOR_NAMES = {
  r: "redrock",
  c: "cactus",
  k: "sky",
  n: "canyon",
  o: "ovni",
};

export default function remarkManualHighlight() {
  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      if (!parent || typeof index !== "number" || !PATTERN.test(node.value)) return;
      PATTERN.lastIndex = 0;

      const parts = [];
      let lastIndex = 0;
      let match;
      while ((match = PATTERN.exec(node.value))) {
        if (match.index > lastIndex) {
          parts.push({ type: "text", value: node.value.slice(lastIndex, match.index) });
        }
        const name = COLOR_NAMES[(match[2] || "").toLowerCase()] ?? "sunshine";
        parts.push({ type: "html", value: `<mark class="tina-hl tina-hl--${name}">` });
        parts.push({ type: "text", value: match[1] });
        parts.push({ type: "html", value: "</mark>" });
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < node.value.length) {
        parts.push({ type: "text", value: node.value.slice(lastIndex) });
      }

      parent.children.splice(index, 1, ...parts);
      return index + parts.length;
    });
  };
}
