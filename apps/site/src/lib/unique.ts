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

export function getAboutPage(): AboutPageData | null {
  const filePath = path.join(UNIQUE_DIR, "rocketmind.md");
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);
  const slug = data.slug || "rocketmind";

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
          return {
            id: typeof cell.id === "string" ? cell.id : Math.random().toString(36).slice(2),
            src: cell.src,
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
