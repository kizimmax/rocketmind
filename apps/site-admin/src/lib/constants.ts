import type { AdminSection, BlockType } from "./types";

// ── Admin sections (match site header navigation) ───────────────────────────

export const ADMIN_SECTIONS: AdminSection[] = [
  { id: "consulting", label: "Консалтинг и стратегии", category: "consulting" },
  { id: "academy", label: "Онлайн-школа", category: "academy" },
  { id: "ai-products", label: "AI-продукты", category: "ai-products" },
  { id: "cases", label: "Кейсы", category: "cases" },
  { id: "media", label: "Медиа", category: "media" },
];

// ── Block type registry ─────────────────────────────────────────────────────

export const BLOCK_TYPES: Record<BlockType, { label: string; description: string }> = {
  hero: { label: "Hero + CTA", description: "Заголовок, описание, фактоиды, кнопка" },
  logoMarquee: { label: "Логотипы партнёров", description: "Бегущая строка логотипов" },
  about: { label: "О продукте", description: "Описание, аккордеон деталей" },
  audience: { label: "Для кого", description: "Целевая аудитория, факты" },
  results: { label: "Результаты", description: "Карточки результатов" },
  process: { label: "Процесс", description: "Этапы работы, участники" },
  experts: { label: "Эксперты", description: "Карточки экспертов продукта" },
  pageBottom: { label: "Кейсы + CTA", description: "Секция кейсов и финальный CTA" },
};

// ── Default block set for new pages ─────────────────────────────────────────

export const DEFAULT_BLOCK_TYPES: BlockType[] = [
  "hero",
  "logoMarquee",
  "about",
  "audience",
  "results",
  "process",
  "experts",
  "pageBottom",
];
