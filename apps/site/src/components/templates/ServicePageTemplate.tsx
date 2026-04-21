import { PageBottom } from "@/components/sections/PageBottom";
import { ProductHero } from "@/components/sections/ProductHero";
import { ProductHeroImage } from "@/components/sections/ProductHeroImage";
import { AboutProduct } from "@/components/sections/AboutProduct";
import { LogoMarqueeSection } from "@/components/sections/LogoMarqueeSection";
import { AboutRocketmindSection } from "@/components/sections/AboutRocketmindSection";
import { ABOUT_RM_DEFAULTS } from "@/components/sections/about-rocketmind-defaults";
import { ForWhomSection, ProcessSection, ResultsSection, ExpertsSection, ToolsSection, PartnershipBlock, ServicesSection } from "@rocketmind/ui";
import type { ProductData, CustomSectionData } from "@/lib/products";
import { getPartnershipsData } from "@/lib/partnerships";
import { getAboutRocketmindPhotos } from "@/lib/about-rocketmind";

function CustomSectionsAfter({
  type,
  sections,
}: {
  type: string | null;
  sections: CustomSectionData[];
}) {
  const matching = sections.filter((s) => s.insertAfter === type);
  if (matching.length === 0) return null;
  return (
    <>
      {matching.map((s) => (
        <AboutProduct
          key={s.id}
          caption={s.about.caption}
          title={s.about.title}
          titleSecondary={s.about.titleSecondary}
          paragraphs={s.about.paragraphs}
          accordion={s.about.accordion}
          accordionCollapsible={s.about.accordionCollapsible}
          imageLeft={s.about.imageLeft}
          paragraphsRight={s.about.paragraphsRight}
          aboutImage={null}
        />
      ))}
    </>
  );
}

/**
 * Шаблон страницы услуги консалтинга / AI-продукта.
 *
 * Блоки (по PRD):
 * 1. Hero + CTA
 * 2. Социальное доказательство
 * 3. О продукте (ключевая ценность)
 * 4. Для кого это решение
 * 5. Инструменты (опционально)
 * 6. Твёрдые результаты
 * 7. Прозрачный процесс (этапы)
 * 8. Продолжительность (опционально)
 * 9. Уникальность (Почему Rocketmind)
 * 10. Эксперт (опционально)
 * 11. Кейсы
 * 12. Отзывы
 * 13. CTA
 */

type ServicePageTemplateProps =
  | { product: ProductData }
  | { title: string; subtitle: string };

