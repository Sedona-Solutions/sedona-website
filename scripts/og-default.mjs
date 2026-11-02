// Génère les images SEO par défaut à partir du logotype (src/components/Logo.astro) :
//  - public/og-default.png  (1200×630) : image de partage quand une page n'en a pas ;
//  - public/logo-sedona.png (512×512)  : logo de l'Organization (JSON-LD, Google).
// Usage : node scripts/og-default.mjs   (à relancer si le logo ou la charte change)
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "..");
const logo = readFileSync(resolve(ROOT, "src/components/Logo.astro"), "utf8");
const paths = [...logo.matchAll(/<path d="([^"]+)"/g)].map((m) => `<path d="${m[1]}"/>`).join("");
if (!paths) throw new Error("Aucun tracé trouvé dans Logo.astro");

const FOND = "#3b0800"; // brun Sedona (texte/fonds sombres du site)
const CREME = "#fcf6f0";
const ACCENT = "#f8b3a9"; // red-rock

// Logo : viewBox 0 0 177 24.
const logoSvg = (x, y, largeur, couleur) => {
  const k = largeur / 177;
  return `<g transform="translate(${x} ${y}) scale(${k})" fill="${couleur}">${paths}</g>`;
};

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${FOND}"/>
  <rect x="0" y="606" width="1200" height="24" fill="${ACCENT}"/>
  ${logoSvg(250, 230, 700, CREME)}
  <text x="600" y="440" text-anchor="middle" fill="${CREME}" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="34" letter-spacing="1">
    ESN technologique · Paris · Lyon · Toulon
  </text>
</svg>`;

const carre = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${FOND}"/>
  ${logoSvg(56, 230, 400, CREME)}
</svg>`;

await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(resolve(ROOT, "public/og-default.png"));
await sharp(Buffer.from(carre)).png({ compressionLevel: 9 }).toFile(resolve(ROOT, "public/logo-sedona.png"));
console.log("✓ public/og-default.png et public/logo-sedona.png générés");
