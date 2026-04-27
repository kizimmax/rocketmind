import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ArticleBodyBlock } from "@rocketmind/ui";
import { getProductBySlug } from "./products";

// ── Types ──────────────────────────────────────────────────────────────────

export type MediaTag = {
  id: string;
  label: string;
};

export type ArticleStatus = "published" | "hidden" | "archived";

export type AsidePreviewCropMode = "top" | "center";

export type ArticleAside =
  | {
      id: string;
      kind: "file";
      fileUrl: string;
      fileName: string;
      displayName: string;
      showPreview: boolean;
      previewImageUrl?: string;
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
      productSlug: string;
      productCategory: "consulting" | "academy" | "ai-products";
    }
  | {
      id: string;
      kind: "logos";
      logos: ArticleLogoAsideItem[];
    };

export type ArticleLogoAsideItem = {
  id: string;
  src: string;
  widthPx: number;
};

export type ArticleSectionQuote = {
  id: string;
  /** Slug из content/experts/ — источник name/role/avatar по умолчанию. */
  expertSlug?: string;
  /** Ручной override имени. */
  name?: string;
  /** Ручной override должности. */
  role?: string;
  /** Ручной override URL аватара. */
  avatarUrl?: string;
  /** Label (uppercase тезис). */
  label?: string;
  /** Параграфы расширенного текста цитаты. */
  paragraphs?: string[];
};

export type ArticleSection = {
  id: string;
  /** H2 секции. Пустая — без заголовка, не попадает в ToC. */
  title: string;
  /** Название в ToC. Пустая — fallback на title. */
  navLabel: string;
  blocks: ArticleBodyBlock[];
  asides: ArticleAside[];
  /** Цитаты экспертов, привязанные к концу секции. */
  quotes: ArticleSectionQuote[];
  asidesTitle: string;
  asidesTitleEnabled: boolean;
};

export type ArticleEntry = {
  slug: string;
  title: string;
  description: string;
  status: ArticleStatus;
  order: number;
  publishedAt: string;
  expertSlug: string | null;
  tags: string[];
  keyThoughts: string[];
  coverUrl: string | null;
  sections: ArticleSection[];
  /** "default" (1 колонка) или "wide" (2 колонки) в сетке /media. */
  cardVariant: "default" | "wide";
  /** Закреплена в начале списка /media. */
  pinned: boolean;
  /** Ручной порядок среди закреплённых (asc). */
  pinnedOrder: number;
  metaTitle: string;
  metaDescription: string;
};

// ── Paths ──────────────────────────────────────────────────────────────────

const MEDIA_DIR = path.join(process.cwd(), "content", "media");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

function resolveCover(slug: string): string | null {
  const rel = `/images/media/${slug}`;
  for (const ext of [".jpg", ".jpeg", ".png", ".webp", ".avif"]) {
    if (fs.existsSync(path.join(PUBLIC_DIR, rel + ext))) {
      return BASE_PATH + rel + ext;
    }
  }
  return null;
}

const BODY_BLOCK_TYPES = new Set([
  "h2",
  "h3",
  "h4",
  "paragraph",
  "quote",
  "image",
  "gallery",
  "video",
]);

function parseBlock(raw: unknown, fallbackId: string): ArticleBodyBlock | null {
  if (!raw || typeof raw !== "object") return null;
  const rec = raw as Record<string, unknown>;
  const type = rec.type;
  if (typeof type !== "string" || !BODY_BLOCK_TYPES.has(type)) return null;
  const data = (rec.data && typeof rec.data === "object"
    ? (rec.data as Record<string, unknown>)
    : {}) as { text?: string; src?: string; caption?: string } & Record<
    string,
    unknown
  >;
  // Image/video-блок валидируется по src; gallery — по непустому массиву items
  // с хотя бы одним валидным элементом; для остальных требуется непустой text.
  if (type === "image" || type === "video") {
    if (typeof data.src !== "string" || !data.src.trim()) return null;
  } else if (type === "gallery") {
    const rawItems = (data as Record<string, unknown>).items;
    if (!Array.isArray(rawItems)) return null;
    const hasValid = rawItems.some((it) => {
      if (!it || typeof it !== "object") return false;
      const rec = it as Record<string, unknown>;
      return typeof rec.src === "string" && rec.src.trim().length > 0;
    });
    if (!hasValid) return null;
    // Нормализуем kind в элементах: default "image", сохраняем "video".
    const normalizedItems = rawItems.map((it) => {
      if (!it || typeof it !== "object") return it;
      const rec = it as Record<string, unknown>;
      return { ...rec, kind: rec.kind === "video" ? "video" : "image" };
    });
    (data as Record<string, unknown>).items = normalizedItems;
  } else {
    if (typeof data.text !== "string" || !data.text.trim()) return null;
  }
  const id = typeof rec.id === "string" && rec.id ? rec.id : fallbackId;
  return { id, type: type as ArticleBodyBlock["type"], data };
}

