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
  caseType: "big" | "mini";
  featured: boolean;
  order: number;
  menuTitle: string;
  cardTitle: string;
  cardDescription: string;
  card: CaseCard;
};

const CASES_DIR = path.join(process.cwd(), "content", "cases");

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

function readCase(filePath: string): CaseEntry | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    if (!data.slug || typeof data.slug !== "string") return null;

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
      caseType: data.caseType === "mini" ? "mini" : "big",
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

/** All cases (big + mini), sorted by `order` ascending. */
export function getAllCases(): CaseEntry[] {
  if (!fs.existsSync(CASES_DIR)) return [];
  return fs
    .readdirSync(CASES_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => readCase(path.join(CASES_DIR, f)))
    .filter((c): c is CaseEntry => c !== null)
    .sort((a, b) => a.order - b.order);
}

/** Featured cases (max 5), sorted by `order`. Used in cross-block CasesSection. */
export function getFeaturedCases(): CaseEntry[] {
  return getAllCases()
    .filter((c) => c.featured)
    .slice(0, 5);
}
