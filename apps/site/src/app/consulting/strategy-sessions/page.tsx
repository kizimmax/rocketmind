import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug("strategy-sessions");
  return {
    title: product?.metaTitle || "Стратегические и дизайн-сессии | Rocketmind",
    description: product?.metaDescription || "Фасилитация стратегических и дизайн-сессий для вашей команды.",
  };
}

export default async function StrategySessionsPage() {
  const product = await getProductBySlug("strategy-sessions");
  if (!product) {
    return <ServicePageTemplate title="Стратегические и дизайн-сессии" subtitle="Фасилитация стратегических и дизайн-сессий для вашей команды." />;
  }
  return <ServicePageTemplate product={product} />;
}
