import type { AdminSection, BlockType } from "./types";

// ── Admin sections (match site header navigation) ───────────────────────────

export const ADMIN_SECTIONS: AdminSection[] = [
  { id: "consulting", label: "Консалтинг и стратегии", category: "consulting" },
  { id: "academy", label: "Онлайн-школа", category: "academy" },
  { id: "ai-products", label: "AI-продукты", category: "ai-products" },
  { id: "cases", label: "Кейсы", category: "cases" },
  { id: "media", label: "Медиа", category: "media" },
  { id: "unique", label: "Уникальные", category: "unique" },
];

/** Section IDs where pages cannot be created manually — they are seeded and fixed. */
export const LOCKED_SECTIONS = new Set<string>(["unique"]);

/** Unique pages and their absolute routes on the public site. */
export const UNIQUE_PAGE_ROUTES: Record<string, string> = {
  home: "/",
  about: "/about",
  // Legacy alias (page slug was previously "rocketmind") — keep for any old references.
  rocketmind: "/about",
  "cases-index": "/cases",
};

/** Maximum number of cases that can be marked `featured: true` (shown on every page). */
export const MAX_FEATURED_CASES = 5;

/** Filter keys on /products — used by the home "homeSections" block to bind a section to a filter. */
export const PRODUCTS_FILTER_KEYS: Array<{ key: string; label: string; category?: string }> = [
  { key: "consulting", label: "Консалтинг и стратегии", category: "consulting" },
  { key: "academy", label: "Онлайн-школа", category: "academy" },
  { key: "ai-products", label: "AI-продукты", category: "ai-products" },
  { key: "expert", label: "Экспертные продукты" },
];

// ── Block type registry ─────────────────────────────────────────────────────

export const BLOCK_TYPES: Record<BlockType, { label: string; description: string }> = {
  hero: { label: "Hero + CTA", description: "Заголовок, описание, фактоиды, кнопка" },
  homeHero: { label: "Hero главной", description: "Заголовок, ротирующиеся строчки с CTA, подпись PIK" },
  methodology: { label: "Методология", description: "Три ячейки: методология, синергия, канвасы" },
  homeSections: { label: "Разделы", description: "Блок с табами разделов и карточками — привязан к фильтрам /products" },
  logoMarquee: { label: "Логотипы партнёров", description: "Бегущая строка логотипов" },
  about: { label: "О продукте", description: "Описание, аккордеон деталей" },
  projects: { label: "Проекты", description: "О продукте с редактируемой сеткой логотипов" },
  audience: { label: "Для кого", description: "Целевая аудитория, факты" },
  tools: { label: "Инструменты", description: "Карточки инструментов с нумерацией" },
  results: { label: "Результаты", description: "Карточки результатов" },
  process: { label: "Процесс", description: "Этапы работы, участники" },
  services: { label: "Услуги", description: "Бенто-сетка карточек услуг" },
  experts: { label: "Эксперты", description: "Карточки экспертов продукта" },
  partnerships: { label: "Партнёрства", description: "Блок партнёрств с бизнес-школами (общий)" },
  aboutRocketmind: { label: "О Rocketmind", description: "Блок о компании с AI-агентами" },
  pageBottom: { label: "Кейсы + CTA", description: "Секция кейсов и финальный CTA" },
  customSection: { label: "Произвольный блок", description: "Универсальный блок на основе «О продукте»" },
  caseCard: { label: "Карточка кейса", description: "Заголовок, описание, 3 показателя, итог" },
  casesList: { label: "Список кейсов", description: "Скролл-блок с отзывами и кейсами на странице /cases" },
};

/** Block types that can be inserted between other blocks (as user-added custom sections). */
export const INSERTABLE_BLOCK_TYPES: BlockType[] = ["customSection"];

/** IDs for custom block prefix — used to distinguish from built-in blocks. */
export const CUSTOM_BLOCK_ID_PREFIX = "cs_";

// ── Default block set for new pages ─────────────────────────────────────────

export const DEFAULT_BLOCK_TYPES: BlockType[] = [
  "hero",
  "logoMarquee",
  "about",
  "partnerships",
  "audience",
  "tools",
  "results",
  "services",
  "process",
  "experts",
  "aboutRocketmind",
  "pageBottom",
];
