import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

const product = getProductBySlug("design-sprints");

export const metadata: Metadata = {
  title: product?.metaTitle || "Организация дизайн-спринтов | Rocketmind",
  description: product?.metaDescription || "Быстрое тестирование идей через структурированные дизайн-спринты.",
};

export default function DesignSprintsPage() {
  if (!product) {
    return <ServicePageTemplate title="Организация дизайн-спринтов" subtitle="Быстрое тестирование идей через структурированные дизайн-спринты." />;
  }
  return <ServicePageTemplate product={product} />;
}
