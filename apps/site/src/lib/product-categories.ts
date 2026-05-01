import { prisma } from "./prisma";

export type ProductCategorySlug = "consulting" | "academy" | "expert" | "ai-products";

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
  label: string;
  seo?: ProductCategorySeo;
};

const DEFAULT_LABELS: Record<ProductCategorySlug, string> = {
  consulting: "Консалтинг и стратегия",
  academy: "Онлайн-школа",
  expert: "Экспертные продукты",
  "ai-products": "AI-продукты",
};

function parseSeo(raw: unknown): ProductCategorySeo | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const out: ProductCategorySeo = {};
  for (const k of ["pageTitlePrefix", "pageTitleAccent", "metaTitle", "metaDescription", "intro"] as const) {
    const v = r[k];
    if (typeof v === "string" && v.trim()) out[k] = v;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export async function getAllProductCategories(): Promise<ProductCategory[]> {
  try {
    const row = await prisma.systemConfig.findUnique({ where: { key: "product-categories" } });
    const overrides: Record<string, ProductCategorySeo> = {};
    if (row) {
      const raw = row.value as { categories?: Array<{ id?: string; seo?: unknown }> };
      for (const c of raw.categories ?? []) {
        if (typeof c?.id !== "string") continue;
        const seo = parseSeo(c.seo);
        if (seo) overrides[c.id] = seo;
      }
    }
    return PRODUCT_CATEGORY_SLUGS.map((id) => ({
      id,
      label: DEFAULT_LABELS[id],
      ...(overrides[id] ? { seo: overrides[id] } : {}),
    }));
  } catch {
    return PRODUCT_CATEGORY_SLUGS.map((id) => ({ id, label: DEFAULT_LABELS[id] }));
  }
}

export async function getProductCategoryBySlug(slug: string): Promise<ProductCategory | null> {
  if (!PRODUCT_CATEGORY_SLUGS.includes(slug as ProductCategorySlug)) return null;
  const all = await getAllProductCategories();
  return all.find((c) => c.id === slug) ?? { id: slug as ProductCategorySlug, label: DEFAULT_LABELS[slug as ProductCategorySlug] };
}
