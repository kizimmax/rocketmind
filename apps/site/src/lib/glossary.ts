import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  parseSections,
  type ArticleSection,
  type ResolvedProductAside,
  type ResolvedQuoteExpert,
  resolveProductAside,
} from "./articles";
import type { CtaEntity } from "./ctas";
import { getCtaById } from "./ctas";

export type GlossaryTermStatus = "published" | "hidden" | "archived";

export type GlossaryTermEntry = {
  slug: string;
  title: string;
  /** Hero-описание термина — короткий лид под заголовком. Пустая строка, если не задано. */
  description: string;
  status: GlossaryTermStatus;
  order: number;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  sections: ArticleSection[];
};

const GLOSSARY_DIR = path.join(process.cwd(), "content", "glossary");

const VALID_STATUSES: ReadonlySet<GlossaryTermStatus> = new Set([
  "published",
  "hidden",
  "archived",
]);

function parseStatus(value: unknown): GlossaryTermStatus {
  if (typeof value === "string" && VALID_STATUSES.has(value as GlossaryTermStatus)) {
    return value as GlossaryTermStatus;
  }
  return "published";
}

function readTerm(filePath: string): GlossaryTermEntry | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    if (typeof data.slug !== "string" || !data.slug) return null;
    return {
      slug: data.slug,
      title: typeof data.title === "string" ? data.title : "",
      description:
        typeof data.description === "string" ? data.description : "",
      status: parseStatus(data.status),
      order: typeof data.order === "number" ? data.order : 0,
      tags: Array.isArray(data.tags)
        ? data.tags.filter((t): t is string => typeof t === "string")
        : [],
      metaTitle:
        typeof data.metaTitle === "string" && data.metaTitle
          ? data.metaTitle
          : `${data.title ?? ""} | Глоссарий Rocketmind`,
      metaDescription:
        typeof data.metaDescription === "string" ? data.metaDescription : "",
      sections: parseSections(data.body),
    };
  } catch {
    return null;
  }
}

export function getAllGlossaryTerms(): GlossaryTermEntry[] {
  if (!fs.existsSync(GLOSSARY_DIR)) return [];
  const files = fs
    .readdirSync(GLOSSARY_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  return files
    .map((f) => readTerm(path.join(GLOSSARY_DIR, f)))
    .filter((t): t is GlossaryTermEntry => t !== null && t.status === "published")
    .sort((a, b) => a.title.localeCompare(b.title, "ru"));
}

export function getGlossaryTermBySlug(slug: string): GlossaryTermEntry | null {
  const file = path.join(GLOSSARY_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return readTerm(file);
}

/**
 * Определяет скрипт первой буквы термина: "cyrillic" (А-Я) или "latin" (A-Z).
 * Используется для разделения списка на два алфавитных пространства.
 */
export function getTermScript(title: string): "cyrillic" | "latin" {
  const ch = title.trim().charAt(0);
  return /[А-Яа-яЁё]/.test(ch) ? "cyrillic" : "latin";
}

/**
 * Возвращает первую букву термина в верхнем регистре (для группировки).
 * Для не-буквенного начала возвращает "#".
 */
export function getTermLetter(title: string): string {
  const ch = title.trim().charAt(0).toUpperCase();
  if (/[А-ЯЁ]/.test(ch)) return ch === "Ё" ? "Е" : ch;
  if (/[A-Z]/.test(ch)) return ch;
  return "#";
}

// ── Resolvers для тела термина (parallel collectResolved* в articles.ts) ────

/** Резолвит все product-asides в секциях термина. Ключ — `${category}:${slug}`. */
export function collectTermResolvedProductAsides(
  term: GlossaryTermEntry,
): Record<string, ResolvedProductAside> {
  const out: Record<string, ResolvedProductAside> = {};
  for (const section of term.sections) {
    for (const aside of section.asides) {
      if (aside.kind !== "product") continue;
      const key = `${aside.productCategory}:${aside.productSlug}`;
      if (out[key]) continue;
      const resolved = resolveProductAside(
        aside.productSlug,
        aside.productCategory,
      );
      if (resolved) out[key] = resolved;
    }
  }
  return out;
}

/** Резолвит CTA-сущности из bottomCtaId секций и cta-asides. Ключ — id CTA. */
export function collectTermResolvedCtas(
  term: GlossaryTermEntry,
): Record<string, CtaEntity> {
  const out: Record<string, CtaEntity> = {};
  for (const section of term.sections) {
    if (section.bottomCtaId && !out[section.bottomCtaId]) {
      const cta = getCtaById(section.bottomCtaId);
      if (cta) out[section.bottomCtaId] = cta;
    }
    for (const aside of section.asides) {
      if (aside.kind === "cta" && aside.ctaId && !out[aside.ctaId]) {
        const cta = getCtaById(aside.ctaId);
        if (cta) out[aside.ctaId] = cta;
      }
    }
  }
  return out;
}

/** Резолвит экспертов для цитат в секциях термина. Ключ — slug эксперта. */
export function collectTermResolvedQuoteExperts(
  term: GlossaryTermEntry,
): Record<string, ResolvedQuoteExpert> {
  // Импорт внутри — чтобы избежать циклической зависимости.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getExpertBySlug } = require("./experts") as typeof import("./experts");
  const out: Record<string, ResolvedQuoteExpert> = {};
  for (const section of term.sections) {
    for (const q of section.quotes) {
      if (!q.expertSlug || out[q.expertSlug]) continue;
      const expert = getExpertBySlug(q.expertSlug);
      if (!expert) continue;
      out[q.expertSlug] = {
        slug: expert.slug,
        name: expert.name,
        role: expert.tag ?? "",
        avatarUrl: expert.image ?? null,
      };
    }
  }
  return out;
}
