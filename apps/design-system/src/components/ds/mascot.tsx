"use client"

import React, { useState, useEffect, useRef } from "react"
import { User, ShieldCheck, MousePointerClick, Zap, Lightbulb, Smile, ThumbsUp } from "lucide-react"

const BASE_PATH = process.env.NODE_ENV === "production" ? "/rocketmind/ds" : ""

const MASCOTS: Array<{
  key: string
  name: string
  role: string
  character: string
  usage: string[]
  states: Partial<Record<string, string[]>>
}> = [
  {
    key: "kate",
    name: "Катя",
    role: "Аналитик экосистем",
    character: "Внимательная, структурная, быстрая в выводах.",
    usage: [
      "Аватар в чате для аналитического агента",
      "Карточка каталога: раздел «Анализ и стратегия»",
      "CTA-блок: «Разобраться в системе», «Найти связи»",
    ],
    states: {
      base:      ["kate_base.png", "kate_base_←.png"],
      confident: ["kate_confident.png"],
      pointer:   ["kate_pointer.png"],
      surprised: ["kate_surprised.png"],
      thinks:    ["kate_thinks.png"],
      smile:     ["kate_smile.png", "kate_smile_←.png"],
    },
  },
  {
    key: "nick",
    name: "Ник",
    role: "Дизраптор",
    character: "Авантюрный, резкий, двигает вперёд без лишних сомнений.",
    usage: [
      "Агент для задач «найти прорывную идею», «бросить вызов рынку»",
      "Карточка каталога: раздел «Инновации и рост»",
      "CTA-блок: «Сломай шаблон», «Запусти что-то новое»",
      "Промо-блоки и hero-секции — энергичный визуальный якорь",
    ],
    states: {
      base:      ["nick-base.png"],
      confident: ["nick_confident.png"],
      pointer:   ["nick_pointer.png"],
      surprised: ["nick_surprised.png"],
      thinks:    ["nick_thinks.png"],
      smile:     ["nick_smile.png"],
      ok:        ["nick_ok.png"],
    },
  },
  {
    key: "sergey",
    name: "Сергей",
    role: "Внешний контекст",
    character: "Спокойный, наблюдательный, смотрит на всё вокруг и сверху.",
    usage: [
      "Агент для задач «исследовать рынок», «найти конкурентов», «внешний аудит»",
      "Карточка каталога: раздел «Рыночная аналитика»",
      "CTA-блок: «Посмотри на рынок», «Что происходит снаружи»",
    ],
    states: {
      base:      ["sergey_base.png"],
      confident: ["sergey_confident.png"],
      pointer:   ["sergey_pointer.png"],
      surprised: ["sergey_surprised.png", "sergey_surprised_2.png", "sergey_surprised_←.png", "sergey_surprised_→.png"],
      thinks:    ["sergey_thinks.png"],
      smile:     ["sergey_smile.png"],
      ok:        ["sergey_ok.png"],
    },
  },
  {
    key: "lida",
    name: "Лида",
    role: "Тестировщик гипотез",
    character: "Практичная, аккуратная, наблюдательная, быстро фиксирует паттерны.",
    usage: [
      "Агент для задач «проверить гипотезу», «валидировать идею»",
      "Карточка каталога: раздел «Исследования и валидация»",
      "CTA-блок: «Проверь свою идею», «Разберись что работает»",
      "Onboarding-блоки — объясняет как работает платформа",
    ],
    states: {
      base:      ["lida_base.png"],
      confident: ["lida_confident.png"],
      pointer:   ["lida_pointing.png"],
      surprised: ["lida_surprised_←.png", "lida_surprised_→.png"],
      thinks:    ["lida_thinks.png"],
      ok:        ["lida_ok.png"],
    },
  },
  {
    key: "alex",
    name: "Алекс",
    role: "Клиентский агент",
    character: "Дружелюбный, уверенный, открытый.",
    usage: [
      "Основной агент для клиентской коммуникации и онбординга",
      "Аватар первого сообщения / empty state чата",
      "Карточка каталога: раздел «Клиентский сервис»",
      "CTA-блок: «Поговори с Алексом», «Начни диалог»",
      "Лендинг — «лицо» продукта",
    ],
    states: {
      base:      ["alex_base.png"],
      confident: ["alex_confident.png"],
      pointer:   ["alex_pointer.png"],
      surprised: ["alex_surprised.png"],
      thinks:    ["alex_thinks.png"],
      ok:        ["alex_ok.png"],
    },
  },
  {
    key: "max",
    name: "Макс",
    role: "Ценность бизнеса",
    character: "Внимательный, вдумчивый, говорит по делу.",
    usage: [
      "Агент для задач «найти узкие места», «оценить бизнес-модель»",
      "Карточка каталога: раздел «Бизнес-аналитика»",
      "CTA-блок: «Найди слабые места», «Где теряются деньги»",
      "Блоки с кейсами и результатами — авторитетный голос",
    ],
    states: {
      base:      ["max_base.png"],
      confident: ["max_confident_←.png", "max_confident_→.png"],
      surprised: ["max_surprised_←.png", "max_surprised_→.png"],
      thinks:    ["max_thinks.png"],
      ok:        ["max_ok.png"],
    },
  },
  {
    key: "mark",
    name: "Марк",
    role: "Дизайнер платформ",
    character: "Собранный, методичный, знает системы.",
    usage: [
      "Агент для задач «спроектировать продукт», «выстроить архитектуру»",
      "Карточка каталога: раздел «Продукт и платформы»",
      "CTA-блок: «Спроектируй своё решение», «Построй систему»",
    ],
    states: {
      base:      ["mark_base.png"],
      confident: ["mark_confident.png"],
      pointer:   ["mark_pointer_1.png", "mark_pointer_2.png"],
      surprised: ["mark_surprised.png"],
      smile:     ["mark_smile.png"],
      ok:        ["mark_ok_←.png", "mark_ok_→.png"],
    },
  },
  {
    key: "sophie",
    name: "Софи",
    role: "Куратор обучения",
    character: "Тёплая, терпеливая, заботливо проводит через обучение.",
    usage: [
      "Агент для задач «обучить команду», «создать программу»",
      "Карточка каталога: раздел «Академия и обучение»",
      "CTA-блок: «Начни обучение», «Прокачай команду»",
      "Onboarding — дуэт с Алексом для первого знакомства с платформой",
    ],
    states: {
      base:      ["sophie_base.png", "sophie_base_←.png"],
      confident: ["sophie_confident.png"],
      pointer:   ["sophie_pointer.png"],
      surprised: ["sophie_surprised.png"],
      smile:     ["sophie_smile.png"],
      ok:        ["sophie_ok.png"],
    },
  },
]

