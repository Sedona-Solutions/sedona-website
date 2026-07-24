import { visit } from "unist-util-visit";

// Transforme un paragraphe ne contenant qu'un lien YouTube/Vimeo (collé en texte
// brut ou via le bouton Lien de Tina) en lecteur vidéo intégré responsive.

const YOUTUBE_RE = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/i;
const VIMEO_RE = /vimeo\.com\/(?:video\/)?(\d+)/i;

function extractUrl(paragraph) {
  if (paragraph.children.length !== 1) return null;
  const child = paragraph.children[0];
  if (child.type === "link" && child.children?.length === 1 && child.children[0].type === "text") {
    return child.url;
  }
  if (child.type === "text") {
    const trimmed = child.value.trim();
    if (/^https?:\/\/\S+$/.test(trimmed)) return trimmed;
  }
  return null;
}

export default function remarkVideoEmbed() {
  return (tree) => {
    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index === null) return;
      const url = extractUrl(node);
      if (!url) return;

      const ytMatch = url.match(YOUTUBE_RE);
      const vimeoMatch = url.match(VIMEO_RE);

      let embedSrc = null;
      if (ytMatch) {
        embedSrc = `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
      } else if (vimeoMatch) {
        embedSrc = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      }
      if (!embedSrc) return;

      parent.children[index] = {
        type: "html",
        value: `<div class="video-embed"><iframe src="${embedSrc}" title="Vidéo" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`,
      };
    });
  };
}
