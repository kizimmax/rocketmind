import fs from "fs";
import path from "path";

/**
 * Ключи категорий каталога /products. Фиксированный набор: соответствует
 * фильтрам в `ProductsCatalog` и каталожным секциям. `expert` — синтетический
 * срез (`expertProduct === true`), у него нет своей директории контента.
 */
export type ProductCategorySlug =
  | "consulting"
  | "academy"
  | "expert"
  | "ai-products";

export const PRODUCT_CATEGORY_SLUGS: ProductCategorySlug[] = [
  "consulting",
  "academy",
  "expert",
  "ai-products",
];

export type ProductCategorySeo = {
  pageTitlePrefix?: string;
  pageTitleAccent?: string;
  metaTitle?: string;
  metaDescription?: string;
  intro?: string;
};

export type ProductCategory = {
  id: ProductCategorySlug;
  /** Дефолтный label чипа в фильтре (используется как fallback для H1-accent). */
  label: string;
  seo?: ProductCategorySeo;
};

const DEFAULT_LABELS: Record<ProductCategorySlug, string> = {
  consulting: "Консалтинг и стратегия",
  academy: "Онлайн-школа",
  expert: "Экспертные продукты",
  "ai-products": "AI-продукты",
};

const CATEGORIES_FILE = path.join(
  process.cwd(),
  "content",
  "products",
  "_categories.json",
);

function parseSeo(raw: unknown): ProductCategorySeo | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const out: ProductCategorySeo = {};
  for (const k of [
    "pageTitlePrefix",
    "pageTitleAccent",
    "metaTitle",
    "metaDescription",
    "intro",
  ] as const) {
    const v = r[k];
    if (typeof v === "string" && v.trim()) out[k] = v;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function readOverrides(): Record<string, ProductCategorySeo> {
  if (!fs.existsSync(CATEGORIES_FILE)) return {};
  try {
    const json = JSON.parse(fs.readFileSync(CATEGORIES_FILE, "utf-8")) as {
      categories?: Array<{ id?: string; seo?: unknown }>;
    };
    const out: Record<string, ProductCategorySeo> = {};
    for (const c of json.categories ?? []) {
      if (typeof c?.id !== "string") continue;
      const seo = parseSeo(c.seo);
      if (seo) out[c.id] = seo;
    }
    return out;
  } catch {
    return {};
  }
}

export function getAllProductCategories(): ProductCategory[] {
  const overrides = readOverrides();
  return PRODUCT_CATEGORY_SLUGS.map((id) => ({
    id,
    label: DEFAULT_LABELS[id],
    ...(overrides[id] ? { seo: overrides[id] } : {}),
  }));
}

export function getProductCategoryBySlug(
  slug: string,
): ProductCategory | null {
  if (!PRODUCT_CATEGORY_SLUGS.includes(slug as ProductCategorySlug)) return null;
  return (
    getAllProductCategories().find((c) => c.id === slug) ?? {
      id: slug as ProductCategorySlug,
      label: DEFAULT_LABELS[slug as ProductCategorySlug],
    }
  );
}
