import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { resolveExperts, getExpertBySlug, type ExpertData } from "./experts";
import type {
  Factoid,
  AboutParagraph,
  AccordionItem,
  ProcessData,
  ToolsData,
  ForWhomData,
  AboutRocketmindData,
} from "./products";

// ── Types ──────────────────────────────────────────────────────────────────────

export type AboutHeroData = {
  caption: string;
  title: string;
  description: string;
  /** Structured paragraphs — supersede `description` when non-empty. */
  paragraphs?: AboutParagraph[];
  ctaText: string;
  factoids: Factoid[];
  experts: ExpertData[];
  /** Large uppercase h1 (white). */
  heading?: string;
  /** Optional secondary gray subtitle rendered under the heading. */
  headingSecondary?: string;
  /** When true, description renders full-width below the heading instead of to its right on desktop. */
  descriptionBelow?: boolean;
  /** Max number of expert avatars to show. Shows all if absent. */
  maxExperts?: number;
  /** Toggle for the experts strip. Default true. */
  showExperts?: boolean;
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

export type ContactSocialKind = "vk" | "telegram" | "max" | "custom";

export type ContactSocial = {
  id: string;
  kind: ContactSocialKind;
  iconSrc?: string;
  username: string;
  url: string;
};

export type ContactPerson = {
  avatar: string | null;
  name: string;
  role: string;
  phone?: string;
  social?: {
    kind: ContactSocialKind;
    iconSrc?: string;
    username: string;
    url: string;
  };
};

export type ContactCardItem =
  | { id: string; kind: "paragraph"; paragraph: AboutParagraph }
  | { id: string; kind: "socials"; socials: ContactSocial[] }
  | { id: string; kind: "person"; person: ContactPerson };

export type ContactCard = {
  id: string;
  title: string;
  items: ContactCardItem[];
};

export type ContactsData = {
  tag: string;
  title: string;
  titleSecondary?: string;
  paragraphs?: AboutParagraph[];
  cards: ContactCard[];
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
  contacts: ContactsData | null;
  aboutRocketmind: AboutRocketmindData | null;
  aboutRocketmindEnabled: boolean;
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
        const o = p as { text?: unknown; uppercase?: unknown; color?: unknown };
        if (typeof o.text === "string") {
          const color = o.color === "primary" || o.color === "secondary" ? o.color : undefined;
          return { text: o.text, uppercase: o.uppercase === true, ...(color ? { color } : {}) };
        }
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

function rid() { return Math.random().toString(36).slice(2, 10); }

function normaliseSocial(raw: unknown): ContactSocial | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const kind =
    o.kind === "vk" || o.kind === "telegram" || o.kind === "max" || o.kind === "custom"
      ? o.kind
      : null;
  if (!kind) return null;
  return {
    id: typeof o.id === "string" ? o.id : rid(),
    kind,
    iconSrc: typeof o.iconSrc === "string" ? o.iconSrc : undefined,
    username: typeof o.username === "string" ? o.username : "",
    url: typeof o.url === "string" ? o.url : "",
  };
}

function normalisePersonSocial(raw: unknown): ContactPerson["social"] | undefined {
  const s = normaliseSocial(raw);
  if (!s) return undefined;
  const { id: _id, ...rest } = s;
  return rest;
}

function normaliseContactItem(raw: unknown): ContactCardItem | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id : rid();
  if (o.kind === "paragraph") {
    const p = normaliseParagraphs([o.paragraph])[0] ?? { text: "", uppercase: false };
    return { id, kind: "paragraph", paragraph: p };
  }
  if (o.kind === "socials") {
    const socials = Array.isArray(o.socials)
      ? (o.socials as unknown[]).map(normaliseSocial).filter((s): s is ContactSocial => s !== null)
      : [];
    return { id, kind: "socials", socials };
  }
  if (o.kind === "person") {
    const p = (o.person && typeof o.person === "object" ? o.person : {}) as Record<string, unknown>;
    const expertSlug = typeof p.expertSlug === "string" ? p.expertSlug : "";
    const resolved = expertSlug ? getExpertBySlug(expertSlug) : null;
    const person: ContactPerson = {
      avatar: resolved?.image ?? (typeof p.avatarSrc === "string" ? p.avatarSrc : null),
      name: resolved?.name ?? (typeof p.name === "string" ? p.name : ""),
      role: resolved?.shortBio ?? resolved?.tag ?? (typeof p.role === "string" ? p.role : ""),
      phone: typeof p.phone === "string" && p.phone ? p.phone : undefined,
      social: normalisePersonSocial(p.social),
    };
    return { id, kind: "person", person };
  }
  return null;
}

function normaliseContacts(raw: unknown): ContactsData | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const cards = Array.isArray(o.cards)
    ? (o.cards as unknown[])
        .map((c): ContactCard | null => {
          if (!c || typeof c !== "object") return null;
          const co = c as Record<string, unknown>;
          const items = Array.isArray(co.items)
            ? (co.items as unknown[]).map(normaliseContactItem).filter((i): i is ContactCardItem => i !== null)
            : [];
          return {
            id: typeof co.id === "string" ? co.id : rid(),
            title: typeof co.title === "string" ? co.title : "",
            items,
          };
        })
        .filter((c): c is ContactCard => c !== null)
    : [];
  return {
    tag: typeof o.tag === "string" ? o.tag : "",
    title: typeof o.title === "string" ? o.title : "",
    titleSecondary: typeof o.titleSecondary === "string" ? o.titleSecondary : undefined,
    paragraphs: normaliseParagraphs(o.paragraphs),
    cards,
  };
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
    paragraphs: normaliseParagraphs(heroRaw.paragraphs),
    ctaText: (heroRaw.ctaText as string) ?? "связаться с нами",
    factoids: Array.isArray(heroRaw.factoids) ? (heroRaw.factoids as Factoid[]) : [],
    experts: resolveExperts(heroExpertSlugs),
    heading: typeof heroRaw.heading === "string" ? heroRaw.heading : undefined,
    headingSecondary: typeof heroRaw.headingSecondary === "string" ? heroRaw.headingSecondary : undefined,
    descriptionBelow: heroRaw.descriptionBelow === true,
    maxExperts: typeof heroRaw.maxExperts === "number" ? heroRaw.maxExperts : undefined,
    showExperts: heroRaw.showExperts !== false,
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
    contacts: normaliseContacts(data.contacts),
    aboutRocketmind:
      data.aboutRocketmind && typeof data.aboutRocketmind === "object"
        ? (data.aboutRocketmind as AboutRocketmindData)
        : null,
    aboutRocketmindEnabled: data.aboutRocketmind !== false,
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
