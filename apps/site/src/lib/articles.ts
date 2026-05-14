import { prisma } from "./prisma";
import type { ArticleBodyBlock, StyledParagraph } from "@rocketmind/ui";
import { getProductBySlug } from "./products";
import { getExpertBySlug } from "./experts";
import { isPreviewMode, matchPreviewPayload } from "./preview-draft";

// ── Types ──────────────────────────────────────────────────────────────────────

export type MediaTagSeo = {
  pageTitlePrefix?: string;
  pageTitleAccent?: string;
  metaTitle?: string;
  metaDescription?: string;
  intro?: string;
};

export type DsAccentColor =
  | "yellow" | "violet" | "sky" | "terracotta" | "pink" | "blue" | "red" | "green";

export type MediaTag = {
  id: string;
  label: string;
  disabled?: boolean;
  seo?: MediaTagSeo;
  system?: boolean;
  cardColor?: DsAccentColor;
};

export type ArticleType = "default" | "lesson" | "case";
export type ArticleStatus = "published" | "hidden" | "archived";
export type AsidePreviewCropMode = "top" | "center";

export type ArticleAside =
  | { id: string; kind: "file"; fileUrl: string; fileName: string; displayName: string; showPreview: boolean; previewImageUrl?: string; previewCropMode?: AsidePreviewCropMode }
  | { id: string; kind: "link"; url: string; displayName: string; showPreview: boolean; previewImageUrl?: string; previewCropMode?: AsidePreviewCropMode }
  | { id: string; kind: "product"; productSlug: string; productCategory: "consulting" | "academy" | "ai-products" }
  | { id: string; kind: "logos"; logos: ArticleLogoAsideItem[] }
  | { id: string; kind: "cta"; ctaId: string }
  | { id: string; kind: "note"; paragraphs: string[] };

export type ArticleLogoAsideItem = { id: string; src: string; widthPx: number };

export type ArticleSectionQuote = {
  id: string;
  expertSlug?: string;
  name?: string;
  role?: string;
  avatarUrl?: string;
  label?: string;
  paragraphs?: string[];
};

export type FactoidCardData = { id: string; number: string; text: string; accent: boolean; newRow?: boolean };
export type ListItemData = { id: string; text: string };
export type ListCardData = { id: string; title: string; items: ListItemData[]; newRow?: boolean };

export type ArticleSection = {
  id: string;
  title: string;
  navLabel: string;
  blocks: ArticleBodyBlock[];
  factoids: FactoidCardData[];
  factoidCols?: 1 | 2 | 3;
  listCards?: ListCardData[];
  listType?: "bullet" | "numbered";
  listCols?: 1 | 2 | 3;
  asides: ArticleAside[];
  quotes: ArticleSectionQuote[];
  asidesTitle: string;
  asidesTitleEnabled: boolean;
  bottomCtaId?: string;
};

export type ArticleChapter = {
  id: string;
  slug: string;
  navLabel: string;
  sections: ArticleSection[];
};

export type ArticleEntry = {
  slug: string;
  title: string;
  /** Legacy lead — для SEO/мета и tooltip'ов глоссария (= первый абзац). */
  description: string;
  /** Структурированный лид под заголовком. Если непуст — перекрывает description. */
  descriptionParagraphs: StyledParagraph[];
  status: ArticleStatus;
  order: number;
  type: ArticleType;
  publishedAt: string;
  expertSlug: string | null;
  tags: string[];
  keyThoughts: string[];
  coverUrl: string | null;
  sections: ArticleSection[];
  cardVariant: "default" | "wide";
  pinned: boolean;
  pinnedOrder: number;
  metaTitle: string;
  metaDescription: string;
  /** Многостраничный режим — главы на отдельных URL. */
  multiPage: boolean;
  /** Главы. Пусто при `multiPage=false`. */
  chapters: ArticleChapter[];
};

// ── Parsers (pure, sync) ───────────────────────────────────────────────────────

const BODY_BLOCK_TYPES = new Set(["h2", "h3", "h4", "paragraph", "quote", "image", "gallery", "video", "table"]);

