// ── Statuses ────────────────────────────────────────────────────────────────

export type PageStatus = "published" | "hidden" | "archived";

// ── Block types (mirror ServicePageTemplate block order) ────────────────────

export type BlockType =
  | "hero"
  | "homeHero"
  | "methodology"
  | "homeSections"
  | "logoMarquee"
  | "about"
  | "projects"
  | "audience"
  | "tools"
  | "results"
  | "process"
  | "services"
  | "experts"
  | "partnerships"
  | "aboutRocketmind"
  | "pageBottom"
  | "customSection"
  | "caseCard"
  | "casesList";

// ── Case-specific types ─────────────────────────────────────────────────────

export type CaseType = "big" | "mini";

export interface CaseCardStat {
  value: string;
  label: string;
  description: string;
}

export interface CaseCardBlockData {
  title: string;
  description: string;
  stats: CaseCardStat[];
  result: string;
}

// ── Testimonials ────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  paragraphs: string[];
  name: string;
  position: string;
  /** /images/testimonials/<id>.<ext> after persistence; data URL while editing. */
  avatar: string | null;
  order: number;
}

// ── Block data shapes (mirror apps/site/src/lib/products.ts) ────────────────

export interface HeroBlockData {
  caption: string;
  title: string;
  titleSecondary?: string;
  description: string;
  ctaText: string;
  factoids: Array<{ number: string; label: string; text: string }>;
  tags?: Array<{ text: string }>;
  secondaryCta?: string;
  /** Base64 data URL for hero background image (academy/ai-products) */
  heroImageData?: string;
  /** Base64 data URL for audio file */
  audioData?: string;
  /** Original filename of uploaded audio */
  audioFilename?: string;
  /** Optional quote shown under experts block (expert-product variant only). */
  quote?: string;
  /** Layout variant. "product" — default with title/caption/cta; "about" — minimal (description + experts strip + 2x2 factoids + marquee) for unique /about page. */
  variant?: "product" | "about";
  /** Factoid layout: "column" — 3-card column (default), "2x2" — 4-card 2×2 grid (about variant). */
  factoidsLayout?: "column" | "2x2";
  /** Experts shown in hero strip (slugs). Used for the "about" hero variant independently from the experts block. */
  experts?: string[];
}

export interface AboutParagraph {
  text: string;
  /** If true, this paragraph uses the uppercase label-18 style (mono, uppercase, tracked). */
  uppercase?: boolean;
}

export interface AboutBlockData {
  caption: string;
  title: string;
  titleSecondary?: string;
  paragraphs: AboutParagraph[];
  accordion: Array<{ title: string; paragraphs: string[] }>;
  /** Layout of image (when hasImage is true). Default: false (image on right). */
  imageLeft?: boolean;
  /** If true, paragraphs render in the right column above the accordion. Default: false (in left column under title). */
  paragraphsRight?: boolean;
  /** What to render in the media slot. "image" — upload via aboutImageData (default); "logoGrid" — editable logo grid; "none" — no media. */
  imageMode?: "image" | "logoGrid" | "none";
  /** Editable logo grid (active when imageMode = "logoGrid"). */
  logoGrid?: LogoGridData;
}

export interface LogoGridCell {
  id: string;
  /** Base64 data URL (admin) or /images/... path (persisted). */
  src: string;
  alt?: string;
  /** Bento size: S=1 col, M=2 cols, L=4 cols in a 4-col grid. Default S. */
  size?: "S" | "M" | "L";
  /** Logo padding inside cell in px. Default 20. Zoom in/out changes by 2px. */
  padding?: number;
}

export interface LogoGridData {
  cells: LogoGridCell[];
}

/** Projects block — about-clone with mandatory logoGrid media (used on /about unique page). */
export type ProjectsBlockData = AboutBlockData;

export interface AudienceBlockData {
  tag: string;
  title: string;
  titleSecondary?: string;
  subtitle?: string;
  wideColumn?: "left" | "right";
  facts: Array<{ title: string; text: string }>;
}

export interface ToolsBlockData {
  tag: string;
  title: string;
  titleSecondary?: string;
  description?: string;
  useIcons?: boolean;
  tools: Array<{ number: string; title: string; text: string; icon?: string | null; wide?: boolean }>;
}

export interface ResultsBlockData {
  tag: string;
  title: string;
  titleSecondary?: string;
  description?: string;
  cards: Array<{ title: string; text: string }>;
}

