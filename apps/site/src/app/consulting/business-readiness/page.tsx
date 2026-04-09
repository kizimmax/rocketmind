import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

const product = getProductBySlug("business-readiness");

export const metadata: Metadata = {
  title: product?.metaTitle || "Диагностика готовности бизнеса к трансформации | Rocketmind",
  description: product?.metaDescription || "Комплексная диагностика готовности бизнеса к цифровой трансформации.",
};

export default function BusinessReadinessPage() {
  if (!product) {
    return <ServicePageTemplate title="Диагностика готовности бизнеса к трансформации" subtitle="Комплексная диагностика готовности бизнеса к цифровой трансформации." />;
  }
  return <ServicePageTemplate product={product} />;
}
