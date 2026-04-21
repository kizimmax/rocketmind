import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { resolveExperts, type ExpertData } from "./experts";

// ── Types ──────────────────────────────────────────────────────────────────────

export type Factoid = {
  number: string;
  label: string;
  text: string;
};

export type HeroTag = {
  text: string;
  icon?: string;
};

// Unified styled paragraph with caps + color toggles, used across all blocks.
export type StyledParagraph = {
  text: string;
  uppercase?: boolean;
  color?: "primary" | "secondary";
};

export type ProductHeroData = {
  caption: string;
  title: string;
  titleSecondary?: string;
  /** Legacy single-string description. Prefer `paragraphs`. */
  description: string;
  /** Structured paragraphs under the title. Supersedes `description` when non-empty. */
  paragraphs?: StyledParagraph[];
  ctaText: string;
  factoids: Factoid[];
  /** Optional tags shown next to caption (e.g. "при поддержке PIK") */
  tags?: HeroTag[];
  /** Optional secondary ghost-style button text */
  secondaryCta?: string;
  /** Audio data URL (base64) from CMS */
  audioData?: string;
  /** Optional quote shown under experts block (expert-product variant only) */
  quote?: string;
};

export type AccordionItem = {
  title: string;
  paragraphs: string[];
};

export type AboutParagraph = StyledParagraph;

export type AboutProductData = {
  caption: string;
  title: string;
  titleSecondary?: string;
  paragraphs: StyledParagraph[];
  accordion: AccordionItem[];
  /** If false, items are always expanded (no click-to-collapse). Default: true. */
  accordionCollapsible: boolean;
  /** Whether an image is shown (resolved from filesystem) */
  hasImage: boolean;
  /** If true, image is on the left; otherwise on the right. Default: false. */
  imageLeft: boolean;
  /** If true, paragraphs render in right column above accordion. Default: false. */
  paragraphsRight: boolean;
};

export type ForWhomFact = {
  title: string;
  text: string;
};

export type ForWhomData = {
  tag: string;
  title: string;
  titleSecondary?: string;
  /** Legacy single-string subtitle. Prefer `paragraphs`. */
  subtitle?: string;
  /** Structured paragraphs under the title. On this block default = primary + caps (light bg). */
  paragraphs?: StyledParagraph[];
  facts: ForWhomFact[];
  wideColumn?: "left" | "right";
};

export type ProcessStep = {
  number: string;
  title: string;
  text: string;
  duration: string;
};

export type ProcessParticipant = {
  role: string;
  text: string;
};

/** @deprecated Use StyledParagraph. */
export type ProcessDescriptionParagraph = StyledParagraph;

export type ProcessData = {
  tag: string;
  title: string;
  titleSecondary?: string;
  subtitle: string;
  /** If true (default), subtitle renders in uppercase label-18 mono. */
  subtitleUppercase?: boolean;
  /** Legacy single-string description. Prefer `paragraphs`. */
  description?: string;
  /** @deprecated Legacy alias for `paragraphs`. */
  descriptionParagraphs?: StyledParagraph[];
  /** Structured paragraphs under the title with per-paragraph caps + color toggles. */
  paragraphs?: StyledParagraph[];
  steps: ProcessStep[];
  participantsTag?: string;
  participants?: ProcessParticipant[];
  variant?: "product" | "academy";
};

export type ResultCardData = {
  title: string;
  text: string;
};

export type ServiceCardData = {
  title: string;
  paragraphs: string[];
  showArrow?: boolean;
  href?: string;
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
  featured?: boolean;
  paragraphsTwoCol?: boolean;
};

export type ServicesData = {
  tag?: string;
  title: string;
  titleSecondary?: string;
  /** Legacy single-string description. Prefer `paragraphs`. */
  description?: string;
  /** Structured paragraphs under the title. */
  paragraphs?: StyledParagraph[];
  cards: ServiceCardData[];
};

