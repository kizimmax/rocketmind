import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ── Types ──────────────────────────────────────────────────────────────────

export type MediaTag = {
  id: string;
  label: string;
};

export type ArticleEntry = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  expertSlug: string | null;
  tags: string[];
  keyThoughts: string[];
  coverUrl: string | null;
  metaTitle: string;
  metaDescription: string;
};

// ── Paths ──────────────────────────────────────────────────────────────────

const MEDIA_DIR = path.join(process.cwd(), "content", "media");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

function resolveCover(slug: string): string | null {
  const rel = `/images/media/${slug}`;
  for (const ext of [".jpg", ".jpeg", ".png", ".webp", ".avif"]) {
    if (fs.existsSync(path.join(PUBLIC_DIR, rel + ext))) {
      return BASE_PATH + rel + ext;
    }
  }
  return null;
}

function readArticle(filePath: string): ArticleEntry | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    if (typeof data.slug !== "string" || !data.slug) return null;
    const slug = data.slug;
    return {
      slug,
      title: typeof data.title === "string" ? data.title : "",
      description: typeof data.description === "string" ? data.description : "",
      publishedAt: typeof data.publishedAt === "string" ? data.publishedAt : "",
      expertSlug: typeof data.expertSlug === "string" ? data.expertSlug : null,
      tags: Array.isArray(data.tags)
        ? data.tags.filter((t): t is string => typeof t === "string")
        : [],
      keyThoughts: Array.isArray(data.keyThoughts)
        ? data.keyThoughts.filter((t): t is string => typeof t === "string")
        : [],
      coverUrl: resolveCover(slug),
      metaTitle:
        typeof data.metaTitle === "string" && data.metaTitle
          ? data.metaTitle
          : `${data.title ?? ""} | Rocketmind`,
      metaDescription:
        typeof data.metaDescription === "string" ? data.metaDescription : "",
    };
  } catch {
    return null;
  }
}

export function getAllArticles(): ArticleEntry[] {
  if (!fs.existsSync(MEDIA_DIR)) return [];
  const files = fs
    .readdirSync(MEDIA_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  return files
    .map((f) => readArticle(path.join(MEDIA_DIR, f)))
    .filter((a): a is ArticleEntry => a !== null)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getArticleBySlug(slug: string): ArticleEntry | null {
  const file = path.join(MEDIA_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return readArticle(file);
}

export function getAllTags(): MediaTag[] {
  const file = path.join(MEDIA_DIR, "_tags.json");
  if (!fs.existsSync(file)) return [];
  try {
    const json = JSON.parse(fs.readFileSync(file, "utf-8")) as {
      tags?: MediaTag[];
    };
    return Array.isArray(json.tags) ? json.tags : [];
  } catch {
    return [];
  }
}

/** Usage count per tag id across all published articles. */
export function getTagUsage(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const a of getAllArticles())
    for (const t of a.tags) out[t] = (out[t] ?? 0) + 1;
  return out;
}
