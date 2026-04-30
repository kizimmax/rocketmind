import { getAllCatalogProducts } from "./products";

/** Catalog card shape passed to ProductsCatalog client component. */
export type CatalogCard = {
  slug: string;
  category: string;
  href: string;
  cardTitle: string;
  cardDescription: string;
  coverImage: string;
  experts: Array<{ name: string; tag?: string; image: string }>;
  /** Hero factoids for wide image cards (academy / ai-products) */
  factoids?: Array<{ number: string; text: string }>;
  /** Whether this product should show the "Экспертный продукт" tag. */
  expertProduct: boolean;
};

/** Section descriptor for each category block. */
export type CatalogSection = {
  key: string;
  title: string;
  description: string;
  cards: CatalogCard[];
};

const SECTION_META: Record<string, { title: string; description: string }> = {
  consulting: {
    title: "Консалтинг и стратегии",
    description:
      "Помогаем командам искать, проверять и усиливать бизнес-модели, связываем стратегию с операционными действиями и переходим от продуктовой логики к платформенной и экосистемной архитектуре",
  },
  academy: {
    title: "Онлайн-школа",
    description:
      "Академия Rocketmind — это среда, где управленцы и команды осваивают бизнес-дизайн, платформенное мышление и работу с гипотезами. Мы обучаем тому, что сами применяем в проектах: от системной стратегии до запуска цифровых инициатив.",
  },
  "ai-products": {
    title: "AI-продукты",
    description:
      "Встроенные ИИ-эксперты, которые усиливают мышление. Они помогают командам быстрее проходить через сложные задачи: от исследования и анализа до формирования бизнес-моделей и стратегий.",
  },
};

const CATEGORY_ORDER = ["consulting", "academy", "ai-products"];

function buildHref(category: string, slug: string): string {
  return `/${category}/${slug}`;
}

export function buildCatalogSections(): CatalogSection[] {
  const allProducts = getAllCatalogProducts();
  return CATEGORY_ORDER.map((cat) => {
    const meta = SECTION_META[cat];
    const cards: CatalogCard[] = allProducts
      .filter((p) => p.category === cat)
      .map((p) => ({
        slug: p.slug,
        category: p.category,
        href: buildHref(p.category, p.slug),
        cardTitle: p.cardTitle,
        cardDescription: p.cardDescription,
        coverImage: p.heroImage ?? "",
        experts:
          p.experts
            ?.filter((e) => e.image)
            .map((e) => ({
              name: e.name,
              tag: e.shortBio || e.tag,
              image: e.image!,
            })) ?? [],
        factoids:
          cat !== "consulting" && p.hero?.factoids?.length
            ? p.hero.factoids.slice(0, 3).map((f) => ({
                number: f.number,
                text: f.text,
              }))
            : undefined,
        expertProduct: p.expertProduct,
      }));

    return {
      key: cat,
      title: meta.title,
      description: meta.description,
      cards,
    };
  }).filter((s) => s.cards.length > 0);
}
