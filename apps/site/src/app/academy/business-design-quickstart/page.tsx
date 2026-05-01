import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug("business-design-quickstart", "academy");
  return {
    title: product?.metaTitle || "Бизнес-дизайн. Быстрый старт | Rocketmind",
    description: product?.metaDescription || "Интенсивный курс по основам бизнес-дизайна для быстрого старта.",
  };
}

export default async function BusinessDesignQuickstartPage() {
  const product = await getProductBySlug("business-design-quickstart", "academy");
  if (!product) {
    return <ServicePageTemplate title="Бизнес-дизайн. Быстрый старт" subtitle="Интенсивный курс по основам бизнес-дизайна для быстрого старта." />;
  }
  return <ServicePageTemplate product={product} />;
}
