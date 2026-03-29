import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Диагностика готовности команды к трансформации | Rocketmind",
  description:
    "Оценка готовности вашей команды к цифровой и организационной трансформации.",
};

export default function TeamReadinessPage() {
  return (
    <ServicePageTemplate
      title="Диагностика готовности команды к трансформации"
      subtitle="Оценка готовности вашей команды к цифровой и организационной трансформации."
    />
  );
}
