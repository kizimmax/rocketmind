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
  | "casesList"
  | "contacts";

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

// Unified styled paragraph with caps + color toggles, used across all blocks.
export interface StyledParagraph {
  text: string;
  /** If true, paragraph renders in the uppercase label-18 mono style. */
  uppercase?: boolean;
  /** "primary" — high-contrast color (light on dark / dark on light). "secondary" — muted. Default secondary. */
  color?: "primary" | "secondary";
}

export interface HeroBlockData {
  caption: string;
  title: string;
  titleSecondary?: string;
  /** Legacy single-string description. Prefer `paragraphs`. */
  description: string;
  /** Structured paragraphs under the title. Supersedes `description` when non-empty. */
  paragraphs?: StyledParagraph[];
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

/** @deprecated Use StyledParagraph. Kept as alias for backward compatibility. */
export type AboutParagraph = StyledParagraph;

export interface AboutBlockData {
  caption: string;
  title: string;
  titleSecondary?: string;
  paragraphs: StyledParagraph[];
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
  /** Legacy single-string subtitle (uppercase primary on light). Prefer `paragraphs`. */
  subtitle?: string;
  /** Structured paragraphs under the title. On this block default = primary + caps (on light bg). */
  paragraphs?: StyledParagraph[];
  wideColumn?: "left" | "right";
  facts: Array<{ title: string; text: string }>;
}

export interface ToolsBlockData {
  tag: string;
  title: string;
  titleSecondary?: string;
  /** Legacy single-string description. Prefer `paragraphs`. */
  description?: string;
  /** Structured paragraphs under the title. */
  paragraphs?: StyledParagraph[];
  useIcons?: boolean;
  descriptionBelow?: boolean;
  tools: Array<{ number: string; title: string; text: string; icon?: string | null; wide?: boolean; accent?: boolean }>;
}

export interface ResultsBlockData {
  tag: string;
  title: string;
  titleSecondary?: string;
  /** Legacy single-string description. Prefer `paragraphs`. */
  description?: string;
  /** Structured paragraphs under the title. */
  paragraphs?: StyledParagraph[];
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
  /** Legacy single-string description. Prefer `paragraphs`. */
  description?: string;
  /** Structured paragraphs under the title. */
  paragraphs?: StyledParagraph[];
  cards: ServiceCard[];
}

export interface LogoMarqueeBlockData {
  // No editable fields — auto-rendered from /public/clip-logos/.
  // Visibility controlled by `block.enabled` flag in PageBlock.
  // Empty placeholder shape for type completeness.
  __placeholder?: never;
}

// ── Contacts block ──────────────────────────────────────────────────────────

export type ContactSocialKind = "vk" | "telegram" | "custom";

export interface ContactSocial {
  id: string;
  kind: ContactSocialKind;
  /** For custom kind — data URL (while editing) or /images/... path (after save). */
  iconSrc?: string;
  username: string;
  url: string;
}

export interface ContactCardPerson {
  /** If set — avatar/name/role are pulled from the expert by the site renderer. */
  expertSlug?: string;
  /** Overrides (used when expertSlug is empty, or to store a custom avatar). */
  avatarSrc?: string;
  name?: string;
  role?: string;
  phone?: string;
  social?: {
    kind: ContactSocialKind;
    iconSrc?: string;
    username: string;
    url: string;
  };
}

export type ContactCardItem =
  | { id: string; kind: "paragraph"; paragraph: StyledParagraph }
  | { id: string; kind: "socials"; socials: ContactSocial[] }
  | { id: string; kind: "person"; person: ContactCardPerson };

export interface ContactCard {
  id: string;
  title: string;
  items: ContactCardItem[];
}

export interface ContactsBlockData {
  tag: string;
  title: string;
  titleSecondary?: string;
  paragraphs?: StyledParagraph[];
  cards: ContactCard[];
}

export interface PartnershipsBlockData {
  caption: string;
  title: string;
  /** Legacy single-string description. Prefer `paragraphs`. */
  description: string;
  /** Structured paragraphs under the title. */
  paragraphs?: StyledParagraph[];
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
  leftVariant: "alex" | "canvas";
  /** Transient base64 data URL for founder photo — attached by API on GET, stripped on PUT. */
  alexPhotoData?: string;
  /** Transient base64 data URL for canvas photo — attached by API on GET, stripped on PUT. */
  canvasPhotoData?: string;
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
  /** Legacy single-string description. Prefer `paragraphs`. */
  description: string;
  /** Structured paragraphs under the title. */
  paragraphs?: StyledParagraph[];
  catalogLabel: string;
  /** Слаги карточек, которые нужно СКРЫТЬ из соответствующего /products фильтра. */
  hiddenCardSlugs: string[];
}

export interface HomeSectionsBlockData {
  sections: HomeSectionItem[];
}

/** @deprecated Use StyledParagraph. Kept as alias for backward compatibility. */
export type ProcessDescriptionParagraph = StyledParagraph;

export interface ProcessBlockData {
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
  /**
   * Только для разделов consulting / academy / ai-products.
   * Показывать в выпадающих меню шапки. По умолчанию true.
   */
  showInMenu?: boolean;
  /**
   * Только для разделов consulting / academy / ai-products.
   * Показывать в футере. По умолчанию true.
   */
  showInFooter?: boolean;
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
  articles: Article[];
  mediaTags: MediaTag[];
  glossaryTerms: GlossaryTerm[];
  lastSaved: string;
}

// ── Media: tags ─────────────────────────────────────────────────────────────

/**
 * Тег медиа-раздела. Справочник тегов редактируется в админке (менеджер тегов),
 * используется при создании/редактировании статей и для фильтрации списка /media.
 */
export interface MediaTag {
  /** Slug, уникальный ключ. Обычно транслит/kebab от label. */
  id: string;
  /** Отображаемое название. */
  label: string;
  createdAt: string;
}

// ── Media: article body blocks (inline, stub for next iteration) ────────────

/**
 * Inline-блоки тела статьи. В текущей итерации тело не редактируется — массив
 * остаётся пустым. Контракт заложен заранее, чтобы сущность Article была
 * стабильной между итерациями.
 */
export type ArticleBodyBlockType =
  | "paragraph"
  | "h2"
  | "h3"
  | "h4"
  | "quote"
  | "image"
  | "gallery"
  | "video"
  | "list"
  | "callout";

export interface ArticleGalleryItem {
  /** Уникальный ID внутри галереи (локальный, не зависит от slug статьи). */
  id: string;
  /** Заголовок таба. */
  title: string;
  /** Публичный URL загруженного файла (/media/uploads/<slug>/<hash>.<ext>). */
  src: string;
  /** Тип контента: изображение (default для обратной совместимости) или видео. */
  kind?: "image" | "video";
  /** Опциональная подпись под активным медиа. Пустая строка/undefined — не рендерится. */
  caption?: string;
}

export interface ArticleBodyBlock {
  id: string;
  type: ArticleBodyBlockType;
  /**
   * Block-specific payload. В текущей итерации используется только поле `text`
   * для h2/h3/paragraph/quote; image/list/callout зарезервированы под следующую
   * итерацию и расширят shape по месту.
   */
  data: { text?: string } & Record<string, unknown>;
}

/**
 * Виджеты в правой колонке секции (файл, внешняя ссылка, мини-карточка продукта).
 * На публичной странице колонка sticky на уровне секции.
 */
/** Как кропать превью 3:2 относительно оригинальной картинки. */
export type AsidePreviewCropMode = "top" | "center";

export type ArticleAside =
  | {
      id: string;
      kind: "file";
      /** Публичный URL, возвращённый upload-эндпоинтом (напр. "/media/uploads/<slug>/<hash>.pdf"). */
      fileUrl: string;
      /** Оригинальное имя файла (для скачивания). */
      fileName: string;
      /** Отображаемое название в UI. Пустая строка — fallback на fileName. */
      displayName: string;
      /** Показывать превью 3:2 над названием. */
      showPreview: boolean;
      /** Ручной превью (вариант A — upload картинки админом). */
      previewImageUrl?: string;
      /** Вертикальное позиционирование при кропе 3:2. Default — "top". */
      previewCropMode?: AsidePreviewCropMode;
    }
  | {
      id: string;
      kind: "link";
      url: string;
      displayName: string;
      showPreview: boolean;
      previewImageUrl?: string;
      previewCropMode?: AsidePreviewCropMode;
    }
  | {
      id: string;
      kind: "product";
      /** Slug продукта из `content/products|academy|ai-products`. */
      productSlug: string;
      /** Категория запоминается на момент вставки — на случай миграции слэгов. */
      productCategory: "consulting" | "academy" | "ai-products";
    }
  | {
      id: string;
      kind: "logos";
      /** Список логотипов. Рендерятся в колонку, монохром --rm-gray-fg-sub. */
      logos: ArticleLogoAsideItem[];
    };

/**
 * Цитата эксперта в конце секции статьи. Минимум одно из `label`/`text` —
 * ровно как в Figma (оба поля опциональны, но блок с пустыми текстом и
 * заголовком не имеет смысла). Автор берётся либо из `content/experts/` по
 * `expertSlug`, либо задаётся вручную через `name`/`role`/`avatarUrl`.
 */
export interface ArticleSectionQuote {
  id: string;
  /** Опциональный slug из content/experts/ — источник name/role/avatar по умолчанию. */
  expertSlug?: string;
  /** Ручной override имени (и источник, если expertSlug не задан). */
  name?: string;
  /** Ручной override должности. */
  role?: string;
  /** Ручной override URL аватара (/media/uploads/<slug>/ или абсолютный). */
  avatarUrl?: string;
  /** Label — Label 18 desktop / Label 16 mobile. Uppercase. */
  label?: string;
  /** Параграфы расширенного текста цитаты (Copy 16). Пустые строки игнорируются. */
  paragraphs?: string[];
}

/** Элемент списка логотипов в logos-aside. */
export interface ArticleLogoAsideItem {
  /** Уникальный ID внутри aside. */
  id: string;
  /** Публичный URL логотипа (SVG/PNG). См. `/api/logos`. */
  src: string;
  /** Ширина в пикселях, настраивается zoom-кнопками в админке. */
  widthPx: number;
}

/**
 * Секция статьи: один H2-заголовок + свой массив inline-блоков + отдельный
 * label для ToC-навигации (fallback на title) + свой список asides.
 */
export interface ArticleSection {
  id: string;
  /** H2 секции. Пустая строка — секция без заголовка и не попадает в ToC. */
  title: string;
  /** Name в боковой навигации. Пустая строка — fallback на title. */
  navLabel: string;
  /** Inline-блоки внутри секции. Тип "h2" внутри не используется по соглашению. */
  blocks: ArticleBodyBlock[];
  /** Aside-виджеты правой колонки (sticky в рамках секции на публичной странице). */
  asides: ArticleAside[];
  /**
   * Цитаты экспертов, привязанные к концу секции. Рендер зависит от соотношения
   * высот body vs aside: body > aside → wide-вариант на всю ширину секции,
   * иначе — narrow вариант в body-колонке. На mobile всегда mobile-вариант.
   */
  quotes: ArticleSectionQuote[];
  /** Заголовок правой колонки (например «Материалы»). */
  asidesTitle: string;
  /** Показывать заголовок над колонкой asides. */
  asidesTitleEnabled: boolean;
}

// ── Media: article ──────────────────────────────────────────────────────────

export interface Article {
  /** Uniform с SitePage: `media/{slug}`. */
  id: string;
  slug: string;
  status: PageStatus;
  order: number;