function parseAside(raw: unknown, fallbackId: string): ArticleAside | null {
  if (!raw || typeof raw !== "object") return null;
  const rec = raw as Record<string, unknown>;
  const id = typeof rec.id === "string" && rec.id ? rec.id : fallbackId;
  const kind = rec.kind;
  if (kind === "file") {
    const fileUrl = typeof rec.fileUrl === "string" ? rec.fileUrl : "";
    if (!fileUrl) return null;
    return {
      id,
      kind: "file",
      fileUrl,
      fileName: typeof rec.fileName === "string" ? rec.fileName : "",
      displayName:
        typeof rec.displayName === "string" ? rec.displayName : "",
      showPreview: rec.showPreview === true,
      previewImageUrl:
        typeof rec.previewImageUrl === "string"
          ? rec.previewImageUrl
          : undefined,
      previewCropMode:
        rec.previewCropMode === "center" ? "center" : "top",
    };
  }
  if (kind === "link") {
    const url = typeof rec.url === "string" ? rec.url : "";
    if (!url) return null;
    return {
      id,
      kind: "link",
      url,
      displayName:
        typeof rec.displayName === "string" ? rec.displayName : "",
      showPreview: rec.showPreview === true,
      previewImageUrl:
        typeof rec.previewImageUrl === "string"
          ? rec.previewImageUrl
          : undefined,
      previewCropMode:
        rec.previewCropMode === "center" ? "center" : "top",
    };
  }
  if (kind === "product") {
    const productSlug =
      typeof rec.productSlug === "string" ? rec.productSlug : "";
    if (!productSlug) return null;
    const cat = rec.productCategory;
    const productCategory =
      cat === "consulting" || cat === "academy" || cat === "ai-products"
        ? cat
        : "consulting";
    return { id, kind: "product", productSlug, productCategory };
  }
  if (kind === "logos") {
    const rawLogos = rec.logos;
    if (!Array.isArray(rawLogos)) return null;
    const logos: ArticleLogoAsideItem[] = rawLogos
      .map((l, i): ArticleLogoAsideItem | null => {
        if (!l || typeof l !== "object") return null;
        const rl = l as Record<string, unknown>;
        const src = typeof rl.src === "string" ? rl.src.trim() : "";
        if (!src) return null;
        const lid =
          typeof rl.id === "string" && rl.id ? rl.id : `${id}_l${i}`;
        const rawW = typeof rl.widthPx === "number" ? rl.widthPx : 160;
        const widthPx = Math.max(80, Math.min(320, Math.round(rawW)));
        return { id: lid, src, widthPx };
      })
      .filter((l): l is ArticleLogoAsideItem => l !== null);
    if (logos.length === 0) return null;
    return { id, kind: "logos", logos };
  }
  return null;
}

function parseQuote(
  raw: unknown,
  fallbackId: string,
): ArticleSectionQuote | null {
  if (!raw || typeof raw !== "object") return null;
  const rec = raw as Record<string, unknown>;
  const label =
    typeof rec.label === "string" ? rec.label.trim() : "";
  const paragraphs: string[] = Array.isArray(rec.paragraphs)
    ? rec.paragraphs
        .map((p) => (typeof p === "string" ? p.trim() : ""))
        .filter((p) => p.length > 0)
    : typeof rec.text === "string" && rec.text.trim()
    ? [rec.text.trim()]
    : [];
  const expertSlug =
    typeof rec.expertSlug === "string" && rec.expertSlug
      ? rec.expertSlug
      : undefined;
  const name =
    typeof rec.name === "string" && rec.name ? rec.name : undefined;
  // Если нет ни автора (expert slug / ручное имя), ни контента — блок пустой.
  if (!label && paragraphs.length === 0) return null;
  if (!expertSlug && !name) return null;
  const id =
    typeof rec.id === "string" && rec.id ? rec.id : fallbackId;
  return {
    id,
    expertSlug,
    name,
    role:
      typeof rec.role === "string" && rec.role ? rec.role : undefined,
    avatarUrl:
      typeof rec.avatarUrl === "string" && rec.avatarUrl
        ? rec.avatarUrl
        : undefined,
    label: label || undefined,
    paragraphs: paragraphs.length > 0 ? paragraphs : undefined,
  };
}

