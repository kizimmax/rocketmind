import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug("hypothesis-testing", "ai-products");
  return {
    title: product?.metaTitle || "ИИ-агент по тестированию бизнес-гипотез | Rocketmind",
    description: product?.metaDescription || "Автоматизированное тестирование бизнес-гипотез с помощью ИИ-агента.",
  };
}

export default async function HypothesisTestingPage() {
  const product = await getProductBySlug("hypothesis-testing", "ai-products");
  if (!product) {
    return <ServicePageTemplate title="ИИ-агент по тестированию бизнес-гипотез" subtitle="Автоматизированное тестирование бизнес-гипотез с помощью ИИ-агента." />;
  }
  return <ServicePageTemplate product={product} />;
}
