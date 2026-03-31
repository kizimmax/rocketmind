import { HeroSection } from "@/components/sections/HeroSection";
import { PageBottom } from "@/components/sections/PageBottom";
import { PlatformOverview } from "@/components/sections/PlatformOverview";
import { ServicesGrid } from "@/components/sections/ServicesGrid";

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
      <PageBottom />
    </>
  );
}
