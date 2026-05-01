import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug("business-readiness");
  return {
    title: product?.metaTitle || "Диагностика готовности бизнеса к трансформации | Rocketmind",
    description: product?.metaDescription || "Комплексная диагностика готовности бизнеса к цифровой трансформации.",
  };
}

export default async function BusinessReadinessPage() {
  const product = await getProductBySlug("business-readiness");
  if (!product) {
    return <ServicePageTemplate title="Диагностика готовности бизнеса к трансформации" subtitle="Комплексная диагностика готовности бизнеса к цифровой трансформации." />;
  }
  return <ServicePageTemplate product={product} />;
}
