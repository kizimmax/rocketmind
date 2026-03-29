import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Получение статуса резидента Сколково | Rocketmind",
  description:
    "Помощь в получении статуса резидента Сколково для вашей компании.",
};

export default function SkolkovoPage() {
  return (
    <ServicePageTemplate
      title="Получение статуса резидента Сколково"
      subtitle="Помощь в получении статуса резидента Сколково для вашей компании."
    />
  );
}
