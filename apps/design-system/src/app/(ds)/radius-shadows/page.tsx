"use client"

import React from "react"
import { Badge, Separator } from "@rocketmind/ui"
import { Section, SubSection, RadiusTokenCard } from "@/components/ds/shared"

export default function RadiusShadowsPage() {
  return (
    <>
      <Section id="radius-shadows" title="4. Скругления">
        <p className="text-muted-foreground mb-6">
          <strong>Flat стиль.</strong> Скругление объясняет тип объекта: <strong>0px</strong> для column-контейнеров, <strong>4px</strong> для controls, <strong>8px</strong> для surface,
          <strong> full</strong> только для самостоятельных pill / avatar-элементов. Тени не используются.
        </p>

        <SubSection id="radius-scale" title="Наглядные сценарии" first />
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-8">
          <RadiusTokenCard
            label="none"
            value="0px"
            token="--radius-none"
            tailwind="rounded-none"
            usage="Column-контейнеры: секции, обёртки, hero-блоки, full-width панели."
            note="Самый крупный уровень — внутри уже лежат карточки и заголовки. Скругление не нужно."
          >
            <div className="space-y-3">
              <div className="rounded-none border border-border bg-card p-4">
                <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-16)] uppercase mb-2">Column / Section</p>
                <div className="flex flex-col gap-2">
                  <div className="rounded-lg border border-border bg-background p-3">
                    <p className="text-[length:var(--text-12)] text-muted-foreground">Вложенная карточка (8px)</p>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-3">
                    <p className="text-[length:var(--text-12)] text-muted-foreground">Ещё одна карточка (8px)</p>
                  </div>
                </div>
              </div>
            </div>
          </RadiusTokenCard>

          <RadiusTokenCard
            label="sm"
            value="4px"
            token="--radius-sm"
            tailwind="rounded-sm"
            usage="Мелкие controls: button, input, select, dropdown, badge, tooltip."
            note="Если элемент нажимается или вводит данные, почти всегда это 4px."
          >
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <button className="h-9 px-4 rounded-sm bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]">
                  Создать
                </button>
                <button className="h-9 px-4 rounded-sm border border-border bg-background text-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]">
                  Фильтр
                </button>
                <span className="inline-flex items-center h-7 px-2 rounded-sm bg-rm-gray-2 text-muted-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]">
                  AI
                </span>
              </div>
              <div className="h-10 px-3 rounded-sm border border-border bg-background flex items-center text-[length:var(--text-14)] text-muted-foreground">
                case@rocketmind.ai
              </div>
              <div className="w-fit min-w-[180px] p-3 rounded-sm border border-border bg-popover">
                <p className="text-[length:var(--text-12)] font-medium">Dropdown / Tooltip</p>
                <p className="text-[length:var(--text-12)] text-muted-foreground">Редактировать</p>
              </div>
            </div>
          </RadiusTokenCard>

          <RadiusTokenCard
            label="lg"
            value="8px"
            token="--radius-lg"
            tailwind="rounded-lg"
            usage="Surface-уровень: card, modal, panel, sidebar, toast."
            note="Если элемент является контейнером контента или самостоятельной поверхностью, это 8px."
          >
            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-card p-4">
                <Badge className="w-fit mb-3">Кейс</Badge>
                <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-16)] uppercase mb-1">Карточка результата</p>
                <p className="text-[length:var(--text-12)] text-muted-foreground">Контейнер контента, поэтому использует surface-radius 8px.</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[var(--rm-yellow-100)] shrink-0" />
                <div>
                  <p className="text-[length:var(--text-12)] font-medium">Toast / Notice</p>
                  <p className="text-[length:var(--text-12)] text-muted-foreground">Та же surface-логика.</p>
                </div>
              </div>
            </div>
          </RadiusTokenCard>

          <RadiusTokenCard
            label="full"
            value="9999px"
            token="--radius-full"
            tailwind="rounded-full"
            usage="Только standalone-pill: avatar, counter, isolated accent label."
            note="Не использовать для основных кнопок, инпутов и карточек — это ломает flat-характер системы."
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-12 h-12 rounded-full border border-border bg-rm-gray-2 flex items-center justify-center font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase">
                  AI
                </div>
                <span className="inline-flex items-center h-8 px-3 rounded-full border border-border bg-background font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]">
                  Standalone label
                </span>
                <span className="inline-flex items-center justify-center min-w-8 h-8 px-2 rounded-full bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase">
                  12
                </span>
              </div>
              <div className="rounded-lg border border-dashed border-border bg-background p-3">
                <p className="text-[length:var(--text-12)] text-muted-foreground">`full` живёт как отдельный маркер, а не как основной radius контейнера.</p>
              </div>
            </div>
          </RadiusTokenCard>
        </div>

        <div className="rounded-lg border border-border bg-rm-gray-2/30 p-4">
          <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">
            В этом блоке две отдельные кнопки копирования: одна копирует CSS token, вторая — Tailwind class. Больше нет смешения между визуальным примером и тем, что попадает в буфер.
          </p>
        </div>
      </Section>

      <Separator />
    </>
  )
}
