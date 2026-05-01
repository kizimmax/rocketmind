import { prisma } from "./prisma";
import { resolveExperts, type ExpertData } from "./experts";

// ── Types ──────────────────────────────────────────────────────────────────────

export type Factoid = { number: string; label: string; text: string };
export type HeroTag = { text: string; icon?: string };
export type StyledParagraph = { text: string; uppercase?: boolean; color?: "primary" | "secondary" };
export type AboutParagraph = StyledParagraph;

export type ProductHeroData = {
  caption: string;
  title: string;
  titleSecondary?: string;
  description: string;
  paragraphs?: StyledParagraph[];
  ctaText: string;
  factoids: Factoid[];
  tags?: HeroTag[];
  secondaryCta?: string;
  audioData?: string;
  quote?: string;
};

export type AccordionItem = { title: string; paragraphs: string[] };

export type AboutProductData = {
  caption: string;
  title: string;
  titleSecondary?: string;
  paragraphs: StyledParagraph[];
  accordion: AccordionItem[];
  accordionCollapsible: boolean;
  hasImage: boolean;
  imageLeft: boolean;
  paragraphsRight: boolean;
};

export type ForWhomFact = { title: string; text: string };
export type ForWhomData = {
  tag: string; title: string; titleSecondary?: string;
  subtitle?: string; paragraphs?: StyledParagraph[];
  facts: ForWhomFact[]; wideColumn?: "left" | "right";
};

export type ProcessStep = { number: string; title: string; text: string; duration: string };
export type ProcessParticipant = { role: string; text: string };
export type ProcessDescriptionParagraph = StyledParagraph;
export type ProcessData = {
  tag: string; title: string; titleSecondary?: string; subtitle: string;
  subtitleUppercase?: boolean; description?: string;
  descriptionParagraphs?: StyledParagraph[]; paragraphs?: StyledParagraph[];
  steps: ProcessStep[]; participantsTag?: string; participants?: ProcessParticipant[];
  variant?: "product" | "academy";
};

export type ResultCardData = { title: string; text: string };
export type ServiceCardData = {
  title: string; paragraphs: string[]; showArrow?: boolean; href?: string;
  colSpan?: 1 | 2; rowSpan?: 1 | 2; featured?: boolean;
  paragraphsTwoCol?: boolean; showInForm?: boolean;
};
export type ServicesFormChipsData = { enabled: boolean; multi?: boolean; label?: string };
export type ServicesData = {
  tag?: string; title: string; titleSecondary?: string;
  description?: string; paragraphs?: StyledParagraph[];
  cards: ServiceCardData[]; formChips?: ServicesFormChipsData;
};
export type ResultsData = {
  tag: string; title: string; titleSecondary?: string;
  description?: string; paragraphs?: StyledParagraph[]; cards: ResultCardData[];
};

export type { ExpertData };

export type ToolCardData = {
  number: string; title: string; text: string;
  icon?: string | null; wide?: boolean; accent?: boolean;
};
export type ToolsData = {
  tag: string; title: string; titleSecondary?: string;
  description?: string; paragraphs?: StyledParagraph[];
  useIcons?: boolean; descriptionBelow?: boolean; tools: ToolCardData[];
};

export type AboutRocketmindData = {
  heading: string; founderName: string; founderBio: string; founderRole: string;
  canvasTitle?: string; canvasText?: string;
  features: Array<{ title: string; text: string }>;
  leftVariant?: "alex" | "canvas"; alexPhoto?: string; canvasPhoto?: string;
};

export type CustomSectionData = {
  id: string;
  insertAfter: string | null;
  enabled: boolean;
  about: AboutProductData;
};

