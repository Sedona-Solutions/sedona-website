// Rendu minimal (sans dépendance) de l'arbre "rich-text" de Tina (champs de type
// `rich-text`, distincts du corps Markdown `isBody`). Accepte aussi une simple
// chaîne (contenu legacy ou champs non encore migrés) pour rester rétro-compatible.
const escapeHtml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function renderLeaf(node) {
  let html = escapeHtml(node.text ?? "");
  if (node.code) html = `<code>${html}</code>`;
  if (node.strikethrough) html = `<s>${html}</s>`;
  if (node.underline) html = `<u>${html}</u>`;
  if (node.italic) html = `<em>${html}</em>`;
  if (node.bold) html = `<strong>${html}</strong>`;
  return html;
}

function renderNodes(nodes) {
  if (!nodes) return "";
  return nodes.map(renderNode).join("");
}

function renderNode(node) {
  if (!node) return "";
  switch (node.type) {
    case "text":
      return renderLeaf(node);
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
    case "p":
    case "ul":
    case "ol":
    case "li":
    case "blockquote":
      return `<${node.type}>${renderNodes(node.children)}</${node.type}>`;
    case "lic":
      return renderNodes(node.children);
    case "a":
      return `<a href="${escapeHtml(node.url ?? "")}">${renderNodes(node.children)}</a>`;
    case "break":
      return "<br />";
    default:
      // Type inconnu : on retombe sur les enfants (ou le texte) pour ne rien perdre.
      if (node.children) return renderNodes(node.children);
      if (typeof node.text === "string") return renderLeaf(node);
      return "";
  }
}

// Formatage inline (gras/italique/code/barré/lien) d'une ligne de markdown déjà
// échappée en HTML — utilisé pour les champs "rich-text" stockés en chaîne brute
// (cf. plus bas) : Tina les enregistre en markdown texte, pas en arbre JSON.
function renderInlineMarkdown(text) {
  let html = escapeHtml(text);
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, url) => `<a href="${escapeHtml(url)}">${t}</a>`);
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
  html = html.replace(/_([^_]+)_/g, "<em>$1</em>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/~~([^~]+)~~/g, "<s>$1</s>");
  return html;
}

/** Rend une chaîne markdown (paragraphes séparés par une ligne vide, listes à
 *  puces/numérotées, titres #, formatage inline) en HTML. */
function markdownStringToHtml(str) {
  const blocks = str.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return blocks
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (!lines.length) return "";
      if (lines.every((l) => /^[-*]\s+/.test(l))) {
        return `<ul>${lines.map((l) => `<li>${renderInlineMarkdown(l.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
      }
      if (lines.every((l) => /^\d+\.\s+/.test(l))) {
        return `<ol>${lines.map((l) => `<li>${renderInlineMarkdown(l.replace(/^\d+\.\s+/, ""))}</li>`).join("")}</ol>`;
      }
      const heading = block.match(/^(#{1,6})\s+(.*)$/);
      if (heading) {
        const level = heading[1].length;
        return `<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`;
      }
      return `<p>${renderInlineMarkdown(lines.join(" "))}</p>`;
    })
    .join("");
}

/** Rend un champ "rich-text" Tina (objet AST, ou chaîne markdown pour les
 *  champs enregistrés en texte brut — cf. markdownStringToHtml) en HTML. */
export function richTextToHtml(value) {
  if (!value) return "";
  if (typeof value === "string") return markdownStringToHtml(value);
  const nodes = Array.isArray(value) ? value : value.children;
  return renderNodes(nodes);
}
