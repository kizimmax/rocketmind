import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { resolveExperts, type ExpertData } from "./experts";
import type {
  Factoid,
  AboutParagraph,
  AccordionItem,
  ProcessData,
  ToolsData,
  ForWhomData,
} from "./products";

// ── Types ──────────────────────────────────────────────────────────────────────

export type AboutHeroData = {
  caption: string;
  title: string;
  description: string;
  ctaText: string;
  factoids: Factoid[];
  experts: ExpertData[];
  /** Custom logo image (base64 data URL). Falls back to default SVG if absent. */
  heroLogoData?: string;
  /** When present, renders as large uppercase heading instead of the brand logo. */
  heading?: string;
  /** Max number of expert avatars to show. Shows all if absent. */
  maxExperts?: number;
};

export type AboutMainData = {
  caption: string;
  title: string;
  titleSecondary?: string;
  paragraphs: AboutParagraph[];
  accordion: AccordionItem[];
  accordionCollapsible: boolean;
  hasImage: boolean;
  imageLeft: boolean;
  paragraphsRight: boolean;
};

export type LogoGridCell = {
  id: string;
  src: string;
  alt?: string;
  size: "S" | "M" | "L";
  /** Logo padding inside cell in px. Default 20. */
  padding?: number;
};

export type ProjectsBlockData = {
  caption: string;
  title: string;
  titleSecondary?: string;
  paragraphs: AboutParagraph[];
  accordion: AccordionItem[];
  logoGrid: LogoGridCell[];
};

export type AboutPageData = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  hero: AboutHeroData;
  about: AboutMainData | null;
  tools: ToolsData | null;
  projects: ProjectsBlockData | null;
  process: ProcessData | null;
  experts: ExpertData[];
  audience: ForWhomData | null;
  aboutImage: string | null;
};

// ── Paths ──────────────────────────────────────────────────────────────────────

const UNIQUE_DIR = path.join(process.cwd(), "content", "unique");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

function resolveUniqueImage(slug: string, role: string): string | null {
  const base = `/images/unique/${slug}/${role}`;
  for (const ext of [".svg", ".png", ".jpg", ".jpeg", ".webp"]) {
    if (fs.existsSync(path.join(PUBLIC_DIR, base + ext))) {
      return BASE_PATH + base + ext;
    }
  }
  return null;
}

// ── Paragraph/accordion normalisation (mirrors products.ts) ───────────────────

function normaliseParagraphs(raw: unknown): AboutParagraph[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((p): AboutParagraph | null => {
      if (typeof p === "string") return { text: p, uppercase: false };
      if (p && typeof p === "object") {
        const o = p as { text?: unknown; uppercase?: unknown };
        if (typeof o.text === "string") return { text: o.text, uppercase: o.uppercase === true };
      }
      return null;
    })
    .filter((p): p is AboutParagraph => p !== null);
}

function normaliseAccordion(raw: unknown): AccordionItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const i = item as { title?: string; paragraphs?: unknown };
    const paragraphs = Array.isArray(i.paragraphs)
      ? i.paragraphs.filter((p): p is string => typeof p === "string")
      : [];
    return { title: i.title ?? "", paragraphs };
  });
}

// ── API ────────────────────────────────────────────────────────────────────────

