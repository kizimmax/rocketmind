import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

const product = getProductBySlug("smart-analytics");

export const metadata: Metadata = {
  title: product?.metaTitle || "Умная аналитика для развития бизнеса | Rocketmind",
  description: product?.metaDescription || "Связываем управленческие гипотезы с данными и ритмом решений.",
};

export default function SmartAnalyticsPage() {
  if (!product) {
    return <ServicePageTemplate title="Умная аналитика для развития бизнеса" subtitle="Связываем управленческие гипотезы с данными и ритмом решений." />;
  }
  return <ServicePageTemplate product={product} />;
}
