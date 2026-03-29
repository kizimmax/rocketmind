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

type ServicePageTemplateProps = {
  /** Заголовок H1 */
  title: string;
  /** Подзаголовок / оффер */
  subtitle: string;
};

export function ServicePageTemplate({
  title,
  subtitle,
}: ServicePageTemplateProps) {
  return (
    <div className="flex flex-col">
      {/* 1. Hero + CTA */}
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-5 py-24 text-center md:px-8 xl:px-14">
        <div className="mx-auto max-w-[1512px]">
          <h1 className="font-heading text-4xl font-bold md:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {subtitle}
          </p>
          <div className="mt-10">
            <span className="inline-block rounded-sm bg-foreground px-8 py-3 font-mono text-sm uppercase tracking-wider text-background">
              Оставить заявку
            </span>
          </div>
        </div>
      </section>

      {/* 2. Социальное доказательство */}
      <section className="border-t border-border px-5 py-16 md:px-8 xl:px-14">
        <div className="mx-auto max-w-[1512px]">
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Социальное доказательство — заполнить
          </p>
        </div>
      </section>

      {/* 3. О продукте */}
      <section className="border-t border-border px-5 py-16 md:px-8 xl:px-14">
        <div className="mx-auto max-w-[1512px]">
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            О продукте — заполнить
          </p>
        </div>
      </section>

      {/* 4. Для кого */}
      <section className="border-t border-border px-5 py-16 md:px-8 xl:px-14">
        <div className="mx-auto max-w-[1512px]">
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Для кого это решение — заполнить
          </p>
        </div>
      </section>

      {/* 5. Инструменты (опционально) */}
      <section className="border-t border-border px-5 py-16 md:px-8 xl:px-14">
        <div className="mx-auto max-w-[1512px]">
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Инструменты — заполнить (опционально)
          </p>
        </div>
      </section>

      {/* 6. Твёрдые результаты */}
      <section className="border-t border-border px-5 py-16 md:px-8 xl:px-14">
        <div className="mx-auto max-w-[1512px]">
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Твёрдые результаты — заполнить
          </p>
        </div>
      </section>

      {/* 7. Прозрачный процесс (этапы) */}
      <section className="border-t border-border px-5 py-16 md:px-8 xl:px-14">
        <div className="mx-auto max-w-[1512px]">
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Прозрачный процесс — заполнить
          </p>
        </div>
      </section>

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
      <section className="border-t border-border px-5 py-16 md:px-8 xl:px-14">
        <div className="mx-auto max-w-[1512px]">
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Эксперт продукта — заполнить (опционально)
          </p>
        </div>
      </section>

      {/* 11. Кейсы */}
      <section className="border-t border-border px-5 py-16 md:px-8 xl:px-14">
        <div className="mx-auto max-w-[1512px]">
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Кейсы — заполнить
          </p>
        </div>
      </section>

      {/* 12. Отзывы */}
      <section className="border-t border-border px-5 py-16 md:px-8 xl:px-14">
        <div className="mx-auto max-w-[1512px]">
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Отзывы — заполнить
          </p>
        </div>
      </section>

      {/* 13. CTA */}
      <section className="border-t border-border px-5 py-24 md:px-8 xl:px-14">
        <div className="mx-auto max-w-[1512px] text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            Готовы начать?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Индивидуальный расчёт и отказ от шаблонных решений.
          </p>
          <div className="mt-8">
            <span className="inline-block rounded-sm bg-foreground px-8 py-3 font-mono text-sm uppercase tracking-wider text-background">
              Оставить заявку
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
