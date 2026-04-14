import type { Metadata } from "next";
import { getAllCatalogProducts } from "@/lib/products";
import { ProductsCatalog } from "@/components/sections/ProductsCatalog";
import { PageBottom } from "@/components/sections/PageBottom";

export const metadata: Metadata = {
  title: "Продукты | Rocketmind",
  description:
    "Единый маркетплейс решений для трансформации вашего бизнеса. От бизнес-моделирования и консалтинга до корпоративного обучения и цифровых продуктов.",
};

/** Catalog card shape passed to the client component. */
export type CatalogCard = {
  slug: string;
  category: string;
  href: string;
  cardTitle: string;
  cardDescription: string;
  coverImage: string;
  experts: Array<{ name: string; image: string }>;
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

export default function ProductsPage() {
  const allProducts = getAllCatalogProducts();

  const sections: CatalogSection[] = CATEGORY_ORDER.map((cat) => {
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
            .map((e) => ({ name: e.name, image: e.image! })) ?? [],
      }));

    return {
      key: cat,
      title: meta.title,
      description: meta.description,
      cards,
    };
  }).filter((s) => s.cards.length > 0);

  return (
    <>
      <ProductsCatalog sections={sections} />
      <PageBottom />
    </>
  );
}
