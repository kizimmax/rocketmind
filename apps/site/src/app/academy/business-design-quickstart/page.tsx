import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

const product = getProductBySlug("business-design-quickstart", "academy");

export const metadata: Metadata = {
  title: product?.metaTitle || "Бизнес-дизайн. Быстрый старт | Rocketmind",
  description: product?.metaDescription || "Интенсивный курс по основам бизнес-дизайна для быстрого старта.",
};

export default function BusinessDesignQuickstartPage() {
  if (!product) {
    return <ServicePageTemplate title="Бизнес-дизайн. Быстрый старт" subtitle="Интенсивный курс по основам бизнес-дизайна для быстрого старта." />;
  }
  return <ServicePageTemplate product={product} />;
}
