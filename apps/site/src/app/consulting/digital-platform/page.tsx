import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

const product = getProductBySlug("digital-platform");

export const metadata: Metadata = {
  title: product?.metaTitle || "Цифровая платформа в вашем бизнесе | Rocketmind",
  description: product?.metaDescription || "Внедрение цифровой платформы для трансформации бизнес-процессов.",
};

export default function DigitalPlatformPage() {
  if (!product) {
    return <ServicePageTemplate title="Цифровая платформа в вашем бизнесе" subtitle="Внедрение цифровой платформы для трансформации бизнес-процессов." />;
  }
  return <ServicePageTemplate product={product} />;
}