function parseBlock(raw: unknown, fallbackId: string): ArticleBodyBlock | null {
  if (!raw || typeof raw !== "object") return null;
  const rec = raw as Record<string, unknown>;
  const type = rec.type;
  if (typeof type !== "string" || !BODY_BLOCK_TYPES.has(type)) return null;
  const data = (rec.data && typeof rec.data === "object" ? (rec.data as Record<string, unknown>) : {}) as {
    text?: string; src?: string; caption?: string;
  } & Record<string, unknown>;
  if (type === "image" || type === "video") {
    if (typeof data.src !== "string" || !data.src.trim()) return null;
  } else if (type === "gallery") {
    const rawItems = (data as Record<string, unknown>).items;
    if (!Array.isArray(rawItems)) return null;
    const hasValid = rawItems.some((it) => {
      if (!it || typeof it !== "object") return false;
      const r = it as Record<string, unknown>;
      return typeof r.src === "string" && r.src.trim().length > 0;
    });
    if (!hasValid) return null;
    (data as Record<string, unknown>).items = rawItems.map((it) => {
      if (!it || typeof it !== "object") return it;
      const r = it as Record<string, unknown>;
      return { ...r, kind: r.kind === "video" ? "video" : "image" };
    });
  } else if (type === "table") {
    const rawRows = (data as Record<string, unknown>).rows;
    if (!Array.isArray(rawRows)) return null;
    const rows: string[][] = rawRows
      .map((row) => Array.isArray(row) ? row.map((c) => (typeof c === "string" ? c : "")) : null)
      .filter((r): r is string[] => r !== null);
    if (rows.length === 0) return null;
    const cols = Math.max(...rows.map((r) => r.length));
    if (cols === 0) return null;
    const normalized = rows.map((r) => r.length === cols ? r : [...r, ...Array(cols - r.length).fill("")]);
    if (normalized.every((r) => r.every((c) => !c.trim()))) return null;
    (data as Record<string, unknown>).rows = normalized;
    (data as Record<string, unknown>).hasHeader = data.hasHeader !== false;
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
    return { id, kind: "file", fileUrl, fileName: typeof rec.fileName === "string" ? rec.fileName : "", displayName: typeof rec.displayName === "string" ? rec.displayName : "", showPreview: rec.showPreview === true, previewImageUrl: typeof rec.previewImageUrl === "string" ? rec.previewImageUrl : undefined, previewCropMode: rec.previewCropMode === "center" ? "center" : "top" };
  }
  if (kind === "link") {
    const url = typeof rec.url === "string" ? rec.url : "";
    if (!url) return null;
    return { id, kind: "link", url, displayName: typeof rec.displayName === "string" ? rec.displayName : "", showPreview: rec.showPreview === true, previewImageUrl: typeof rec.previewImageUrl === "string" ? rec.previewImageUrl : undefined, previewCropMode: rec.previewCropMode === "center" ? "center" : "top" };
  }
  if (kind === "product") {
    const productSlug = typeof rec.productSlug === "string" ? rec.productSlug : "";
    if (!productSlug) return null;
    const cat = rec.productCategory;
    const productCategory = cat === "consulting" || cat === "academy" || cat === "ai-products" ? cat : "consulting";
    return { id, kind: "product", productSlug, productCategory };
  }
  if (kind === "cta") {
    const ctaId = typeof rec.ctaId === "string" ? rec.ctaId.trim() : "";
    if (!ctaId) return null;
    return { id, kind: "cta", ctaId };
  }
  if (kind === "note") {
    const paragraphs = Array.isArray(rec.paragraphs) ? (rec.paragraphs as unknown[]).map((p) => typeof p === "string" ? p : "").filter((p) => p.trim().length > 0) : [];
    if (paragraphs.length === 0) return null;
    return { id, kind: "note", paragraphs };
  }
  if (kind === "logos") {
    const rawLogos = rec.logos;
    if (!Array.isArray(rawLogos)) return null;
    const logos: ArticleLogoAsideItem[] = rawLogos.map((l, i): ArticleLogoAsideItem | null => {
      if (!l || typeof l !== "object") return null;
      const rl = l as Record<string, unknown>;
      const src = typeof rl.src === "string" ? rl.src.trim() : "";
      if (!src) return null;
      const lid = typeof rl.id === "string" && rl.id ? rl.id : `${id}_l${i}`;
      const rawW = typeof rl.widthPx === "number" ? rl.widthPx : 160;
      return { id: lid, src, widthPx: Math.max(80, Math.min(320, Math.round(rawW))) };
    }).filter((l): l is ArticleLogoAsideItem => l !== null);
    if (logos.length === 0) return null;
    return { id, kind: "logos", logos };
  }
  return null;
}

