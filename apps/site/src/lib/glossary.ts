import { prisma } from "./prisma";
import {
  parseSections,
  type ArticleSection,
  type ResolvedProductAside,
  type ResolvedQuoteExpert,
  resolveProductAside,
} from "./articles";
import type { CtaEntity } from "./ctas";
import { getCtaById } from "./ctas";
import { getExpertBySlug } from "./experts";

export type GlossaryTermStatus = "published" | "hidden" | "archived";

export type GlossaryTermEntry = {
  slug: string;
  title: string;
  description: string;
  status: GlossaryTermStatus;
  order: number;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  sections: ArticleSection[];
  pinned: boolean;
  pinnedOrder: number;
};

const VALID_STATUSES = new Set(["published", "hidden", "archived"]);
function parseStatus(value: unknown): GlossaryTermStatus {
  return typeof value === "string" && VALID_STATUSES.has(value) ? (value as GlossaryTermStatus) : "published";
}

function rowToEntry(row: {
  slug: string; status: string; title: string; description: string;
  content: unknown; tagIds: string[]; metaTitle: string; metaDescription: string;
}): GlossaryTermEntry {
  const c = (row.content && typeof row.content === "object" ? row.content : {}) as Record<string, unknown>;
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    status: parseStatus(row.status),
    order: typeof c.order === "number" ? c.order : 0,
    tags: row.tagIds,
    metaTitle: row.metaTitle || `${row.title} | Глоссарий Rocketmind`,
    metaDescription: row.metaDescription,
    sections: parseSections(Array.isArray(c.sections) ? c.sections : []),
    pinned: c.pinned === true,
    pinnedOrder: typeof c.pinnedOrder === "number" ? c.pinnedOrder : 0,
  };
}

export async function getAllGlossaryTerms(): Promise<GlossaryTermEntry[]> {
  try {
    const rows = await prisma.glossaryTerm.findMany({ where: { status: "published" } });
    return rows.map(rowToEntry).sort((a, b) => a.title.localeCompare(b.title, "ru"));
  } catch {
    return [];
  }
}

export async function getGlossaryTermBySlug(slug: string): Promise<GlossaryTermEntry | null> {
  try {
    const row = await prisma.glossaryTerm.findUnique({ where: { slug } });
    if (!row) return null;
    return rowToEntry(row);
  } catch {
    return null;
  }
}

export function getTermScript(title: string): "cyrillic" | "latin" {
  const ch = title.trim().charAt(0);
  return /[А-Яа-яЁё]/.test(ch) ? "cyrillic" : "latin";
}

export function getTermLetter(title: string): string {
  const ch = title.trim().charAt(0).toUpperCase();
  if (/[А-ЯЁ]/.test(ch)) return ch === "Ё" ? "Е" : ch;
  if (/[A-Z]/.test(ch)) return ch;
  return "#";
}

export async function collectTermResolvedProductAsides(
  term: GlossaryTermEntry,
): Promise<Record<string, ResolvedProductAside>> {
  const out: Record<string, ResolvedProductAside> = {};
  for (const section of term.sections) {
    for (const aside of section.asides) {
      if (aside.kind !== "product") continue;
      const key = `${aside.productCategory}:${aside.productSlug}`;
      if (out[key]) continue;
      const resolved = await resolveProductAside(aside.productSlug, aside.productCategory);
      if (resolved) out[key] = resolved;
    }
  }
  return out;
}

export async function collectTermResolvedCtas(
  term: GlossaryTermEntry,
): Promise<Record<string, CtaEntity>> {
  const out: Record<string, CtaEntity> = {};
  for (const section of term.sections) {
    if (section.bottomCtaId && !out[section.bottomCtaId]) {
      const cta = await getCtaById(section.bottomCtaId);
      if (cta) out[section.bottomCtaId] = cta;
    }
    for (const aside of section.asides) {
      if (aside.kind === "cta" && aside.ctaId && !out[aside.ctaId]) {
        const cta = await getCtaById(aside.ctaId);
        if (cta) out[aside.ctaId] = cta;
      }
    }
  }
  return out;
}

export async function collectTermResolvedQuoteExperts(
  term: GlossaryTermEntry,
): Promise<Record<string, ResolvedQuoteExpert>> {
  const out: Record<string, ResolvedQuoteExpert> = {};
  for (const section of term.sections) {
    for (const q of section.quotes) {
      if (!q.expertSlug || out[q.expertSlug]) continue;
      const expert = await getExpertBySlug(q.expertSlug);
      if (!expert) continue;
      out[q.expertSlug] = { slug: expert.slug, name: expert.name, role: expert.tag ?? "", avatarUrl: expert.image ?? null };
    }
  }
  return out;
}
