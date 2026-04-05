"use client"

import React, { useState } from "react"

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const DEMO_ITEMS = [
  {
    title: "Быстро занимает ключевые позиции в смежных рынках",
    description: "Экосистемная стратегия — это переход к новой архитектуре устойчивости и роста бизнеса. Вместо того чтобы развивать один продукт изолированно.",
  },
  {
    title: "Объединяет партнеров, клиентов и технологии",
    description: "Создаём единую сеть взаимодействия, где каждый участник усиливает ценность остальных.",
  },
  {
    title: "Развивает новые направления",
    description: "Выявляем и запускаем смежные бизнес-модели, которые органично дополняют основной продукт.",
  },
  {
    title: "Снижает зависимость от источника дохода",
    description: "Диверсификация через экосистемный подход делает бизнес устойчивым к рыночным изменениям.",
  },
]

export function AccordionShowcase() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="flex flex-col">
      {DEMO_ITEMS.map((item, i) => {
        const isOpen = openIndex === i
        const isFirst = i === 0

        return (
          <button
            key={i}
            type="button"
            className={`flex items-start gap-7 py-4 pr-4 text-left cursor-pointer border-[#404040] ${
              isFirst ? "border-t border-b" : "border-b"
            }`}
            onClick={() => setOpenIndex(isOpen ? -1 : i)}
          >
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-foreground">
                {item.title}
              </span>
              {isOpen && item.description && (
                <p className="text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
            <div className="shrink-0 mt-0.5 text-foreground">
              {isOpen ? <MinusIcon /> : <PlusIcon />}
            </div>
          </button>
        )
      })}
    </div>
  )
}
