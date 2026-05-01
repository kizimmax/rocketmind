import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug("digital-platform");
  return {
    title: product?.metaTitle || "Цифровая платформа в вашем бизнесе | Rocketmind",
    description: product?.metaDescription || "Внедрение цифровой платформы для трансформации бизнес-процессов.",
  };
}

export default async function DigitalPlatformPage() {
  const product = await getProductBySlug("digital-platform");
  if (!product) {
    return <ServicePageTemplate title="Цифровая платформа в вашем бизнесе" subtitle="Внедрение цифровой платформы для трансформации бизнес-процессов." />;
  }
  return <ServicePageTemplate product={product} />;
}