function parseQuote(raw: unknown, fallbackId: string): ArticleSectionQuote | null {
  if (!raw || typeof raw !== "object") return null;
  const rec = raw as Record<string, unknown>;
  const label = typeof rec.label === "string" ? rec.label.trim() : "";
  const paragraphs: string[] = Array.isArray(rec.paragraphs)
    ? (rec.paragraphs as unknown[]).map((p) => typeof p === "string" ? p.trim() : "").filter((p) => p.length > 0)
    : typeof rec.text === "string" && rec.text.trim() ? [rec.text.trim()] : [];
  const expertSlug = typeof rec.expertSlug === "string" && rec.expertSlug ? rec.expertSlug : undefined;
  const name = typeof rec.name === "string" && rec.name ? rec.name : undefined;
  if (!label && paragraphs.length === 0) return null;
  if (!expertSlug && !name) return null;
  const id = typeof rec.id === "string" && rec.id ? rec.id : fallbackId;
  return { id, expertSlug, name, role: typeof rec.role === "string" && rec.role ? rec.role : undefined, avatarUrl: typeof rec.avatarUrl === "string" && rec.avatarUrl ? rec.avatarUrl : undefined, label: label || undefined, paragraphs: paragraphs.length > 0 ? paragraphs : undefined };
}

export function parseSections(raw: unknown): ArticleSection[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item, sIdx): ArticleSection | null => {
    if (!item || typeof item !== "object") return null;
    const rec = item as Record<string, unknown>;
    const rawBlocks = rec.blocks;
    if (!Array.isArray(rawBlocks)) return null;
    const sectionId = typeof rec.id === "string" && rec.id ? rec.id : `s${sIdx}`;
    const blocks = rawBlocks.map((b, i) => parseBlock(b, `${sectionId}_b${i}`)).filter((b): b is ArticleBodyBlock => b !== null);
    const asides = Array.isArray(rec.asides) ? (rec.asides as unknown[]).map((a, i) => parseAside(a, `${sectionId}_a${i}`)).filter((a): a is ArticleAside => a !== null) : [];
    const quotes = Array.isArray(rec.quotes) ? (rec.quotes as unknown[]).map((q, i) => parseQuote(q, `${sectionId}_q${i}`)).filter((q): q is ArticleSectionQuote => q !== null) : [];
    const bottomCtaId = typeof rec.bottomCtaId === "string" && rec.bottomCtaId.trim() ? rec.bottomCtaId.trim() : undefined;
    const rawFactoids = rec.factoids;
    const factoids: FactoidCardData[] = Array.isArray(rawFactoids) ? rawFactoids.map((c) => {
      if (!c || typeof c !== "object") return null;
      const r = c as Record<string, unknown>;
      const id = typeof r.id === "string" ? r.id : "";
      const number = typeof r.number === "string" ? r.number : "";
      const text = typeof r.text === "string" ? r.text : "";
      const accent = r.accent === true;
      if (!id || (!number.trim() && !text.trim())) return null;
      const card: FactoidCardData = { id, number, text, accent };
      if (r.newRow === true) card.newRow = true;
      return card;
    }).filter((c): c is FactoidCardData => c !== null) : [];
    const factoidColsRaw = rec.factoidCols;
    const factoidCols = factoidColsRaw === 1 || factoidColsRaw === 2 || factoidColsRaw === 3 ? (factoidColsRaw as 1 | 2 | 3) : undefined;
    const rawListCards = rec.listCards;
    const listCards: ListCardData[] = Array.isArray(rawListCards) ? rawListCards.map((c) => {
      if (!c || typeof c !== "object") return null;
      const r = c as Record<string, unknown>;
      const id = typeof r.id === "string" ? r.id : "";
      if (!id) return null;
      const items: ListItemData[] = Array.isArray(r.items) ? (r.items as unknown[]).map((it) => {
        if (!it || typeof it !== "object") return null;
        const ir = it as Record<string, unknown>;
        const iid = typeof ir.id === "string" ? ir.id : "";
        const text = typeof ir.text === "string" ? ir.text : "";
        if (!iid) return null;
        return { id: iid, text };
      }).filter((it): it is ListItemData => it !== null) : [];
      const card: ListCardData = { id, title: typeof r.title === "string" ? r.title : "", items };
      if (r.newRow === true) card.newRow = true;
      return card;
    }).filter((c): c is ListCardData => c !== null) : [];
    const listType: "bullet" | "numbered" = rec.listType === "numbered" ? "numbered" : "bullet";
    const listColsRaw = rec.listCols;
    const listCols = listColsRaw === 1 || listColsRaw === 2 || listColsRaw === 3 ? (listColsRaw as 1 | 2 | 3) : undefined;
    return {
      id: sectionId,
      title: typeof rec.title === "string" ? rec.title : "",
      navLabel: typeof rec.navLabel === "string" ? rec.navLabel : "",
      blocks, factoids, factoidCols,
      listCards: listCards.length > 0 ? listCards : undefined,
      listType: listCards.length > 0 ? listType : undefined,
      listCols: listCards.length > 0 ? listCols : undefined,
      asides, quotes,
      asidesTitle: typeof rec.asidesTitle === "string" && rec.asidesTitle ? rec.asidesTitle : "Материалы",
      asidesTitleEnabled: typeof rec.asidesTitleEnabled === "boolean" ? rec.asidesTitleEnabled : true,
      bottomCtaId,
    };
  }).filter((s): s is ArticleSection => s !== null);
}

