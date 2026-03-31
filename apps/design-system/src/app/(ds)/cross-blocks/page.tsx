"use client"

import React from "react"
import { InfiniteLogoMarquee, Separator } from "@rocketmind/ui"
import type { LogoMarqueeItem } from "@rocketmind/ui"
import { Section, SubSection, SpecBlock } from "@/components/ds/shared"
import { TokenChip } from "@/components/ds/color-helpers"
import { SiteHeader } from "@/components/ui/site-header"

const BASE_PATH = process.env.NODE_ENV === "production" ? "/rocketmind/ds" : ""

const DEMO_LOGOS: LogoMarqueeItem[] = [
  { alt: "Билайн",           src: `${BASE_PATH}/hero-logos/beeline.svg`,   width: 125, height: 24 },
  { alt: "РУСАЛ",             src: `${BASE_PATH}/hero-logos/rusal.svg`,     width: 113, height: 34 },
  { alt: "Минцифры России",   src: `${BASE_PATH}/hero-logos/mintsifry.svg`, width: 146, height: 32 },
  { alt: "ВТБ",              src: `${BASE_PATH}/hero-logos/vtb.svg`,       width: 90,  height: 33 },
  { alt: "Т-Банк",           src: `${BASE_PATH}/hero-logos/tbank.svg`,     width: 116, height: 37 },
  { alt: "Росатом",          src: `${BASE_PATH}/hero-logos/rosatom.svg`,   width: 109, height: 39 },
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
        <SubSection id="cross-header" title="Header — Шапка" first />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Единая шапка для всех страниц. Sticky, backdrop blur при скролле.
          Логотип слева, меню и CTA собраны в правой части экрана. На мобайле: логотип + гамбургер.
        </p>

        {/* ── Live preview ── */}
        <div className="-mx-5 md:-mx-10 mb-8 border-y border-border overflow-hidden">
          <div className="bg-rm-gray-2/20">
            <SiteHeader basePath={BASE_PATH} preview />
            {/* Fake page content to simulate context */}
            <div className="px-8 py-10 space-y-3">
              {[100, 75, 88, 60].map((w, i) => (
                <div key={i} className="h-3 rounded-sm bg-rm-gray-2" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </div>

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
                    ["Логотип",          "text_logo_*.svg",            "dark/light вариант автоматически"],
                    ["Навигация",        "--font-mono-family",         "12px, uppercase, tracking 0.08em"],
                    ["Цвет nav",         "--muted-foreground",         "hover → --foreground + bg-rm-gray-3"],
                    ["Кнопка «Войти»",   "--border / --rm-gray-2",     "Outline, hover: bg-rm-gray-3"],
                    ["CTA «Попробовать»","--rm-yellow-100",             "hover: --rm-yellow-300"],
                    ["Мобайл гамбургер", "Lucide Menu / X",            "18px, stroke 1.5px"],
                    ["Мобайл меню",      "React portal + fixed",       "top-16, backdrop-blur-lg"],
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="px-4 py-2 border-b border-border bg-rm-gray-2/30">
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Default — top of page</span>
                </div>
                <div className="bg-transparent p-0">
                  <nav className="flex h-16 items-center justify-between px-5 border-b border-transparent">
                    <div className="flex items-center gap-2">
                      <img src={`${BASE_PATH}/text_logo_dark_background_en.svg`} alt="Rocketmind" className="h-6 hidden dark:block" />
                      <img src={`${BASE_PATH}/text_logo_light_background_en.svg`} alt="Rocketmind" className="h-6 dark:hidden" />
                    </div>
                    <div className="hidden sm:flex items-center gap-0.5">
                      {["Продукты","Агенты","Тарифы"].map(l => (
                        <span key={l} className="px-3 py-1.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">{l}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline-flex items-center justify-center h-8 px-3 rounded-sm border border-border text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-foreground">Войти</span>
                      <span className="inline-flex items-center justify-center h-8 px-3 rounded-sm bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em]">Попробовать</span>
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
                      <img src={`${BASE_PATH}/text_logo_dark_background_en.svg`} alt="Rocketmind" className="h-6 hidden dark:block" />
                      <img src={`${BASE_PATH}/text_logo_light_background_en.svg`} alt="Rocketmind" className="h-6 dark:hidden" />
                    </div>
                    <div className="hidden sm:flex items-center gap-0.5">
                      {["Продукты","Агенты","Тарифы"].map(l => (
                        <span key={l} className="px-3 py-1.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">{l}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline-flex items-center justify-center h-8 px-3 rounded-sm border border-border text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-foreground">Войти</span>
                      <span className="inline-flex items-center justify-center h-8 px-3 rounded-sm bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em]">Попробовать</span>
                    </div>
                  </nav>
                </div>
                <div className="px-4 py-2 bg-rm-gray-2/10">
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground">border-border · bg-background/95 · backdrop-blur-lg</span>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-rm-gray-2/30 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground">
              <p className="mb-1">{'<SiteHeader basePath={BASE_PATH} />'}</p>
              <p className="text-[length:var(--text-12)] text-muted-foreground/60">{'// basePath — для корректных путей к SVG-логотипам в prod'}</p>
            </div>
          </div>
        </SpecBlock>

        {/* ── Logo Marquee ── */}
        <SubSection id="cross-marquee" title="InfiniteLogoMarquee" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Бесконечная бегущая строка логотипов партнёров / клиентов. CSS-анимация (не JS), fade по краям через mask-image. Компонент из <code className="text-foreground">@rocketmind/ui</code>.
        </p>

        {/* ── Live preview ── */}
        <div className="-mx-5 md:-mx-10 border-y border-border py-8 mb-8 bg-[#0A0A0A]">
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
                    ["Добавить логотип",   "Положить SVG в apps/site/public/hero-logos/. Имя = kebab-case slug, например sberbank.svg."],
                    ["Удалить логотип",    "Удалить файл из apps/site/public/hero-logos/."],
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
