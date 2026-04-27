import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type GlossaryTermStatus = "published" | "hidden" | "archived";

export type GlossaryTermEntry = {
  slug: string;
  title: string;
  status: GlossaryTermStatus;
  order: number;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
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
