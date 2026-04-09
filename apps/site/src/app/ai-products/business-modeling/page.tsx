import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

const product = getProductBySlug("business-modeling", "ai-products");

export const metadata: Metadata = {
  title: product?.metaTitle || "ИИ-сервис моделирования бизнеса | Rocketmind",
  description: product?.metaDescription || "SaaS-платформа для моделирования бизнеса с помощью искусственного интеллекта.",
};

export default function BusinessModelingPage() {
  if (!product) {
    return <ServicePageTemplate title="ИИ-сервис моделирования бизнеса" subtitle="SaaS-платформа для моделирования бизнеса с помощью искусственного интеллекта." />;
  }
  return <ServicePageTemplate product={product} />;
}
