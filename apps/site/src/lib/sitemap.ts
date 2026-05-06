import { SITE_URL } from "./site-url";
import { getAllArticles, getPublicTags, getTagUsage } from "./articles";
import { getAllGlossaryTerms } from "./glossary";
import { getAllCatalogProducts } from "./products";
import { PRODUCT_CATEGORY_SLUGS } from "./product-categories";

export type SitemapEntry = {
  loc: string;
  lastmod: string;
};

function toDate(value: unknown): string {
  if (typeof value === "string" && value) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

export async function collectSitemapEntries(): Promise<SitemapEntry[]> {
  const today = new Date().toISOString().slice(0, 10);
  const entries: SitemapEntry[] = [];

  entries.push({ loc: "/", lastmod: today });
  entries.push({ loc: "/about", lastmod: today });
  entries.push({ loc: "/cases", lastmod: today });
  entries.push({ loc: "/products", lastmod: today });
  entries.push({ loc: "/media", lastmod: today });
  entries.push({ loc: "/media/glossary", lastmod: today });

  for (const slug of PRODUCT_CATEGORY_SLUGS) {
    entries.push({ loc: `/products/${slug}`, lastmod: today });
  }

  const [products, articles, terms, tagUsageMap, publicTags] = await Promise.all([
    getAllCatalogProducts(),
    getAllArticles(),
    getAllGlossaryTerms(),
    getTagUsage(),
    getPublicTags(),
  ]);

  for (const p of products) {
    entries.push({ loc: `/${p.category}/${p.slug}`, lastmod: today });
  }

  for (const a of articles) {
    entries.push({ loc: `/media/${a.slug}`, lastmod: toDate(a.publishedAt) });
  }

  for (const term of terms) {
    entries.push({ loc: `/media/glossary/term/${term.slug}`, lastmod: today });
  }

  for (const t of publicTags) {
    if ((tagUsageMap[t.id] ?? 0) === 0) continue;
    entries.push({ loc: `/media/tag/${t.id}`, lastmod: today });
  }

  const termTagIds = new Set<string>();
  for (const term of terms) for (const tag of term.tags) termTagIds.add(tag);
  for (const t of publicTags) {
    if (!termTagIds.has(t.id)) continue;
    entries.push({ loc: `/media/glossary/tag/${t.id}`, lastmod: today });
  }

  for (const slug of ["privacy-policy", "data-consent", "marketing-consent"]) {
    entries.push({ loc: `/legal/${slug}`, lastmod: today });
  }

  return entries;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export function renderSitemapXml(entries: SitemapEntry[]): string {
  const lines: string[] = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  for (const e of entries) {
    lines.push("  <url>", `    <loc>${escapeXml(SITE_URL + e.loc)}</loc>`, `    <lastmod>${e.lastmod}</lastmod>`, "  </url>");
  }
  lines.push("</urlset>");
  return lines.join("\n") + "\n";
}

export async function generateSitemapXml(): Promise<string> {
  return renderSitemapXml(await collectSitemapEntries());
}