function loadUniquePage(uniqueSlug: string, defaultSlug: string): AboutPageData | null {
  const filePath = path.join(UNIQUE_DIR, `${uniqueSlug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);
  const slug = data.slug || defaultSlug;

  // ── Hero ────────────────────────────────────────────────────────────────────
  const heroRaw = (data.hero ?? {}) as Record<string, unknown>;
  const heroExpertSlugs = Array.isArray(heroRaw.experts) ? (heroRaw.experts as string[]) : [];
  const hero: AboutHeroData = {
    caption: (heroRaw.caption as string) ?? "",
    title: ((heroRaw.title as string) ?? "").trimEnd(),
    description: (heroRaw.description as string) ?? "",
    ctaText: (heroRaw.ctaText as string) ?? "связаться с нами",
    factoids: Array.isArray(heroRaw.factoids) ? (heroRaw.factoids as Factoid[]) : [],
    experts: resolveExperts(heroExpertSlugs),
    heroLogoData: typeof heroRaw.heroLogoData === "string" ? heroRaw.heroLogoData : undefined,
    heading: typeof heroRaw.heading === "string" ? heroRaw.heading : undefined,
    maxExperts: typeof heroRaw.maxExperts === "number" ? heroRaw.maxExperts : undefined,
  };

  // ── About main ──────────────────────────────────────────────────────────────
  const aboutImage = resolveUniqueImage(slug, "about");
  const aboutRaw = (data.about ?? null) as Record<string, unknown> | null;
  const about: AboutMainData | null = aboutRaw
    ? {
        caption: (aboutRaw.caption as string) ?? "",
        title: (aboutRaw.title as string) ?? "",
        titleSecondary: aboutRaw.titleSecondary as string | undefined,
        paragraphs: normaliseParagraphs(aboutRaw.paragraphs),
        accordion: normaliseAccordion(aboutRaw.accordion),
        accordionCollapsible: aboutRaw.accordionCollapsible !== false,
        hasImage: aboutImage !== null,
        imageLeft: aboutRaw.imageLeft === true,
        paragraphsRight: aboutRaw.paragraphsRight === true,
      }
    : null;

  // ── Projects (about-clone with logoGrid) ────────────────────────────────────
  const projectsRaw = (data.projects ?? null) as Record<string, unknown> | null;
  const logoGridRaw = (projectsRaw?.logoGrid ?? {}) as { cells?: unknown };
  const cells: LogoGridCell[] = Array.isArray(logoGridRaw.cells)
    ? logoGridRaw.cells
        .map((c): LogoGridCell | null => {
          const cell = c as { id?: unknown; src?: unknown; alt?: unknown; size?: unknown; padding?: unknown };
          if (typeof cell.src !== "string" || !cell.src) return null;
          const src = cell.src.startsWith("/") ? BASE_PATH + cell.src : cell.src;
          return {
            id: typeof cell.id === "string" ? cell.id : Math.random().toString(36).slice(2),
            src,
            alt: typeof cell.alt === "string" ? cell.alt : undefined,
            size: cell.size === "S" || cell.size === "L" ? cell.size : "M",
            padding: typeof cell.padding === "number" ? cell.padding : undefined,
          };
        })
        .filter((c): c is LogoGridCell => c !== null)
    : [];

  const projects: ProjectsBlockData | null = projectsRaw
    ? {
        caption: (projectsRaw.caption as string) ?? "",
        title: (projectsRaw.title as string) ?? "",
        titleSecondary: projectsRaw.titleSecondary as string | undefined,
        paragraphs: normaliseParagraphs(projectsRaw.paragraphs),
        accordion: normaliseAccordion(projectsRaw.accordion),
        logoGrid: cells,
      }
    : null;

  // ── Experts (page-level) ────────────────────────────────────────────────────
  const pageExpertSlugs = Array.isArray(data.experts) ? (data.experts as string[]) : [];
  const pageExperts = resolveExperts(pageExpertSlugs);

  return {
    slug,
    metaTitle: data.metaTitle || "",
    metaDescription: data.metaDescription || "",
    hero,
    about,
    tools: (data.tools as ToolsData | undefined) ?? null,
    projects,
    process: (data.process as ProcessData | undefined) ?? null,
    experts: pageExperts,
    audience: (data.audience as ForWhomData | undefined) ?? null,
    aboutImage,
  };
}

export function getAboutPage(): AboutPageData | null {
  // Slug renamed from "rocketmind" → "about"; fall back to legacy filename for compat.
  return loadUniquePage("about", "about") ?? loadUniquePage("rocketmind", "rocketmind");
}

export function getCasesIndexPage(): AboutPageData | null {
  return loadUniquePage("cases-index", "cases-index");
}

// ── Home page (unique, slug="home") ────────────────────────────────────────────

export type HomeHeroRotatingLine = {
  text: string;
  ctaLabel: string;
  ctaHref: string;
};

export type HomeHeroData = {
  title: string;
  pikCaption: string;
  rotatingLines: HomeHeroRotatingLine[];
};

export type HomeMethodologyCell = {
  label: string;
  title: string;
  description: string;
};

export type HomeMethodologyData = {
  cells: HomeMethodologyCell[];
};

export type HomeSectionItem = {
  filterKey: string;
  trackName: string;
  headerHighlight: string;
  mobileTitle: string;
  description: string;
  catalogLabel: string;
  hiddenCardSlugs: string[];
};

export type HomeSectionsData = {
  sections: HomeSectionItem[];
};

export type HomePageData = {
  hero: HomeHeroData | null;
  methodology: HomeMethodologyData | null;
  sections: HomeSectionsData | null;
};

const HOME_HERO_DEFAULTS: HomeHeroData = {
  title: "Помогаем бизнесу расти\nи масштабироваться",
  pikCaption: "Развиваем методологию\nи представляем PIK\nв России и странах Азии",
  rotatingLines: [
    { text: "создаем стратегию развития", ctaLabel: "Обсудить стратегию", ctaHref: "#contact" },
    { text: "ищем новые направления", ctaLabel: "Обсудить стратегию", ctaHref: "#contact" },
    { text: "внедряем системное мышление", ctaLabel: "Обсудить стратегию", ctaHref: "#contact" },
    { text: "интегрируем AI для эффективности", ctaLabel: "Обсудить стратегию", ctaHref: "#contact" },
  ],
};

export function getHomePage(): HomePageData {
  const filePath = path.join(UNIQUE_DIR, "home.md");
  if (!fs.existsSync(filePath)) {
    return { hero: HOME_HERO_DEFAULTS, methodology: null, sections: null };
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  const heroRaw = (data.homeHero ?? null) as Record<string, unknown> | null;
  const hero: HomeHeroData = heroRaw
    ? {
        title: typeof heroRaw.title === "string" ? heroRaw.title : HOME_HERO_DEFAULTS.title,
        pikCaption:
          typeof heroRaw.pikCaption === "string" ? heroRaw.pikCaption : HOME_HERO_DEFAULTS.pikCaption,
        rotatingLines: Array.isArray(heroRaw.rotatingLines)
          ? (heroRaw.rotatingLines as Array<Record<string, unknown>>)
              .map((l): HomeHeroRotatingLine => ({
                text: typeof l.text === "string" ? l.text : "",
                ctaLabel: typeof l.ctaLabel === "string" ? l.ctaLabel : "",
                ctaHref: typeof l.ctaHref === "string" ? l.ctaHref : "",
              }))
              .filter((l) => l.text.length > 0)
          : HOME_HERO_DEFAULTS.rotatingLines,
      }
    : HOME_HERO_DEFAULTS;

  const methRaw = (data.methodology ?? null) as Record<string, unknown> | null;
  const methodology: HomeMethodologyData | null = methRaw
    ? {
        cells: Array.isArray(methRaw.cells)
          ? (methRaw.cells as Array<Record<string, unknown>>).map((c) => ({
              label: typeof c.label === "string" ? c.label : "",
              title: typeof c.title === "string" ? c.title : "",
              description: typeof c.description === "string" ? c.description : "",
            }))
          : [],
      }
    : null;

  const secRaw = (data.homeSections ?? null) as Record<string, unknown> | null;
  const sections: HomeSectionsData | null = secRaw
    ? {
        sections: Array.isArray(secRaw.sections)
          ? (secRaw.sections as Array<Record<string, unknown>>).map((s) => ({
              filterKey: typeof s.filterKey === "string" ? s.filterKey : "",
              trackName: typeof s.trackName === "string" ? s.trackName : "",
              headerHighlight: typeof s.headerHighlight === "string" ? s.headerHighlight : "",
              mobileTitle: typeof s.mobileTitle === "string" ? s.mobileTitle : "",
              description: typeof s.description === "string" ? s.description : "",
              catalogLabel: typeof s.catalogLabel === "string" ? s.catalogLabel : "Все продукты",
              hiddenCardSlugs: Array.isArray(s.hiddenCardSlugs)
                ? (s.hiddenCardSlugs as unknown[]).filter((x): x is string => typeof x === "string")
                : [],
            }))
          : [],
      }
    : null;

  return { hero, methodology, sections };
}
