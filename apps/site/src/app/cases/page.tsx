import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutHero } from "@/components/sections/AboutHero";
import { AboutRocketmindSection, ABOUT_RM_DEFAULTS } from "@/components/sections/AboutRocketmindSection";
import { CasesPageBlock } from "@/components/sections/CasesPageBlock";
import { CTASectionYellow } from "@/components/sections/CTASectionYellow";
import { LogoMarqueeSection } from "@/components/sections/LogoMarqueeSection";
import { getAllCases } from "@/lib/cases";
import { getTestimonials } from "@/lib/testimonials";
import { getCasesIndexPage } from "@/lib/unique";
import { getAboutRocketmindPhotos } from "@/lib/about-rocketmind";

export async function generateMetadata(): Promise<Metadata> {
  const page = getCasesIndexPage();
  return {
    title: page?.metaTitle || "Кейсы | Rocketmind",
    description: page?.metaDescription,
  };
}

export default function CasesPage() {
  const page = getCasesIndexPage();
  if (!page) return notFound();

  const cases = getAllCases();
  const testimonials = getTestimonials();

  return (
    <div className="flex flex-col">
      {/* 1. Hero — about-variant с заголовком «КЕЙСЫ» вместо логотипа */}
      <AboutHero
        caption={page.hero.caption}
        title={page.hero.title}
        description={page.hero.description}
        paragraphs={page.hero.paragraphs}
        ctaText={page.hero.ctaText}
        factoids={page.hero.factoids}
        heading={page.hero.heading || "Кейсы"}
        headingSecondary={page.hero.headingSecondary}
        descriptionBelow={page.hero.descriptionBelow}
        showExperts={page.hero.showExperts}
        maxExperts={page.hero.maxExperts}
        experts={page.experts.map((e) => ({
          name: e.name,
          tag: e.shortBio || e.tag,
          image: e.image,
        }))}
      />

      {/* 2. Карусель логотипов — сразу под фактоидами hero */}
      <LogoMarqueeSection noBorder />

      {/* 3. Sticky reviews + scrolling cases list */}
      <CasesPageBlock cases={cases} testimonials={testimonials} />

      {/* 3. О Rocketmind — стандартный блок из шаблонной продуктовой страницы */}
      <AboutRocketmindSection {...ABOUT_RM_DEFAULTS} {...getAboutRocketmindPhotos()} />


      {/* 4. CTA */}
      <CTASectionYellow />
    </div>
  );
}