const VALID_STATUSES = new Set(["published", "hidden", "archived"]);
function parseStatus(value: unknown): ArticleStatus {
  return typeof value === "string" && VALID_STATUSES.has(value) ? (value as ArticleStatus) : "published";
}

export function parseStyledParagraphs(raw: unknown): StyledParagraph[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item): StyledParagraph | null => {
      if (!item || typeof item !== "object") return null;
      const rec = item as Record<string, unknown>;
      const text = typeof rec.text === "string" ? rec.text : "";
      if (!text.trim()) return null;
      return {
        text,
        uppercase: rec.uppercase === true,
        color: rec.color === "primary" ? "primary" : "secondary",
      };
    })
    .filter((p): p is StyledParagraph => p !== null);
}

function parseChapters(raw: unknown): ArticleChapter[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item, idx): ArticleChapter | null => {
      if (!item || typeof item !== "object") return null;
      const rec = item as Record<string, unknown>;
      const slug = typeof rec.slug === "string" ? rec.slug.trim() : "";
      if (!slug) return null;
      const id = typeof rec.id === "string" && rec.id ? rec.id : `c${idx}`;
      const navLabel = typeof rec.navLabel === "string" ? rec.navLabel : "";
      const sections = parseSections(Array.isArray(rec.sections) ? rec.sections : []);
      return { id, slug, navLabel, sections };
    })
    .filter((c): c is ArticleChapter => c !== null);
}