export type ProductData = {
  slug: string; category: string;
  menuTitle: string; menuDescription: string;
  cardTitle: string; cardDescription: string;
  metaTitle: string; metaDescription: string;
  hero: ProductHeroData;
  about: AboutProductData | null;
  audience: ForWhomData | null;
  tools: ToolsData | null;
  results: ResultsData | null;
  services: ServicesData | null;
  process: ProcessData | null;
  experts: ExpertData[] | null;
  aboutRocketmind: AboutRocketmindData | null;
  aboutRocketmindEnabled: boolean;
  logoMarqueeEnabled: boolean;
  expertProduct: boolean;
  order: number;
  showInMenu: boolean;
  showInFooter: boolean;
  formId: string | null;
  pageBottomCtaId: string | null;
  pageBottomEnabled: boolean;
  coverImage: string;
  heroImage: string | null;
  aboutImage: string | null;
  customSections: CustomSectionData[];
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function normaliseParagraphs(raw: unknown): StyledParagraph[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((p): StyledParagraph | null => {
    if (typeof p === "string") return { text: p, uppercase: false };
    if (p && typeof p === "object") {
      const o = p as { text?: unknown; uppercase?: unknown; color?: unknown };
      if (typeof o.text === "string") {
        const color = o.color === "primary" || o.color === "secondary" ? o.color : undefined;
        return { text: o.text, uppercase: o.uppercase === true, ...(color ? { color } : {}) };
      }
    }
    return null;
  }).filter((p): p is StyledParagraph => p !== null);
}

function normaliseAccordion(raw: unknown): AccordionItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const i = item as { title?: string; paragraphs?: unknown; description?: unknown };
    const paragraphs = Array.isArray(i.paragraphs) && i.paragraphs.length > 0
      ? (i.paragraphs as unknown[]).filter((p): p is string => typeof p === "string")
      : typeof i.description === "string" && i.description ? [i.description] : [];
    return { title: i.title ?? "", paragraphs };
  });
}

function parseAboutLike(raw: unknown): AboutProductData {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const legacyUppercase = r.paragraphsUppercase === true;
  const paragraphs: StyledParagraph[] = Array.isArray(r.paragraphs) && (r.paragraphs as unknown[]).length > 0
    ? normaliseParagraphs(r.paragraphs)
    : typeof r.description === "string" && r.description
      ? [{ text: r.description, uppercase: legacyUppercase }]
      : [];
  return {
    caption: typeof r.caption === "string" ? r.caption : "",
    title: typeof r.title === "string" ? r.title : "",
    titleSecondary: typeof r.titleSecondary === "string" ? r.titleSecondary : undefined,
    paragraphs,
    accordion: normaliseAccordion(r.accordion),
    accordionCollapsible: r.accordionCollapsible !== false,
    hasImage: false,
    imageLeft: r.imageLeft === true,
    paragraphsRight: r.paragraphsRight === true,
  };
}

async function pageToProductData(page: {
  slug: string; category: string; status: string; sortOrder: number; content: unknown;
  menuTitle: string; menuDescription: string; cardTitle: string; cardDescription: string;
  metaTitle: string; metaDescription: string;
}): Promise<ProductData> {
  const data = (page.content && typeof page.content === "object" ? page.content : {}) as Record<string, unknown>;

  const heroRaw = (data.hero && typeof data.hero === "object" ? data.hero : {}) as Record<string, unknown>;
  const heroImageUrl = typeof heroRaw.heroImageData === "string" && heroRaw.heroImageData.startsWith("http") ? heroRaw.heroImageData : null;
  const audioUrl = typeof heroRaw.audioData === "string" && heroRaw.audioData.startsWith("http") ? heroRaw.audioData : undefined;
  const { heroImageData: _h, audioData: _a, audioFilename: _af, ...heroClean } = heroRaw;

  const aboutRaw = data.about && typeof data.about === "object" ? (data.about as Record<string, unknown>) : null;
  const aboutImageUrl = aboutRaw && typeof aboutRaw.aboutImageData === "string" && aboutRaw.aboutImageData.startsWith("http") ? aboutRaw.aboutImageData : null;

  const expertSlugs = Array.isArray(data.experts) ? (data.experts as unknown[]).filter((s): s is string => typeof s === "string") : [];
  const experts = expertSlugs.length > 0 ? await resolveExperts(expertSlugs) : null;

  const about: AboutProductData | null = aboutRaw
    ? { ...parseAboutLike(aboutRaw), hasImage: aboutImageUrl !== null }
    : null;

  const customSections: CustomSectionData[] = Array.isArray(data.customSections)
    ? (data.customSections as Array<Record<string, unknown>>)
        .filter((cs) => cs && typeof cs === "object" && cs.enabled !== false)
        .map((cs, i) => ({
          id: typeof cs.id === "string" ? cs.id : `cs_${i}`,
          insertAfter: typeof cs.insertAfter === "string" && cs.insertAfter.length > 0 ? cs.insertAfter : null,
          enabled: cs.enabled !== false,
          about: parseAboutLike(cs.data),
        }))
    : [];

  const pageBottomCtaId = (() => {
    const pb = data.pageBottom;
    if (pb && typeof pb === "object" && typeof (pb as Record<string, unknown>).ctaId === "string") {
      const id = ((pb as Record<string, unknown>).ctaId as string).trim();
      return id || null;
    }
    return null;
  })();

  return {
    slug: page.slug,
    category: page.category,
    menuTitle: page.menuTitle,
    menuDescription: page.menuDescription,
    cardTitle: page.cardTitle,
    cardDescription: page.cardDescription,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    hero: {
      ...heroClean,
      title: typeof heroClean.title === "string" ? heroClean.title.trimEnd() : "",
      caption: typeof heroClean.caption === "string" ? heroClean.caption : "",
      description: typeof heroClean.description === "string" ? heroClean.description : "",
      ctaText: typeof heroClean.ctaText === "string" ? heroClean.ctaText : "оставить заявку",
      factoids: Array.isArray(heroClean.factoids) ? (heroClean.factoids as Factoid[]) : [],
      ...(audioUrl ? { audioData: audioUrl } : {}),
    },
    about,
    audience: data.audience && typeof data.audience === "object" ? (data.audience as ForWhomData) : null,
    tools: data.tools && typeof data.tools === "object" ? (data.tools as ToolsData) : null,
    results: data.results && typeof data.results === "object" ? (data.results as ResultsData) : null,
    services: data.services && typeof data.services === "object" ? (data.services as ServicesData) : null,
    process: data.process && typeof data.process === "object" ? (data.process as ProcessData) : null,
    experts,
    aboutRocketmind: data.aboutRocketmind && typeof data.aboutRocketmind === "object" ? (data.aboutRocketmind as AboutRocketmindData) : null,
    aboutRocketmindEnabled: data.aboutRocketmind !== false,
    logoMarqueeEnabled: data.logoMarquee !== false,
    expertProduct: typeof data.expertProduct === "boolean" ? data.expertProduct : expertSlugs.length > 0,
    order: typeof data.order === "number" ? data.order : page.sortOrder,
    showInMenu: data.showInMenu !== false,
    showInFooter: data.showInFooter !== false,
    formId: typeof data.formId === "string" && data.formId ? data.formId : null,
    pageBottomCtaId,
    pageBottomEnabled: data.pageBottom !== false,
    coverImage: heroImageUrl ?? "",
    heroImage: heroImageUrl,
    aboutImage: aboutImageUrl,
    customSections,
  };
}

