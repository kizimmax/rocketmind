import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Умная аналитика для развития бизнеса | Rocketmind",
  description:
    "Связываем управленческие гипотезы с данными и ритмом решений.",
};

export default function SmartAnalyticsPage() {
  return (
    <ServicePageTemplate
      title="Умная аналитика для развития бизнеса"
      subtitle="Связываем управленческие гипотезы с данными и ритмом решений."
    />
  );
}