  // Hero
  title: string;
  description: string;
  /** Base64 data URL (demo) или относительный путь (persisted). */
  coverImageData?: string;
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string;
  /** Slug эксперта (соответствует файлу в apps/site/content/experts/). */
  expertSlug?: string;

  // Taxonomy
  tagIds: string[];

  // Editor-pinned key thoughts, шапка
  keyThoughts: string[];

  // Body — массив секций (каждая с H2 + свои блоки + navLabel для ToC)
  body: ArticleSection[];

  // Media-list display
  /**
   * Вариант карточки в списке /media. "default" — стандартная (1 колонка из 3).
   * "wide" — широкая карточка (2 колонки из 3, обложка слева, теги/автор справа).
   */
  cardVariant: "default" | "wide";
  /**
   * Закреплена ли статья на /media. Закреплённые идут первыми, упорядочиваются
   * по `pinnedOrder` (asc). Новая закреплённая получает max+1, что даёт по-дате
   * позицию в конце пина — ручная перестановка через DnD меняет `pinnedOrder`.
   */
  pinned: boolean;
  /** Ручной порядок среди закреплённых (asc). Игнорируется если pinned=false. */
  pinnedOrder: number;

  // Meta
  metaTitle: string;
  metaDescription: string;

  createdAt: string;
  updatedAt: string;
}

// ── Glossary term ───────────────────────────────────────────────────────────

/**
 * Термин глоссария. Хранится как `apps/site/content/glossary/{slug}.md` (аналог
 * статьи) — в ближайшей итерации сюда добавится body-редактор, сейчас только
 * метаданные: title, tagIds, metaTitle, metaDescription.
 */
export interface GlossaryTerm {
  /** Uniform с Article: `glossary/{slug}`. */
  id: string;
  slug: string;
  status: PageStatus;
  order: number;
  title: string;
  tagIds: string[];
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}
