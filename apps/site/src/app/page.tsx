import { HeroSection } from "@/components/sections/HeroSection";
import { PlatformOverview } from "@/components/sections/PlatformOverview";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { CTASection } from "@/components/sections/CTASection";

export const metadata = {
  title: "Rocketmind | Стратегия и бизнес-модели",
  description:
    "Помогаем командам искать, проверять и усиливать бизнес-модели, связывать стратегию с операционными действиями и переходить от продуктовой логики к платформенной и экосистемной архитектуре.",
};

export default function RocketmindPage() {
  return (
    <>
      <HeroSection />
      <PlatformOverview />
      <ServicesGrid />
      <CTASection />
    </>
  );
}
