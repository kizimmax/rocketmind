import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ForWhomSection,
  ProcessSection,
  ExpertsSection,
  ToolsSection,
  ContactsSection,
} from "@rocketmind/ui";
import { AboutHero } from "@/components/sections/AboutHero";
import { AboutProduct } from "@/components/sections/AboutProduct";
import { AboutProjects } from "@/components/sections/AboutProjects";
import { LogoMarqueeSection } from "@/components/sections/LogoMarqueeSection";
import { PageBottom } from "@/components/sections/PageBottom";
import { AboutRocketmindSection } from "@/components/sections/AboutRocketmindSection";
import { ABOUT_RM_DEFAULTS } from "@/components/sections/about-rocketmind-defaults";
import { getAboutPage } from "@/lib/unique";
import { getAboutRocketmindPhotos } from "@/lib/about-rocketmind";

export async function generateMetadata(): Promise<Metadata> {
  const page = getAboutPage();
  return {
    title: page?.metaTitle || "О Rocketmind",
    description: page?.metaDescription,
  };
}

export default function AboutPage() {
  const page = getAboutPage();
  if (!page) return notFound();

  return (
    <div className="flex flex-col">
      {/* 1. Hero — about-variant: description + experts strip + 2×2 factoids */}
      <AboutHero
        caption={page.hero.caption}
        title={page.hero.title}
        description={page.hero.description}
        paragraphs={page.hero.paragraphs}
        ctaText={page.hero.ctaText}
        factoids={page.hero.factoids}
        heading={page.hero.heading}
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

      {/* 2. Logos marquee (right below hero, no top border on about page) */}
      <LogoMarqueeSection noBorder />

      {/* 3. О Rocketmind — about-with-image */}
      {page.about ? (
        <AboutProduct
          caption={page.about.caption}
          title={page.about.title}
          titleSecondary={page.about.titleSecondary}
          paragraphs={page.about.paragraphs}
          accordion={page.about.accordion}
          accordionCollapsible={page.about.accordionCollapsible}
          imageLeft={page.about.imageLeft}
          paragraphsRight={page.about.paragraphsRight}
          aboutImage={page.aboutImage}
        />
      ) : null}

      {/* 4. Инструменты и методы */}
      {page.tools ? (
        <ToolsSection
          tag={page.tools.tag}
          title={page.tools.title}
          titleSecondary={page.tools.titleSecondary}
          description={page.tools.description}
          paragraphs={page.tools.paragraphs}
          tools={page.tools.tools}
          useIcons={page.tools.useIcons}
          descriptionBelow={page.tools.descriptionBelow}
        />
      ) : null}

      {/* 5. Проекты — about-clone with logoGrid */}
      {page.projects ? (
        <AboutProjects {...page.projects} />
      ) : null}

      {/* 6. Хронология — process */}
      {page.process ? (
        <ProcessSection
          tag={page.process.tag}
          title={page.process.title}
          titleSecondary={page.process.titleSecondary}
          subtitle={page.process.subtitle}
          subtitleUppercase={page.process.subtitleUppercase}
          description={page.process.description}
          paragraphs={page.process.paragraphs ?? page.process.descriptionParagraphs}
          steps={page.process.steps}
          participantsTag={page.process.participantsTag}
          participants={page.process.participants}
          variant={page.process.variant}
        />
      ) : null}

      {/* 7. Эксперты */}
      {page.experts.length > 0 ? (
        <ExpertsSection experts={page.experts} />
      ) : null}

      {/* 8. О Rocketmind — сквозной блок */}
      {page.aboutRocketmindEnabled ? (
        <AboutRocketmindSection
          {...ABOUT_RM_DEFAULTS}
          {...getAboutRocketmindPhotos()}
          {...(page.aboutRocketmind ?? {})}
        />
      ) : null}

      {/* 9. Контакты */}
      {page.contacts ? (
        <ContactsSection
          tag={page.contacts.tag}
          title={page.contacts.title}
          titleSecondary={page.contacts.titleSecondary}
          paragraphs={page.contacts.paragraphs}
          cards={page.contacts.cards}
        />
      ) : page.audience ? (
        <ForWhomSection
          tag={page.audience.tag}
          title={page.audience.title}
          titleSecondary={page.audience.titleSecondary}
          subtitle={page.audience.subtitle}
          paragraphs={page.audience.paragraphs}
          facts={page.audience.facts}
          wideColumn={page.audience.wideColumn}
        />
      ) : null}

      {/* 10. Сквозной pageBottom — кейсы + CTA */}
      <PageBottom />
    </div>
  );
}
