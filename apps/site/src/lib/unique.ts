import { prisma } from "./prisma";
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
  caption: string; title: string; description: string;
  paragraphs?: AboutParagraph[]; ctaText: string;
  factoids: Factoid[]; experts: ExpertData[];
  heading?: string; headingSecondary?: string;
  descriptionBelow?: boolean; maxExperts?: number; showExperts?: boolean;
};

export type AboutMainData = {
  caption: string; title: string; titleSecondary?: string;
  paragraphs: AboutParagraph[]; accordion: AccordionItem[];
  accordionCollapsible: boolean; hasImage: boolean;
  imageLeft: boolean; paragraphsRight: boolean;
};

export type LogoGridCell = {
  id: string; src: string; alt?: string; size: "S" | "M" | "L"; padding?: number;
};

export type ProjectsBlockData = {
  caption: string; title: string; titleSecondary?: string;
  paragraphs: AboutParagraph[]; accordion: AccordionItem[];
  logoGrid: LogoGridCell[];
};

export type ContactSocialKind = "vk" | "telegram" | "max" | "custom";
export type ContactSocial = { id: string; kind: ContactSocialKind; iconSrc?: string; username: string; url: string };
export type ContactPerson = {
  avatar: string | null; name: string; role: string; phone?: string;
  social?: { kind: ContactSocialKind; iconSrc?: string; username: string; url: string };
};
export type ContactCardItem =
  | { id: string; kind: "paragraph"; paragraph: AboutParagraph }
  | { id: string; kind: "socials"; socials: ContactSocial[] }
  | { id: string; kind: "person"; person: ContactPerson };
export type ContactCard = { id: string; title: string; items: ContactCardItem[] };
export type ContactsData = {
  tag: string; title: string; titleSecondary?: string;
  paragraphs?: AboutParagraph[]; cards: ContactCard[];
};

export type AboutPageData = {
  slug: string; metaTitle: string; metaDescription: string;
  hero: AboutHeroData; about: AboutMainData | null; tools: ToolsData | null;
  projects: ProjectsBlockData | null; process: ProcessData | null;
  experts: ExpertData[]; audience: ForWhomData | null; contacts: ContactsData | null;
  aboutRocketmind: AboutRocketmindData | null; aboutRocketmindEnabled: boolean;
  aboutImage: string | null;
};

// ── Home page types ────────────────────────────────────────────────────────────

export type HomeHeroRotatingLine = { text: string; ctaLabel: string; ctaHref: string; formId?: string };
export type HomeHeroData = { title: string; pikCaption: string; rotatingLines: HomeHeroRotatingLine[] };
export type HomeMethodologyCell = { label: string; title: string; description: string };
export type HomeMethodologyData = { cells: HomeMethodologyCell[] };
export type HomeSectionItem = {
  filterKey: string; trackName: string; headerHighlight: string;
  mobileTitle: string; description: string; catalogLabel: string; hiddenCardSlugs: string[];
};
export type HomeSectionsData = { sections: HomeSectionItem[] };
export type HomePageData = {
  hero: HomeHeroData | null; methodology: HomeMethodologyData | null; sections: HomeSectionsData | null;
};

// ── Parsers ────────────────────────────────────────────────────────────────────

function normaliseParagraphs(raw: unknown): AboutParagraph[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((p): AboutParagraph | null => {
    if (typeof p === "string") return { text: p, uppercase: false };
    if (p && typeof p === "object") {
      const o = p as { text?: unknown; uppercase?: unknown; color?: unknown };
      if (typeof o.text === "string") {
        const color = o.color === "primary" || o.color === "secondary" ? o.color : undefined;
        return { text: o.text, uppercase: o.uppercase === true, ...(color ? { color } : {}) };
      }
    }
    return null;
  }).filter((p): p is AboutParagraph => p !== null);
}

