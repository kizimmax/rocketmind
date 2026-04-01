"use client"

import React from "react"
import Link from "next/link"
import { InfiniteLogoMarquee, Separator } from "@rocketmind/ui"
import type { LogoMarqueeItem } from "@rocketmind/ui"
import { Section, SubSection, SpecBlock } from "@/components/ds/shared"
import { TokenChip } from "@/components/ds/color-helpers"
import { RocketmindMenu } from "@/components/sections/RocketmindMenu"

const BASE_PATH = process.env.NODE_ENV === "production" ? "/rocketmind/ds" : ""

const DEMO_LOGOS: LogoMarqueeItem[] = [
  { alt: "Билайн",          src: `${BASE_PATH}/clip-logos/bilaine.svg`,       width: 125, height: 24 },
  { alt: "ВТБ",             src: `${BASE_PATH}/clip-logos/vtb.svg`,           width: 90,  height: 33 },
  { alt: "Т-Банк",          src: `${BASE_PATH}/clip-logos/tbank.svg`,         width: 116, height: 37 },
  { alt: "Росатом",         src: `${BASE_PATH}/clip-logos/rosatom.svg`,       width: 109, height: 39 },
  { alt: "Минцифры",        src: `${BASE_PATH}/clip-logos/mincifr.svg`,       width: 146, height: 32 },
  { alt: "РУСАЛ",           src: `${BASE_PATH}/clip-logos/ruslan.svg`,        width: 113, height: 34 },
  { alt: "Газпромбанк",     src: `${BASE_PATH}/clip-logos/gazprombank.svg`,   width: 120, height: 36 },
  { alt: "МТС",             src: `${BASE_PATH}/clip-logos/mtc.svg`,           width: 75,  height: 34 },
  { alt: "ВКонтакте",       src: `${BASE_PATH}/clip-logos/vk.svg`,            width: 80,  height: 34 },
  { alt: "X5 Group",        src: `${BASE_PATH}/clip-logos/x5.svg`,            width: 90,  height: 36 },
]

/* ── Nav labels for static footer preview ── */
const FOOTER_CONSULT_LEFT  = ["Экосистемная стратегия", "Цифровая платформа", "Умная аналитика", "Готовность команды"]
const FOOTER_CONSULT_RIGHT = ["Стратегические сессии", "Дизайн-спринты", "Резидент Сколково", "Готовность бизнеса"]
const FOOTER_ACADEMY       = ["Бизнес-дизайн для команд", "Бизнес-дизайн. Быстрый старт"]
const FOOTER_AI            = ["Тестирование гипотез", "Моделирование бизнеса"]
const FOOTER_COMPANY       = ["О Rocketmind", "Кейсы", "Медиа", "Политика конфиденциальности", "Обработка персональных данных", "Рекламное согласие"]