export type ResultsData = {
  tag: string;
  title: string;
  titleSecondary?: string;
  /** Legacy single-string description. Prefer `paragraphs`. */
  description?: string;
  /** Structured paragraphs under the title. */
  paragraphs?: StyledParagraph[];
  cards: ResultCardData[];
};

export type { ExpertData };

export type ToolCardData = {
  number: string;
  title: string;
  text: string;
  icon?: string | null;
};

export type ToolsData = {
  tag: string;
  title: string;
  titleSecondary?: string;
  /** Legacy single-string description. Prefer `paragraphs`. */
  description?: string;
  /** Structured paragraphs under the title. */
  paragraphs?: StyledParagraph[];
  useIcons?: boolean;
  descriptionBelow?: boolean;
  tools: ToolCardData[];
};

export type AboutRocketmindData = {
  heading: string;
  founderName: string;
  founderBio: string;
  founderRole: string;
  canvasTitle?: string;
  canvasText?: string;
  features: Array<{ title: string; text: string }>;
  leftVariant?: "alex" | "canvas";
  alexPhoto?: string;
  canvasPhoto?: string;
};

export type CustomSectionData = {
  id: string;
  /** Built-in block type after which this section renders (null = very top). */
  insertAfter: string | null;
  enabled: boolean;
  about: AboutProductData;
};

export type ProductData = {
  slug: string;
  category: string;
  // Menu / Navigation
  menuTitle: string;
  menuDescription: string;
  // Product Card
  cardTitle: string;
  cardDescription: string;
  // SEO
  metaTitle: string;
  metaDescription: string;
  // Hero
  hero: ProductHeroData;
  // About product
  about: AboutProductData | null;
  // For whom
  audience: ForWhomData | null;
  // Tools
  tools: ToolsData | null;
  // Results
  results: ResultsData | null;
  // Services (optional bento grid)
  services: ServicesData | null;
  // Process
  process: ProcessData | null;
  // Experts
  experts: ExpertData[] | null;
  // About Rocketmind (CMS-editable)
  aboutRocketmind: AboutRocketmindData | null;
  /** Whether the "About Rocketmind" block is shown (default: true; disabled if frontmatter `aboutRocketmind: false`) */
  aboutRocketmindEnabled: boolean;
  /** Whether the partner logo marquee is shown (default: true; disabled if frontmatter `logoMarquee: false`) */
  logoMarqueeEnabled: boolean;
  /** Explicit flag — treats this as an "expert product" (shows tag, moves description up, renders experts block in hero). Defaults to `experts.length > 0` if unset. */
  expertProduct: boolean;
  // Image paths (auto-resolved)
  coverImage: string;
  /** Resolved cover image path (null if file doesn't exist) */
  heroImage: string | null;
  aboutImage: string | null;
  /** User-inserted custom sections (universal "О продукте"-style blocks). */
  customSections: CustomSectionData[];
};

// ── Paths ──────────────────────────────────────────────────────────────────────

const PRODUCTS_DIR = path.join(process.cwd(), "content", "products");
const CONTENT_DIRS: Record<string, string> = {
  consulting: path.join(process.cwd(), "content", "products"),
  academy: path.join(process.cwd(), "content", "academy"),
  "ai-products": path.join(process.cwd(), "content", "ai-products"),
  cases: path.join(process.cwd(), "content", "cases"),
  media: path.join(process.cwd(), "content", "media"),
};
const PUBLIC_DIR = path.join(process.cwd(), "public");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Auto-resolve product asset by role.
 *
 * Convention:
 *   /images/products/<category>/<slug>/cover.svg
 *   /images/products/<category>/<slug>/about.jpg
 *   /images/products/<category>/<slug>/audio.mp3
 */
function resolveAsset(
  category: string,
  slug: string,
  role: string,
  extensions: string[],
): string | null {
  const base = `/images/products/${category}/${slug}/${role}`;
  for (const ext of extensions) {
    if (fs.existsSync(path.join(PUBLIC_DIR, base + ext))) {
      return BASE_PATH + base + ext;
    }
  }
  return null;
}

