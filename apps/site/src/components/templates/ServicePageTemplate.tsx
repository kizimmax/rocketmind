import { PageBottom } from "@/components/sections/PageBottom";
import { ProductHero } from "@/components/sections/ProductHero";
import { AboutProduct } from "@/components/sections/AboutProduct";
import { LogoMarqueeSection } from "@/components/sections/LogoMarqueeSection";
import { ForWhomSection, ProcessSection, ResultsSection, ExpertsSection } from "@rocketmind/ui";
import type { ProductData } from "@/lib/products";

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

  return (
    <div className="flex flex-col">
      {/* 1. Hero + CTA */}
      {hasProduct ? (
        <ProductHero
          caption={props.product.hero.caption}
          title={props.product.hero.title}
          description={props.product.hero.description}
          ctaText={props.product.hero.ctaText}
          factoids={props.product.hero.factoids}
          coverImage={props.product.coverImage}
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

      {/* 2. Социальное доказательство — логотипы партнёров */}
      <LogoMarqueeSection />

      {/* 3. О продукте */}
      {hasProduct && props.product.about ? (
        <AboutProduct
          caption={props.product.about.caption}
          title={props.product.about.title}
          description={props.product.about.description}
          accordion={props.product.about.accordion}
          aboutImage={props.product.aboutImage}
        />
      ) : (
        <section className="border-t border-border px-5 py-16 md:px-8 xl:px-14">
          <div className="mx-auto max-w-[1512px]">
            <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
              О продукте — заполнить
            </p>
          </div>
        </section>
      )}

      {/* 4. Для кого */}
      {hasProduct && props.product.audience ? (
        <ForWhomSection
          tag={props.product.audience.tag}
          title={props.product.audience.title}
          subtitle={props.product.audience.subtitle}
          facts={props.product.audience.facts}
          wideColumn={props.product.audience.wideColumn}
        />
      ) : (
        <section className="border-t border-border px-5 py-16 md:px-8 xl:px-14">
          <div className="mx-auto max-w-[1512px]">
            <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Для кого это решение — заполнить
            </p>
          </div>
        </section>
      )}

      {/* 5. Инструменты (опционально) */}
      <section className="border-t border-border px-5 py-16 md:px-8 xl:px-14">
        <div className="mx-auto max-w-[1512px]">
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Инструменты — заполнить (опционально)
          </p>
        </div>
      </section>

      {/* 6. Твёрдые результаты */}
      {hasProduct && props.product.results ? (
        <ResultsSection
          tag={props.product.results.tag}
          title={props.product.results.title}
          description={props.product.results.description}
          cards={props.product.results.cards}
        />
      ) : (
        <section className="border-t border-border px-5 py-16 md:px-8 xl:px-14">
          <div className="mx-auto max-w-[1512px]">
            <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Твёрдые результаты — заполнить
            </p>
          </div>
        </section>
      )}

      {/* 7. Прозрачный процесс (этапы) */}
      {hasProduct && props.product.process ? (
        <ProcessSection
          tag={props.product.process.tag}
          title={props.product.process.title}
          subtitle={props.product.process.subtitle}
          description={props.product.process.description}
          steps={props.product.process.steps}
          participantsTag={props.product.process.participantsTag}
          participants={props.product.process.participants}
          variant={props.product.process.variant}
        />
      ) : (
        <section className="border-t border-border px-5 py-16 md:px-8 xl:px-14">
          <div className="mx-auto max-w-[1512px]">
            <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Прозрачный процесс — заполнить
            </p>
          </div>
        </section>
      )}

      {/* 8. Продолжительность (опционально) */}
      <section className="border-t border-border px-5 py-16 md:px-8 xl:px-14">
        <div className="mx-auto max-w-[1512px]">
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Продолжительность — заполнить (опционально)
          </p>
        </div>
      </section>

      {/* 9. Почему Rocketmind */}
      <section className="border-t border-border px-5 py-16 md:px-8 xl:px-14">
        <div className="mx-auto max-w-[1512px]">
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Почему Rocketmind — заполнить
          </p>
        </div>
      </section>

      {/* 10. Эксперт (опционально) */}
      {hasProduct && props.product.experts && props.product.experts.length > 0 ? (
        <ExpertsSection experts={props.product.experts} />
      ) : null}

      {/* 11–13. Кейсы + отзывы + логотипы + CTA */}
      <PageBottom />
    </div>
  );
}
