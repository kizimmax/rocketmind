import { prisma } from "@/lib/prisma";

const FALLBACK_SITE_URL = "https://r-front-rocketmind.amvera.io";
const SITE_URL = (process.env.SITE_URL ?? FALLBACK_SITE_URL).replace(/\/$/, "");

export type SitemapEntry = { loc: string; lastmod: string };

function toDate(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function collectSitemapEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];

  const [pages, articles] = await Promise.all([
    prisma.page.findMany({ select: { url: true, category: true, slug: true, updatedAt: true } }),
    prisma.article.findMany({
      where: { status: "published" },
      select: { slug: true, publishedAt: true, updatedAt: true },
    }),
  ]);

  const pagesBySlug = new Map(pages.map((p) => [p.slug, p]));

  entries.push({ loc: "/", lastmod: pagesBySlug.get("home")?.updatedAt.toISOString().slice(0, 10) ?? todayStr() });
  entries.push({ loc: "/about", lastmod: pagesBySlug.get("about")?.updatedAt.toISOString().slice(0, 10) ?? todayStr() });
  entries.push({ loc: "/cases", lastmod: pagesBySlug.get("cases-index")?.updatedAt.toISOString().slice(0, 10) ?? todayStr() });
  entries.push({ loc: "/products", lastmod: todayStr() });
  entries.push({ loc: "/media", lastmod: todayStr() });
  entries.push({ loc: "/media/glossary", lastmod: todayStr() });

  for (const p of pages) {
    const skip = ["home", "about", "cases-index", "products"].includes(p.slug) && p.category === "unique";
    if (skip) continue;
    const loc = p.url.startsWith("/") ? p.url : `/${p.url}`;
    entries.push({ loc, lastmod: p.updatedAt.toISOString().slice(0, 10) });
  }

  for (const a of articles) {
    const lastmod = toDate(a.publishedAt) ?? a.updatedAt.toISOString().slice(0, 10);
    entries.push({ loc: `/media/${a.slug}`, lastmod });
  }

  for (const slug of ["privacy-policy", "data-consent", "marketing-consent"]) {
    entries.push({ loc: `/legal/${slug}`, lastmod: todayStr() });
  }

  return entries;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export function renderSitemapXml(entries: SitemapEntry[]): string {
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const e of entries) {
    lines.push("  <url>", `    <loc>${escapeXml(SITE_URL + e.loc)}</loc>`, `    <lastmod>${e.lastmod}</lastmod>`, "  </url>");
  }
  lines.push("</urlset>");
  return lines.join("\n") + "\n";
}

export async function generateSitemapXml(): Promise<string> {
  return renderSitemapXml(await collectSitemapEntries());
}