export default function CrossBlocksPage() {
  return (
    <>
      <Section id="cross-blocks" title="Сквозные блоки">
        <p className="text-muted-foreground mb-8">
          Блоки, которые появляются на нескольких страницах: лендинг, авторизация, main app.
          Их стиль должен быть абсолютно единым — один компонент, ноль дублирования.
        </p>

        {/* ═══════════════════════════════════════════════════════════════
            1. ФИКСИРОВАННАЯ ШАПКА
           ═══════════════════════════════════════════════════════════════ */}
        <SubSection id="cross-header-fixed" title="Header — Фиксированная шапка" first />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Фиксированная шапка для всех страниц. На главной скрыта, появляется при скролле за 50% viewport.
          На внутренних — видна сразу. Логотип слева, <code className="text-foreground">RocketmindMenu</code> справа (desktop),
          <code className="text-foreground">MobileNav</code> бургер (mobile).
        </p>

        {/* ── Live preview — static replica (не fixed, сразу видна) ── */}
        <div className="rounded-lg border border-border overflow-hidden mb-8 isolate relative z-0">
          <div className="bg-rm-gray-2/20">
            <header className="w-full h-16 bg-background border-b border-border flex items-center">
              <div className="mx-auto flex w-full max-w-[1512px] items-center justify-between gap-6 px-5 md:px-8 xl:px-14">
                <Link href="/" className="flex items-center">
                  <img
                    src={`${BASE_PATH}/text_logo_dark_background_en.svg`}
                    alt="Rocketmind"
                    className="h-auto w-[120px] md:w-[144px]"
                  />
                </Link>
                <RocketmindMenu
                  className="ml-auto flex flex-1 items-center justify-end gap-5 lg:gap-7"
                  showDropdowns={true}
                />
              </div>
            </header>
            <div className="px-8 py-10 space-y-3">
              {[100, 75, 88, 60].map((w, i) => (
                <div key={i} className="h-3 rounded-sm bg-rm-gray-2" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </div>

        <SpecBlock title="Поведение">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Контекст</th>
                  <th className="text-left px-4 py-2 font-medium">Поведение</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Главная", "Скрыта. Появляется (translate-y + opacity) при скролле за 50vh. fixed top-0, z-50, h-16"],
                  ["Внутренние", "Всегда видна. Тот же стиль: fixed top-0, bg-background, border-b"],
                  ["Desktop (≥768px)", "text_logo слева + RocketmindMenu (с dropdown) справа"],
                  ["Mobile (<768px)", "text_logo + MobileNav бургер (ml-auto). Меню скрыто"],
                ].map(([ctx, behavior]) => (
                  <tr key={ctx} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground whitespace-nowrap align-top">{ctx}</td>
                    <td className="px-4 py-2">{behavior}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        <SpecBlock title="Токены">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Свойство</th>
                  <th className="text-left px-4 py-2 font-medium">Значение</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Позиция",     "fixed top-0 left-0 right-0, z-50"],
                  ["Высота",      "h-16 (64px)"],
                  ["Фон",         "bg-background, border-b border-border"],
                  ["Контейнер",   "max-w-[1512px] mx-auto, px-5 md:px-8 xl:px-14"],
                  ["Логотип",     "text_logo_dark_background_en.svg, w-[120px] md:w-[144px]"],
                  ["Навигация",   "RocketmindMenu: 18px (!text-[18px]), ml-auto justify-end gap-5 lg:gap-7"],
                  ["Анимация",    "transition-all duration-300, translate-y + opacity"],
                  ["Скрыто",      "-translate-y-full opacity-0 pointer-events-none"],
                ].map(([prop, value]) => (
                  <tr key={prop} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground whitespace-nowrap">{prop}</td>
                    <td className="px-4 py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        <SpecBlock title="Компоненты навигации">
          <div className="space-y-4">
            <p className="text-[length:var(--text-14)] text-muted-foreground">
              <strong className="text-foreground">RocketmindMenu</strong> — общий компонент для fixed-шапки и hero.
              Разделяет пункты на dropdown (Radix NavigationMenu) и plain-ссылки (отдельный &lt;nav&gt;).
              Viewport привязан к правому краю последнего dropdown-триггера (AI-продукты).
            </p>
            <div className="overflow-auto rounded-lg border border-border">
              <table className="w-full text-[length:var(--text-14)]">
                <thead>
                  <tr className="border-b border-border bg-rm-gray-2/30">
                    <th className="text-left px-4 py-2 font-medium">Prop</th>
                    <th className="text-left px-4 py-2 font-medium">Тип</th>
                    <th className="text-left px-4 py-2 font-medium">Описание</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["className",     "string",  "Классы обёртки (layout, gap, justify)"],
                    ["itemClassName", "string",  "Классы триггеров (размер шрифта)"],
                    ["showDropdowns", "boolean", "false → все пункты как plain-ссылки"],
                  ].map(([prop, type, desc]) => (
                    <tr key={prop} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 font-medium text-foreground"><code>{prop}</code></td>
                      <td className="px-4 py-2"><TokenChip>{type}</TokenChip></td>
                      <td className="px-4 py-2">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[length:var(--text-14)] text-muted-foreground">
              <strong className="text-foreground">MobileNav</strong> — полноэкранное меню (clip-path circle).
              Белый фон, accordion-секции, stagger-анимация. Portal → document.body, z-[55].
              Бургер: 2 бара w-[40px], трансформируется в X, z-[60].
            </p>
            <div className="p-4 rounded-lg border border-border bg-rm-gray-2/30 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground space-y-1">
              <p className="text-muted-foreground/60">{'// apps/site/src/components/sections/'}</p>
              <p>{'Header.tsx        → RocketmindMenu + MobileNav'}</p>
              <p>{'RocketmindMenu.tsx → Radix NavigationMenu + plain links'}</p>
              <p>{'MobileNav.tsx      → clip-path circle + accordions'}</p>
            </div>
          </div>
        </SpecBlock>

        <SpecBlock title="Dropdown">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Свойство</th>
                  <th className="text-left px-4 py-2 font-medium">Значение</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Viewport",  "[&>div]:right-0 [&>div]:left-auto — привязан к правому краю (до AI-продукты)"],
                  ["Ширина",    ">4 items → w-[680px] grid-cols-3, ≤4 → w-[420px] grid-cols-2"],
                  ["Hover",     "hover:opacity-[0.88], data-[state=open]:opacity-[0.88]"],
                  ["Клик",      "onClick → router.push(item.href) — навигация на разводящую страницу"],
                ].map(([prop, value]) => (
                  <tr key={prop} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground whitespace-nowrap">{prop}</td>
                    <td className="px-4 py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        <SpecBlock title="Навигационные данные (site-nav.ts)">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Группа</th>
                  <th className="text-left px-4 py-2 font-medium">Тип</th>
                  <th className="text-left px-4 py-2 font-medium">href</th>
                  <th className="text-left px-4 py-2 font-medium">Подпункты</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Консалтинг и стратегии", "Dropdown (8)", "/consulting",  "Экосистемная стратегия, Цифровая платформа, Умная аналитика, Готовность команды, Стратегические сессии, Дизайн-спринты, Резидент Сколково, Готовность бизнеса"],
                  ["Онлайн-школа",           "Dropdown (2)", "/academy",     "Бизнес-дизайн для команд, Бизнес-дизайн. Быстрый старт"],
                  ["AI-продукты",            "Dropdown (2)", "/ai-products", "Тестирование гипотез, Моделирование бизнеса"],
                  ["О Rocketmind",           "Link",         "/about",       "—"],
                  ["Медиа",                  "Link",         "/media",       "—"],
                ].map(([group, type, href, items]) => (
                  <tr key={group} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{group}</td>
                    <td className="px-4 py-2"><TokenChip>{type}</TokenChip></td>
                    <td className="px-4 py-2"><code>{href}</code></td>
                    <td className="px-4 py-2">{items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        <SpecBlock title="Hero Header (доп. вариант)">
          <div className="space-y-4">
            <p className="text-[length:var(--text-14)] text-muted-foreground">
              Навигация внутри hero-секции главной. Не отдельная шапка — часть hero-контента.
              Desktop: <code className="text-foreground">RocketmindMenu</code> прижат вправо (20px шрифт, gap-x-7), рядом статистика и бургер.
              Mobile: только <code className="text-foreground">MobileNav</code>, меню скрыто. Появляется с motion fadeUp.
            </p>
            <div className="overflow-auto rounded-lg border border-border">
              <table className="w-full text-[length:var(--text-14)]">
                <thead>
                  <tr className="border-b border-border bg-rm-gray-2/30">
                    <th className="text-left px-4 py-2 font-medium">Параметр</th>
                    <th className="text-left px-4 py-2 font-medium">Hero Header</th>
                    <th className="text-left px-4 py-2 font-medium">Fixed Header</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["Позиция",    "Inline, часть hero",       "fixed top-0"],
                    ["Фон",        "Прозрачный",               "bg-background"],
                    ["Шрифт",      "20px",                     "18px"],
                    ["Логотип",    "Большой wordmark hero",    "text_logo 144px"],
                    ["Видимость",  "До скролла",               "После скролла 50vh"],
                    ["Анимация",   "motion fadeUp",            "translate-y"],
                  ].map(([param, hero, fixed]) => (
                    <tr key={param} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 font-medium text-foreground whitespace-nowrap">{param}</td>
                      <td className="px-4 py-2">{hero}</td>
                      <td className="px-4 py-2">{fixed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SpecBlock>

        {/* ═══════════════════════════════════════════════════════════════
            2. ФУТЕР
           ═══════════════════════════════════════════════════════════════ */}
        <SubSection id="cross-footer" title="Footer — Футер" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Единый футер для всех страниц. Логотип с дескриптором, 4-колоночная навигация (2 на мобайле),
          юридические ссылки, копирайт. Данные из <code className="text-foreground">site-nav.ts</code>.
        </p>

        {/* ── Live preview — static footer ── */}
        <div className="rounded-lg border border-border overflow-hidden mb-8 isolate relative z-0">
          <footer className="border-t border-border bg-background">
            <div className="mx-auto max-w-[1512px] px-5 py-12 md:px-8 md:py-16 xl:px-14">
              <Link href="/" className="inline-flex items-center">
                <img
                  src={`${BASE_PATH}/with_descriptor_dark_background_en.svg`}
                  alt="Rocketmind"
                  className="h-14 w-auto"
                />
              </Link>
              <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
                <div className="flex flex-col justify-between">
                  <FooterCol title="Консалтинг" items={FOOTER_CONSULT_LEFT} />
                  <p className="mt-8 text-[13px] text-muted-foreground/50 hidden md:block">&copy; 2026 Rocketmind</p>
                </div>
                <FooterCol title={"\u00A0"} items={FOOTER_CONSULT_RIGHT} />
                <div className="flex flex-col gap-10">
                  <FooterCol title="Онлайн-школа" items={FOOTER_ACADEMY} />
                  <FooterCol title="AI-продукты" items={FOOTER_AI} />
                </div>
                <FooterCol title="Компания" items={FOOTER_COMPANY} />
              </div>
              <p className="mt-10 text-[13px] text-muted-foreground/50 md:hidden">&copy; 2026 Rocketmind</p>
            </div>
          </footer>
        </div>

        <SpecBlock title="Токены футера">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Свойство</th>
                  <th className="text-left px-4 py-2 font-medium">Значение</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Фон",           "bg-background, border-t border-border"],
                  ["Контейнер",     "max-w-[1512px] mx-auto, px-5 md:px-8 xl:px-14, py-12 md:py-16"],
                  ["Логотип",       "with_descriptor_dark_background_en.svg, h-14"],
                  ["Сетка",         "grid-cols-2 gap-8 md:grid-cols-4 md:gap-12"],
                  ["Заголовок",     "font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground/50"],
                  ["Ссылка",        "text-[14px] leading-[1.5] text-muted-foreground hover:text-foreground"],
                  ["Копирайт",      "text-[13px] text-muted-foreground/50. Desktop: в 1-й колонке. Mobile: под сеткой"],
                  ["Данные",        "CONSULTING_SERVICES, ACADEMY_COURSES, AI_PRODUCTS, LEGAL_LINKS из site-nav.ts"],
                ].map(([prop, value]) => (
                  <tr key={prop} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground whitespace-nowrap">{prop}</td>
                    <td className="px-4 py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        <SpecBlock title="Структура">
          <div className="p-4 rounded-lg border border-border bg-rm-gray-2/30 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground space-y-1">
            <p className="text-muted-foreground/60">{'// apps/site/src/components/sections/Footer.tsx'}</p>
            <p>{'import { Footer } from "@/components/sections/Footer";'}</p>
            <p>&nbsp;</p>
            <p>{'<Footer />'}</p>
          </div>
        </SpecBlock>

        {/* ═══════════════════════════════════════════════════════════════
            3. БЕГУЩАЯ СТРОКА ЛОГОТИПОВ
           ═══════════════════════════════════════════════════════════════ */}
        <SubSection id="cross-marquee" title="InfiniteLogoMarquee" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Бесконечная бегущая строка логотипов партнёров / клиентов. CSS-анимация (не JS), fade по краям через mask-image. Компонент из <code className="text-foreground">@rocketmind/ui</code>.
        </p>

        <div className="rounded-lg border border-border py-8 mb-8 bg-[#0A0A0A] overflow-hidden">
          <div className="mx-auto max-w-[1056px]">
            <InfiniteLogoMarquee logos={DEMO_LOGOS} reverse />
          </div>
        </div>

        <SpecBlock title="Props">
          <div className="space-y-6">
            <div className="overflow-auto rounded-lg border border-border">
              <table className="w-full text-[length:var(--text-14)]">
                <thead>
                  <tr className="border-b border-border bg-rm-gray-2/30">
                    <th className="text-left px-4 py-2 font-medium">Prop</th>
                    <th className="text-left px-4 py-2 font-medium">Тип</th>
                    <th className="text-left px-4 py-2 font-medium">По умолчанию</th>
                    <th className="text-left px-4 py-2 font-medium">Описание</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["logos",          "LogoMarqueeItem[]", "—",    "Массив { alt, src, width?, height? }"],
                    ["speedSeconds",   "number",            "25",   "Длительность цикла"],
                    ["gap",           "number",            "67",   "Расстояние между логотипами (px)"],
                    ["maxLogoHeight", "number",            "39",   "Макс. высота логотипа (px)"],
                    ["fadeWidth",     "number",            "44",   "Ширина fade-маски по краям (px)"],
                    ["reverse",      "boolean",           "false", "Направление: true → слева направо"],
                  ].map(([prop, type, def, desc]) => (
                    <tr key={prop} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 font-medium text-foreground"><code>{prop}</code></td>
                      <td className="px-4 py-2"><TokenChip>{type}</TokenChip></td>
                      <td className="px-4 py-2"><code>{def}</code></td>
                      <td className="px-4 py-2">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 rounded-lg border border-border bg-rm-gray-2/30 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground space-y-1">
              <p>{'import { InfiniteLogoMarquee } from "@rocketmind/ui";'}</p>
              <p>{'<InfiniteLogoMarquee logos={logos} reverse />'}</p>
            </div>
          </div>
        </SpecBlock>
      </Section>

      <Separator />
    </>
  )
}

/* ── Footer column for static preview ── */
function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground/50">{title}</p>
      <ul className="mt-4 flex flex-col gap-2.5">
        {items.map((label) => (
          <li key={label}>
            <span className="text-[14px] leading-[1.5] text-muted-foreground">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
