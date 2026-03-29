import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Диагностика готовности бизнеса к трансформации | Rocketmind",
  description:
    "Комплексная диагностика готовности бизнеса к цифровой трансформации.",
};

export default function BusinessReadinessPage() {
  return (
    <ServicePageTemplate
      title="Диагностика готовности бизнеса к трансформации"
      subtitle="Комплексная диагностика готовности бизнеса к цифровой трансформации."
    />
  );
}
