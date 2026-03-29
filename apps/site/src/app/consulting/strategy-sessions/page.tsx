import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Стратегические и дизайн-сессии | Rocketmind",
  description:
    "Фасилитация стратегических и дизайн-сессий для вашей команды.",
};

export default function StrategySessionsPage() {
  return (
    <ServicePageTemplate
      title="Стратегические и дизайн-сессии"
      subtitle="Фасилитация стратегических и дизайн-сессий для вашей команды."
    />
  );
}
