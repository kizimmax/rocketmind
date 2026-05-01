import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug("team-readiness");
  return {
    title: product?.metaTitle || "Диагностика готовности команды к трансформации | Rocketmind",
    description: product?.metaDescription || "Оценка готовности вашей команды к цифровой и организационной трансформации.",
  };
}

export default async function TeamReadinessPage() {
  const product = await getProductBySlug("team-readiness");
  if (!product) {
    return <ServicePageTemplate title="Диагностика готовности команды к трансформации" subtitle="Оценка готовности вашей команды к цифровой и организационной трансформации." />;
  }
  return <ServicePageTemplate product={product} />;
}