function rowToEntry(row: {
  slug: string; type: string; status: string; title: string; description: string;
  content: unknown; coverPath: string | null; expertSlug: string | null; publishedAt: string;
  tagIds: string[]; pinned: boolean; pinnedOrder: number; featured: boolean;
  cardVariant: string; metaTitle: string; metaDescription: string;
}): ArticleEntry {
  const c = (row.content && typeof row.content === "object" ? row.content : {}) as Record<string, unknown>;
  const multiPage = c.multiPage === true;
  const chapters = multiPage ? parseChapters(c.chapters) : [];
  // body — плоский сборник: для одностраничной — как раньше (content.body),
  // для многостраничной — конкатенация секций всех глав (для глоссария/поиска).
  const sections = multiPage
    ? chapters.flatMap((ch) => ch.sections)
    : parseSections(Array.isArray(c.body) ? c.body : []);
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    descriptionParagraphs: parseStyledParagraphs(c.descriptionParagraphs),
    status: parseStatus(row.status),
    order: typeof c.order === "number" ? c.order : 0,
    type: row.type === "lesson" || row.type === "case" ? row.type : "default",
    publishedAt: row.publishedAt,
    expertSlug: row.expertSlug ?? null,
    tags: row.tagIds,
    keyThoughts: Array.isArray(c.keyThoughts) ? (c.keyThoughts as unknown[]).filter((k): k is string => typeof k === "string") : [],
    coverUrl: row.coverPath ?? null,
    sections,
    cardVariant: row.cardVariant === "wide" ? "wide" : "default",
    pinned: row.pinned,
    pinnedOrder: row.pinnedOrder,
    metaTitle: row.metaTitle || `${row.title} | Rocketmind`,
    metaDescription: row.metaDescription,
    multiPage,
    chapters,
  };
}

// ── Public API (async) ─────────────────────────────────────────────────────────

export async function getAllArticles(): Promise<ArticleEntry[]> {
  try {
    const rows = await prisma.article.findMany({ where: { status: "published" } });
    return rows.map(rowToEntry).sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (a.pinned && b.pinned) return a.pinnedOrder - b.pinnedOrder;
      return a.publishedAt < b.publishedAt ? 1 : -1;
    });
  } catch {
    return [];
  }
}

/**
 * Похожие статьи: общий хотя бы один тег с текущей, исключая саму статью.
 * Сортировка — по `publishedAt` desc. Лимит — `limit` (по умолчанию 12).
 */
export async function getSimilarArticles(
  article: ArticleEntry,
  limit = 12,
): Promise<ArticleEntry[]> {
  const tagSet = new Set(article.tags);
  if (tagSet.size === 0) return [];
  const all = await getAllArticles();
  return all
    .filter((a) => a.slug !== article.slug && a.tags.some((t) => tagSet.has(t)))
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, limit);
}

export async function getArticleBySlug(slug: string): Promise<ArticleEntry | null> {
  try {
    // Preview-режим: подменяем содержимое черновиком из PreviewDraft (in-memory правки),
    // либо читаем из таблицы без фильтра статуса (видим скрытые).
    if (await isPreviewMode()) {
      const draft = await matchPreviewPayload<Record<string, unknown>>("article", { slug });
      if (draft) return previewArticlePayloadToEntry(draft) ?? null;
      const draftRow = await prisma.article.findFirst({ where: { slug } });
      if (!draftRow) return null;
      return rowToEntry(draftRow);
    }
    // findFirst + status filter — `findUnique` не принимает не-уникальные where, поэтому
    // фильтр статуса делаем здесь, чтобы скрытые/архивные не отдавались публике.
    const row = await prisma.article.findFirst({ where: { slug, status: "published" } });
    if (!row) return null;
    return rowToEntry(row);
  } catch {
    return null;
  }
}

/**
 * Преобразует payload, присланный редактором админки (admin Article shape), в
 * виртуальный row в формате прозрачно `prisma.article.findFirst()`, после чего
 * прогоняет его через `rowToEntry`. Используется только в preview-режиме.
 */
