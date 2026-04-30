import type { Metadata } from "next";
import { getPartnershipsData, type PartnershipsData } from "@/lib/partnerships";
import { buildCatalogSections } from "@/lib/catalog-sections";
import { ProductsCatalog } from "@/components/sections/ProductsCatalog";
import { PageBottom } from "@/components/sections/PageBottom";

export type { CatalogCard, CatalogSection } from "@/lib/catalog-sections";
export { type PartnershipsData };

export const metadata: Metadata = {
  title: "Продукты | Rocketmind",
  description:
    "Единый маркетплейс решений для трансформации вашего бизнеса. От бизнес-моделирования и консалтинга до корпоративного обучения и цифровых продуктов.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  const sections = buildCatalogSections();
  const partnerships = getPartnershipsData();

  return (
    <>
      <ProductsCatalog sections={sections} partnerships={partnerships} />
      <PageBottom />
    </>
  );
}
