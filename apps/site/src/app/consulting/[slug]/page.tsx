import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug, "consulting");
  if (!product) return {};
  return {
    title: product.metaTitle || `${product.menuTitle ?? slug} | Rocketmind`,
    description: product.metaDescription ?? "",
  };
}

export default async function ConsultingProductPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug, "consulting");
  if (!product) notFound();
  return <ServicePageTemplate product={product} />;
}