export interface ExpertsBlockData {
  /** Array of expert slugs referencing content/experts/{slug}.md */
  experts: string[];
}

export interface ServiceCard {
  title: string;
  paragraphs: string[];
  showArrow?: boolean;
  href?: string;
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
  featured?: boolean;
  paragraphsTwoCol?: boolean;
}

export interface ServicesBlockData {
  tag?: string;
  title: string;
  titleSecondary?: string;
  description?: string;
  cards: ServiceCard[];
}

export interface LogoMarqueeBlockData {
  // No editable fields — auto-rendered from /public/clip-logos/.
  // Visibility controlled by `block.enabled` flag in PageBlock.
  // Empty placeholder shape for type completeness.
  __placeholder?: never;
}

export interface PartnershipsBlockData {
  caption: string;
  title: string;
  description: string;
  logos: Array<{ src: string; alt: string }>;
  photos: Array<{ src: string; alt?: string }>;
}

export interface AboutRocketmindBlockData {
  heading: string;
  founderName: string;
  founderBio: string;
  founderRole: string;
  canvasTitle: string;
  canvasText: string;
  features: Array<{ title: string; text: string }>;
  variant: "dark" | "light";
  leftVariant: "alex" | "canvas";
}

// ── Home page (unique) blocks ───────────────────────────────────────────────

export interface HomeHeroRotatingLine {
  /** Серый подзаголовок, меняется по кругу. */
  text: string;
  /** Подпись CTA-кнопки, которая показывается одновременно с этой строкой. */
  ctaLabel: string;
  /** href CTA-кнопки. */
  ctaHref: string;
}

export interface HomeHeroBlockData {
  /** Первые две строки (сохраняются неизменными, разбиваются по \n). */
  title: string;
  /** Подпись под логотипом PIK (многострочная, \n сохраняется). */
  pikCaption: string;
  /** Ротирующиеся серые строчки + их CTA. */
  rotatingLines: HomeHeroRotatingLine[];
}

export interface MethodologyCell {
  /** Жёлтый label сверху ячейки. */
  label: string;
  /** Крупный заголовок ячейки. */
  title: string;
  /** Описание. */
  description: string;
}

export interface MethodologyBlockData {
  /** Ровно 3 ячейки: Методология, Синергия, Канвасы. */
  cells: MethodologyCell[];
}

export interface HomeSectionItem {
  /** Ключ фильтра /products — один из FILTER_KEYS. */
  filterKey: string;
  trackName: string;
  headerHighlight: string;
  /** Заголовок для мобильной версии (\n — перевод строки). */
  mobileTitle: string;
  description: string;
  catalogLabel: string;
  /** Слаги карточек, которые нужно СКРЫТЬ из соответствующего /products фильтра. */
  hiddenCardSlugs: string[];
}

export interface HomeSectionsBlockData {
  sections: HomeSectionItem[];
}

export interface ProcessBlockData {
  tag: string;
  title: string;
  titleSecondary?: string;
  subtitle: string;
  description?: string;
  steps: Array<{ number: string; title: string; text: string; duration: string }>;
  participantsTag?: string;
  participants?: Array<{ role: string; text: string }>;
}

// ── Block ───────────────────────────────────────────────────────────────────

export interface PageBlock {
  id: string;
  type: BlockType;
  enabled: boolean;
  order: number;
  data: Record<string, unknown>;
}

// ── Page ────────────────────────────────────────────────────────────────────

export interface SitePage {
  id: string;
  sectionId: string;
  slug: string;
  status: PageStatus;
  order: number;
  menuTitle: string;
  menuDescription: string;
  cardTitle: string;
  cardDescription: string;
  metaTitle: string;
  metaDescription: string;
  /** Explicit "expert product" flag. If undefined, legacy behaviour (derived from experts block) applies. */
  expertProduct?: boolean;
  /** Cases section only. "big" = has internal /cases/[slug] page; "mini" = card-only. */
  caseType?: CaseType;
  /** Cases section only. If true, this case appears in the cross-block CasesSection on all pages. Max 5 site-wide. */
  featured?: boolean;
  blocks: PageBlock[];
  createdAt: string;
  updatedAt: string;
}

// ── Section ─────────────────────────────────────────────────────────────────

export interface AdminSection {
  id: string;
  label: string;
  category: string;
}

// ── Store root ──────────────────────────────────────────────────────────────

export interface AdminStore {
  version: number;
  pages: SitePage[];
  lastSaved: string;
}
