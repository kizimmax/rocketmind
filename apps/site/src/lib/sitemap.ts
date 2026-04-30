import fs from "fs";
import path from "path";
import { SITE_URL } from "./site-url";
import { getAllArticles, getPublicTags, getTagUsage } from "./articles";
import { getAllGlossaryTerms } from "./glossary";
import { getAllCatalogProducts } from "./products";
import { PRODUCT_CATEGORY_SLUGS } from "./product-categories";

const CONTENT_DIR = path.join(process.cwd(), "content");
const APP_DIR = path.join(process.cwd(), "src", "app");

export type SitemapEntry = {
  /** Path starting with `/`. */
  loc: string;
  /** ISO date `YYYY-MM-DD`. */
  lastmod: string;
};

/**
 * Override-файл с готовым XML. Если существует — `/sitemap.xml`-роут отдаёт его
 * как есть, минуя генератор. Сохраняется через админку (раздел «Системные»).
 */
export function getSitemapOverridePath(): string {
  return path.join(CONTENT_DIR, "_sitemap-override.xml");
}

function toDate(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
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

/** Возвращает первое не-null значение, иначе сегодняшнюю дату. */
function pick(...candidates: (string | null | undefined)[]): string {
  for (const c of candidates) if (c) return c;
  return new Date().toISOString().slice(0, 10);
}

/**
 * Маппинг категория → директория с .md-файлами продукта. `consulting` исторически
 * лежит в `content/products/`, остальные — в `content/<category>/`.
 */
function productContentDir(category: string): string {
  if (category === "consulting") return path.join(CONTENT_DIR, "products");
  return path.join(CONTENT_DIR, category);
}

export function collectSitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];

  // Index/landing pages — lastmod от unique-md либо макс. mtime содержимого секции
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

  // Категории каталога /products/<slug> (consulting/academy/expert/ai-products)
  for (const slug of PRODUCT_CATEGORY_SLUGS) {
    entries.push({
      loc: `/products/${slug}`,
      lastmod: pick(
        dirMaxMtime(path.join(CONTENT_DIR, "products")),
        dirMaxMtime(path.join(CONTENT_DIR, "academy")),
        dirMaxMtime(path.join(CONTENT_DIR, "ai-products")),
      ),
    });
  }

  // Продукты по всем категориям (consulting/academy/ai-products)
  for (const p of getAllCatalogProducts()) {
    const file = path.join(productContentDir(p.category), `${p.slug}.md`);
    entries.push({
      loc: `/${p.category}/${p.slug}`,
      lastmod: pick(fileMtime(file)),
    });
  }

  // Опубликованные статьи /media/[slug]
  for (const a of getAllArticles()) {
    const file = path.join(CONTENT_DIR, "media", `${a.slug}.md`);
    entries.push({
      loc: `/media/${a.slug}`,
      lastmod: pick(toDate(a.publishedAt), fileMtime(file)),
    });
  }

  // Tag-страницы /media/tag/<id> — только для тегов, у которых есть статьи
  const tagUsage = getTagUsage();
  const publicTags = getPublicTags();
  const mediaDirMtime = dirMaxMtime(path.join(CONTENT_DIR, "media"));
  for (const t of publicTags) {
    if ((tagUsage[t.id] ?? 0) === 0) continue;
    entries.push({
      loc: `/media/tag/${t.id}`,
      lastmod: pick(mediaDirMtime),
    });
  }

  // Tag-страницы /media/glossary/tag/<id> — только теги, у которых есть термины
  const allTerms = getAllGlossaryTerms();
  const termTagIds = new Set<string>();
  for (const term of allTerms) for (const tag of term.tags) termTagIds.add(tag);
  const glossaryDirMtime = dirMaxMtime(path.join(CONTENT_DIR, "glossary"));
  for (const t of publicTags) {
    if (!termTagIds.has(t.id)) continue;
    entries.push({
      loc: `/media/glossary/tag/${t.id}`,
      lastmod: pick(glossaryDirMtime),
    });
  }

  // Legal — статика без md-источника
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
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const e of entries) {
    lines.push(
      "  <url>",
      `    <loc>${escapeXml(SITE_URL + e.loc)}</loc>`,
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
