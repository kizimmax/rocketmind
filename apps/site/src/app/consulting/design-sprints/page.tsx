import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug("design-sprints");
  return {
    title: product?.metaTitle || "Организация дизайн-спринтов | Rocketmind",
    description: product?.metaDescription || "Быстрое тестирование идей через структурированные дизайн-спринты.",
  };
}

export default async function DesignSprintsPage() {
  const product = await getProductBySlug("design-sprints");
  if (!product) {
    return <ServicePageTemplate title="Организация дизайн-спринтов" subtitle="Быстрое тестирование идей через структурированные дизайн-спринты." />;
  }
  return <ServicePageTemplate product={product} />;
}
