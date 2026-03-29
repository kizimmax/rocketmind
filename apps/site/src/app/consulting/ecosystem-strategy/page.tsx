import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Экосистемная стратегия | Rocketmind",
  description:
    "Переход от линейной модели к экосистемной архитектуре роста.",
};

export default function EcosystemStrategyPage() {
  return (
    <ServicePageTemplate
      title="Экосистемная стратегия"
      subtitle="Переход от линейной модели к экосистемной архитектуре роста."
    />
  );
}
