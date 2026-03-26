"use client"

import React from "react"
import { Separator } from "@rocketmind/ui"
import { Section, TokenRow, TooltipDemo } from "@/components/ds/shared"

export default function TooltipsPage() {
  return (
    <>
      <Section id="tooltips" title="10. Тултипы">
        <p className="text-muted-foreground mb-6">
          Контекстные подсказки при наведении. Появляются поверх контента через <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]">position: fixed</code>, не обрезаются родителем. Анимация: 120ms ease-out, fade + translateY.
        </p>

        <h3 id="tooltips-animation" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] md:text-[length:var(--text-32)] uppercase tracking-[-0.01em] mb-4">
          Анимация
        </h3>
        <div className="space-y-2 mb-8">
          {[
            { token: "--tooltip-duration", value: "120ms", desc: "Длительность появления" },
            { token: "--tooltip-easing",   value: "cubic-bezier(0, 0, 0.2, 1)", desc: "Ease-out — быстрый вход, плавный финал" },
            { token: "--tooltip-offset-y", value: "4px", desc: "Смещение при появлении (translateY)" },
            { token: "--tooltip-scale",    value: "0.97 → 1", desc: "Лёгкое масштабирование" },
          ].map((t) => (
            <TokenRow key={t.token} token={t.token} value={t.value} desc={t.desc} />
          ))}
        </div>

        <h3 id="tooltips-variants" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] md:text-[length:var(--text-32)] uppercase tracking-[-0.01em] mb-4">
          Варианты
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Простой текстовый */}
          <div className="p-6 rounded-lg border border-border flex flex-col items-center gap-4">
            <p className="text-[length:var(--text-12)] text-muted-foreground uppercase tracking-wider mb-2">Простой</p>
            <TooltipDemo
              label="Наведи на меня"
              content={<span className="text-[length:var(--text-12)] text-popover-foreground">Короткая подсказка</span>}
            />
          </div>
          {/* С заголовком */}
          <div className="p-6 rounded-lg border border-border flex flex-col items-center gap-4">
            <p className="text-[length:var(--text-12)] text-muted-foreground uppercase tracking-wider mb-2">С заголовком</p>
            <TooltipDemo
              label="Наведи на меня"
              content={
                <>
                  <p className="font-semibold text-[length:var(--text-12)] text-popover-foreground mb-0.5">Заголовок</p>
                  <p className="text-[length:var(--text-12)] text-muted-foreground">Дополнительное описание действия или объекта.</p>
                </>
              }
            />
          </div>
          {/* Со списком */}
          <div className="p-6 rounded-lg border border-border flex flex-col items-center gap-4">
            <p className="text-[length:var(--text-12)] text-muted-foreground uppercase tracking-wider mb-2">С описанием</p>
            <TooltipDemo
              label="Наведи на меня"
              content={
                <>
                  <p className="font-semibold text-[length:var(--text-12)] text-popover-foreground mb-0.5">Роль агента</p>
                  <p className="text-[length:var(--text-12)] text-muted-foreground italic mb-2">Характер и стиль коммуникации.</p>
                  <ul className="space-y-1">
                    {["Применение 1", "Применение 2", "Применение 3"].map((u) => (
                      <li key={u} className="text-[length:var(--text-12)] text-muted-foreground flex gap-1.5">
                        <span className="text-[var(--rm-yellow-100)] shrink-0">·</span>
                        <span>{u}</span>
                      </li>
                    ))}
                  </ul>
                </>
              }
            />
          </div>
        </div>

        <h3 id="tooltips-rules" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] md:text-[length:var(--text-32)] uppercase tracking-[-0.01em] mb-4">
          Правила применения
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { rule: "Не обрезается родителем",    desc: "Тултип рендерится через fixed, всегда поверх контента" },
            { rule: "Появляется быстро",          desc: "120ms — достаточно для плавности без задержки" },
            { rule: "pointer-events: none",       desc: "Тултип не мешает взаимодействию с соседними элементами" },
            { rule: "Исчезает мгновенно",         desc: "При уходе курсора — убирается без анимации (unmount)" },
            { rule: "Минимальная ширина 160px",   desc: "Контент не переносится слишком узко" },
            { rule: "z-index: 50",                desc: "Всегда поверх контента, но под модалами (z-100+)" },
          ].map((item) => (
            <div key={item.rule} className="flex gap-3 p-3 rounded-lg border border-border">
              <span className="text-[var(--rm-yellow-100)] mt-0.5 shrink-0">·</span>
              <div>
                <p className="text-[length:var(--text-14)] font-medium">{item.rule}</p>
                <p className="text-[length:var(--text-12)] text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Separator />
    </>
  )
}