/**
 * Body хранится массивом секций: `[{ id, title, navLabel, blocks, asides, quotes, ... }]`.
 * Тут валидируем и возвращаем типизированную структуру. Секции без заголовка
 * и с пустыми blocks/asides допустимы — отфильтровываются в рендере по месту.
 */
function parseSections(raw: unknown): ArticleSection[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item, sIdx): ArticleSection | null => {
      if (!item || typeof item !== "object") return null;
      const rec = item as Record<string, unknown>;
      const rawBlocks = rec.blocks;
      if (!Array.isArray(rawBlocks)) return null;
      const sectionId =
        typeof rec.id === "string" && rec.id ? rec.id : `s${sIdx}`;
      const blocks = rawBlocks
        .map((b, i) => parseBlock(b, `${sectionId}_b${i}`))
        .filter((b): b is ArticleBodyBlock => b !== null);
      const rawAsides = rec.asides;
      const asides = Array.isArray(rawAsides)
        ? rawAsides
            .map((a, i) => parseAside(a, `${sectionId}_a${i}`))
            .filter((a): a is ArticleAside => a !== null)
        : [];
      const rawQuotes = rec.quotes;
      const quotes = Array.isArray(rawQuotes)
        ? rawQuotes
            .map((q, i) => parseQuote(q, `${sectionId}_q${i}`))
            .filter((q): q is ArticleSectionQuote => q !== null)
        : [];
      return {
        id: sectionId,
        title: typeof rec.title === "string" ? rec.title : "",
        navLabel: typeof rec.navLabel === "string" ? rec.navLabel : "",
        blocks,
        asides,
        quotes,
        asidesTitle:
          typeof rec.asidesTitle === "string" && rec.asidesTitle
            ? rec.asidesTitle
            : "Материалы",
        asidesTitleEnabled:
          typeof rec.asidesTitleEnabled === "boolean"
            ? rec.asidesTitleEnabled
            : true,
      };
    })
    .filter((s): s is ArticleSection => s !== null);
}

const VALID_STATUSES: ReadonlySet<ArticleStatus> = new Set([
  "published",
  "hidden",
  "archived",
]);

function parseStatus(value: unknown): ArticleStatus {
  if (typeof value === "string" && VALID_STATUSES.has(value as ArticleStatus)) {
    return value as ArticleStatus;
  }
  // Отсутствие status = исторический .md без этого поля → считаем published.
  return "published";
}

function readArticle(filePath: string): ArticleEntry | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    if (typeof data.slug !== "string" || !data.slug) return null;
    const slug = data.slug;
    return {
      slug,
      title: typeof data.title === "string" ? data.title : "",
      description: typeof data.description === "string" ? data.description : "",
      status: parseStatus(data.status),
      order: typeof data.order === "number" ? data.order : 0,
      publishedAt: typeof data.publishedAt === "string" ? data.publishedAt : "",
      expertSlug: typeof data.expertSlug === "string" ? data.expertSlug : null,
      tags: Array.isArray(data.tags)
        ? data.tags.filter((t): t is string => typeof t === "string")
        : [],
      keyThoughts: Array.isArray(data.keyThoughts)
        ? data.keyThoughts.filter((t): t is string => typeof t === "string")
        : [],
      coverUrl: resolveCover(slug),
      sections: parseSections(data.body),
      cardVariant: data.cardVariant === "wide" ? "wide" : "default",
      pinned: data.pinned === true,
      pinnedOrder:
        typeof data.pinnedOrder === "number" ? data.pinnedOrder : 0,
      metaTitle:
        typeof data.metaTitle === "string" && data.metaTitle
          ? data.metaTitle
          : `${data.title ?? ""} | Rocketmind`,
      metaDescription:
        typeof data.metaDescription === "string" ? data.metaDescription : "",
    };
  } catch {
    return null;
  }
}

/**
 * Public-listing: возвращает только published статьи (hidden/archived скрываются).
 * Порядок: сначала закреплённые (по `pinnedOrder` asc), затем остальные по
 * `publishedAt` desc.
 */
