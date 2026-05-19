/**
 * Hardcoded section tree for the permission system.
 *
 * - `id` is a path token (no dots). Full path = parent.path + "." + id.
 * - `refinable: true` means: in addition to static children defined here,
 *   the admin UI may load real entities from the DB to grant per-item
 *   access (e.g. specific products inside a category).
 * - Leaf nodes without `children` and without `refinable` get a single
 *   VIEW/EDIT checkbox in the UI.
 */

export type SectionKind =
  | "page"
  | "product-category"
  | "product"
  | "article"
  | "glossary-term"
  | "expert"
  | "testimonial"
  | "cta"
  | "form"
  | "ai-agent"
  | "program"
  | "case"
  | "media-tag"
  | "submission"
  | "redirect";

export interface SectionDef {
  id: string;
  label: string;
  /** Backing entity kind for dynamic child loading. */
  kind?: SectionKind;
  /** Static sub-sections. */
  children?: SectionDef[];
  /** UI may load entities of `kind` as additional children at runtime. */
  refinable?: boolean;
}

export const SECTIONS: SectionDef[] = [
  {
    id: "pages",
    label: "Страницы",
    kind: "page",
    refinable: true,
  },
  {
    id: "media",
    label: "Медиа",
    children: [
      { id: "articles", label: "Статьи", kind: "article", refinable: true },
      { id: "glossary", label: "Глоссарий", kind: "glossary-term", refinable: true },
      { id: "tags", label: "Теги", kind: "media-tag", refinable: true },
    ],
  },
  {
    id: "products",
    label: "Продукты",
    children: [
      { id: "categories", label: "Категории", kind: "product-category", refinable: true },
      { id: "items", label: "Товары", kind: "product", refinable: true },
    ],
  },
  {
    id: "experts",
    label: "Эксперты",
    kind: "expert",
    refinable: true,
  },
  {
    id: "cases",
    label: "Кейсы",
    kind: "case",
    refinable: true,
  },
  {
    id: "testimonials",
    label: "Отзывы",
    kind: "testimonial",
    refinable: true,
  },
  {
    id: "cta-forms",
    label: "CTA и формы",
    children: [
      { id: "ctas", label: "CTA", kind: "cta", refinable: true },
      { id: "forms", label: "Формы", kind: "form", refinable: true },
    ],
  },
  {
    id: "submissions",
    label: "Заявки",
    kind: "submission",
    refinable: true,
  },
  {
    id: "ai-agents",
    label: "AI-эксперты",
    kind: "ai-agent",
    refinable: true,
  },
  {
    id: "programs",
    label: "Программы",
    children: [
      { id: "list", label: "Программы", kind: "program", refinable: true },
      { id: "students", label: "Студенты" },
      { id: "places", label: "Площадки" },
      { id: "program-agents", label: "Программные агенты" },
    ],
  },
  {
    id: "system",
    label: "Системные",
    children: [
      { id: "settings", label: "Настройки" },
      { id: "audit-log", label: "Аудит-лог" },
      { id: "users", label: "Пользователи" },
    ],
  },
  {
    id: "redirects",
    label: "Редиректы",
    kind: "redirect",
    refinable: true,
  },
];

/**
 * Flat map: path -> SectionDef, for fast lookup and validation that a granted
 * path actually exists in the static tree (dynamic refinable items are
 * validated separately against the DB at write-time).
 */
function buildPathMap(): Map<string, SectionDef> {
  const map = new Map<string, SectionDef>();
  function walk(prefix: string, nodes: SectionDef[]) {
    for (const n of nodes) {
      const path = prefix ? `${prefix}.${n.id}` : n.id;
      map.set(path, n);
      if (n.children) walk(path, n.children);
    }
  }
  walk("", SECTIONS);
  return map;
}

export const SECTION_PATH_MAP = buildPathMap();

/** Returns the SectionDef for a static path, or null if it's a dynamic leaf or unknown. */
export function findStaticSection(path: string): SectionDef | null {
  return SECTION_PATH_MAP.get(path) ?? null;
}

/**
 * Splits a granted path into static prefix and dynamic suffix.
 * Example: "products.items.<uuid>" -> { staticPath: "products.items", itemId: "<uuid>" }
 */
export function splitDynamic(path: string): { staticPath: string; itemId: string | null } {
  const parts = path.split(".");
  for (let i = parts.length; i >= 1; i--) {
    const candidate = parts.slice(0, i).join(".");
    if (SECTION_PATH_MAP.has(candidate)) {
      const remainder = parts.slice(i).join(".");
      return { staticPath: candidate, itemId: remainder || null };
    }
  }
  return { staticPath: "", itemId: null };
}
