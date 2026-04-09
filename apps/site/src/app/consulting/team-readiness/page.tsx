import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

const product = getProductBySlug("team-readiness");

export const metadata: Metadata = {
  title: product?.metaTitle || "Диагностика готовности команды к трансформации | Rocketmind",
  description: product?.metaDescription || "Оценка готовности вашей команды к цифровой и организационной трансформации.",
};

export default function TeamReadinessPage() {
  if (!product) {
    return <ServicePageTemplate title="Диагностика готовности команды к трансформации" subtitle="Оценка готовности вашей команды к цифровой и организационной трансформации." />;
  }
  return <ServicePageTemplate product={product} />;
}
