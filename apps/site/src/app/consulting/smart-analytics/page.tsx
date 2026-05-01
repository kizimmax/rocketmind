import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug("smart-analytics");
  return {
    title: product?.metaTitle || "Умная аналитика для развития бизнеса | Rocketmind",
    description: product?.metaDescription || "Связываем управленческие гипотезы с данными и ритмом решений.",
  };
}

export default async function SmartAnalyticsPage() {
  const product = await getProductBySlug("smart-analytics");
  if (!product) {
    return <ServicePageTemplate title="Умная аналитика для развития бизнеса" subtitle="Связываем управленческие гипотезы с данными и ритмом решений." />;
  }
  return <ServicePageTemplate product={product} />;
}