function normaliseAccordion(raw: unknown): AccordionItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const i = item as { title?: string; paragraphs?: unknown };
    const paragraphs = Array.isArray(i.paragraphs) ? (i.paragraphs as unknown[]).filter((p): p is string => typeof p === "string") : [];
    return { title: i.title ?? "", paragraphs };
  });
}

function rid() { return Math.random().toString(36).slice(2, 10); }

function normaliseSocial(raw: unknown): ContactSocial | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const kind = o.kind === "vk" || o.kind === "telegram" || o.kind === "max" || o.kind === "custom" ? o.kind : null;
  if (!kind) return null;
  return { id: typeof o.id === "string" ? o.id : rid(), kind, iconSrc: typeof o.iconSrc === "string" ? o.iconSrc : undefined, username: typeof o.username === "string" ? o.username : "", url: typeof o.url === "string" ? o.url : "" };
}

function normalisePersonSocial(raw: unknown): ContactPerson["social"] | undefined {
  const s = normaliseSocial(raw);
  if (!s) return undefined;
  const { id: _id, ...rest } = s;
  return rest;
}

async function normaliseContactItem(raw: unknown): Promise<ContactCardItem | null> {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id : rid();
  if (o.kind === "paragraph") {
    const p = normaliseParagraphs([o.paragraph])[0] ?? { text: "", uppercase: false };
    return { id, kind: "paragraph", paragraph: p };
  }
  if (o.kind === "socials") {
    const socials = Array.isArray(o.socials) ? (o.socials as unknown[]).map(normaliseSocial).filter((s): s is ContactSocial => s !== null) : [];
    return { id, kind: "socials", socials };
  }
  if (o.kind === "person") {
    const p = (o.person && typeof o.person === "object" ? o.person : {}) as Record<string, unknown>;
    const expertSlug = typeof p.expertSlug === "string" ? p.expertSlug : "";
    const resolved = expertSlug ? await getExpertBySlug(expertSlug) : null;
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

async function normaliseContacts(raw: unknown): Promise<ContactsData | null> {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const cards: ContactCard[] = [];
  if (Array.isArray(o.cards)) {
    for (const c of o.cards) {
      if (!c || typeof c !== "object") continue;
      const co = c as Record<string, unknown>;
      const items: ContactCardItem[] = [];
      if (Array.isArray(co.items)) {
        for (const item of co.items) {
          const normalised = await normaliseContactItem(item);
          if (normalised) items.push(normalised);
        }
      }
      cards.push({ id: typeof co.id === "string" ? co.id : rid(), title: typeof co.title === "string" ? co.title : "", items });
    }
  }
  return { tag: typeof o.tag === "string" ? o.tag : "", title: typeof o.title === "string" ? o.title : "", titleSecondary: typeof o.titleSecondary === "string" ? o.titleSecondary : undefined, paragraphs: normaliseParagraphs(o.paragraphs), cards };
}

async function buildAboutPage(page: { slug: string; content: unknown; metaTitle: string; metaDescription: string }): Promise<AboutPageData> {
  const data = (page.content && typeof page.content === "object" ? page.content : {}) as Record<string, unknown>;

  const heroRaw = (data.hero && typeof data.hero === "object" ? data.hero : {}) as Record<string, unknown>;
  const heroExpertSlugs = Array.isArray(heroRaw.experts) ? (heroRaw.experts as string[]) : [];
  const heroExperts = await resolveExperts(heroExpertSlugs);

  const hero: AboutHeroData = {
    caption: typeof heroRaw.caption === "string" ? heroRaw.caption : "",
    title: (typeof heroRaw.title === "string" ? heroRaw.title : "").trimEnd(),
    description: typeof heroRaw.description === "string" ? heroRaw.description : "",
    paragraphs: normaliseParagraphs(heroRaw.paragraphs),
    ctaText: typeof heroRaw.ctaText === "string" ? heroRaw.ctaText : "связаться с нами",
    factoids: Array.isArray(heroRaw.factoids) ? (heroRaw.factoids as Factoid[]) : [],
    experts: heroExperts,
    heading: typeof heroRaw.heading === "string" ? heroRaw.heading : undefined,
    headingSecondary: typeof heroRaw.headingSecondary === "string" ? heroRaw.headingSecondary : undefined,
    descriptionBelow: heroRaw.descriptionBelow === true,
    maxExperts: typeof heroRaw.maxExperts === "number" ? heroRaw.maxExperts : undefined,
    showExperts: heroRaw.showExperts !== false,
  };

  const aboutRaw = data.about && typeof data.about === "object" ? (data.about as Record<string, unknown>) : null;
  const aboutImageUrl = aboutRaw && typeof aboutRaw.aboutImageData === "string" && aboutRaw.aboutImageData.startsWith("http") ? aboutRaw.aboutImageData : null;
  const about: AboutMainData | null = aboutRaw ? {
    caption: typeof aboutRaw.caption === "string" ? aboutRaw.caption : "",
    title: typeof aboutRaw.title === "string" ? aboutRaw.title : "",
    titleSecondary: typeof aboutRaw.titleSecondary === "string" ? aboutRaw.titleSecondary : undefined,
    paragraphs: normaliseParagraphs(aboutRaw.paragraphs),
    accordion: normaliseAccordion(aboutRaw.accordion),
    accordionCollapsible: aboutRaw.accordionCollapsible !== false,
    hasImage: aboutImageUrl !== null,
    imageLeft: aboutRaw.imageLeft === true,
    paragraphsRight: aboutRaw.paragraphsRight === true,
  } : null;

  const projectsRaw = data.projects && typeof data.projects === "object" ? (data.projects as Record<string, unknown>) : null;
  const logoGridRaw = (projectsRaw?.logoGrid && typeof projectsRaw.logoGrid === "object" ? projectsRaw.logoGrid : {}) as { cells?: unknown };
  const cells: LogoGridCell[] = Array.isArray(logoGridRaw.cells) ? logoGridRaw.cells.map((c): LogoGridCell | null => {
    const cell = c as { id?: unknown; src?: unknown; alt?: unknown; size?: unknown; padding?: unknown };
    if (typeof cell.src !== "string" || !cell.src) return null;
    return { id: typeof cell.id === "string" ? cell.id : Math.random().toString(36).slice(2), src: cell.src, alt: typeof cell.alt === "string" ? cell.alt : undefined, size: cell.size === "S" || cell.size === "L" ? cell.size : "M", padding: typeof cell.padding === "number" ? cell.padding : undefined };
  }).filter((c): c is LogoGridCell => c !== null) : [];

  const projects: ProjectsBlockData | null = projectsRaw ? {
    caption: typeof projectsRaw.caption === "string" ? projectsRaw.caption : "",
    title: typeof projectsRaw.title === "string" ? projectsRaw.title : "",
    titleSecondary: typeof projectsRaw.titleSecondary === "string" ? projectsRaw.titleSecondary : undefined,
    paragraphs: normaliseParagraphs(projectsRaw.paragraphs),
    accordion: normaliseAccordion(projectsRaw.accordion ?? []),
    logoGrid: cells,
  } : null;

  const pageExpertSlugs = Array.isArray(data.experts) ? (data.experts as unknown[]).filter((s): s is string => typeof s === "string") : [];
  const pageExperts = await resolveExperts(pageExpertSlugs);

  return {
    slug: page.slug,
    metaTitle: page.metaTitle || "",
    metaDescription: page.metaDescription || "",
    hero,
    about,
    tools: data.tools && typeof data.tools === "object" ? (data.tools as ToolsData) : null,
    projects,
    process: data.process && typeof data.process === "object" ? (data.process as ProcessData) : null,
    experts: pageExperts,
    audience: data.audience && typeof data.audience === "object" ? (data.audience as ForWhomData) : null,
    contacts: await normaliseContacts(data.contacts),
    aboutRocketmind: data.aboutRocketmind && typeof data.aboutRocketmind === "object" ? (data.aboutRocketmind as AboutRocketmindData) : null,
    aboutRocketmindEnabled: data.aboutRocketmind !== false,
    aboutImage: aboutImageUrl,
  };
}

// ── API ────────────────────────────────────────────────────────────────────────

export async function getAboutPage(): Promise<AboutPageData | null> {
  try {
    const page = await prisma.page.findFirst({ where: { category: "unique", slug: { in: ["about", "rocketmind"] } } });
    if (!page) return null;
    return buildAboutPage(page);
  } catch {
    return null;
  }
}

export async function getCasesIndexPage(): Promise<AboutPageData | null> {
  try {
    const page = await prisma.page.findFirst({ where: { category: "unique", slug: "cases-index" } });
    if (!page) return null;
    return buildAboutPage(page);
  } catch {
    return null;
  }
}

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

export async function getHomePage(): Promise<HomePageData> {
  try {
    const page = await prisma.page.findFirst({ where: { category: "unique", slug: "home" } });
    if (!page) return { hero: HOME_HERO_DEFAULTS, methodology: null, sections: null };

    const data = (page.content && typeof page.content === "object" ? page.content : {}) as Record<string, unknown>;

    const heroRaw = data.homeHero && typeof data.homeHero === "object" ? (data.homeHero as Record<string, unknown>) : null;
    const hero: HomeHeroData = heroRaw ? {
      title: typeof heroRaw.title === "string" ? heroRaw.title : HOME_HERO_DEFAULTS.title,
      pikCaption: typeof heroRaw.pikCaption === "string" ? heroRaw.pikCaption : HOME_HERO_DEFAULTS.pikCaption,
      rotatingLines: Array.isArray(heroRaw.rotatingLines)
        ? (heroRaw.rotatingLines as Array<Record<string, unknown>>).map((l): HomeHeroRotatingLine => ({ text: typeof l.text === "string" ? l.text : "", ctaLabel: typeof l.ctaLabel === "string" ? l.ctaLabel : "", ctaHref: typeof l.ctaHref === "string" ? l.ctaHref : "", ...(typeof l.formId === "string" && l.formId ? { formId: l.formId } : {}) })).filter((l) => l.text.length > 0)
        : HOME_HERO_DEFAULTS.rotatingLines,
    } : HOME_HERO_DEFAULTS;

    const methRaw = data.methodology && typeof data.methodology === "object" ? (data.methodology as Record<string, unknown>) : null;
    const methodology: HomeMethodologyData | null = methRaw ? {
      cells: Array.isArray(methRaw.cells) ? (methRaw.cells as Array<Record<string, unknown>>).map((c) => ({ label: typeof c.label === "string" ? c.label : "", title: typeof c.title === "string" ? c.title : "", description: typeof c.description === "string" ? c.description : "" })) : [],
    } : null;

    const secRaw = data.homeSections && typeof data.homeSections === "object" ? (data.homeSections as Record<string, unknown>) : null;
    const sections: HomeSectionsData | null = secRaw ? {
      sections: Array.isArray(secRaw.sections) ? (secRaw.sections as Array<Record<string, unknown>>).map((s) => ({
        filterKey: typeof s.filterKey === "string" ? s.filterKey : "",
        trackName: typeof s.trackName === "string" ? s.trackName : "",
        headerHighlight: typeof s.headerHighlight === "string" ? s.headerHighlight : "",
        mobileTitle: typeof s.mobileTitle === "string" ? s.mobileTitle : "",
        description: typeof s.description === "string" ? s.description : "",
        catalogLabel: typeof s.catalogLabel === "string" ? s.catalogLabel : "Все продукты",
        hiddenCardSlugs: Array.isArray(s.hiddenCardSlugs) ? (s.hiddenCardSlugs as unknown[]).filter((x): x is string => typeof x === "string") : [],
      })) : [],
    } : null;

    return { hero, methodology, sections };
  } catch {
    return { hero: HOME_HERO_DEFAULTS, methodology: null, sections: null };
  }
}
