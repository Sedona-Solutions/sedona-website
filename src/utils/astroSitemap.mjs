import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

// Génère dist/sitemap.xml à partir des pages HTML réellement produites par le build.
//
// Exclut automatiquement :
//  - les pages de redirection des anciennes URL WordPress (meta refresh, cf. redirects) ;
//  - les pages marquées noindex dans Tina (data-sitemap="exclure", posé par Seo.astro) ;
//  - l'interface d'administration Tina (/admin/).
// <lastmod> reprend article:modified_time / article:published_time quand ils existent.

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith(".html") ? [join(dir, e.name)] : []
  );

const escXml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function sitemap() {
  let site;
  return {
    name: "sedona-sitemap",
    hooks: {
      "astro:config:done": ({ config }) => {
        site = config.site;
      },
      "astro:build:done": ({ dir, logger }) => {
        if (!site) return logger.warn("`site` absent : sitemap non généré.");
        const root = fileURLToPath(dir);
        const urls = [];
        for (const fichier of walk(root)) {
          const rel = relative(root, fichier).split(sep).join("/");
          if (rel.startsWith("admin/") || rel === "404.html") continue;
          const html = readFileSync(fichier, "utf8");
          if (/http-equiv="refresh"/i.test(html) || /data-sitemap="exclure"/.test(html)) continue;
          const chemin = "/" + rel.replace(/(^|\/)index\.html$/, "$1").replace(/\.html$/, "/");
          const date =
            html.match(/property="article:modified_time" content="([^"]+)"/)?.[1] ??
            html.match(/property="article:published_time" content="([^"]+)"/)?.[1];
          urls.push({ loc: new URL(encodeURI(chemin), site).href, lastmod: date?.slice(0, 10) });
        }
        urls.sort((a, b) => a.loc.localeCompare(b.loc));
        const xml =
          '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          urls
            .map((u) => `  <url><loc>${escXml(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`)
            .join("\n") +
          "\n</urlset>\n";
        writeFileSync(join(root, "sitemap.xml"), xml, "utf8");
        logger.info(`sitemap.xml : ${urls.length} URL`);
      },
    },
  };
}
