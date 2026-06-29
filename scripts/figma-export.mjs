// @ts-check
/**
 * Outil d'export Figma → projet Astro.
 *
 * Utilisation (le token et la file key sont lus dans .env) :
 *   node --env-file=.env scripts/figma-export.mjs list
 *   node --env-file=.env scripts/figma-export.mjs tokens
 *   node --env-file=.env scripts/figma-export.mjs assets [node-id...] [--format=svg|png] [--scale=2]
 *
 * - list   : cartographie les pages et frames de haut niveau (avec leurs node-id).
 * - tokens : extrait les styles publiés (couleurs, typographies) vers src/styles/tokens.generated.css.
 * - assets : exporte les nœuds donnés (ou toutes les frames de haut niveau) dans public/figma/.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const API = "https://api.figma.com/v1";
const TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY;
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

if (!TOKEN || !FILE_KEY) {
  console.error(
    "\n✖ FIGMA_TOKEN et/ou FIGMA_FILE_KEY manquants.\n" +
      "  Copiez .env.example en .env et renseignez vos valeurs, puis relancez avec :\n" +
      "  node --env-file=.env scripts/figma-export.mjs <commande>\n",
  );
  process.exit(1);
}

/** Appel générique à l'API Figma. */
async function figma(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { "X-Figma-Token": TOKEN },
  });
  if (!res.ok) {
    throw new Error(`Figma API ${res.status} ${res.statusText} sur ${path}\n${await res.text()}`);
  }
  return res.json();
}

/** Convertit une couleur Figma {r,g,b,a} (0–1) en hex. */
function toHex({ r, g, b, a = 1 }) {
  const h = (n) => Math.round(n * 255).toString(16).padStart(2, "0");
  const base = `#${h(r)}${h(g)}${h(b)}`;
  return a < 1 ? `${base}${h(a)}` : base;
}

/** kebab-case pour les noms de variables CSS. */
function kebab(name) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

// ---------------------------------------------------------------------------

async function cmdList() {
  const { document, name } = await figma(`/files/${FILE_KEY}?depth=2`);
  console.log(`\n📄 Fichier : ${name}\n`);
  for (const page of document.children ?? []) {
    console.log(`▸ Page « ${page.name} »  (${page.id})`);
    for (const frame of page.children ?? []) {
      const size = frame.absoluteBoundingBox
        ? `  ${Math.round(frame.absoluteBoundingBox.width)}×${Math.round(frame.absoluteBoundingBox.height)}`
        : "";
      console.log(`    • ${frame.name}  (${frame.id})${size}`);
    }
  }
  console.log("\nℹ️  Utilisez ces node-id avec : … assets <node-id>\n");
}

// Node-id des frames du design system (page « _Style »).
// Surchargeable via la variable d'env FIGMA_COLORS_NODE / FIGMA_TYPO_NODE.
const COLORS_NODE = process.env.FIGMA_COLORS_NODE ?? "3072:31108";
const TYPO_NODE = process.env.FIGMA_TYPO_NODE ?? "3072:31005";

