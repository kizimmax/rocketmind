"use client"

import React from "react"
import { Separator, CTASectionDark, CTASectionYellow, AccordionFAQ } from "@rocketmind/ui"
import { Section, SubSection, SpecBlock } from "@/components/ds/shared"
import { TokenChip } from "@/components/ds/color-helpers"
import { CasesSectionShowcase } from "@/components/ds/cases-section-showcase"

export default function MarketingBlocksPage() {
  return (
    <>
      <Section id="marketing-blocks" title="Маркетинг блоки">
        <p className="text-muted-foreground mb-8">
          Готовые блоки для лендинга и маркетинговых страниц. Используют токены дизайн-системы — стиль единый с основным приложением.
        </p>

        {/* ── Accordion 05 ── */}
        <SubSection id="marketing-blocks-faq" title="Аккордион — FAQ" first />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Аккордион для секций FAQ и «Часто задаваемые вопросы». Числа слева — порядковые метки. Заголовок раскрытого пункта подсвечивается акцентным жёлтым. Плавное открытие через <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]">grid-template-rows</code> (200ms, ease-standard).
        </p>
        <div className="-mx-5 md:-mx-10 border-y border-border py-10 px-5 md:px-10 mb-8">
          <AccordionFAQ />
        </div>
        <SpecBlock title="Токены">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Свойство</th>
                  <th className="text-left px-4 py-2 font-medium">Токен / значение</th>
                  <th className="text-left px-4 py-2 font-medium">Описание</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Закрытый заголовок",  "text-foreground/20",              "Приглушённый текст"],
                  ["Открытый заголовок",  "text-primary (--rm-yellow-100)",  "Акцентный жёлтый"],
                  ["Hover заголовок",     "text-foreground/50",              "Промежуточное состояние"],
                  ["Типографика",         "--font-heading-family, uppercase", "Bold, tracking -0.02em"],
                  ["Номер",              "--font-mono-family, --text-12",    "Tabular nums, mt-2"],
                  ["Контент",            "--text-14, text-muted-foreground", "Отступ pl-6 / md:px-20"],
                  ["Разделитель",         "border-b border-border",          "Стандартный бордер ДС"],
                  ["Анимация",            "grid-template-rows, 200ms",       "--ease-standard (0.4,0,0.2,1)"],
                ].map(([prop, token, desc]) => (
                  <tr key={prop} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{prop}</td>
                    <td className="px-4 py-2"><TokenChip>{token}</TokenChip></td>
                    <td className="px-4 py-2 text-[length:var(--text-14)] text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        {/* ── CTA — Тёмный ── */}
        <SubSection id="marketing-blocks-cta-dark" title="CTA — Тёмный" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Тёмный CTA-блок с желтой кнопкой и декоративным кругом с паттерном точек. Figma: 1400×424 px. Фон — <TokenChip>bg-[#0A0A0A]</TokenChip>, кнопка — <TokenChip>bg-[--rm-yellow-100]</TokenChip> с тёмным текстом.
        </p>
        {/* Live preview */}
        <div className="mb-8">
          <CTASectionDark className="!pb-0" />
        </div>
        <SpecBlock title="Токены">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Свойство</th>
                  <th className="text-left px-4 py-2 font-medium">Значение</th>
                  <th className="text-left px-4 py-2 font-medium">Описание</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Контейнер",        "border border-border",             "Рамка вокруг всего блока, px-5 md:px-8 xl:px-14 отступы секции"],
                  ["Фон секции",       "#0A0A0A",                          "bg-background (dark)"],
                  ["Заголовок",        "#F0F0F0 (foreground)",             "H2, Roboto Condensed 700, 52px desktop"],
                  ["Описание",         "text-muted-foreground",            "Copy 18, Roboto 400, 18px desktop"],
                  ["Кнопка",          "#FFCC00 (--rm-yellow-100)",        "Жёлтая, text #0A0A0A"],
                  ["Декор-круг",       "789×789 px, rgba(219,200,0,0.14)","Dot pattern + yellow glow"],
                  ["Оверлей",          "linear-gradient 90deg 38%→80%",   "Gradient overlay тёмный→прозрачный"],
                  ["Типографика кнопки","Loos Condensed 500, 16px, +4%",  "uppercase, border-radius 4px"],
                ].map(([prop, val, desc]) => (
                  <tr key={prop} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{prop}</td>
                    <td className="px-4 py-2"><TokenChip>{val}</TokenChip></td>
                    <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        {/* ── CTA — Жёлтый ── */}
        <SubSection id="marketing-blocks-cta-yellow" title="CTA — Жёлтый (золотое сечение)" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Жёлтый CTA-блок с тёмной кнопкой и спиралью золотого сечения. Figma: 442-1532 (desktop 1401×400 px) / 443-1546 (mobile 353×571 px). Фон — <TokenChip>#FFCC00</TokenChip>, кнопка — <TokenChip>#0A0A0A</TokenChip> с текстом <TokenChip>#F0F0F0</TokenChip>.
        </p>
        {/* Live preview */}
        <div className="mb-8">
          <CTASectionYellow className="!px-0 !pb-0" />
        </div>
        <SpecBlock title="Токены">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Свойство</th>
                  <th className="text-left px-4 py-2 font-medium">Значение</th>
                  <th className="text-left px-4 py-2 font-medium">Описание</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Фон секции",       "#FFCC00 (--rm-yellow-100)",        "Жёлтый"],
                  ["Заголовок",        "#0A0A0A",                          "H2, 52px desktop / H4 24px mobile"],
                  ["Описание",         "#0A0A0A",                          "18px desktop / 14px mobile"],
                  ["Кнопка",          "#0A0A0A, text #F0F0F0",            "Инверсия; mobile w-full, desktop w-fit (hug)"],
                  ["Декор-спираль",    "#FFE066 (--rm-yellow-300), right 47%, h-full", "Спираль золотого сечения"],
                  ["Высота desktop",   "min-h-[400px]",                    "1401×400 px по Figma"],
                  ["Типографика кнопки","Loos Condensed 500, 16px, +4%",  "uppercase, border-radius 4px"],
                ].map(([prop, val, desc]) => (
                  <tr key={prop} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{prop}</td>
                    <td className="px-4 py-2"><TokenChip>{val}</TokenChip></td>
                    <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        {/* ── Кейсы + Отзывы ── */}
        <SubSection id="marketing-blocks-cases" title="Кейсы + Отзывы" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Блок кейсов и отзывов с бегущей строкой логотипов партнёров. Тёмный фон <TokenChip>#0A0A0A</TokenChip>. Левая колонна — отзывы с fade-маской, правая — кейс с заголовком, стат-блоком, результатом и навигатором.
          Компонент <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]">CasesSection</code> из <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]">apps/site</code>.
        </p>
        <div className="-mx-5 md:-mx-10 border-y border-border overflow-hidden mb-8">
          <CasesSectionShowcase />
        </div>
        <SpecBlock title="Токены и структура">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Элемент</th>
                  <th className="text-left px-4 py-2 font-medium">Значение</th>
                  <th className="text-left px-4 py-2 font-medium">Описание</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Фон секции",       "#0A0A0A",                            "Тёмный (dark bg)"],
                  ["Лейблы",           "#FFCC00 (--rm-yellow-100)",          "Loos Condensed 500, 18px, uppercase"],
                  ["Заголовок кейса",  "#F0F0F0, Roboto Condensed 700",      "52px desktop / 36px md / 24px sm"],
                  ["Текст отзывов",    "#939393",                            "14px, leading 1.4"],
                  ["Отзывы fade",      "mask-image linear-gradient",         "Плавное исчезание сверху и снизу, 40px"],
                  ["Стат-блок",        "border #404040, p-5/p-8",           "Grid 1→3 col, gap-4/gap-6"],
                  ["Цифры статов",     "#F0F0F0, 52px desktop / 40px mob",  "Roboto Condensed 700"],
                  ["Результат",        "#F0F0F0, Loos Condensed 500, 16px", "uppercase, tracking 0.04em"],
                  ["Навигатор",        "#F0F0F0 / #939393",                  "Активный белый, остальные серые"],
                  ["Logo Marquee",     "opacity-55",                         "InfiniteLogoMarquee reverse, py-8"],
                  ["Разделители",      "#404040 (h-px)",                     "Сверху и снизу секции, вокруг марки"],
                ].map(([el, val, desc]) => (
                  <tr key={el} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{el}</td>
                    <td className="px-4 py-2"><TokenChip>{val}</TokenChip></td>
                    <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        {/* ── PageBottom — Состав ── */}
        <SubSection id="marketing-blocks-page-bottom" title="Состав PageBottom" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Компонент-обёртка <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]">PageBottom</code> объединяет три самостоятельных блока в стандартную последовательность конца страницы.
          Добавляется на всех страницах сайта, кроме <strong className="text-foreground">/cases</strong> и <strong className="text-foreground">/media</strong>.
        </p>
        <div className="-mx-5 md:-mx-10 border-y border-border py-6 px-5 md:px-10 mb-8">
          <div className="flex flex-col gap-1 text-[length:var(--text-14)]">
            <div className="flex items-center gap-3 py-2 border-b border-border">
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground w-6">1</span>
              <span className="font-medium text-foreground">CasesSection</span>
              <span className="text-muted-foreground">— авто-ротация кейсов (15 с), отзывы, бегущая строка логотипов партнёров</span>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-border">
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground w-6">2</span>
              <span className="font-medium text-foreground">CTASection</span>
              <span className="text-muted-foreground">— тёмный CTA с жёлтой кнопкой и декоративным кругом</span>
            </div>
            <div className="flex items-center gap-3 py-2">
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground w-6">3</span>
              <span className="font-medium text-foreground">Footer</span>
              <span className="text-muted-foreground">— футер сайта</span>
            </div>
          </div>
        </div>
        <SpecBlock title="Использование">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Страница</th>
                  <th className="text-left px-4 py-2 font-medium">PageBottom</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["/ (главная)",                        "✓"],
                  ["/consulting, /academy, /ai-products", "✓"],
                  ["/about",                             "✓"],
                  ["/consulting/* (все подстраницы)",    "✓ — через ServicePageTemplate"],
                  ["/academy/* (все подстраницы)",       "✓ — через ServicePageTemplate"],
                  ["/ai-products/* (все подстраницы)",   "✓ — через ServicePageTemplate"],
                  ["/cases, /cases/[slug]",              "✗ — страница кейсов"],
                  ["/media, /media/[slug]",              "✗ — медиа-страницы"],
                  ["/legal/*",                           "✗ — юридические страницы"],
                ].map(([page, status]) => (
                  <tr key={page} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">
                      <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded">{page}</code>
                    </td>
                    <td className={`px-4 py-2 ${status.startsWith("✓") ? "text-foreground" : "text-muted-foreground/50"}`}>
                      {status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

      </Section>

      <Separator />
    </>
  )
}
