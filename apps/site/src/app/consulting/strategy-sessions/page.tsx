import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

const product = getProductBySlug("strategy-sessions");

export const metadata: Metadata = {
  title: product?.metaTitle || "Стратегические и дизайн-сессии | Rocketmind",
  description: product?.metaDescription || "Фасилитация стратегических и дизайн-сессий для вашей команды.",
};

export default function StrategySessionsPage() {
  if (!product) {
    return <ServicePageTemplate title="Стратегические и дизайн-сессии" subtitle="Фасилитация стратегических и дизайн-сессий для вашей команды." />;
  }
  return <ServicePageTemplate product={product} />;
}
