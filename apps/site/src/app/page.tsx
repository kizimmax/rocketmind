import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/sections/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { PlatformOverview } from "@/components/sections/PlatformOverview";
import { RocketmindMenu } from "@/components/sections/RocketmindMenu";
import { ServicesGrid } from "@/components/sections/ServicesGrid";

export const metadata = {
  title: "Rocketmind | Стратегия и бизнес-модели",
  description:
    "Помогаем командам искать, проверять и усиливать бизнес-модели, связывать стратегию с операционными действиями и переходить от продуктовой логики к платформенной и экосистемной архитектуре.",
};


export default function RocketmindPage() {
  return (
    <div className="dark flex min-h-screen flex-col bg-background font-body text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PlatformOverview />
        <ServicesGrid />
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex h-16 max-w-[1512px] items-center justify-between gap-6 px-5 md:px-8 xl:px-14">
          <Link href="/" className="flex items-center">
            <Image
              src="/text_logo_dark_background_en.svg"
              alt="Rocketmind"
              width={90}
              height={12}
              className="h-auto w-[90px]"
            />
          </Link>

          <RocketmindMenu
            className="ml-auto hidden flex-1 items-center justify-end gap-12 lg:flex"
            showDropdowns={false}
          />

          <Link
            href="/"
            className="hidden lg:flex items-center font-mono text-[12px] uppercase tracking-widest text-muted-foreground/40 hover:text-muted-foreground transition-colors duration-150"
          >
            DS
          </Link>
        </div>
      </footer>
    </div>
  );
}