// ── API ────────────────────────────────────────────────────────────────────────

const CATALOG_CATEGORIES = ["consulting", "academy", "ai-products"];

export async function getProductBySlug(slug: string, category?: string): Promise<ProductData | null> {
  try {
    const where = category
      ? { slug, category }
      : { slug, category: { in: CATALOG_CATEGORIES } };
    const page = await prisma.page.findFirst({ where: { ...where, status: "published" } });
    if (!page) return null;
    return pageToProductData(page);
  } catch {
    return null;
  }
}

export async function getAllProducts(): Promise<ProductData[]> {
  try {
    const pages = await prisma.page.findMany({
      where: { category: "consulting", status: "published" },
      orderBy: { sortOrder: "asc" },
    });
    const products = await Promise.all(pages.map(pageToProductData));
    return products.sort((a, b) => a.order !== b.order ? a.order - b.order : a.slug.localeCompare(b.slug));
  } catch {
    return [];
  }
}

export async function getProductsByCategory(category: string): Promise<ProductData[]> {
  try {
    const pages = await prisma.page.findMany({
      where: { category, status: "published" },
      orderBy: { sortOrder: "asc" },
    });
    const products = await Promise.all(pages.map(pageToProductData));
    return products.sort((a, b) => a.order !== b.order ? a.order - b.order : a.slug.localeCompare(b.slug));
  } catch {
    return [];
  }
}

export async function getAllCatalogProducts(): Promise<ProductData[]> {
  try {
    const pages = await prisma.page.findMany({
      where: { category: { in: CATALOG_CATEGORIES }, status: "published" },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });
    const byCategory = new Map<string, typeof pages>();
    for (const p of pages) {
      if (!byCategory.has(p.category)) byCategory.set(p.category, []);
      byCategory.get(p.category)!.push(p);
    }
    const result: ProductData[] = [];
    for (const cat of CATALOG_CATEGORIES) {
      const catPages = byCategory.get(cat) ?? [];
      const catProducts = await Promise.all(catPages.map(pageToProductData));
      result.push(...catProducts.sort((a, b) => a.order !== b.order ? a.order - b.order : a.slug.localeCompare(b.slug)));
    }
    return result;
  } catch {
    return [];
  }
}
