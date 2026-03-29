import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Организация дизайн-спринтов | Rocketmind",
  description:
    "Быстрое тестирование идей через структурированные дизайн-спринты.",
};

export default function DesignSprintsPage() {
  return (
    <ServicePageTemplate
      title="Организация дизайн-спринтов"
      subtitle="Быстрое тестирование идей через структурированные дизайн-спринты."
    />
  );
}
