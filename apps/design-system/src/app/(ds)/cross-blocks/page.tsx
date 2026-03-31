"use client"

import React from "react"
import { InfiniteLogoMarquee, Separator } from "@rocketmind/ui"
import type { LogoMarqueeItem } from "@rocketmind/ui"
import { Section, SubSection, SpecBlock } from "@/components/ds/shared"
import { TokenChip } from "@/components/ds/color-helpers"
import { SiteHeader } from "@/components/ui/site-header"

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

export default function CrossBlocksPage() {
  return (
    <>
      <Section id="cross-blocks" title="Сквозные блоки">
        <p className="text-muted-foreground mb-8">
          Блоки, которые появляются на нескольких страницах: лендинг, авторизация, main app.
          Их стиль должен быть абсолютно единым — один компонент, ноль дублирования.
        </p>

        {/* ── Header ── */}
        <SubSection id="cross-header" title="SiteHeader — Шапка сайта" first />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Единая шапка для всех публичных страниц. Sticky, backdrop blur при скролле.
          Логотип-иконка прижат к левому краю (без паддинга), далее текстовый логотип, навигация с dropdown-меню (Radix NavigationMenu) и CTA-кнопки. На мобайле: логотип + гамбургер → портальное меню на весь экран.
        </p>

        {/* ── Live preview ── */}
        <div className="rounded-lg border border-border overflow-hidden mb-8">
          <div className="bg-rm-gray-2/20">
            <SiteHeader basePath={BASE_PATH} preview />
            <div className="px-8 py-10 space-y-3">
              {[100, 75, 88, 60].map((w, i) => (
                <div key={i} className="h-3 rounded-sm bg-rm-gray-2" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Behavior description ── */}
        <SpecBlock title="Поведение на страницах">
          <div className="space-y-6">
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
                    ["Лендинг (главная)", "sticky top-0, фон прозрачный → при скролле >10px: bg-background/95 + backdrop-blur-lg + border-border. Полная навигация с dropdown-меню (Услуги, Академия, ИИ-продукты), прямые ссылки (Тарифы, О нас), кнопки «Войти» и «Попробовать»"],
                    ["Внутренние страницы", "Аналогичное поведение sticky + blur. Навигационные пункты и CTA одинаковы на всех страницах. Разница только в active-состоянии ссылок"],
                    ["Мобайл (<768px)", "Логотип-иконка + текстовый логотип + гамбургер (18px). При клике — портальное меню (React Portal → document.body), fixed top-16, backdrop-blur-lg. Accordion-группы для dropdown-секций. Полная ширина кнопок «Войти» и «Попробовать» внизу меню"],
                    ["Десктоп (≥768px)", "Иконка логотипа прижата к левому краю (h-16, без padding). Текстовый логотип + NavigationMenu с dropdown-контентом (2-column grid, 480px wide). CTA-кнопки справа: «Войти» (secondary) + «Попробовать» (yellow)"],
                    ["DS документация", "preview=true → position: relative (не sticky). Фон сразу blur, для демонстрации scrolled-состояния"],
                  ].map(([ctx, behavior]) => (
                    <tr key={ctx} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 font-medium text-foreground whitespace-nowrap align-top">{ctx}</td>
                      <td className="px-4 py-2">{behavior}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SpecBlock>

        <SpecBlock title="Токены, состояния и применение">
          <div className="space-y-6">
            <div className="overflow-auto rounded-lg border border-border">
              <table className="w-full text-[length:var(--text-14)]">
                <thead>
                  <tr className="border-b border-border bg-rm-gray-2/30">
                    <th className="text-left px-4 py-2 font-medium">Свойство</th>
                    <th className="text-left px-4 py-2 font-medium">Токен</th>
                    <th className="text-left px-4 py-2 font-medium">Значение</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["Высота",           "fixed",                      "64px (h-16)"],
                    ["Фон (покой)",      "transparent",                "Прозрачный — контент виден сквозь"],
                    ["Фон (скролл)",     "bg-background/95 + blur",    "backdrop-blur-lg, border-border"],
                    ["Бордер",           "--border",                   "Появляется только при скролле"],
                    ["z-index",          "z-50",                       "Всегда поверх контента"],
                    ["Логотип-иконка",   "icon_*.svg",                 "h-16, flush left (без паддинга), dark/light автоматически"],
                    ["Логотип текст",    "text_logo_*.svg",            "h-6, после иконки через px-1 mr-4"],
                    ["Навигация",        "--font-mono-family",         "12px, uppercase, tracking 0.08em"],
                    ["Dropdown",         "NavigationMenu (Radix)",     "480px wide, 2-col grid, icons 16px в 36px контейнере"],
                    ["Цвет nav",         "--muted-foreground",         "hover → --foreground + bg-accent"],
                    ["Кнопка «Войти»",   "bg-secondary",              "h-9, px-4, hover: opacity 0.88"],
                    ["CTA «Попробовать»","--rm-yellow-100",            "hover: --rm-yellow-300"],
                    ["Мобайл гамбургер", "Lucide Menu / X",            "18px, stroke 1.5px, h-9 w-9 контейнер"],
                    ["Мобайл меню",      "React Portal + fixed",       "top-16, backdrop-blur-lg, accordion-группы"],
                  ].map(([prop, token, value]) => (
                    <tr key={prop} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 font-medium text-foreground">{prop}</td>
                      <td className="px-4 py-2"><TokenChip>{token}</TokenChip></td>
                      <td className="px-4 py-2 text-[length:var(--text-14)] text-muted-foreground">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* State comparison: default vs scrolled */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="px-4 py-2 border-b border-border bg-rm-gray-2/30">
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Default — top of page</span>
                </div>
                <div className="bg-transparent p-0">
                  <nav className="flex h-16 items-center justify-between px-5 border-b border-transparent">
                    <div className="flex items-center gap-2">
                      <img src={`${BASE_PATH}/icon_light_background.svg`} alt="" className="h-10 w-auto dark:hidden" />
                      <img src={`${BASE_PATH}/icon_dark_background.svg`} alt="" className="h-10 w-auto hidden dark:block" />
                      <img src={`${BASE_PATH}/text_logo_dark_background_en.svg`} alt="Rocketmind" className="h-5 hidden dark:block" />
                      <img src={`${BASE_PATH}/text_logo_light_background_en.svg`} alt="Rocketmind" className="h-5 dark:hidden" />
                    </div>
                    <div className="hidden sm:flex items-center gap-0.5">
                      {["Услуги","Академия","ИИ-продукты","Тарифы","О нас"].map(l => (
                        <span key={l} className="px-3 py-1.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">{l}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline-flex items-center justify-center h-9 px-4 rounded-sm bg-secondary text-secondary-foreground text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em]">Войти</span>
                      <span className="inline-flex items-center justify-center h-9 px-4 rounded-sm bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em]">Попробовать</span>
                    </div>
                  </nav>
                </div>
                <div className="px-4 py-2 bg-rm-gray-2/10">
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground">border-transparent · bg-transparent</span>
                </div>
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="px-4 py-2 border-b border-border bg-rm-gray-2/30">
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Scrolled — after 10px</span>
                </div>
                <div className="bg-background/95 backdrop-blur-lg p-0">
                  <nav className="flex h-16 items-center justify-between px-5 border-b border-border">
                    <div className="flex items-center gap-2">
                      <img src={`${BASE_PATH}/icon_light_background.svg`} alt="" className="h-10 w-auto dark:hidden" />
                      <img src={`${BASE_PATH}/icon_dark_background.svg`} alt="" className="h-10 w-auto hidden dark:block" />
                      <img src={`${BASE_PATH}/text_logo_dark_background_en.svg`} alt="Rocketmind" className="h-5 hidden dark:block" />
                      <img src={`${BASE_PATH}/text_logo_light_background_en.svg`} alt="Rocketmind" className="h-5 dark:hidden" />
                    </div>
                    <div className="hidden sm:flex items-center gap-0.5">
                      {["Услуги","Академия","ИИ-продукты","Тарифы","О нас"].map(l => (
                        <span key={l} className="px-3 py-1.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">{l}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline-flex items-center justify-center h-9 px-4 rounded-sm bg-secondary text-secondary-foreground text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em]">Войти</span>
                      <span className="inline-flex items-center justify-center h-9 px-4 rounded-sm bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em]">Попробовать</span>
                    </div>
                  </nav>
                </div>
                <div className="px-4 py-2 bg-rm-gray-2/10">
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground">border-border · bg-background/95 · backdrop-blur-lg</span>
                </div>
              </div>
            </div>

            {/* Component structure */}
            <SpecBlock title="Структура компонента">
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border bg-rm-gray-2/30 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground space-y-1">
                  <p>{'import { SiteHeader } from "@/components/ui/site-header";'}</p>
                  <p>&nbsp;</p>
                  <p className="text-muted-foreground/60">{'// Лендинг — sticky, прозрачный фон'}</p>
                  <p>{'<SiteHeader basePath="/rocketmind" />'}</p>
                  <p>&nbsp;</p>
                  <p className="text-muted-foreground/60">{'// DS документация — relative, blur-фон сразу'}</p>
                  <p>{'<SiteHeader basePath="/rocketmind/ds" preview />'}</p>
                </div>

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
                        ["basePath", "string", '""', "Префикс путей к SVG-логотипам (для prod-деплоя)"],
                        ["preview",  "boolean", "false", "Режим preview: relative вместо sticky, blur-фон сразу"],
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

                <div className="overflow-auto rounded-lg border border-border">
                  <table className="w-full text-[length:var(--text-14)]">
                    <thead>
                      <tr className="border-b border-border bg-rm-gray-2/30">
                        <th className="text-left px-4 py-2 font-medium">Внутренний элемент</th>
                        <th className="text-left px-4 py-2 font-medium">Описание</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      {[
                        ["useScroll(10)",       "Хук: отслеживает window.scrollY > 10px, переключает фон"],
                        ["NavigationMenu",      "Radix NavigationMenu — desktop dropdown-меню (Услуги, Академия, ИИ-продукты)"],
                        ["DropdownItem",        "Карточка в dropdown: иконка 16px в 36px контейнере + title + description"],
                        ["MobileGroup",         "Accordion-группа в мобильном меню: label + ChevronDown + список items"],
                        ["createPortal",        "Мобильное меню рендерится через React Portal в document.body"],
                      ].map(([elem, desc]) => (
                        <tr key={elem} className="border-b border-border last:border-0">
                          <td className="px-4 py-2 font-medium text-foreground whitespace-nowrap"><code>{elem}</code></td>
                          <td className="px-4 py-2">{desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </SpecBlock>

            {/* Navigation data */}
            <SpecBlock title="Навигационные данные">
              <div className="overflow-auto rounded-lg border border-border">
                <table className="w-full text-[length:var(--text-14)]">
                  <thead>
                    <tr className="border-b border-border bg-rm-gray-2/30">
                      <th className="text-left px-4 py-2 font-medium">Группа</th>
                      <th className="text-left px-4 py-2 font-medium">Тип</th>
                      <th className="text-left px-4 py-2 font-medium">Пункты</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    {[
                      ["Услуги",       "Dropdown", "AI-консалтинг, Автоматизация, Кейс-система, Аналитика"],
                      ["Академия",     "Dropdown", "Курсы, Мастер-классы, База знаний, Корп. обучение"],
                      ["ИИ-продукты",  "Dropdown", "AI-агенты, AI-аналитик, AI-маркетолог, AI-разработчик"],
                      ["Тарифы",       "Link",     "Прямая ссылка, без dropdown"],
                      ["О нас",        "Link",     "Прямая ссылка, без dropdown"],
                    ].map(([group, type, items]) => (
                      <tr key={group} className="border-b border-border last:border-0">
                        <td className="px-4 py-2 font-medium text-foreground">{group}</td>
                        <td className="px-4 py-2"><TokenChip>{type}</TokenChip></td>
                        <td className="px-4 py-2">{items}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SpecBlock>
          </div>
        </SpecBlock>

        {/* ── Logo Marquee ── */}
        <SubSection id="cross-marquee" title="InfiniteLogoMarquee" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Бесконечная бегущая строка логотипов партнёров / клиентов. CSS-анимация (не JS), fade по краям через mask-image. Компонент из <code className="text-foreground">@rocketmind/ui</code>.
        </p>

        {/* ── Live preview ── */}
        <div className="rounded-lg border border-border py-8 mb-8 bg-[#0A0A0A] overflow-hidden">
          <div className="mx-auto max-w-[1056px]">
            <InfiniteLogoMarquee logos={DEMO_LOGOS} reverse />
          </div>
        </div>

        <SpecBlock title="Props и применение">
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
                    ["logos",          "LogoMarqueeItem[]", "—",   "Массив логотипов { alt, src, width?, height? }"],
                    ["speedSeconds",   "number",            "25",  "Длительность одного цикла анимации"],
                    ["gap",           "number",            "67",  "Расстояние между логотипами (px)"],
                    ["maxLogoHeight", "number",            "39",  "Максимальная высота логотипа (px)"],
                    ["fadeWidth",     "number",            "44",  "Ширина fade-маски по краям (px)"],
                    ["reverse",      "boolean",           "false", "Направление: true — слева направо (→)"],
                    ["className",    "string",            "—",   "Дополнительные классы контейнера"],
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
              <p>&nbsp;</p>
              <p>{'<InfiniteLogoMarquee logos={logos} reverse />'}</p>
            </div>
            <div className="overflow-auto rounded-lg border border-border">
              <table className="w-full text-[length:var(--text-14)]">
                <thead>
                  <tr className="border-b border-border bg-rm-gray-2/30">
                    <th className="text-left px-4 py-2 font-medium">Действие</th>
                    <th className="text-left px-4 py-2 font-medium">Инструкция</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["Добавить логотип",   "Положить SVG в apps/site/public/clip-logos/. Имя = kebab-case slug, например sberbank.svg."],
                    ["Удалить логотип",    "Удалить файл из apps/site/public/clip-logos/."],
                    ["Изменить порядок",   "Отредактировать массив preferredOrder в apps/site/src/lib/partner-logos.ts."],
                  ].map(([action, instruction]) => (
                    <tr key={action} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 font-medium text-foreground whitespace-nowrap">{action}</td>
                      <td className="px-4 py-2">{instruction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 rounded-lg border border-border bg-rm-gray-2/30 text-[length:var(--text-14)] text-muted-foreground space-y-2">
              <p><span className="text-foreground font-medium">Форматы:</span> SVG (рек.), PNG, WebP, AVIF, JPG. Монохромный белый/серый.</p>
              <p><span className="text-foreground font-medium">Размер:</span> viewBox ~100-170px × 32-40px. Именование: kebab-case.</p>
            </div>
          </div>
        </SpecBlock>
      </Section>

      <Separator />
    </>
  )
}
