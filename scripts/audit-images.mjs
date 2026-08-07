#!/usr/bin/env node
// Mesure l'état des images dans le build : poids, dimensions déclarées, lazy loading,
// et références restantes vers les originaux non optimisés de public/uploads/.
//
// Sert de référence avant/après pour le chantier d'optimisation, et de garde-fou une
// fois la migration terminée : `--strict` fait échouer la commande s'il reste des
// images matricielles servies depuis /uploads/ (donc hors pipeline astro:assets).
//
// Usage : node scripts/audit-images.mjs [--strict] [--json]

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST = join(ROOT, "dist");

const RASTER = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"]);
const MEDIA = new Set([...RASTER, ".svg", ".ico", ".pdf", ".mp4", ".webm"]);

const strict = process.argv.includes("--strict");
const asJson = process.argv.includes("--json");

/** Liste récursivement les fichiers d'un dossier. */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const human = (bytes) => {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / 1024 ** 2).toFixed(1)} Mo`;
};

if (!existsSync(DIST)) {
  console.error("dist/ absent — lancer `npm run build` d'abord.");
  process.exit(1);
}

const files = walk(DIST);

// --- Poids ---------------------------------------------------------------
let totalBytes = 0;
let imageBytes = 0;
let optimizedBytes = 0; // images émises par astro:assets (dans /_astro/)
for (const f of files) {
  const size = statSync(f).size;
  totalBytes += size;
  if (RASTER.has(extname(f).toLowerCase())) {
    imageBytes += size;
    if (relative(DIST, f).startsWith("_astro")) optimizedBytes += size;
  }
}

// --- Analyse du HTML -----------------------------------------------------
const htmlFiles = files.filter((f) => f.endsWith(".html"));
let imgTotal = 0;
let imgWithDims = 0;
let imgWithLoading = 0;
let imgWithoutAlt = 0;
const rawUploads = new Map(); // src -> pages qui le référencent
const missing = new Set();

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf-8");
  const page = "/" + relative(DIST, file).replace(/index\.html$/, "");

  for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
    imgTotal++;
    if (/\bwidth=/.test(tag) && /\bheight=/.test(tag)) imgWithDims++;
    if (/\bloading=/.test(tag)) imgWithLoading++;
    if (!/\balt=/.test(tag)) imgWithoutAlt++;

    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    // Image matricielle encore servie depuis public/ : hors pipeline d'optimisation.
    if (src?.startsWith("/uploads/") && RASTER.has(extname(src).toLowerCase())) {
      if (!rawUploads.has(src)) rawUploads.set(src, new Set());
      rawUploads.get(src).add(page);
    }
  }

  // Tout média référencé doit exister dans le build (attrape les chemins CMS erronés).
  for (const m of html.matchAll(/(?:src|href)="(\/[^":?#]+)"/g)) {
    const url = m[1];
    if (MEDIA.has(extname(url).toLowerCase()) && !existsSync(join(DIST, url))) missing.add(url);
  }
}

const report = {
  poids: { total: totalBytes, images: imageBytes, optimisees: optimizedBytes },
  img: { total: imgTotal, avecDimensions: imgWithDims, avecLoading: imgWithLoading, sansAlt: imgWithoutAlt },
  uploadsNonOptimisees: rawUploads.size,
  assetsManquants: [...missing],
};

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const pct = (n, d) => (d === 0 ? "—" : `${((n / d) * 100).toFixed(0)} %`);
  console.log(`\n  Poids du build      ${human(totalBytes)}`);
  console.log(`  dont images         ${human(imageBytes)} (${pct(imageBytes, totalBytes)})`);
  console.log(`  dont optimisées     ${human(optimizedBytes)} (${pct(optimizedBytes, imageBytes)} des images)`);
  console.log(`\n  Balises <img>       ${imgTotal}`);
  console.log(`  avec width+height   ${imgWithDims} (${pct(imgWithDims, imgTotal)})`);
  console.log(`  avec loading        ${imgWithLoading} (${pct(imgWithLoading, imgTotal)})`);
  console.log(`  sans alt            ${imgWithoutAlt}`);
  console.log(`\n  Images /uploads/ non optimisées : ${rawUploads.size}`);
  if (rawUploads.size > 0 && strict) {
    for (const [src, pages] of [...rawUploads].slice(0, 20)) {
      console.log(`    ${src}  →  ${[...pages].slice(0, 3).join(", ")}${pages.size > 3 ? ` (+${pages.size - 3})` : ""}`);
    }
    if (rawUploads.size > 20) console.log(`    … et ${rawUploads.size - 20} autres`);
  }
  if (missing.size > 0) {
    console.log(`\n  ⚠ Assets référencés mais absents du build : ${missing.size}`);
    for (const u of [...missing].slice(0, 10)) console.log(`    ${u}`);
  }
  console.log();
}

// Un asset manquant est toujours une erreur : le lien est cassé en production.
if (missing.size > 0) process.exit(1);
// Les originaux non optimisés ne bloquent qu'une fois la migration censée terminée.
if (strict && rawUploads.size > 0) process.exit(1);
