import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export const metadata: Metadata = {
  title: "ИИ-агент по тестированию бизнес-гипотез | Rocketmind",
  description:
    "Автоматизированное тестирование бизнес-гипотез с помощью ИИ-агента.",
};

export default function HypothesisTestingPage() {
  return (
    <ServicePageTemplate
      title="ИИ-агент по тестированию бизнес-гипотез"
      subtitle="Автоматизированное тестирование бизнес-гипотез с помощью ИИ-агента."
    />
  );
}