async function cmdTokens() {
  const colors = [];
  const typography = [];
  const seenColor = new Set();

  // --- Couleurs : on parcourt récursivement la frame "Colors" du design system. ---
  const colorRes = await figma(`/files/${FILE_KEY}/nodes?ids=${COLORS_NODE}&depth=8`);
  const colorRoot = colorRes.nodes[COLORS_NODE]?.document;

  const walkColors = (node, path) => {
    const name = node.name ?? "";
    const helper = name.startsWith(".") || /^(divider|header|colors)$/i.test(name);
    const nextPath = helper || !name ? path : [...path, name];
    const fill = node.fills?.find?.((f) => f.type === "SOLID" && f.visible !== false);
    // On ne retient que les nœuds « feuille » colorés (rect/frame swatch sans enfants colorés).
    const isLeaf = !node.children || node.children.length === 0;
    if (fill && isLeaf && nextPath.length) {
      const value = toHex({ ...fill.color, a: fill.opacity ?? 1 });
      const tokenName = kebab(nextPath.join("-"));
      const key = tokenName;
      if (tokenName && !seenColor.has(key)) {
        seenColor.add(key);
        colors.push({ name: tokenName, value });
      }
    }
    for (const child of node.children ?? []) walkColors(child, nextPath);
  };
  if (colorRoot) walkColors(colorRoot, []);

  // --- Typographie : nœuds TEXT de la frame "Typography". ---
  const typoRes = await figma(`/files/${FILE_KEY}/nodes?ids=${TYPO_NODE}&depth=8`);
  const typoRoot = typoRes.nodes[TYPO_NODE]?.document;
  const seenTypo = new Set();

  const walkTypo = (node) => {
    if (node.type === "TEXT" && node.style) {
      const s = node.style;
      const name = kebab(node.name || `${s.fontFamily}-${s.fontSize}`);
      if (name && !seenTypo.has(name)) {
        seenTypo.add(name);
        typography.push({ name, font: s.fontFamily, weight: s.fontWeight, size: s.fontSize, lineHeight: s.lineHeightPx });
      }
    }
    for (const child of node.children ?? []) walkTypo(child);
  };
  if (typoRoot) walkTypo(typoRoot);

  const lines = [
    "/* Généré automatiquement depuis Figma — ne pas éditer à la main.",
    "   Régénérer : node --env-file=.env scripts/figma-export.mjs tokens */",
    "",
    ":root {",
    ...colors.map((c) => `  --color-${c.name}: ${c.value};`),
    "",
    ...typography.flatMap((t) => [
      `  --font-${t.name}-family: "${t.font}";`,
      `  --font-${t.name}-weight: ${t.weight};`,
      `  --font-${t.name}-size: ${t.size}px;`,
      t.lineHeight ? `  --font-${t.name}-line-height: ${Math.round(t.lineHeight)}px;` : "",
    ].filter(Boolean)),
    "}",
    "",
  ];

  const out = resolve(ROOT, "src/styles/tokens.generated.css");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, lines.join("\n"), "utf8");
  console.log(`✔ ${colors.length} couleurs et ${typography.length} styles typographiques → src/styles/tokens.generated.css`);
}

async function cmdAssets(args) {
  const format = (args.find((a) => a.startsWith("--format="))?.split("=")[1] ?? "svg").toLowerCase();
  const scale = Number(args.find((a) => a.startsWith("--scale="))?.split("=")[1] ?? 2);
  let ids = args.filter((a) => !a.startsWith("--"));

  // Aucun id fourni → on prend toutes les frames de haut niveau.
  if (ids.length === 0) {
    const { document } = await figma(`/files/${FILE_KEY}?depth=2`);
    ids = (document.children ?? []).flatMap((p) => (p.children ?? []).map((f) => f.id));
    if (ids.length === 0) {
      console.error("Aucune frame trouvée à exporter.");
      return;
    }
  }

  const params = new URLSearchParams({ ids: ids.join(","), format });
  if (format === "png") params.set("scale", String(scale));
  const { images, err } = await figma(`/images/${FILE_KEY}?${params}`);
  if (err) throw new Error(`Erreur d'export Figma : ${err}`);

  const dir = resolve(ROOT, "public/figma");
  await mkdir(dir, { recursive: true });
  let n = 0;
  for (const [id, url] of Object.entries(images)) {
    if (!url) continue;
    const bin = Buffer.from(await (await fetch(url)).arrayBuffer());
    const file = resolve(dir, `${id.replace(/[:]/g, "-")}.${format}`);
    await writeFile(file, bin);
    n++;
    console.log(`  ↓ ${file}`);
  }
  console.log(`✔ ${n} asset(s) exporté(s) dans public/figma/`);
}

// ---------------------------------------------------------------------------

const [, , command, ...rest] = process.argv;
try {
  switch (command) {
    case "list":
      await cmdList();
      break;
    case "tokens":
      await cmdTokens();
      break;
    case "assets":
      await cmdAssets(rest);
      break;
    default:
      console.log("Commandes : list | tokens | assets [node-id...] [--format=svg|png] [--scale=2]");
  }
} catch (err) {
  console.error("\n✖", err.message ?? err);
  process.exit(1);
}