export async function ServicePageTemplate(props: ServicePageTemplateProps) {
  const hasProduct = "product" in props;
  const isAcademy = hasProduct && props.product.category === "academy";
  const partnerships = isAcademy ? getPartnershipsData() : null;
  const aboutRmPhotos = getAboutRocketmindPhotos();
  const customSections: CustomSectionData[] = hasProduct ? props.product.customSections : [];

  return (
    <div className="flex flex-col">
      {/* Custom sections inserted before the hero */}
      <CustomSectionsAfter type={null} sections={customSections} />

      {/* 1. Hero + CTA */}
      {hasProduct && (props.product.category === "academy" || props.product.category === "ai-products") ? (
        <ProductHeroImage
          caption={props.product.hero.caption}
          title={props.product.hero.title}
          titleSecondary={props.product.hero.titleSecondary}
          description={props.product.hero.description}
          paragraphs={props.product.hero.paragraphs}
          ctaText={props.product.hero.ctaText}
          factoids={props.product.hero.factoids}
          coverImage={props.product.heroImage}
          tags={props.product.hero.tags}
          secondaryCta={props.product.hero.secondaryCta}
          audioSrc={props.product.hero.audioData}
        />
      ) : hasProduct ? (
        <ProductHero
          caption={props.product.hero.caption}
          title={props.product.hero.title}
          titleSecondary={props.product.hero.titleSecondary}
          description={props.product.hero.description}
          paragraphs={props.product.hero.paragraphs}
          ctaText={props.product.hero.ctaText}
          factoids={props.product.hero.factoids}
          coverImage={props.product.coverImage}
          tags={props.product.hero.tags}
          expertProduct={props.product.expertProduct}
          experts={
            props.product.experts?.map((e) => ({
              name: e.name,
              tag: e.shortBio || e.tag,
              image: e.image,
            })) ?? undefined
          }
          quote={props.product.hero.quote}
        />
      ) : (
        <section className="flex min-h-[60vh] flex-col items-center justify-center px-5 py-24 text-center md:px-8 xl:px-14">
          <div className="mx-auto max-w-[1512px]">
            <h1 className="h1 text-foreground">{props.title}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              {props.subtitle}
            </p>
            <div className="mt-10">
              <span className="inline-block rounded-sm bg-foreground px-8 py-3 font-mono text-sm uppercase tracking-wider text-background">
                Оставить заявку
              </span>
            </div>
          </div>
        </section>
      )}
      <CustomSectionsAfter type="hero" sections={customSections} />

      {/* 2. Социальное доказательство — логотипы партнёров (управляется через CMS) */}
      {(!hasProduct || props.product.logoMarqueeEnabled) && (
        <LogoMarqueeSection noBorder={hasProduct && (props.product.category === "academy" || props.product.category === "ai-products")} />
      )}
      <CustomSectionsAfter type="logoMarquee" sections={customSections} />

      {/* 3. О продукте */}
      {hasProduct && props.product.about ? (
        <AboutProduct
          caption={props.product.about.caption}
          title={props.product.about.title}
          titleSecondary={props.product.about.titleSecondary}
          paragraphs={props.product.about.paragraphs}
          accordion={props.product.about.accordion}
          accordionCollapsible={props.product.about.accordionCollapsible}
          imageLeft={props.product.about.imageLeft}
          paragraphsRight={props.product.about.paragraphsRight}
          aboutImage={props.product.aboutImage}
        />
      ) : null}
      <CustomSectionsAfter type="about" sections={customSections} />

      {/* Partnerships — academy only, after "О продукте" */}
      {partnerships && (
        <section className="border-t border-[#404040] bg-[#0A0A0A] px-5 py-16 md:px-8 md:py-20 xl:px-14">
          <div className="mx-auto max-w-[1512px]">
            <PartnershipBlock
              caption={partnerships.caption}
              title={partnerships.title}
              description={partnerships.description}
              paragraphs={partnerships.paragraphs}
              logos={partnerships.logos}
              photos={partnerships.photos}
            />
          </div>
        </section>
      )}

      {hasProduct && partnerships && <CustomSectionsAfter type="partnerships" sections={customSections} />}

      {/* 4. Для кого */}
      {hasProduct && props.product.audience ? (
        <ForWhomSection
          tag={props.product.audience.tag}
          title={props.product.audience.title}
          titleSecondary={props.product.audience.titleSecondary}
          subtitle={props.product.audience.subtitle}
          paragraphs={props.product.audience.paragraphs}
          facts={props.product.audience.facts}
          wideColumn={props.product.audience.wideColumn}
        />
      ) : null}
      <CustomSectionsAfter type="audience" sections={customSections} />

      {/* 5. Инструменты (опционально) */}
      {hasProduct && props.product.tools ? (
        <ToolsSection
          tag={props.product.tools.tag}
          title={props.product.tools.title}
          titleSecondary={props.product.tools.titleSecondary}
          description={props.product.tools.description}
          paragraphs={props.product.tools.paragraphs}
          tools={props.product.tools.tools}
          useIcons={props.product.tools.useIcons}
          descriptionBelow={props.product.tools.descriptionBelow}
        />
      ) : null}
      <CustomSectionsAfter type="tools" sections={customSections} />

      {/* 6. Твёрдые результаты */}
      {hasProduct && props.product.results ? (
        <ResultsSection
          tag={props.product.results.tag}
          title={props.product.results.title}
          titleSecondary={props.product.results.titleSecondary}
          description={props.product.results.description}
          paragraphs={props.product.results.paragraphs}
          cards={props.product.results.cards}
        />
      ) : null}
      <CustomSectionsAfter type="results" sections={customSections} />

      {/* Услуги (опционально, перед процессом) */}
      {hasProduct && props.product.services && props.product.services.cards?.length > 0 ? (
        <ServicesSection
          tag={props.product.services.tag}
          title={props.product.services.title}
          titleSecondary={props.product.services.titleSecondary}
          description={props.product.services.description}
          paragraphs={props.product.services.paragraphs}
          cards={props.product.services.cards}
        />
      ) : null}
      <CustomSectionsAfter type="services" sections={customSections} />

      {/* 7. Прозрачный процесс (этапы) */}
      {hasProduct && props.product.process ? (
        <ProcessSection
          tag={props.product.process.tag}
          title={props.product.process.title}
          titleSecondary={props.product.process.titleSecondary}
          subtitle={props.product.process.subtitle}
          subtitleUppercase={props.product.process.subtitleUppercase}
          description={props.product.process.description}
          paragraphs={props.product.process.paragraphs ?? props.product.process.descriptionParagraphs}
          steps={props.product.process.steps}
          participantsTag={props.product.process.participantsTag}
          participants={props.product.process.participants}
          variant={props.product.process.variant}
        />
      ) : null}
      <CustomSectionsAfter type="process" sections={customSections} />

      {/* 9. Эксперт (опционально) */}
      {hasProduct && props.product.experts && props.product.experts.length > 0 ? (
        <ExpertsSection experts={props.product.experts} />
      ) : null}
      <CustomSectionsAfter type="experts" sections={customSections} />

      {/* 10. Почему / О Rocketmind — управляется свитчем в админке */}
      {(!hasProduct || props.product.aboutRocketmindEnabled) && (
        <AboutRocketmindSection
          {...ABOUT_RM_DEFAULTS}
          {...aboutRmPhotos}
          {...(hasProduct && props.product.aboutRocketmind ? props.product.aboutRocketmind : {})}
        />
      )}
      <CustomSectionsAfter type="aboutRocketmind" sections={customSections} />

      {/* 12–14. Кейсы + отзывы + логотипы + CTA */}
      <PageBottom />
      <CustomSectionsAfter type="pageBottom" sections={customSections} />
    </div>
  );
}
