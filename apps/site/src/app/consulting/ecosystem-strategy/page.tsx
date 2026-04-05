import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";
import { getProductBySlug } from "@/lib/products";

const product = getProductBySlug("ecosystem-strategy");

export const metadata: Metadata = {
  title: product?.metaTitle ?? "Экосистемная стратегия | Rocketmind",
  description: product?.metaDescription,
};

export default function EcosystemStrategyPage() {
  if (!product) return notFound();

  return <ServicePageTemplate product={product} />;
}
