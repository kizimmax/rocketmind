import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug("business-design-teams", "academy");
  return {
    title: product?.metaTitle || "Бизнес-дизайн для команд | Rocketmind",
    description: product?.metaDescription || "Практикум по бизнес-дизайну для команд.",
  };
}

export default async function BusinessDesignTeamsPage() {
  const product = await getProductBySlug("business-design-teams", "academy");
  if (!product) {
    return (
      <ServicePageTemplate
        title="ПРАКТИКУМ ПО БИЗНЕС-ДИЗАЙНУ ДЛЯ КОМАНД"
        subtitle="Страница курса будет добавлена позже."
      />
    );
  }
  return <ServicePageTemplate product={product} />;
}
