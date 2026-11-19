import { visit } from "unist-util-visit";

// Enveloppe chaque tableau Markdown dans <div class="table-scroll"> : sur mobile,
// un tableau plus large que l'écran défile horizontalement dans son cadre au lieu
// de déborder de la colonne de texte (et du fond de l'article).
export default function rehypeTableScroll() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "table" || !parent || index === undefined) return;
      if (parent.type === "element" && parent.properties?.className?.includes?.("table-scroll")) return;
      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["table-scroll"] },
        children: [node],
      };
    });
  };
}
