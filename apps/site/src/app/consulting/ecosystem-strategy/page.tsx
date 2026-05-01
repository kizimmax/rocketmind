import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug("ecosystem-strategy");
  return {
    title: product?.metaTitle ?? "Экосистемная стратегия | Rocketmind",
    description: product?.metaDescription,
  };
}

export default async function EcosystemStrategyPage() {
  const product = await getProductBySlug("ecosystem-strategy");
  if (!product) return notFound();
  return <ServicePageTemplate product={product} />;
}
