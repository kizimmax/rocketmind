import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Зеркало `apps/site/src/lib/sitemap.ts` для админки. Логика дублируется по
 * той же причине, что и в других admin-API: site-app импортировать из admin
 * нельзя (раздельные tsconfig/bundling), а формат хранения в .md общий.
 *
 * Если меняешь правила сборки sitemap здесь — синхронизируй
 * `apps/site/src/lib/sitemap.ts` (и наоборот).
 */

const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const CONTENT_DIR = path.join(SITE_ROOT, "content");
const APP_DIR = path.join(SITE_ROOT, "src", "app");
const SITE_URL_FILE = path.join(SITE_ROOT, "src", "lib", "site-url.ts");

const FALLBACK_SITE_URL = "https://r-front-rocketmind.amvera.io";

export const SITEMAP_OVERRIDE_PATH = path.join(
  CONTENT_DIR,
  "_sitemap-override.xml",
);

export type SitemapEntry = { loc: string; lastmod: string };

/** Достаёт SITE_URL из site-url.ts регэкспом — без импорта чужого пакета. */
function resolveSiteUrl(): string {
  try {
    const src = fs.readFileSync(SITE_URL_FILE, "utf-8");
    const m = src.match(/SITE_URL\s*=\s*["']([^"']+)["']/);
    if (m) return m[1].replace(/\/$/, "");
  } catch {
    /* fall through */
  }
  return FALLBACK_SITE_URL;
}

function fileMtime(filePath: string): string | null {
  try {
    return new Date(fs.statSync(filePath).mtime).toISOString().slice(0, 10);
  } catch {
    return null;
  }
}

function dirMaxMtime(dir: string): string | null {
  try {
    if (!fs.existsSync(dir)) return null;
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
    let max = 0;
    for (const f of files) {
      const m = fs.statSync(path.join(dir, f)).mtime.getTime();
      if (m > max) max = m;
    }
    return max ? new Date(max).toISOString().slice(0, 10) : null;
  } catch {
    return null;
  }
}

function toDate(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function pick(...candidates: (string | null | undefined)[]): string {
  for (const c of candidates) if (c) return c;
  return new Date().toISOString().slice(0, 10);
}

/** category → директория с продуктами. consulting лежит в content/products/. */
function productContentDir(category: string): string {
  if (category === "consulting") return path.join(CONTENT_DIR, "products");
  return path.join(CONTENT_DIR, category);
}

type ProductRow = { slug: string; category: string; file: string };

function readAllProducts(): ProductRow[] {
  const out: ProductRow[] = [];
  const dirs: { dir: string; defaultCategory: string }[] = [
    { dir: path.join(CONTENT_DIR, "products"), defaultCategory: "consulting" },
    { dir: path.join(CONTENT_DIR, "academy"), defaultCategory: "academy" },
    {
      dir: path.join(CONTENT_DIR, "ai-products"),
      defaultCategory: "ai-products",
    },
  ];
  for (const { dir, defaultCategory } of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
    for (const f of files) {
      try {
        const raw = fs.readFileSync(path.join(dir, f), "utf-8");
        const { data } = matter(raw);
        const slug =
          typeof data.slug === "string" && data.slug ? data.slug : null;
        if (!slug) continue;
        const category =
          typeof data.category === "string" && data.category
            ? data.category
            : defaultCategory;
        out.push({ slug, category, file: path.join(dir, f) });
      } catch {
        /* skip bad file */
      }
    }
  }
  return out;
}

type ArticleRow = { slug: string; publishedAt: string; file: string };

function readPublishedArticles(): ArticleRow[] {
  const dir = path.join(CONTENT_DIR, "media");
  if (!fs.existsSync(dir)) return [];
  const out: ArticleRow[] = [];
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  for (const f of files) {
    try {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      const { data } = matter(raw);
      const slug =
        typeof data.slug === "string" && data.slug ? data.slug : null;
      if (!slug) continue;
      const status =
        typeof data.status === "string" ? data.status : "published";
      if (status !== "published") continue;
      const publishedAt =
        typeof data.publishedAt === "string" ? data.publishedAt : "";
      out.push({ slug, publishedAt, file: path.join(dir, f) });
    } catch {
      /* skip bad file */
    }
  }
  return out;
}

export function collectSitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];

  entries.push({
    loc: "/",
    lastmod: pick(fileMtime(path.join(CONTENT_DIR, "unique", "home.md"))),
  });
  entries.push({
    loc: "/about",
    lastmod: pick(fileMtime(path.join(CONTENT_DIR, "unique", "about.md"))),
  });
  entries.push({
    loc: "/cases",
    lastmod: pick(
      fileMtime(path.join(CONTENT_DIR, "unique", "cases-index.md")),
      dirMaxMtime(path.join(CONTENT_DIR, "cases")),
    ),
  });
  entries.push({
    loc: "/products",
    lastmod: pick(
      dirMaxMtime(path.join(CONTENT_DIR, "products")),
      dirMaxMtime(path.join(CONTENT_DIR, "academy")),
      dirMaxMtime(path.join(CONTENT_DIR, "ai-products")),
    ),
  });
  entries.push({
    loc: "/media",
    lastmod: pick(dirMaxMtime(path.join(CONTENT_DIR, "media"))),
  });
  entries.push({
    loc: "/media/glossary",
    lastmod: pick(dirMaxMtime(path.join(CONTENT_DIR, "glossary"))),
  });

  for (const p of readAllProducts()) {
    entries.push({
      loc: `/${p.category}/${p.slug}`,
      lastmod: pick(fileMtime(p.file)),
    });
  }

  for (const a of readPublishedArticles()) {
    entries.push({
      loc: `/media/${a.slug}`,
      lastmod: pick(toDate(a.publishedAt), fileMtime(a.file)),
    });
  }

  for (const slug of ["privacy-policy", "data-consent", "marketing-consent"]) {
    entries.push({
      loc: `/legal/${slug}`,
      lastmod: pick(fileMtime(path.join(APP_DIR, "legal", slug, "page.tsx"))),
    });
  }

  return entries;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function renderSitemapXml(entries: SitemapEntry[]): string {
  const siteUrl = resolveSiteUrl();
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const e of entries) {
    lines.push(
      "  <url>",
      `    <loc>${escapeXml(siteUrl + e.loc)}</loc>`,
      `    <lastmod>${e.lastmod}</lastmod>`,
      "  </url>",
    );
  }
  lines.push("</urlset>");
  return lines.join("\n") + "\n";
}

export function generateSitemapXml(): string {
  return renderSitemapXml(collectSitemapEntries());
}
