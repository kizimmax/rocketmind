import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPartnershipsData } from "@/lib/partnerships";
import { buildCatalogSections } from "@/lib/catalog-sections";
import {
  PRODUCT_CATEGORY_SLUGS,
  getProductCategoryBySlug,
  type ProductCategorySlug,
} from "@/lib/product-categories";
import { ProductsCatalog } from "@/components/sections/ProductsCatalog";
import { PageBottom } from "@/components/sections/PageBottom";

export function generateStaticParams() {
  return PRODUCT_CATEGORY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getProductCategoryBySlug(slug);
  if (!category) return {};

  const accent = category.seo?.pageTitleAccent ?? category.label;
  const prefix = category.seo?.pageTitlePrefix ?? "Продукты";
  const title =
    category.seo?.metaTitle ?? `${prefix} — ${accent} | Rocketmind`;
  const description =
    category.seo?.metaDescription ??
    `${prefix}: ${accent.toLowerCase()} — каталог Rocketmind.`;

  return {
    title,
    description,
    alternates: { canonical: `/products/${slug}` },
  };
}

export default async function ProductsCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getProductCategoryBySlug(slug);
  if (!category) return notFound();

  const sections = buildCatalogSections();
  const partnerships = getPartnershipsData();

  return (
    <>
      <ProductsCatalog
        sections={sections}
        partnerships={partnerships}
        activeCategory={category.id as ProductCategorySlug}
        headingPrefix={category.seo?.pageTitlePrefix ?? "Продукты"}
        headingAccent={category.seo?.pageTitleAccent ?? category.label}
        intro={category.seo?.intro}
      />
      <PageBottom />
    </>
  );
}