function previewArticlePayloadToEntry(p: Record<string, unknown>): ArticleEntry | null {
  try {
    const type = p.type === "lesson" || p.type === "case" ? p.type : "default";
    const slug = typeof p.slug === "string" ? p.slug : "";
    if (!slug) return null;
    const content: Record<string, unknown> = {
      body: Array.isArray(p.body) ? p.body : [],
      keyThoughts: Array.isArray(p.keyThoughts) ? p.keyThoughts : [],
      ...(Array.isArray(p.descriptionParagraphs) && p.descriptionParagraphs.length > 0
        ? { descriptionParagraphs: p.descriptionParagraphs }
        : {}),
      ...(type === "case" && p.caseCard ? { caseCard: p.caseCard } : {}),
      ...(p.multiPage === true
        ? { multiPage: true, chapters: Array.isArray(p.chapters) ? p.chapters : [] }
        : { multiPage: false }),
      sortOrder: typeof p.order === "number" ? p.order : 0,
    };
    const virtualRow = {
      slug,
      type,
      status: typeof p.status === "string" ? p.status : "published",
      title: typeof p.title === "string" ? p.title : "",
      description: typeof p.description === "string" ? p.description : "",
      content,
      // В админке cover лежит в `coverImageData` (либо data: URL для свежей
       // загрузки, либо относительный путь после сохранения). На сайте лоадер
       // ждёт `coverPath` — мапим один в другой.
      coverPath:
        typeof p.coverImageData === "string" && p.coverImageData
          ? p.coverImageData
          : typeof p.coverPath === "string"
            ? p.coverPath
            : null,
      expertSlug: typeof p.expertSlug === "string" ? p.expertSlug : null,
      publishedAt: typeof p.publishedAt === "string" ? p.publishedAt : "",
      tagIds: Array.isArray(p.tagIds) ? (p.tagIds as string[]) : [],
      pinned: p.pinned === true,
      pinnedOrder: typeof p.pinnedOrder === "number" ? p.pinnedOrder : 0,
      featured: p.featured === true,
      cardVariant: p.cardVariant === "wide" ? "wide" : "default",
      metaTitle: typeof p.metaTitle === "string" ? p.metaTitle : "",
      metaDescription: typeof p.metaDescription === "string" ? p.metaDescription : "",
    };
    return rowToEntry(virtualRow);
  } catch {
    return null;
  }
}

const DS_ACCENTS = new Set(["yellow", "violet", "sky", "terracotta", "pink", "blue", "red", "green"]);
function isDsAccent(v: unknown): v is DsAccentColor {
  return typeof v === "string" && DS_ACCENTS.has(v);
}

const SYSTEM_TAG_DEFAULTS: ReadonlyArray<MediaTag> = [
  { id: "lesson", label: "Урок", system: true, cardColor: "sky" },
  { id: "case", label: "Кейс", system: true, cardColor: "terracotta" },
];

function parseTagSeo(raw: unknown): MediaTagSeo | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const out: MediaTagSeo = {};
  for (const k of ["pageTitlePrefix", "pageTitleAccent", "metaTitle", "metaDescription", "intro"] as const) {
    const v = r[k];
    if (typeof v === "string" && v.trim()) out[k] = v;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export async function getAllTags(): Promise<MediaTag[]> {
  let rows: Array<{ id: string; label: string; disabled: boolean; system: boolean; cardColor: string | null; seo: unknown }> = [];
  try {
    rows = await prisma.mediaTag.findMany({ orderBy: { createdAt: "asc" } });
  } catch { /* fall through */ }

  const tags: MediaTag[] = rows.map((r): MediaTag => ({
    id: r.id,
    label: r.label,
    ...(r.disabled ? { disabled: true } : {}),
    ...(r.system ? { system: true } : {}),
    ...(isDsAccent(r.cardColor) ? { cardColor: r.cardColor } : {}),
    ...(parseTagSeo(r.seo) ? { seo: parseTagSeo(r.seo) } : {}),
  }));

  const byId = new Map(tags.map((t) => [t.id, t]));
  const merged: MediaTag[] = [];
  for (const def of SYSTEM_TAG_DEFAULTS) {
    const user = byId.get(def.id);
    byId.delete(def.id);
    merged.push({ ...def, ...(user ?? {}), id: def.id, label: user?.label?.trim() || def.label, system: true, cardColor: user?.cardColor ?? def.cardColor });
  }
  for (const t of tags) if (byId.has(t.id)) merged.push(t);
  return merged;
}

export async function getTagById(id: string): Promise<MediaTag | null> {
  const tags = await getAllTags();
  return tags.find((t) => t.id === id) ?? null;
}

export async function getPublicTags(): Promise<MediaTag[]> {
  return (await getAllTags()).filter((t) => !t.disabled);
}

export async function getTagUsage(): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  const all = await getAllArticles();
  for (const a of all) for (const t of a.tags) out[t] = (out[t] ?? 0) + 1;
  out.lesson = (out.lesson ?? 0) + all.filter((a) => a.type === "lesson").length;
  out.case = (out.case ?? 0) + all.filter((a) => a.type === "case").length;
  return out;
}