function resolveImage(category: string, slug: string, role: string): string | null {
  return resolveAsset(category, slug, role, [".svg", ".png", ".jpg", ".webp"]);
}

function resolveAudio(category: string, slug: string): string | null {
  return resolveAsset(category, slug, "audio", [".mp3", ".wav", ".ogg", ".m4a", ".webm"]);
}

// ── API ────────────────────────────────────────────────────────────────────────

export function getProductBySlug(slug: string, category?: string): ProductData | null {
  // Try category-specific dir first, fall back to products dir
  let filePath = path.join(PRODUCTS_DIR, `${slug}.md`);
  if (category && CONTENT_DIRS[category]) {
    const catPath = path.join(CONTENT_DIRS[category], `${slug}.md`);
    if (fs.existsSync(catPath)) filePath = catPath;
  }
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  const staticCover = resolveImage(data.category, data.slug, "cover");
  const staticAbout = resolveImage(data.category, data.slug, "about");

  const staticAudio = resolveAudio(data.category, data.slug);

  const coverImage =
    staticCover ??
    `${BASE_PATH}/images/products/${data.category}/${data.slug}/cover.svg`;

  const heroImage = staticCover ?? null;
  const aboutImage = staticAbout ?? null;

  const legacyUppercase = data.about?.paragraphsUppercase === true;
  const aboutParagraphs: AboutParagraph[] = data.about
    ? Array.isArray(data.about.paragraphs) && data.about.paragraphs.length > 0
      ? data.about.paragraphs
          .map((p: unknown): AboutParagraph | null => {
            if (typeof p === "string") return { text: p, uppercase: legacyUppercase };
            if (p && typeof p === "object") {
              const o = p as { text?: unknown; uppercase?: unknown };
              if (typeof o.text === "string")
                return { text: o.text, uppercase: o.uppercase === true || legacyUppercase };
            }
            return null;
          })
          .filter((p: AboutParagraph | null): p is AboutParagraph => p !== null)
      : typeof data.about.description === "string" && data.about.description
        ? [{ text: data.about.description, uppercase: legacyUppercase }]
        : []
    : [];

  const aboutAccordion: AccordionItem[] = data.about
    ? (data.about.accordion ?? []).map(
        (item: { title?: string; paragraphs?: unknown; description?: unknown }) => {
          const itemParagraphs: string[] =
            Array.isArray(item.paragraphs) && item.paragraphs.length > 0
              ? item.paragraphs.filter(
                  (p: unknown): p is string => typeof p === "string",
                )
              : typeof item.description === "string" && item.description
                ? [item.description]
                : [];
          return { title: item.title ?? "", paragraphs: itemParagraphs };
        },
      )
    : [];

  const about: AboutProductData | null = data.about
    ? {
        caption: data.about.caption,
        title: data.about.title,
        titleSecondary: data.about.titleSecondary,
        paragraphs: aboutParagraphs,
        accordion: aboutAccordion,
        accordionCollapsible: data.about.accordionCollapsible !== false,
        hasImage: aboutImage !== null,
        imageLeft: data.about.imageLeft === true,
        paragraphsRight: data.about.paragraphsRight === true,
      }
    : null;

  // ── Custom sections (user-inserted "О продукте"-style blocks) ──
  function parseAboutLike(raw: unknown): AboutProductData {
    const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
    const rawParagraphs: AboutParagraph[] = Array.isArray(r.paragraphs)
      ? (r.paragraphs as unknown[])
          .map((p): AboutParagraph | null => {
            if (typeof p === "string") return { text: p, uppercase: false };
            if (p && typeof p === "object") {
              const o = p as { text?: unknown; uppercase?: unknown };
              if (typeof o.text === "string")
                return { text: o.text, uppercase: o.uppercase === true };
            }
            return null;
          })
          .filter((p: AboutParagraph | null): p is AboutParagraph => p !== null)
      : [];
    const rawAccordion: AccordionItem[] = Array.isArray(r.accordion)
      ? (r.accordion as Array<{ title?: string; paragraphs?: unknown }>).map((item) => ({
          title: item.title ?? "",
          paragraphs: Array.isArray(item.paragraphs)
            ? item.paragraphs.filter((p): p is string => typeof p === "string")
            : [],
        }))
      : [];
    return {
      caption: typeof r.caption === "string" ? r.caption : "",
      title: typeof r.title === "string" ? r.title : "",
      titleSecondary: typeof r.titleSecondary === "string" ? r.titleSecondary : undefined,
      paragraphs: rawParagraphs,
      accordion: rawAccordion,
      accordionCollapsible: r.accordionCollapsible !== false,
      hasImage: false,
      imageLeft: r.imageLeft === true,
      paragraphsRight: r.paragraphsRight === true,
    };
  }

  const customSections: CustomSectionData[] = Array.isArray(data.customSections)
    ? (data.customSections as Array<{ id?: unknown; insertAfter?: unknown; enabled?: unknown; data?: unknown }>)
        .filter((cs) => cs && typeof cs === "object" && cs.enabled !== false)
        .map((cs, i) => ({
          id: typeof cs.id === "string" ? cs.id : `cs_${i}`,
          insertAfter:
            typeof cs.insertAfter === "string" && cs.insertAfter.length > 0 ? cs.insertAfter : null,
          enabled: cs.enabled !== false,
          about: parseAboutLike(cs.data),
        }))
    : [];

  // Strip base64 blobs — assets are now resolved from filesystem
  const { heroImageData: _h, audioData: _a, audioFilename: _af, ...heroClean } = data.hero ?? {};

  return {
    slug: data.slug,
    category: data.category,
    menuTitle: data.menuTitle,
    menuDescription: data.menuDescription,
    cardTitle: data.cardTitle,
    cardDescription: data.cardDescription,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    hero: {
      ...heroClean,
      title: (data.hero.title as string).trimEnd(),
      audioData: staticAudio ?? undefined,
    },
    about,
    audience: data.audience ?? null,
    tools: data.tools ?? null,
    results: data.results ?? null,
    services: data.services ?? null,
    process: data.process ?? null,
    experts: Array.isArray(data.experts) && data.experts.length > 0
      ? resolveExperts(data.experts as string[])
      : null,
    aboutRocketmind:
      data.aboutRocketmind && typeof data.aboutRocketmind === "object"
        ? data.aboutRocketmind
        : null,
    aboutRocketmindEnabled: data.aboutRocketmind !== false,
    logoMarqueeEnabled: data.logoMarquee !== false,
    expertProduct:
      typeof data.expertProduct === "boolean"
        ? data.expertProduct
        : Array.isArray(data.experts) && data.experts.length > 0,
    coverImage,
    heroImage,
    aboutImage,
    customSections,
  };
}

export function getAllProducts(): ProductData[] {
  if (!fs.existsSync(PRODUCTS_DIR)) return [];

  return fs
    .readdirSync(PRODUCTS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => getProductBySlug(f.replace(/\.md$/, "")))
    .filter(Boolean) as ProductData[];
}

export function getProductsByCategory(category: string): ProductData[] {
  return getAllProducts().filter((p) => p.category === category);
}

/**
 * Load all products from all content directories (consulting, academy, ai-products).
 */
export function getAllCatalogProducts(): ProductData[] {
  const results: ProductData[] = [];
  const productCategories = ["consulting", "academy", "ai-products"];

  for (const cat of productCategories) {
    const dir = CONTENT_DIRS[cat];
    if (!dir || !fs.existsSync(dir)) continue;

    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

    for (const f of files) {
      const slug = f.replace(/\.md$/, "");
      const product = getProductBySlug(slug, cat);
      if (product) results.push(product);
    }
  }

  return results;
}
