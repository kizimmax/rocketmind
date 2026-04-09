import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

const product = getProductBySlug("business-design-teams", "academy");

export const metadata: Metadata = {
  title: product?.metaTitle || "Бизнес-дизайн для команд | Rocketmind",
  description: product?.metaDescription || "Практикум по бизнес-дизайну для команд.",
};

export default function BusinessDesignTeamsPage() {
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
