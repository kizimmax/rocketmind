import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ExpertData = {
  slug: string;
  name: string;
  tag: string;
  shortBio: string;
  bio: string;
  image: string | null;
};

// ── Paths ──────────────────────────────────────────────────────────────────────

const EXPERTS_DIR = path.join(process.cwd(), "content", "experts");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

function resolveExpertImage(slug: string): string | null {
  const base = `/images/experts/${slug}`;
  for (const ext of [".jpg", ".png", ".webp", ".svg"]) {
    if (fs.existsSync(path.join(PUBLIC_DIR, base + ext))) {
      return BASE_PATH + base + ext;
    }
  }
  return null;
}

// ── API ────────────────────────────────────────────────────────────────────────

/**
 * Synthetic «редакционный» автор. Используется как дефолт для статей без
 * персонального эксперта. Не имеет .md-файла и не попадает в getAllExperts.
 */
export const EDITORIAL_EXPERT_SLUG = "r-editorial";
const EDITORIAL_EXPERT: ExpertData = {
  slug: EDITORIAL_EXPERT_SLUG,
  name: "R-Редакция",
  tag: "",
  shortBio: "",
  bio: "",
  image: null,
};

export function getExpertBySlug(slug: string): ExpertData | null {
  if (slug === EDITORIAL_EXPERT_SLUG) return EDITORIAL_EXPERT;

  const filePath = path.join(EXPERTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  return {
    slug: data.slug || slug,
    name: data.name || "",
    tag: data.tag || "Эксперт продукта",
    shortBio: data.shortBio || "",
    bio: data.bio || "",
    image: resolveExpertImage(data.slug || slug),
  };
}

export function getAllExperts(): ExpertData[] {
  if (!fs.existsSync(EXPERTS_DIR)) return [];

  return fs
    .readdirSync(EXPERTS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => getExpertBySlug(f.replace(/\.md$/, "")))
    .filter(Boolean) as ExpertData[];
}

/**
 * Resolve an array of expert slugs to full ExpertData objects.
 * Skips slugs that don't have a matching .md file.
 */
export function resolveExperts(slugs: string[]): ExpertData[] {
  return slugs
    .map((slug) => getExpertBySlug(slug))
    .filter(Boolean) as ExpertData[];
}
