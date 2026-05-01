import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug("skolkovo");
  return {
    title: product?.metaTitle || "Получение статуса резидента Сколково | Rocketmind",
    description: product?.metaDescription || "Помощь в получении статуса резидента Сколково для вашей компании.",
  };
}

export default async function SkolkovoPage() {
  const product = await getProductBySlug("skolkovo");
  if (!product) {
    return <ServicePageTemplate title="Получение статуса резидента Сколково" subtitle="Помощь в получении статуса резидента Сколково для вашей компании." />;
  }
  return <ServicePageTemplate product={product} />;
}