const MASCOT_STATE_TABS = [
  { key: "base",      label: "Базовое",     icon: User },
  { key: "confident", label: "Уверенное",   icon: ShieldCheck },
  { key: "pointer",   label: "Указывает",   icon: MousePointerClick },
  { key: "surprised", label: "Удивлённый",  icon: Zap },
  { key: "thinks",    label: "Думает",      icon: Lightbulb },
  { key: "smile",     label: "Улыбка",      icon: Smile },
  { key: "ok",        label: "ОК",          icon: ThumbsUp },
]

export function getVariantLabel(filename: string): string {
  const name = filename.replace(/\.png$/i, "")
  const match = name.match(/[_-]([←→\d]+)$/)
  return match ? match[1] : ""
}

export function MascotCard({ mascot, activeState }: { mascot: typeof MASCOTS[0]; activeState: string }) {
  const variants = mascot.states[activeState] ?? []
  const baseVariants = mascot.states.base ?? []
  const isFallback = variants.length === 0
  const files = isFallback ? baseVariants : variants
  const [variantIdx, setVariantIdx] = useState(0)
  const [tooltip, setTooltip] = useState<{ top: number; right: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  // Reset variant index when active state changes
  useEffect(() => { setVariantIdx(0) }, [activeState])

  const currentFile = files[variantIdx] ?? files[0]
  const imgPath = `${BASE_PATH}/ai-mascots/${mascot.key}/${currentFile}`
  const downloadName = `rocketmind_${mascot.key}_${currentFile}`
  const hasMultiple = files.length > 1

  function showTooltip() {
    if (!btnRef.current) return
    const r = btnRef.current.getBoundingClientRect()
    setTooltip({ top: r.bottom + 6, right: window.innerWidth - r.right })
  }

  return (
    <div className="flex flex-col rounded-lg border border-border overflow-hidden">
      <div className="bg-rm-gray-2/30 flex items-end justify-center h-44 relative">
        <img
          src={imgPath}
          alt={`${mascot.name} — ${activeState}`}
          className={`h-full object-contain object-bottom transition-opacity${isFallback ? " opacity-30" : ""}`}
        />
        {/* Variant switcher — top left */}
        {hasMultiple && !isFallback && (
          <div className="absolute top-2 left-2 flex gap-1">
            {files.map((f, i) => {
              const label = getVariantLabel(f)
              return (
                <button
                  key={f}
                  onClick={() => setVariantIdx(i)}
                  className={`min-w-[26px] px-1.5 py-0.5 rounded text-[length:var(--text-12)] font-mono border text-center transition-colors cursor-pointer ${
                    i === variantIdx
                      ? "bg-[var(--rm-yellow-100)] text-black border-[var(--rm-yellow-100)]"
                      : "bg-background/80 border-border text-muted-foreground hover:text-foreground"
                  }`}
                  title={f}
                >
                  {label || String(i + 1)}
                </button>
              )
            })}
          </div>
        )}
        {/* Info button — top right */}
        <button
          ref={btnRef}
          onMouseEnter={showTooltip}
          onMouseLeave={() => setTooltip(null)}
          className="absolute top-2 right-2 w-5 h-5 rounded-full border border-border bg-background/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="8.5"/>
            <line x1="12" y1="12" x2="12" y2="16"/>
          </svg>
        </button>
        {/* Portal tooltip */}
        {tooltip && (
          <div
            className="tooltip-enter fixed z-50 w-56 pointer-events-none"
            style={{ top: tooltip.top, right: tooltip.right }}
          >
            <div className="rounded-sm border border-border bg-popover shadow-xl p-3 text-[length:var(--text-12)] leading-relaxed">
              <p className="font-semibold text-foreground mb-0.5">{mascot.role}</p>
              <p className="text-muted-foreground mb-2 italic">{mascot.character}</p>
              <ul className="space-y-1">
                {mascot.usage.map((u, i) => (
                  <li key={i} className="text-muted-foreground flex gap-1.5">
                    <span className="mt-0.5 shrink-0 text-[var(--rm-yellow-100)]">·</span>
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="p-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[length:var(--text-14)] font-medium truncate">{mascot.name}</p>
          <p className="text-[length:var(--text-12)] text-muted-foreground truncate">{mascot.role}</p>
        </div>
        {isFallback ? (
          <span className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded text-[length:var(--text-12)] border border-border text-muted-foreground/40 cursor-not-allowed opacity-40">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            PNG
          </span>
        ) : (
          <a
            href={imgPath}
            download={downloadName}
            className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded text-[length:var(--text-12)] border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
            title="Скачать PNG"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            PNG
          </a>
        )}
      </div>
    </div>
  )
}

export function MascotSection() {
  const [activeState, setActiveState] = useState("base")

  return (
    <div>
      <p className="text-muted-foreground mb-4 text-[length:var(--text-14)]">
        PNG-маскоты AI-агентов. Переключайте состояния через табы. Если у маскота нет варианта — показывается базовое с прозрачностью, кнопка скачать недоступна.
      </p>
      <div className="inline-flex flex-wrap items-center gap-4 border-b border-border mb-6">
        {MASCOT_STATE_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeState === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveState(tab.key)}
              className={`relative inline-flex h-10 items-center gap-1.5 px-0 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {tab.label}
              {isActive && (
                <span className="absolute bottom-[-1px] left-0 h-0.5 w-full bg-[var(--rm-yellow-100)]" />
              )}
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {MASCOTS.map((mascot) => (
          <MascotCard key={mascot.key} mascot={mascot} activeState={activeState} />
        ))}
      </div>
    </div>
  )
}
