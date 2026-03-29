import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Цифровая платформа в вашем бизнесе | Rocketmind",
  description:
    "Внедрение цифровой платформы для трансформации бизнес-процессов.",
};

export default function DigitalPlatformPage() {
  return (
    <ServicePageTemplate
      title="Цифровая платформа в вашем бизнесе"
      subtitle="Внедрение цифровой платформы для трансформации бизнес-процессов."
    />
  );
}
