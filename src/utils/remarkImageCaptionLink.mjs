import { visit } from "unist-util-visit";

// Le champ "Caption" de l'éditeur d'image de Tina sérialise en Markdown standard
// comme le "title" optionnel de l'image : ![alt](src "caption"). On détourne ce
// champ pour en faire un lien cliquable (ex. une vignette qui renvoie vers une
// vidéo YouTube) quand la légende ressemble à une URL — sinon elle reste une
// simple légende (title natif du <img>, comportement Markdown standard).
const URL_LIKE = /^(https?:\/\/|\/)/i;

export default function remarkImageCaptionLink() {
  return (tree) => {
    visit(tree, "image", (node, index, parent) => {
      if (!parent || typeof index !== "number") return;
      if (!node.title || !URL_LIKE.test(node.title)) return;

      const link = {
        type: "link",
        url: node.title,
        title: null,
        children: [{ ...node, title: null }],
        data: { hProperties: { target: "_blank", rel: "noopener" } },
      };
      parent.children.splice(index, 1, link);
    });
  };
}
