import { prisma } from "./prisma";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ExpertData = {
  slug: string;
  name: string;
  tag: string;
  shortBio: string;
  bio: string;
  image: string | null;
};

// ── Synthetic editorial author ─────────────────────────────────────────────────

export const EDITORIAL_EXPERT_SLUG = "r-editorial";
const EDITORIAL_EXPERT: ExpertData = {
  slug: EDITORIAL_EXPERT_SLUG,
  name: "R-Редакция",
  tag: "",
  shortBio: "",
  bio: "",
  image: null,
};

function rowToExpert(row: { slug: string; content: unknown; photoPath: string | null }): ExpertData {
  const c = (row.content && typeof row.content === "object" ? row.content : {}) as Record<string, unknown>;
  return {
    slug: row.slug,
    name: typeof c.name === "string" ? c.name : "",
    tag: typeof c.tag === "string" ? c.tag : "Эксперт продукта",
    shortBio: typeof c.shortBio === "string" ? c.shortBio : "",
    bio: typeof c.bio === "string" ? c.bio : "",
    image: row.photoPath ?? null,
  };
}

// ── API ────────────────────────────────────────────────────────────────────────

export async function getExpertBySlug(slug: string): Promise<ExpertData | null> {
  if (slug === EDITORIAL_EXPERT_SLUG) return EDITORIAL_EXPERT;
  try {
    const row = await prisma.expert.findUnique({ where: { slug } });
    if (!row) return null;
    return rowToExpert(row);
  } catch {
    return null;
  }
}

export async function getAllExperts(): Promise<ExpertData[]> {
  try {
    const rows = await prisma.expert.findMany({ orderBy: { sortOrder: "asc" } });
    return rows.map(rowToExpert);
  } catch {
    return [];
  }
}

export async function resolveExperts(slugs: string[]): Promise<ExpertData[]> {
  if (slugs.length === 0) return [];
  const unique = [...new Set(slugs)];
  const editorial = unique.includes(EDITORIAL_EXPERT_SLUG) ? [EDITORIAL_EXPERT] : [];
  const dbSlugs = unique.filter((s) => s !== EDITORIAL_EXPERT_SLUG);
  if (dbSlugs.length === 0) return editorial;
  try {
    const rows = await prisma.expert.findMany({ where: { slug: { in: dbSlugs } } });
    const bySlug = new Map(rows.map((r) => [r.slug, rowToExpert(r)]));
    const dbExperts = dbSlugs.map((s) => bySlug.get(s)).filter((e): e is ExpertData => e !== undefined);
    return [...editorial, ...dbExperts];
  } catch {
    return editorial;
  }
}
