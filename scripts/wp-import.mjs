// @ts-check
/**
 * Import des articles WordPress (millésime configurable) → content/articles/*.md
 *
 * Récupère les articles via l'API REST WordPress (/wp-json/wp/v2/posts),
 * les convertit en Markdown, télécharge les images (couverture + avatars)
 * dans public/uploads/articles/wp/, et écrit un fichier .md par article au
 * format attendu par Astro / TinaCMS (collection « article »).
 *
 * Pré-requis :  npm i -D turndown
 *
 * Utilisation :
 *   node scripts/wp-import.mjs --url=https://ancien-site.fr --annee=2026
 *   node scripts/wp-import.mjs --url=https://ancien-site.fr --annee=2026 --dry   (aperçu sans écrire)
 */

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n, d) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split("=")[1] ?? d;
const has = (n) => process.argv.includes(`--${n}`);

const BASE = (arg("url") || "").replace(/\/$/, "");
const ANNEE = Number(arg("annee", "2026"));
const DRY = has("dry");

if (!BASE) {
  console.error("\n✖ Indiquez l'URL du site WordPress :\n  node scripts/wp-import.mjs --url=https://ancien-site.fr --annee=2026\n");
  process.exit(1);
}

/** turndown (HTML → Markdown). Optionnel : si absent, on garde un fallback minimal. */
let toMarkdown;
try {
  const Turndown = (await import("turndown")).default;
  const td = new Turndown({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });
  toMarkdown = (html) => td.turndown(html || "");
} catch {
  console.warn("⚠ turndown introuvable (npm i -D turndown) — conversion HTML basique utilisée.");
  toMarkdown = (html) =>
    (html || "")
      .replace(/<\/(p|div|h[1-6]|li)>/gi, "\n\n")
      .replace(/<li[^>]*>/gi, "- ")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
}

const stripHtml = (s = "") =>
  s.replace(/<[^>]+>/g, "").replace(/&hellip;/g, "…").replace(/&#8217;/g, "'").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

const slugify = (s = "") =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** Échappe une valeur scalaire pour YAML (guillemets si nécessaire). */
const yaml = (v) => {
  const s = String(v ?? "");
  return /[:#"'\n]|^\s|\s$/.test(s) ? `"${s.replace(/"/g, '\\"')}"` : s;
};

const tempsLecture = (html) => {
  const mots = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(mots / 200))} min de lecture`;
};

async function dl(url, destRel) {
  if (!url) return "";
  const ext = (extname(new URL(url).pathname) || ".jpg").split("?")[0];
  const rel = `${destRel}${ext}`;
  const abs = resolve(ROOT, "public" + rel);
  if (!DRY) {
    await mkdir(dirname(abs), { recursive: true });
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    await writeFile(abs, buf);
  }
  return rel;
}

async function main() {
  const after = `${ANNEE}-01-01T00:00:00`;
  const before = `${ANNEE + 1}-01-01T00:00:00`;
  let page = 1, total = 0;

  console.log(`\n📥 Import des articles ${ANNEE} depuis ${BASE}\n`);

  for (;;) {
    const api = `${BASE}/wp-json/wp/v2/posts?after=${after}&before=${before}&_embed=1&per_page=100&page=${page}`;
    const res = await fetch(api);
    if (res.status === 400) break; // page au-delà de la dernière
    if (!res.ok) throw new Error(`WP API ${res.status} ${res.statusText} — ${api}`);
    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) break;

    for (const p of posts) {
      const slug = p.slug || slugify(stripHtml(p.title?.rendered));
      const titre = stripHtml(p.title?.rendered);
      const auteur = p._embedded?.author?.[0]?.name ?? "";
      const media = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
      const termes = (p._embedded?.["wp:term"] ?? []).flat();
      const tags = termes.filter((t) => t?.taxonomy === "post_tag").map((t) => t.name);
      const categorie = termes.find((t) => t?.taxonomy === "category")?.name ?? "";

      const couverture = media ? await dl(media, `/uploads/articles/wp/${slug}`) : "";
      const avatarUrl = p._embedded?.author?.[0]?.avatar_urls?.["96"];
      const avatar = avatarUrl ? await dl(avatarUrl, `/uploads/articles/wp/avatar-${p.author}`) : "";

      const body = toMarkdown(p.content?.rendered);

      const fm = [
        "---",
        `titre: ${yaml(titre)}`,
        `date: ${p.date}`,
        couverture && `couverture: ${couverture}`,
        `extrait: ${yaml(stripHtml(p.excerpt?.rendered))}`,
        auteur && `auteur: ${yaml(auteur)}`,
        avatar && `avatar: ${avatar}`,
        `tempsLecture: ${yaml(tempsLecture(p.content?.rendered))}`,
        categorie && `categorie: ${yaml(categorie)}`,
        tags.length && `tags:\n${tags.map((t) => `  - ${yaml(t)}`).join("\n")}`,
        "---",
        "",
        body,
        "",
      ].filter(Boolean).join("\n");

      const out = resolve(ROOT, "content/articles", `${slug}.md`);
      if (DRY) console.log(`  • ${slug}  «${titre}»  (${tags.length} tags${couverture ? ", couverture" : ""})`);
      else { await writeFile(out, fm, "utf8"); console.log(`  ✓ content/articles/${slug}.md`); }
      total++;
    }
    page++;
  }

  console.log(`\n${DRY ? "👀 Aperçu" : "✔ Import terminé"} : ${total} article(s) ${ANNEE}.${DRY ? " (rien écrit)" : ""}\n`);
}

main().catch((e) => { console.error("\n✖", e.message ?? e); process.exit(1); });
