import { prisma } from "./prisma";

export type CaseStat = { value: string; label: string; description: string };
export type CaseCard = { title: string; description: string; stats: CaseStat[]; result: string };

export type CaseEntry = {
  slug: string;
  caseType: "big" | "mini";
  featured: boolean;
  order: number;
  menuTitle: string;
  cardTitle: string;
  cardDescription: string;
  card: CaseCard;
  status?: "published" | "hidden" | "archived";
};

function normaliseStats(raw: unknown): CaseStat[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((s): CaseStat | null => {
    if (!s || typeof s !== "object") return null;
    const o = s as { value?: unknown; label?: unknown; description?: unknown };
    return { value: typeof o.value === "string" ? o.value : "", label: typeof o.label === "string" ? o.label : "", description: typeof o.description === "string" ? o.description : "" };
  }).filter((s): s is CaseStat => s !== null);
}

export async function getAllCases(): Promise<CaseEntry[]> {
  const [miniPages, bigArticles] = await Promise.all([
    prisma.page.findMany({ where: { category: "cases", status: "published" } }).catch(() => []),
    prisma.article.findMany({ where: { type: "case", status: "published" } }).catch(() => []),
  ]);

  const mini: CaseEntry[] = miniPages.flatMap((page) => {
    const data = (page.content && typeof page.content === "object" ? page.content : {}) as Record<string, unknown>;
    if (data.caseType !== "mini") return [];
    const cardRaw = (data.caseCard && typeof data.caseCard === "object" ? data.caseCard : {}) as Record<string, unknown>;
    const card: CaseCard = {
      title: typeof cardRaw.title === "string" ? cardRaw.title : "",
      description: typeof cardRaw.description === "string" ? cardRaw.description : "",
      stats: normaliseStats(cardRaw.stats),
      result: typeof cardRaw.result === "string" ? cardRaw.result : "",
    };
    return [{
      slug: page.slug,
      caseType: "mini" as const,
      featured: data.featured === true,
      order: typeof data.order === "number" ? data.order : 0,
      menuTitle: page.menuTitle,
      cardTitle: page.cardTitle,
      cardDescription: page.cardDescription,
      card,
    }];
  });

  const big: CaseEntry[] = bigArticles.map((article) => {
    const c = (article.content && typeof article.content === "object" ? article.content : {}) as Record<string, unknown>;
    const cardRaw = (c.caseCard && typeof c.caseCard === "object" ? c.caseCard : {}) as Record<string, unknown>;
    const card: CaseCard = {
      title: (typeof cardRaw.title === "string" && cardRaw.title) ? cardRaw.title : article.title,
      description: (typeof cardRaw.description === "string" && cardRaw.description) ? cardRaw.description : article.description,
      stats: normaliseStats(cardRaw.stats),
      result: typeof cardRaw.result === "string" ? cardRaw.result : "",
    };
    return {
      slug: article.slug,
      caseType: "big" as const,
      featured: article.featured,
      order: typeof c.order === "number" ? c.order : 0,
      menuTitle: article.title,
      cardTitle: article.title,
      cardDescription: article.description,
      card,
      status: "published" as const,
    };
  });

  return [...mini, ...big].sort((a, b) => a.order - b.order);
}

export async function getFeaturedCases(): Promise<CaseEntry[]> {
  return (await getAllCases()).filter((c) => c.featured).slice(0, 5);
}
