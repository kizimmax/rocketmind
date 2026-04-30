import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type CaseStat = {
  value: string;
  label: string;
  description: string;
};

export type CaseCard = {
  title: string;
  description: string;
  stats: CaseStat[];
  result: string;
};

export type CaseEntry = {
  slug: string;
  /**
   * `mini` — карточка-кейс из `content/cases/*.md` (без отдельной страницы).
   * `big`  — кейс-статья из `content/media/*.md` (`type === "case"`),
   *           кликабельна, ведёт на `/media/<slug>`.
   */
  caseType: "big" | "mini";
  featured: boolean;
  order: number;
  menuTitle: string;
  cardTitle: string;
  cardDescription: string;
  card: CaseCard;
  /** Только для `big`: статус публикации статьи. Скрытые/архивные не показываем. */
  status?: "published" | "hidden" | "archived";
};

const CASES_DIR = path.join(process.cwd(), "content", "cases");
const MEDIA_DIR = path.join(process.cwd(), "content", "media");

function normaliseStats(raw: unknown): CaseStat[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((s): CaseStat | null => {
      if (!s || typeof s !== "object") return null;
      const o = s as { value?: unknown; label?: unknown; description?: unknown };
      return {
        value: typeof o.value === "string" ? o.value : "",
        label: typeof o.label === "string" ? o.label : "",
        description: typeof o.description === "string" ? o.description : "",
      };
    })
    .filter((s): s is CaseStat => s !== null);
}

function readMiniCase(filePath: string): CaseEntry | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    if (!data.slug || typeof data.slug !== "string") return null;
    // На фронте /cases теперь показывает только mini-кейсы из content/cases/.
    // Старые big-кейсы (если такие .md остались) игнорируем — они должны быть
    // пере-созданы как Article с `type: "case"` (см. content/media/).
    if (data.caseType !== "mini") return null;

    const cardRaw = (data.caseCard ?? {}) as Record<string, unknown>;
    const card: CaseCard = {
      title: typeof cardRaw.title === "string" ? cardRaw.title : "",
      description:
        typeof cardRaw.description === "string" ? cardRaw.description : "",
      stats: normaliseStats(cardRaw.stats),
      result: typeof cardRaw.result === "string" ? cardRaw.result : "",
    };

    return {
      slug: data.slug,
      caseType: "mini",
      featured: data.featured === true,
      order: typeof data.order === "number" ? data.order : 0,
      menuTitle: typeof data.menuTitle === "string" ? data.menuTitle : "",
      cardTitle: typeof data.cardTitle === "string" ? data.cardTitle : "",
      cardDescription:
        typeof data.cardDescription === "string" ? data.cardDescription : "",
      card,
    };
  } catch {
    return null;
  }
}

/**
 * Прочитать .md статьи из `content/media/` и, если `type === "case"`, вернуть
 * её как big CaseEntry. Карточка кейса берётся из `caseCard` фронтматтера.
 */
function readBigCaseFromArticle(filePath: string): CaseEntry | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    if (!data.slug || typeof data.slug !== "string") return null;
    if (data.type !== "case") return null;
    const status =
      data.status === "hidden" || data.status === "archived"
        ? data.status
        : "published";
    if (status !== "published") return null;

    const cardRaw = (data.caseCard ?? {}) as Record<string, unknown>;
    const card: CaseCard = {
      title:
        typeof cardRaw.title === "string" && cardRaw.title
          ? cardRaw.title
          : typeof data.title === "string"
            ? data.title
            : "",
      description:
        typeof cardRaw.description === "string" && cardRaw.description
          ? cardRaw.description
          : typeof data.description === "string"
            ? data.description
            : "",
      stats: normaliseStats(cardRaw.stats),
      result: typeof cardRaw.result === "string" ? cardRaw.result : "",
    };
    return {
      slug: data.slug,
      caseType: "big",
      featured: data.featured === true,
      order: typeof data.order === "number" ? data.order : 0,
      menuTitle: typeof data.title === "string" ? data.title : "",
      cardTitle: typeof data.title === "string" ? data.title : "",
      cardDescription:
        typeof data.description === "string" ? data.description : "",
      card,
      status,
    };
  } catch {
    return null;
  }
}

/**
 * All cases (big + mini), sorted by `order` ascending.
 * - mini читаются из `content/cases/*.md`,
 * - big — из `content/media/*.md` (Article с `type === "case"`).
 */
export function getAllCases(): CaseEntry[] {
  const mini: CaseEntry[] = fs.existsSync(CASES_DIR)
    ? fs
        .readdirSync(CASES_DIR)
        .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
        .map((f) => readMiniCase(path.join(CASES_DIR, f)))
        .filter((c): c is CaseEntry => c !== null)
    : [];
  const big: CaseEntry[] = fs.existsSync(MEDIA_DIR)
    ? fs
        .readdirSync(MEDIA_DIR)
        .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
        .map((f) => readBigCaseFromArticle(path.join(MEDIA_DIR, f)))
        .filter((c): c is CaseEntry => c !== null)
    : [];
  return [...mini, ...big].sort((a, b) => a.order - b.order);
}

/** Featured cases (max 5), sorted by `order`. Used in cross-block CasesSection. */
export function getFeaturedCases(): CaseEntry[] {
  return getAllCases()
    .filter((c) => c.featured)
    .slice(0, 5);
}
