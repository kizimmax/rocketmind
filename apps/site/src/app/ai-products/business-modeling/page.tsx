import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug("business-modeling", "ai-products");
  return {
    title: product?.metaTitle || "ИИ-сервис моделирования бизнеса | Rocketmind",
    description: product?.metaDescription || "SaaS-платформа для моделирования бизнеса с помощью искусственного интеллекта.",
  };
}

export default async function BusinessModelingPage() {
  const product = await getProductBySlug("business-modeling", "ai-products");
  if (!product) {
    return <ServicePageTemplate title="ИИ-сервис моделирования бизнеса" subtitle="SaaS-платформа для моделирования бизнеса с помощью искусственного интеллекта." />;
  }
  return <ServicePageTemplate product={product} />;
}