// ── Product aside resolver ──────────────────────────────────────────────────────

export type ResolvedProductAside = {
  slug: string;
  category: "consulting" | "academy" | "ai-products";
  title: string;
  description: string;
  coverUrl: string | null;
  experts: Array<{ name: string; image: string | null }>;
  href: string;
};

export async function resolveProductAside(
  slug: string,
  category: "consulting" | "academy" | "ai-products",
): Promise<ResolvedProductAside | null> {
  const product = await getProductBySlug(slug, category);
  if (!product) return null;
  return {
    slug: product.slug,
    category: product.category as ResolvedProductAside["category"],
    title: product.cardTitle || product.menuTitle || product.slug,
    description: product.cardDescription || "",
    coverUrl: product.heroImage ?? null,
    experts: (product.experts ?? []).map((ex) => ({ name: ex.name, image: ex.image ?? null })),
    href: `/${product.category}/${product.slug}`,
  };
}

export async function collectResolvedProductAsides(
  article: ArticleEntry,
): Promise<Record<string, ResolvedProductAside>> {
  const out: Record<string, ResolvedProductAside> = {};
  for (const section of article.sections) {
    for (const aside of section.asides) {
      if (aside.kind !== "product") continue;
      const key = `${aside.productCategory}:${aside.productSlug}`;
      if (out[key]) continue;
      const resolved = await resolveProductAside(aside.productSlug, aside.productCategory);
      if (resolved) out[key] = resolved;
    }
  }
  return out;
}

// ── CTA resolver ───────────────────────────────────────────────────────────────

import type { CtaEntity } from "./ctas";
import { getCtaById } from "./ctas";

export async function collectResolvedCtas(
  article: ArticleEntry,
): Promise<Record<string, CtaEntity>> {
  const out: Record<string, CtaEntity> = {};
  for (const section of article.sections) {
    if (section.bottomCtaId && !out[section.bottomCtaId]) {
      const cta = await getCtaById(section.bottomCtaId);
      if (cta) out[section.bottomCtaId] = cta;
    }
    for (const aside of section.asides) {
      if (aside.kind === "cta" && aside.ctaId && !out[aside.ctaId]) {
        const cta = await getCtaById(aside.ctaId);
        if (cta) out[aside.ctaId] = cta;
      }
    }
  }
  return out;
}

// ── Quote expert resolver ──────────────────────────────────────────────────────

export type ResolvedQuoteExpert = {
  slug: string;
  name: string;
  role: string;
  avatarUrl: string | null;
};

export async function collectResolvedQuoteExperts(
  article: ArticleEntry,
): Promise<Record<string, ResolvedQuoteExpert>> {
  const out: Record<string, ResolvedQuoteExpert> = {};
  for (const section of article.sections) {
    for (const quote of section.quotes) {
      const slug = quote.expertSlug;
      if (!slug || out[slug]) continue;
      const expert = await getExpertBySlug(slug);
      if (!expert) continue;
      out[slug] = { slug: expert.slug, name: expert.name, role: expert.tag, avatarUrl: expert.image };
    }
  }
  return out;
}
