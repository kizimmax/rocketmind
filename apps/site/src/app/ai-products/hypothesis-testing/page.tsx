import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

const product = getProductBySlug("hypothesis-testing", "ai-products");

export const metadata: Metadata = {
  title: product?.metaTitle || "ИИ-агент по тестированию бизнес-гипотез | Rocketmind",
  description: product?.metaDescription || "Автоматизированное тестирование бизнес-гипотез с помощью ИИ-агента.",
};

export default function HypothesisTestingPage() {
  if (!product) {
    return <ServicePageTemplate title="ИИ-агент по тестированию бизнес-гипотез" subtitle="Автоматизированное тестирование бизнес-гипотез с помощью ИИ-агента." />;
  }
  return <ServicePageTemplate product={product} />;
}