export function getAllArticles(): ArticleEntry[] {
  if (!fs.existsSync(MEDIA_DIR)) return [];
  const files = fs
    .readdirSync(MEDIA_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  const all = files
    .map((f) => readArticle(path.join(MEDIA_DIR, f)))
    .filter((a): a is ArticleEntry => a !== null && a.status === "published");
  return all.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.pinned && b.pinned) return a.pinnedOrder - b.pinnedOrder;
    return a.publishedAt < b.publishedAt ? 1 : -1;
  });
}

/**
 * Возвращает статью по slug даже если она hidden/archived — нужно для корректной
 * 404-логики в `generateStaticParams` и прямого доступа по URL. Фильтрация видимости
 * делается на уровне страницы (см. `/media/[slug]/page.tsx`).
 */
export function getArticleBySlug(slug: string): ArticleEntry | null {
  const file = path.join(MEDIA_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return readArticle(file);
}

export function getAllTags(): MediaTag[] {
  const file = path.join(MEDIA_DIR, "_tags.json");
  if (!fs.existsSync(file)) return [];
  try {
    const json = JSON.parse(fs.readFileSync(file, "utf-8")) as {
      tags?: MediaTag[];
    };
    return Array.isArray(json.tags) ? json.tags : [];
  } catch {
    return [];
  }
}

/** Usage count per tag id across all published articles. */
export function getTagUsage(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const a of getAllArticles())
    for (const t of a.tags) out[t] = (out[t] ?? 0) + 1;
  return out;
}

// ── Product aside resolver ──────────────────────────────────────────────────

export type ResolvedProductAside = {
  slug: string;
  category: "consulting" | "academy" | "ai-products";
  title: string;
  description: string;
  coverUrl: string | null;
  experts: Array<{ name: string; image: string | null }>;
  href: string;
};

/**
 * Для product-aside резолвит полные данные продукта из `content/products`
 * (или category-specific dir). Возвращает `null` если slug не найден.
 */
export function resolveProductAside(
  slug: string,
  category: "consulting" | "academy" | "ai-products",
): ResolvedProductAside | null {
  const product = getProductBySlug(slug, category);
  if (!product) return null;
  const experts = (product.experts ?? []).map((ex) => ({
    name: ex.name,
    image: ex.image ?? null,
  }));
  return {
    slug: product.slug,
    category: product.category as ResolvedProductAside["category"],
    title: product.cardTitle || product.menuTitle || product.slug,
    description: product.cardDescription || "",
    coverUrl: product.heroImage ?? null,
    experts,
    href: `${BASE_PATH}/${product.category}/${product.slug}`,
  };
}

/** Собирает map всех уникальных product-asides статьи → resolved data. */
export function collectResolvedProductAsides(
  article: ArticleEntry,
): Record<string, ResolvedProductAside> {
  const out: Record<string, ResolvedProductAside> = {};
  for (const section of article.sections) {
    for (const aside of section.asides) {
      if (aside.kind !== "product") continue;
      const key = `${aside.productCategory}:${aside.productSlug}`;
      if (out[key]) continue;
      const resolved = resolveProductAside(
        aside.productSlug,
        aside.productCategory,
      );
      if (resolved) out[key] = resolved;
    }
  }
  return out;
}

// ── Quote expert resolver ──────────────────────────────────────────────────

export type ResolvedQuoteExpert = {
  slug: string;
  name: string;
  role: string;
  avatarUrl: string | null;
};

/**
 * Для цитат с `expertSlug` подтягивает name/tag/avatar из content/experts/.
 * Map ключ — slug эксперта.
 */
export function collectResolvedQuoteExperts(
  article: ArticleEntry,
): Record<string, ResolvedQuoteExpert> {
  // Импорт внутри — чтобы избежать циклической зависимости (experts.ts
  // используется на уровне страниц, тут не хотим подтягивать его всюду).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getExpertBySlug } = require("./experts") as typeof import("./experts");
  const out: Record<string, ResolvedQuoteExpert> = {};
  for (const section of article.sections) {
    for (const quote of section.quotes) {
      const slug = quote.expertSlug;
      if (!slug || out[slug]) continue;
      const expert = getExpertBySlug(slug);
      if (!expert) continue;
      out[slug] = {
        slug: expert.slug,
        name: expert.name,
        role: expert.tag,
        avatarUrl: expert.image,
      };
    }
  }
  return out;
}
