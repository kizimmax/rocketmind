"use client"

import React from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { CopyButton } from "@/components/copy-button"
import { ColorSwatchLive } from "@/components/color-swatch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Rocket, Sparkles, Eye, Zap, Search, User, Gem, BookOpen,
  ChevronRight, ChevronDown, ArrowRight, Loader2, Trash2, Menu, X,
  Wrench, GraduationCap
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { GridGuides } from "@/components/ui/guide-grid"
import { SiteHeader } from "@/components/ui/site-header"
import { Accordion } from "@base-ui/react"

const DS_VERSION = "1.4.0"

/* ───────── COLOR BLOCK HELPERS ───────── */

/** Возвращает счётчик, который инкрементируется при смене темы (class на <html>) */
function useThemeKey() {
  const [key, setKey] = useState(0)
  useEffect(() => {
    const observer = new MutationObserver(() => setKey(k => k + 1))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])
  return key
}

function computeHex(el: HTMLElement): string {
  const bg = getComputedStyle(el).backgroundColor
  const m = bg.match(/(\d+)/g)
  if (!m) return ""
  return "#" + [+m[0], +m[1], +m[2]].map(v => v.toString(16).padStart(2, "0")).join("")
}

/** Returns black or white based on WCAG perceived luminance */
function computeLumColor(hex: string): string {
  if (!hex || hex.length < 7) return "#000000"
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const lin = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  return lum > 0.5 ? "#000000" : "#ffffff"
}

/** Кликабельный цветной блок: hex по клику, hex-оверлей 30% всегда / 100% при ховере, опциональный бейдж */
function ColorHexBlock({
  style, className, badgeColor, badge,
}: {
  style: React.CSSProperties
  className: string
  badgeColor?: string  // CSS value for badge text, e.g. "var(--rm-yellow-fg)"
  badge?: string       // e.g. "100"
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hex, setHex] = useState("")
  const [autoColor, setAutoColor] = useState("#000000")
  const [hovered, setHovered] = useState(false)
  const themeKey = useThemeKey()

  useEffect(() => {
    if (!ref.current) return
    const h = computeHex(ref.current)
    if (h) { setHex(h); setAutoColor(computeLumColor(h)) }
  }, [themeKey])

  return (
    <div
      ref={ref}
      className={`relative cursor-pointer transition-all duration-150 ${className}`}
      style={style}
      onMouseEnter={() => {
        if (ref.current) {
          const h = computeHex(ref.current)
          if (h) { setHex(h); setAutoColor(computeLumColor(h)) }
        }
        setHovered(true)
      }}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (!ref.current) return
        const h = computeHex(ref.current)
        if (!h) return
        navigator.clipboard.writeText(h)
        toast.success("Скопировано в буфер обмена", { description: `HEX: ${h}`, duration: 2000 })
      }}
    >
      {badge && (
        <span
          className="absolute top-1 left-1 text-[9px] font-[family-name:var(--font-mono-family)] font-bold"
          style={{ color: badgeColor }}
        >{badge}</span>
      )}
      {hex && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-150"
          style={{ opacity: hovered ? 1 : 0.3 }}
        >
          <span className="text-[11px] font-[family-name:var(--font-mono-family)]" style={{ color: autoColor }}>
            {hex}
          </span>
        </div>
      )}
    </div>
  )
}


/** Нижняя строка акцентной карточки: fg на 100-фоне (col-span-2) + fg-subtle (col-span-4) */
function FgRow({ token }: { token: string }) {
  const fgProbeRef = useRef<HTMLDivElement>(null)
  const fgsProbeRef = useRef<HTMLDivElement>(null)
  const [fgHex, setFgHex] = useState("")
  const [fgsHex, setFgsHex] = useState("")

  const themeKey = useThemeKey()

  const readHexes = () => {
    if (fgProbeRef.current) { const h = computeHex(fgProbeRef.current); if (h) setFgHex(h) }
    if (fgsProbeRef.current) { const h = computeHex(fgsProbeRef.current); if (h) setFgsHex(h) }
  }

  useEffect(() => { readHexes() }, [themeKey])

  return (
    <div className="grid grid-cols-6 border-t border-border relative">
      {/* Invisible probes to read fg/fg-subtle hex values */}
      <div ref={fgProbeRef}  className="sr-only" style={{ backgroundColor: `var(--rm-${token}-fg)` }} />
      <div ref={fgsProbeRef} className="sr-only" style={{ backgroundColor: `var(--rm-${token}-fg-subtle)` }} />
      {/* fg cell */}
      <div
        className="col-span-2 px-3 py-2 flex items-center justify-between border-r border-border cursor-pointer"
        style={{ backgroundColor: `var(--rm-${token}-100)`, color: `var(--rm-${token}-fg)` }}
        onMouseEnter={readHexes}
        onClick={() => { if (fgHex) { navigator.clipboard.writeText(fgHex); toast.success("Скопировано в буфер обмена", { description: `HEX: ${fgHex}`, duration: 2000 }) } }}
      >
        <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)]">fg · {fgHex}</span>
        <div onClick={e => e.stopPropagation()}>
          <CopyButton value={fgHex} label={`HEX: ${fgHex}`} iconColor={`var(--rm-${token}-fg)`} />
        </div>
      </div>
      {/* fg-subtle cell */}
      <div
        className="col-span-4 px-3 py-2 flex items-center justify-between cursor-pointer"
        style={{ backgroundColor: `var(--rm-${token}-900)`, color: `var(--rm-${token}-fg-subtle)` }}
        onMouseEnter={readHexes}
        onClick={() => { if (fgsHex) { navigator.clipboard.writeText(fgsHex); toast.success("Скопировано в буфер обмена", { description: `HEX: ${fgsHex}`, duration: 2000 }) } }}
      >
        <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)]">fg-subtle · {fgsHex}</span>
        <div onClick={e => e.stopPropagation()}>
          <CopyButton value={fgsHex} label={`HEX: ${fgsHex}`} iconColor={`var(--rm-${token}-fg-subtle)`} />
        </div>
      </div>
    </div>
  )
}

const DS_DATE = "2026-03-16"
const BASE_PATH = process.env.NODE_ENV === "production" ? "/rocketmind-design-system" : ""

/* ───────── NAV DATA ───────── */
type SubSection = { id: string; label: string }
type NavSection = { id: string; label: string; subsections: SubSection[] }

const sections: NavSection[] = [
  { id: "logos", label: "Логотипы", subsections: [] },
  { id: "colors", label: "Цвета", subsections: [
    { id: "colors-bg",       label: "Фоны" },
    { id: "colors-gray",     label: "Серая шкала" },
    { id: "colors-accent",   label: "Акцентная" },
    { id: "colors-inverted", label: "Инвертированные" },
  ]},
  { id: "typography", label: "Типография", subsections: [
    { id: "typography-fonts", label: "Шрифты" },
    { id: "typography-scale", label: "Типографика" },
  ]},
  { id: "spacing", label: "Спейсинг и сетка", subsections: [
    { id: "spacing-scale",  label: "Шкала отступов" },
    { id: "spacing-grid",   label: "Сетка страницы" },
    { id: "spacing-phi",    label: "Пропорции (phi)" },
    { id: "spacing-visual", label: "Визуальный стиль" },
  ]},
  { id: "radius-shadows", label: "Скругления", subsections: [
    { id: "radius-scale", label: "Border Radius" },
  ]},
  { id: "components", label: "Компоненты", subsections: [
    { id: "components-buttons", label: "Кнопки" },
    { id: "components-inputs",  label: "Инпуты" },
    { id: "components-cards",   label: "Карточки" },
  ]},
  { id: "tooltips", label: "Тултипы", subsections: [
    { id: "tooltips-animation", label: "Анимация" },
    { id: "tooltips-variants",  label: "Варианты" },
    { id: "tooltips-rules",     label: "Правила" },
  ]},
  { id: "icons", label: "Иконки", subsections: [
    { id: "icons-scale",   label: "Размерная шкала" },
    { id: "icons-lucide",  label: "Lucide" },
    { id: "icons-mascots", label: "Маскоты" },
  ]},
  { id: "animations", label: "Анимации", subsections: [
    { id: "animations-timing", label: "Timing-шкала" },
    { id: "animations-easing", label: "Easing-кривые" },
    { id: "animations-micro",  label: "Микроинтерактивы" },
    { id: "animations-loading", label: "Loading" },
    { id: "animations-page",   label: "Page-level" },
    { id: "animations-a11y",   label: "Доступность" },
  ]},
  { id: "cross-blocks", label: "Сквозные блоки", subsections: [
    { id: "cross-header", label: "Header" },
  ]},
  { id: "marketing-blocks", label: "Маркетинг блоки", subsections: [] },
]

function useActiveSection() {
  const [activeId, setActiveId] = useState(sections[0].id)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActiveId(e.target.id)
      },
      { rootMargin: "-20% 0px -70% 0px" }
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])
  return activeId
}

/* ───────── MASCOT SECTION ───────── */
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
  { key: "base",      label: "Базовое" },
  { key: "confident", label: "Уверенное" },
  { key: "pointer",   label: "Указывает" },
  { key: "surprised", label: "Удивлённый" },
  { key: "thinks",    label: "Думает" },
  { key: "smile",     label: "Улыбка" },
  { key: "ok",        label: "ОК" },
]

function getVariantLabel(filename: string): string {
  const name = filename.replace(/\.png$/i, "")
  const match = name.match(/[_-]([←→\d]+)$/)
  return match ? match[1] : ""
}

/* ── Reusable tooltip demo component ── */
function TooltipDemo({ label, content }: { label: string; content: React.ReactNode }) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const ref = useRef<HTMLButtonElement>(null)

  function show() {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    setPos({ top: r.bottom + 6, left: r.left + r.width / 2 })
  }

  return (
    <>
      <button
        ref={ref}
        onMouseEnter={show}
        onMouseLeave={() => setPos(null)}
        className="px-3 py-1.5 rounded-md border border-border text-[length:var(--text-12)] text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
      >
        {label}
      </button>
      {pos && (
        <div
          className="tooltip-enter fixed z-50 pointer-events-none"
          style={{ top: pos.top, left: pos.left, transform: "translateX(-50%)" }}
        >
          <div className="rounded-lg border border-border bg-popover shadow-xl p-3 w-48 text-[length:var(--text-12)] leading-relaxed">
            {content}
          </div>
        </div>
      )}
    </>
  )
}

function MascotCard({ mascot, activeState }: { mascot: typeof MASCOTS[0]; activeState: string }) {
  const variants = mascot.states[activeState] ?? []
  const baseVariants = mascot.states.base ?? []
  const isFallback = variants.length === 0
  const files = isFallback ? baseVariants : variants
  const [variantIdx, setVariantIdx] = useState(0)
  const [tooltip, setTooltip] = useState<{ top: number; right: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

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
    <div className="flex flex-col rounded-sm border border-border overflow-hidden">
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
                  className={`px-1.5 py-0.5 rounded text-[length:var(--text-12)] font-mono border transition-colors ${
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
            <div className="rounded-lg border border-border bg-popover shadow-xl p-3 text-[length:var(--text-12)] leading-relaxed">
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

function MascotSection() {
  const [activeState, setActiveState] = useState("base")

  return (
    <div>
      <p className="text-muted-foreground mb-4 text-[length:var(--text-14)]">
        PNG-маскоты AI-агентов. Переключайте состояния через табы. Если у маскота нет варианта — показывается базовое с прозрачностью, кнопка скачать недоступна.
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {MASCOT_STATE_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveState(tab.key)}
            className={`px-3 py-1.5 rounded-md text-[length:var(--text-12)] font-medium border transition-colors ${
              activeState === tab.key
                ? "bg-[var(--rm-yellow-100)] text-black border-[var(--rm-yellow-100)]"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {MASCOTS.map((mascot) => (
          <MascotCard key={`${mascot.key}-${activeState}`} mascot={mascot} activeState={activeState} />
        ))}
      </div>
    </div>
  )
}

/* ───────── DOT GRID LENS DEMO ───────── */
const GRID_GAP = 28
const BASE_R = 1.5
const MAX_SCALE = 3.3
const LENS_RADIUS = 120

function DotGridDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const rafRef = useRef(0)
  const [accent, setAccent] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const container = canvas.parentElement!

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const w = container.clientWidth
      const h = container.clientHeight
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width = `${w}px`
      canvas!.style.height = `${h}px`
      ctx.scale(dpr, dpr)
    }

    function draw() {
      const w = container.clientWidth
      const h = container.clientHeight
      ctx.clearRect(0, 0, w, h)
      const isDark = document.documentElement.classList.contains("dark")
      // --rm-gray-4: #CBCBCB (light) / #404040 (dark)
      const baseColor = isDark ? [64, 64, 64] : [203, 203, 203]
      // --rm-yellow-100: #FFCC00
      const accentColor = [255, 204, 0]
      const { x: mx, y: my } = mouseRef.current
      const cols = Math.ceil(w / GRID_GAP) + 1
      const rows = Math.ceil(h / GRID_GAP) + 1

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const px = i * GRID_GAP
          const py = j * GRID_GAP
          const dx = px - mx
          const dy = py - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          const t = Math.max(0, 1 - dist / LENS_RADIUS)
          const scale = 1 + (MAX_SCALE - 1) * t * t
          const r = BASE_R * scale

          if (accent && t > 0) {
            const ri = Math.round(baseColor[0] + (accentColor[0] - baseColor[0]) * t * t)
            const gi = Math.round(baseColor[1] + (accentColor[1] - baseColor[1]) * t * t)
            const bi = Math.round(baseColor[2] + (accentColor[2] - baseColor[2]) * t * t)
            ctx.fillStyle = `rgb(${ri},${gi},${bi})`
          } else {
            ctx.fillStyle = isDark ? "#404040" : "#CBCBCB"
          }

          ctx.beginPath()
          ctx.arc(px, py, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    function loop() {
      draw()
      if (!reducedMotion) {
        rafRef.current = requestAnimationFrame(loop)
      }
    }

    resize()
    window.addEventListener("resize", resize)

    if (reducedMotion) {
      draw()
    } else {
      rafRef.current = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [accent])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }
  function handleMouseLeave() {
    mouseRef.current = { x: -9999, y: -9999 }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setAccent(false)}
          className={`text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider px-3 py-1 rounded border transition-colors ${!accent ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}
        >
          Монохромный
        </button>
        <button
          onClick={() => setAccent(true)}
          className={`text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider px-3 py-1 rounded border transition-colors ${accent ? "bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] border-[var(--rm-yellow-100)]" : "border-border text-muted-foreground hover:border-foreground"}`}
        >
          Акцентный
        </button>
      </div>
      <div
        className="relative rounded-md border border-border overflow-hidden h-[220px] cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground/40 select-none">
            Двигай курсор
          </span>
        </div>
      </div>
    </div>
  )
}


/* ───────── ANIMATED GRID LINES DEMO ───────── */
function AnimatedGridLinesDemo() {
  const [key, setKey] = useState(0)
  const hLines = [0, 1, 2, 3]
  const vLines = [0, 1, 2, 3, 4]
  return (
    <div className="space-y-3">
      <button
        onClick={() => setKey((k) => k + 1)}
        className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider px-3 py-1 rounded border border-border text-muted-foreground hover:border-foreground transition-colors"
      >
        ↺ Повторить
      </button>
      <div className="relative rounded-md border border-border overflow-hidden h-[280px] bg-background">
        <style>{`
          @keyframes line-h {
            from { opacity: 0; transform: scaleX(0); }
            to   { opacity: 1; transform: scaleX(1); }
          }
          @keyframes line-v {
            from { opacity: 0; transform: scaleY(0); }
            to   { opacity: 1; transform: scaleY(1); }
          }
        `}</style>
        {hLines.map((i) => (
          <div
            key={`h-${key}-${i}`}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${(i + 1) * 20}%`,
              transformOrigin: "left",
              backgroundColor: "var(--rm-gray-4)",
              animation: `line-h 1.6s ease-out ${i * 0.1}s both`,
            }}
          />
        ))}
        {vLines.map((i) => (
          <div
            key={`v-${key}-${i}`}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${(i + 1) * (100 / (vLines.length + 1))}%`,
              transformOrigin: "top",
              backgroundColor: "var(--rm-gray-4)",
              animation: `line-v 1.6s ease-out ${(hLines.length + i) * 0.1}s both`,
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground/40 select-none">
            Hero background grid
          </span>
        </div>
      </div>
      <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">
        scaleX/scaleY 0→1 · 1600ms ease-out · stagger 0.1s между линиями
      </p>
    </div>
  )
}

/* ───────── SECTION WRAPPER ───────── */
function Section({
  id,
  title,
  version,
  children,
}: {
  id: string
  title: string
  version?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-31)] md:text-[length:var(--text-50)] uppercase tracking-[-0.015em] leading-[1.05]">
          {title}
        </h2>
        {version && (
          <Badge variant="outline" className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider h-5">
            v{version}
          </Badge>
        )}
      </div>
      {children}
    </section>
  )
}

/* ───────── TOKEN ROW ───────── */
function TokenRow({
  token,
  value,
  desc,
}: {
  token: string
  value: string
  desc: string
}) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-rm-gray-3/50 transition-colors group">
      <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-foreground bg-rm-gray-2 px-2 py-0.5 rounded min-w-[180px]">
        {token}
      </code>
      <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] min-w-[100px]">
        {value}
      </span>
      <span className="text-[length:var(--text-14)] text-muted-foreground flex-1">{desc}</span>
      <CopyButton value={token} label={token} />
    </div>
  )
}

/* ───────── TIMING ROW WITH BAR ───────── */
function TimingRow({ token, ms, desc }: { token: string; ms: number; desc: string }) {
  const maxMs = 1600
  const width = Math.round((ms / maxMs) * 100)
  return (
    <div className="py-2.5 px-3 rounded-md hover:bg-rm-gray-3/50 transition-colors group">
      <div className="flex items-center gap-3 mb-1.5">
        <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-foreground bg-rm-gray-2 px-2 py-0.5 rounded min-w-[200px]">
          {token}
        </code>
        <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground min-w-[50px]">{ms}ms</span>
        <span className="text-[length:var(--text-14)] text-muted-foreground flex-1">{desc}</span>
        <CopyButton value={token} label={token} />
      </div>
      <div className="h-1.5 bg-rm-gray-2 rounded-full overflow-hidden ml-3">
        <div className="h-full rounded-full bg-[var(--rm-yellow-100)]" style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

/* ───────── EASING DEMO ───────── */
function EasingDemo({ token, curve, desc }: { token: string; curve: string; desc: string }) {
  const [playing, setPlaying] = useState(false)
  const ballRef = useRef<HTMLDivElement>(null)

  function play() {
    if (playing) return
    const el = ballRef.current
    if (!el) return
    setPlaying(true)
    el.style.transition = "none"
    el.style.transform = "translateX(0)"
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `transform 600ms ${curve}`
        el.style.transform = "translateX(148px)"
        setTimeout(() => {
          el.style.transition = `transform 600ms ${curve}`
          el.style.transform = "translateX(0)"
          setTimeout(() => setPlaying(false), 700)
        }, 700)
      })
    })
  }

  return (
    <div className="p-4 bg-card">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div>
          <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-foreground bg-rm-gray-2 px-1.5 py-0.5 rounded">{token}</code>
          <p className="text-[length:var(--text-12)] text-muted-foreground mt-1 leading-relaxed">{desc}</p>
        </div>
        <button
          onClick={play}
          disabled={playing}
          className="shrink-0 px-2.5 py-1 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors disabled:opacity-40 cursor-pointer"
        >
          Play
        </button>
      </div>
      <div className="h-8 bg-rm-gray-2/50 rounded-md relative overflow-hidden flex items-center px-2">
        <div ref={ballRef} className="w-4 h-4 rounded-full bg-[var(--rm-yellow-100)] shrink-0" style={{ transform: "translateX(0)" }} />
      </div>
      <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/60 mt-2 truncate">{curve}</p>
    </div>
  )
}

/* ───────── ANIMATION DEMO CARD ───────── */
function AnimDemoCard({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-md border border-border bg-card flex flex-col gap-3">
      <div>
        <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-foreground font-medium">{label}</p>
        <p className="text-[length:var(--text-12)] text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
      </div>
      <div className="flex-1 flex items-center justify-center">{children}</div>
    </div>
  )
}

/* ───────── TOGGLE ANIM CARD (screen transitions) ───────── */
function ToggleAnimCard({
  label, desc, animClass, animDuration, animEasing, children
}: {
  label: string; desc: string; animClass: string; animDuration: string; animEasing: string; children: React.ReactNode
}) {
  const [animKey, setAnimKey] = useState(0)
  const [visible, setVisible] = useState(false)

  function trigger() {
    setVisible(false)
    setAnimKey(k => k + 1)
    setTimeout(() => setVisible(true), 50)
  }

  return (
    <div className="p-4 rounded-md border border-border bg-card flex flex-col gap-3">
      <div>
        <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-foreground font-medium">{label}</p>
        <p className="text-[length:var(--text-12)] text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
      </div>
      <div className="flex-1 min-h-[80px] flex items-center justify-center">
        {visible ? (
          <div key={animKey} style={{ animation: `${animClass} ${animDuration} ${animEasing} both`, width: "100%" }}>
            {children}
          </div>
        ) : (
          <div className="w-full opacity-20">{children}</div>
        )}
      </div>
      <button
        onClick={trigger}
        className="w-full py-1.5 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors cursor-pointer"
      >
        Воспроизвести
      </button>
    </div>
  )
}

/* ───────── LINK CTA DEMO ───────── */
function LinkCTADemo() {
  const arrowRef = useRef<SVGSVGElement>(null)
  return (
    <div
      className="flex items-center gap-1 cursor-pointer text-foreground text-[length:var(--text-14)] font-medium select-none"
      onMouseEnter={() => { if (arrowRef.current) arrowRef.current.style.transform = "translateX(4px)" }}
      onMouseLeave={() => { if (arrowRef.current) arrowRef.current.style.transform = "translateX(0)" }}
    >
      <span>Подробнее</span>
      <ArrowRight
        ref={arrowRef}
        className="w-4 h-4"
        style={{ transition: "transform 100ms cubic-bezier(0.4,0,0.2,1)", transform: "translateX(0)" }}
      />
    </div>
  )
}

/* ═══════════════════════════════════ MARKETING BLOCKS ═══════════════════════════════════ */

const accordion05Items = [
  { id: "1", q: "Что такое Rocketmind?", a: "Rocketmind — SaaS-платформа с готовыми AI-агентами для ведения кейсов. Каждый агент специализируется на конкретной задаче: анализ, стратегия, исследование рынка, тестирование гипотез." },
  { id: "2", q: "Как начать работу?", a: "Перейдите по ссылке /a/{agent_slug}, введите email — и сразу начинайте диалог. Никаких долгих регистраций и настроек." },
  { id: "3", q: "Что умеют агенты?", a: "Агенты ведут структурированный диалог, задают уточняющие вопросы и в конце формируют готовый результат: отчёт, стратегию или ссылку на следующий шаг." },
  { id: "4", q: "Безопасны ли мои данные?", a: "Все данные зашифрованы и хранятся изолированно. Агент видит только историю вашего конкретного кейса — ничего больше." },
  { id: "5", q: "Какие тарифы?", a: "Первый кейс — бесплатно. Далее подписка от 990 ₽/мес, включает неограниченные диалоги с выбранными агентами." },
]

function Accordion05Demo() {
  return (
    <div className="w-full max-w-3xl">
      <Accordion.Root defaultValue={["3"]} className="w-full">
        {accordion05Items.map((item) => (
          <Accordion.Item
            key={item.id}
            value={item.id}
            className="border-b border-border"
          >
            <Accordion.Header>
              <Accordion.Trigger className="w-full text-left py-5 pl-6 md:pl-14 flex items-start gap-4 cursor-pointer text-foreground/20 transition-colors duration-200 data-[panel-open]:text-primary hover:text-foreground/50">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] mt-2 shrink-0 tabular-nums">
                  {item.id}
                </span>
                <span className="font-[family-name:var(--font-heading-family)] font-bold uppercase text-3xl md:text-[length:var(--text-50)] leading-none tracking-[-0.02em]">
                  {item.q}
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="accordion-05-panel">
              <div className="overflow-hidden">
                <p className="pb-6 pl-6 md:px-20 text-[length:var(--text-14)] text-muted-foreground">
                  {item.a}
                </p>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  )
}

/* ═══════════════════════════════════ VERSION HISTORY ═══════════════════════════════════ */

type VersionEntry = {
  version: string
  date: string
  title: string
  current?: boolean
  added?: string[]
  improved?: string[]
  fixed?: string[]
  removed?: string[]
}

const VERSION_HISTORY: VersionEntry[] = [
  {
    version: "1.4.0",
    date: "2026-03-16",
    title: "Typography Refactor & Sidebar Accordion",
    current: true,
    added: [
      "Аккордеон в сайдбаре — раскрытие подразделов по клику и hover-стрелка",
      "Типография: табличный лейаут шкалы и вкладка Specimens",
      "Подраздел «Specimens» со всеми сочетаниями шрифт/стиль",
    ],
    improved: [
      "Серая шкала — групповые подписи (Neutrals, Overlay, Text)",
      "Колонка 100 стала шире; hex отображается в строках fg / fg-subtle",
      "Раздел «Тултипы» перемещён в конец раздела «Компоненты»",
      "Задокументированы: Gutter 0px, Bento Grid, скрипты обновления ДС",
    ],
    fixed: [
      "Hover-зона стрелки nav — больше не перекрывает ссылку раздела",
      "scroll-mt добавлен для всех подзаголовков",
      "Иерархия заголовков в разделе «Компоненты» (H2→H3→H4)",
      "Бордеры серой шкалы — корректная ширина для всех ячеек",
      "Hex в цветовых карточках обновляется при смене темы",
    ],
  },
  {
    version: "1.3.0",
    date: "2026-03-15",
    title: "Grid Visual Language & Click-to-copy",
    added: [
      "GridGuides — компонент визуальных направляющих сетки с документацией",
      "Hex overlay on hover для всех цветовых карточек",
      "Click-to-copy hex и токен во всех секциях цветов",
    ],
    improved: [
      "Табличные лейауты во всех секциях (вместо карточек-сеток)",
      "Цветовые карточки: badge с токеном сверху-слева, click-to-copy",
      "Sidebar: активный пункт — жёлтая вертикальная полоска",
      "Card hover — унифицирован border-цвет для всех тем",
    ],
    fixed: [
      "guideColor по умолчанию теперь var(--border), корректно в тёмной теме",
      "GridGuides demo: уменьшен до 3 колонок, карточки не обрезаются",
      "CopyButton: корректный hover-фон на цветных и прозрачных фонах",
      "Hover-бордер карточек убран, заменён на ДС-hover стейт",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-03-10",
    title: "Dot Grid Lens",
    added: [
      "Раздел 9: Dot Grid Lens — фоновый эффект линзы на сетке точек",
      "Токены эффекта, алгоритм работы, live demo (монохромный / акцентный)",
      "Таблица применения по контекстам",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-03-09",
    title: "Начальная версия",
    added: [
      "Цветовая палитра: акцентная шкала, серая шкала, семантические токены",
      "Типография: 4 шрифта, 4 категории стилей, размерная шкала на φ",
      "Spacing и сетка: 4pt grid, 12-колоночная сетка, breakpoints",
      "Скругления и тени",
      "Компоненты: кнопки, формы, карточки, тултипы, аккордеон и др.",
      "Иконки (Lucide), анимации, сквозные и маркетинг-блоки",
      "Поддержка light / dark тем",
    ],
  },
]

function VersionHistory() {
  const [openVersions, setOpenVersions] = React.useState<string[]>(["1.4.0"])

  function toggle(version: string) {
    setOpenVersions(prev =>
      prev.includes(version) ? prev.filter(v => v !== version) : [...prev, version]
    )
  }

  return (
    <section id="version-history" className="scroll-mt-20 pb-16">
      <h2 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-50)] uppercase tracking-[-0.01em] leading-[1.2] mb-6">
        История версий
      </h2>
      <div className="space-y-2">
        {VERSION_HISTORY.map((entry) => {
          const isOpen = openVersions.includes(entry.version)
          return (
            <div key={entry.version} className="rounded-md border border-border overflow-hidden">
              <button
                onClick={() => toggle(entry.version)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-rm-gray-2/50 transition-colors"
              >
                {entry.current ? (
                  <Badge className="bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] hover:bg-[var(--rm-yellow-100)] shrink-0 h-5">
                    v{entry.version}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] hover:bg-transparent shrink-0 h-5">
                    v{entry.version}
                  </Badge>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[length:var(--text-14)] font-medium">{entry.date} — {entry.title}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 border-t border-border">
                  <div className="pt-4 grid sm:grid-cols-2 gap-x-8 gap-y-4">
                    {entry.added && (
                      <div>
                        <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground mb-2">Добавлено</p>
                        <ul className="space-y-1">
                          {entry.added.map((item, i) => (
                            <li key={i} className="flex gap-2 text-[length:var(--text-14)] text-muted-foreground">
                              <span className="text-[var(--rm-yellow-100)] shrink-0 mt-0.5">+</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {entry.improved && (
                      <div>
                        <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground mb-2">Улучшено</p>
                        <ul className="space-y-1">
                          {entry.improved.map((item, i) => (
                            <li key={i} className="flex gap-2 text-[length:var(--text-14)] text-muted-foreground">
                              <span className="text-foreground shrink-0 mt-0.5">↑</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {entry.fixed && (
                      <div>
                        <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground mb-2">Исправлено</p>
                        <ul className="space-y-1">
                          {entry.fixed.map((item, i) => (
                            <li key={i} className="flex gap-2 text-[length:var(--text-14)] text-muted-foreground">
                              <span className="text-muted-foreground shrink-0 mt-0.5">·</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {entry.removed && (
                      <div>
                        <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground mb-2">Удалено</p>
                        <ul className="space-y-1">
                          {entry.removed.map((item, i) => (
                            <li key={i} className="flex gap-2 text-[length:var(--text-14)] text-muted-foreground">
                              <span className="text-destructive shrink-0 mt-0.5">−</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ═══════════════════════════════════ MAIN PAGE ═══════════════════════════════════ */
export default function DesignSystemPage() {
  const [mobileNav, setMobileNav] = useState(false)
  const activeId = useActiveSection()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [hoverArrowId, setHoverArrowId] = useState<string | null>(null)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startHover = (id: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    setHoverArrowId(id)
  }
  const endHover = () => {
    hoverTimeout.current = setTimeout(() => setHoverArrowId(null), 200)
  }

  /* ── Sidebar yellow scroll indicator ── */
  const navRef = useRef<HTMLElement>(null)
  const triggerRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const subnavInnerRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const trackRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ top: 0, height: 0 })
  useEffect(() => {
    const measure = () => {
      const trigger = triggerRefs.current.get(activeId)
      const track = trackRef.current
      if (!trigger || !track) return
      const trackH = track.clientHeight
      const isExpanded = expandedId === activeId
      const subnavInner = subnavInnerRefs.current.get(activeId)
      const subnavH = isExpanded && subnavInner ? subnavInner.scrollHeight : 0
      setIndicator({
        top:    (trigger.offsetTop / trackH) * 100,
        height: ((trigger.offsetHeight + subnavH) / trackH) * 100,
      })
    }
    measure()
    // Re-measure after CSS transition (300ms) to correct position drift from sibling animations
    const timer = setTimeout(measure, 310)
    return () => clearTimeout(timer)
  }, [activeId, expandedId])

  /* ── Auto-expand active section ── */
  useEffect(() => {
    if (activeId) setExpandedId(activeId)
  }, [activeId])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ───── HEADER ───── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-5 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1 text-muted-foreground"
              onClick={() => setMobileNav(!mobileNav)}
            >
              {mobileNav ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <img
                src={`${BASE_PATH}/text_logo_dark_background_en.svg`}
                alt="Rocketmind"
                className="h-7 hidden dark:block"
              />
              <img
                src={`${BASE_PATH}/text_logo_light_background_en.svg`}
                alt="Rocketmind"
                className="h-7 dark:hidden"
              />
            </div>
            <Badge variant="outline" className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-widest h-5 hidden sm:flex">
              Design System v{DS_VERSION}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] hidden sm:block">
              {DS_DATE}
            </span>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile nav */}
        {mobileNav && (
          <nav className="md:hidden border-t border-border bg-card px-5 py-3 space-y-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setMobileNav(false)}
                className="block py-1.5 text-[length:var(--text-14)] text-muted-foreground hover:text-foreground transition-colors font-[family-name:var(--font-mono-family)] uppercase tracking-wider"
              >
                {s.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <div className="max-w-[1280px] mx-auto flex">
        {/* ───── SIDEBAR NAV ───── */}
        <aside className="relative hidden md:flex flex-col w-[220px] shrink-0 sticky top-14 self-start h-[calc(100vh-56px)] border-r border-border">
          {/* ── Yellow scroll position indicator ── */}
          <div ref={trackRef} className="absolute right-0 top-8 bottom-[60px] w-0.5 pointer-events-none z-10" aria-hidden>
            <div
              className="sidebar-indicator absolute left-0 right-0 bg-[var(--rm-yellow-100)]"
              style={{ top: `${indicator.top}%`, height: `${indicator.height}%` }}
            />
          </div>

          <div className="flex-1 overflow-y-auto py-8 pl-5 pr-0">
          <nav ref={navRef} className="relative space-y-0.5">
            {sections.map((s) => {
              const isActive = activeId === s.id
              const isClickOpen = expandedId === s.id
              const isHoverOpen = hoverArrowId === s.id
              const isOpen = isClickOpen || isHoverOpen
              const hasSubs = s.subsections.length > 0
              return (
                <div key={s.id}>
                  <div
                    className="flex items-center"
                    ref={el => { if (el) triggerRefs.current.set(s.id, el); else triggerRefs.current.delete(s.id) }}
                  >
                    {/* Arrow OR spacer — w-6=24px matches ml-3+pl-3 of subnav */}
                    {hasSubs ? (
                      <button
                        onMouseEnter={() => { if (!isClickOpen) startHover(s.id) }}
                        onMouseLeave={endHover}
                        onClick={() => { setHoverArrowId(null); setExpandedId(isActive ? s.id : (expandedId === s.id ? null : s.id)) }}
                        className="shrink-0 w-6 self-stretch flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={isOpen ? "Скрыть подразделы" : "Показать подразделы"}
                      >
                        <ChevronRight
                          size={12}
                          className={`transition-transform duration-200 ${isClickOpen ? "rotate-90" : ""}`}
                        />
                      </button>
                    ) : (
                      <span className="shrink-0 w-6" aria-hidden />
                    )}
                    <a
                      href={`#${s.id}`}
                      onClick={() => setExpandedId(s.id)}
                      className={`flex-1 py-1.5 text-[length:var(--text-12)] transition-colors
                                 font-[family-name:var(--font-mono-family)] uppercase tracking-wider
                                 ${isActive
                                   ? "text-foreground font-medium"
                                   : "text-muted-foreground hover:text-foreground"
                                 }`}
                    >
                      {s.label}
                    </a>
                  </div>
                  {hasSubs && (
                    <div
                      className={`sidebar-subnav${isOpen ? " is-open" : ""}`}
                      onMouseEnter={() => { if (isHoverOpen && !isClickOpen) startHover(s.id) }}
                      onMouseLeave={endHover}
                    >
                      <div
                        className="sidebar-subnav-inner ml-3 pl-3 border-l border-border space-y-0.5 pb-1"
                        ref={el => { if (el) subnavInnerRefs.current.set(s.id, el); else subnavInnerRefs.current.delete(s.id) }}
                      >
                        {s.subsections.map((sub) => (
                          <a
                            key={sub.id}
                            href={`#${sub.id}`}
                            className="block py-0.5 text-[length:var(--text-12)] text-muted-foreground hover:text-foreground transition-colors font-[family-name:var(--font-mono-family)] uppercase tracking-wider opacity-80"
                          >
                            {sub.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
          </div>

          <div className="shrink-0 pl-10 pr-5 py-4 border-t border-border">
            <Badge className="bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] hover:bg-[var(--rm-yellow-100)]">
              v{DS_VERSION}
            </Badge>
            <p className="text-[length:var(--text-12)] text-muted-foreground mt-1">{DS_DATE}</p>
          </div>
        </aside>

        {/* ───── MAIN CONTENT ───── */}
        <main className="flex-1 min-w-0 px-5 md:px-10 py-10 space-y-16">
          {/* HERO */}
          <div className="space-y-4">
            <h1 className="font-[family-name:var(--font-heading-family)] font-extrabold text-[length:var(--text-48)] md:text-[length:var(--text-81)] uppercase tracking-[-0.02em] leading-[1.0]">
              Design System
            </h1>
            <p className="text-[length:var(--text-19)] text-muted-foreground leading-relaxed max-w-[640px]">
              Единая дизайн-система для SaaS-сервиса и маркетингового сайта Rocketmind.
              Основана на компонентах <strong>shadcn/ui</strong> + кастомизация под бренд.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">shadcn/ui</Badge>
              <Badge variant="outline">Tailwind CSS</Badge>
              <Badge variant="outline">Radix UI</Badge>
              <Badge variant="outline">Dark / Light</Badge>
            </div>
          </div>

          <Separator />

          {/* ═══════ 0. LOGOS ═══════ */}
          <Section id="logos" title="0. Логотипы" version={DS_VERSION}>
            <p className="text-muted-foreground mb-8">
              Полный набор логотипов Rocketmind. Используйте вариант на тёмном фоне для тёмных поверхностей,
              на светлом — для белых/серых. Доступны форматы <strong>SVG</strong> (векторный) и <strong>PNG</strong>.
            </p>

            {/* ── Reusable logo card helper rendered inline via array ── */}
            {[
              {
                group: "Icon — только иконка",
                imgH: "h-16",
                items: [
                  { label: "Icon — тёмный фон", file: "icon_dark_background", bg: "#121212", imgClass: `<img src="/icon_dark_background.svg" className="h-16 w-auto hidden dark:block" />` },
                  { label: "Icon — светлый фон", file: "icon_light_background", bg: "#f5f5f5", imgClass: `<img src="/icon_light_background.svg" className="h-16 w-auto dark:hidden" />` },
                ],
              },
              {
                group: "Text Logo — EN",
                imgH: "h-10",
                items: [
                  { label: "Text EN — тёмный фон", file: "text_logo_dark_background_en", bg: "#121212", imgClass: `<img src="/text_logo_dark_background_en.svg" className="h-7 hidden dark:block" />` },
                  { label: "Text EN — светлый фон", file: "text_logo_light_background_en", bg: "#f5f5f5", imgClass: `<img src="/text_logo_light_background_en.svg" className="h-7 dark:hidden" />` },
                ],
              },
              {
                group: "Text Logo — RU",
                imgH: "h-10",
                items: [
                  { label: "Text RU — тёмный фон", file: "text_logo_dark_background_ru", bg: "#121212", imgClass: `<img src="/text_logo_dark_background_ru.svg" className="h-7 hidden dark:block" />` },
                  { label: "Text RU — светлый фон", file: "text_logo_light_background_ru", bg: "#f5f5f5", imgClass: `<img src="/text_logo_light_background_ru.svg" className="h-7 dark:hidden" />` },
                ],
              },
              {
                group: "С дескриптором — EN",
                imgH: "h-14",
                items: [
                  { label: "С дескриптором EN — тёмный", file: "with_descriptor_dark_background_en", bg: "#121212", imgClass: `<img src="/with_descriptor_dark_background_en.svg" className="h-14 w-auto hidden dark:block" />` },
                  { label: "С дескриптором EN — светлый", file: "with_descriptor_light_background_en", bg: "#f5f5f5", imgClass: `<img src="/with_descriptor_light_background_en.svg" className="h-14 w-auto dark:hidden" />` },
                ],
              },
              {
                group: "С дескриптором — RU",
                imgH: "h-14",
                items: [
                  { label: "С дескриптором RU — тёмный", file: "with_descriptor_dark_background_ru", bg: "#121212", imgClass: `<img src="/with_descriptor_dark_background_ru.svg" className="h-14 w-auto hidden dark:block" />` },
                  { label: "С дескриптором RU — светлый", file: "with_descriptor_light_background_ru", bg: "#f5f5f5", imgClass: `<img src="/with_descriptor_light_background_ru.svg" className="h-14 w-auto dark:hidden" />` },
                ],
              },
            ].map((group) => (
              <div key={group.group} className="mb-10 last:mb-0">
                <p className="text-[length:var(--text-12)] font-semibold uppercase tracking-wider text-muted-foreground mb-4 font-[family-name:var(--font-mono-family)]">
                  {group.group}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {group.items.map((item) => (
                    <div key={item.file} className="rounded-sm border border-border overflow-hidden">
                      <div className="flex items-center justify-center p-8" style={{ backgroundColor: item.bg }}>
                        <img src={`${BASE_PATH}/${item.file}.svg`} alt={item.label} className={`${group.imgH} w-auto`} />
                      </div>
                      <div className="px-4 py-3 bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[length:var(--text-14)] font-medium">{item.label}</p>
                          <div className="flex gap-2">
                            <a href={`${BASE_PATH}/${item.file}.svg`} download className="text-[length:var(--text-12)] text-muted-foreground hover:text-foreground border border-border rounded px-2 py-1 font-[family-name:var(--font-mono-family)] transition-colors">SVG</a>
                            <a href={`${BASE_PATH}/${item.file}.png`} download className="text-[length:var(--text-12)] text-muted-foreground hover:text-foreground border border-border rounded px-2 py-1 font-[family-name:var(--font-mono-family)] transition-colors">PNG</a>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground bg-rm-gray-2 px-2 py-0.5 rounded flex-1 truncate">
                            {item.imgClass}
                          </code>
                          <CopyButton value={item.imgClass} label={item.label} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Section>

          <Separator />

          {/* ═══════ 1. COLORS ═══════ */}
          <Section id="colors" title="1. Цветовая палитра" version={DS_VERSION}>
            <p className="text-muted-foreground mb-8">
              Все цвета — CSS-переменные. Акцентный цвет бренда — <strong className="text-[var(--rm-yellow-100)]">#FFCC00</strong>.
              Категориальные цвета используются для кодировки данных, тегов, карточек.
            </p>

            {/* ── Backgrounds ── */}
            <h3 id="colors-bg" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.01em] mb-2">
              Фоны
            </h3>
            <div className="border border-border rounded-lg overflow-hidden grid grid-cols-2 sm:grid-cols-4 mb-3">
              {[
                { name: "Background", var: "--background",    token: "--background", lhex: "#FAFAFA", dhex: "#0A0A0A",
                  note: "Основной фон страницы. Используй по умолчанию — особенно когда поверх кладёшь цвет." },
                { name: "Card",       var: "--card",          token: "--card",       lhex: "#FFFFFF", dhex: "#121212",
                  note: "Поверхность карточек и поповеров. Слой над фоном страницы." },
                { name: "Muted",      var: "--rm-gray-2",     token: "--rm-gray-2",  lhex: "#F5F5F5", dhex: "#1A1A1A",
                  note: "Тихий фон для badge, инлайн-кода, неактивных зон." },
                { name: "Accent",     var: "--rm-gray-3",     token: "--rm-gray-3",  lhex: "#EBEBEB", dhex: "#242424",
                  note: "Hover-состояния в списках, дропдаунах, nav-пунктах." },
              ].map((c, i) => (
                <div key={c.token} className={`flex flex-col gap-2 p-3 ${i < 3 ? "border-r border-border" : ""} ${i < 2 ? "sm:border-b-0 border-b border-border" : ""}`}>
                  <ColorHexBlock
                    className="w-full h-16 rounded-sm"
                    style={{ backgroundColor: `var(${c.var})` }}
                  />
                  <div>
                    <p className="text-[length:var(--text-14)] font-medium">{c.name}</p>
                    <div className="flex items-center gap-0.5">
                      <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] flex-1">{c.token}</p>
                      <CopyButton value={c.token} label={`Токен: ${c.token}`} />
                    </div>
                    <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">L: {c.lhex} · D: {c.dhex}</p>
                  </div>
                  <p className="text-[length:var(--text-12)] text-muted-foreground leading-relaxed border-t border-border pt-2">{c.note}</p>
                </div>
              ))}
            </div>
            <div className="rounded-md border border-border bg-rm-gray-2/40 px-4 py-3 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] mb-10 leading-relaxed">
              Background (#FAFAFA / #0A0A0A) — фон страницы, всегда первый слой.
              Card (#FFFFFF / #121212) — поверхность карточек и поповеров поверх Background.
              Muted — тихий фон. Accent — hover-состояния.
            </div>

            {/* ── Gray Scale ── */}
            <h3 id="colors-gray" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.01em] mb-1">
              Серая шкала
            </h3>
            <p className="text-[length:var(--text-13)] text-muted-foreground font-[family-name:var(--font-mono-family)] mb-3">
              Используй шкалу последовательно — не пропускай уровни без причины.
            </p>
            <div className="border border-border rounded-lg overflow-hidden grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 mb-10">
              {(() => {
                const grays = [
                  { name: "Gray 1",  var: "--rm-gray-1",  role: "Card / popover", lhex: "#FAFAFA", dhex: "#121212" },
                  { name: "Gray 2",  var: "--rm-gray-2",  role: "Muted / 2nd",   lhex: "#F5F5F5", dhex: "#1A1A1A" },
                  { name: "Gray 3",  var: "--rm-gray-3",  role: "Hover / accent", lhex: "#EBEBEB", dhex: "#242424" },
                  { name: "Gray 4",  var: "--rm-gray-4",  role: "Default border", lhex: "#CBCBCB", dhex: "#404040" },
                  { name: "Gray 5",  var: "--rm-gray-5",  role: "Hover border",   lhex: "#A3A3A3", dhex: "#5C5C5C" },
                  { name: "Gray 6",  var: "--rm-gray-6",  role: "2nd text",       lhex: "#666666", dhex: "#939393" },
                  { name: "Gray fg", var: "--rm-gray-fg", role: "Primary text",   lhex: "#2D2D2D", dhex: "#F0F0F0" },
                ]
                return grays.map((c, i) => (
                  <div key={c.var} className={`flex flex-col gap-1.5 p-3 ${i < grays.length - 1 ? "border-r border-border" : ""}`}>
                    <ColorHexBlock
                      className="w-full h-10 rounded-sm"
                      style={{ backgroundColor: `var(${c.var})` }}
                    />
                    <p className="text-[length:var(--text-12)] font-medium font-[family-name:var(--font-mono-family)]">{c.name}</p>
                    <div className="flex items-center gap-0.5">
                      <p className="text-[10px] text-muted-foreground font-[family-name:var(--font-mono-family)] flex-1 truncate">{c.var}</p>
                      <CopyButton value={c.var} label={`Токен: ${c.var}`} />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-[family-name:var(--font-mono-family)]">{c.role}</p>
                  </div>
                ))
              })()}
              {/* Group labels row — visible only at md (7-col grid) */}
              <div className="hidden md:flex md:col-span-3 border-t border-border border-r px-3 py-2 items-center">
                <span className="text-[10px] text-muted-foreground font-[family-name:var(--font-mono-family)]">фоны компонентов</span>
              </div>
              <div className="hidden md:flex md:col-span-2 border-t border-border border-r px-3 py-2 items-center">
                <span className="text-[10px] text-muted-foreground font-[family-name:var(--font-mono-family)]">границы</span>
              </div>
              <div className="hidden md:flex md:col-span-1 border-t border-border border-r px-3 py-2 items-center">
                <span className="text-[10px] text-muted-foreground font-[family-name:var(--font-mono-family)]">вторичный текст</span>
              </div>
              <div className="hidden md:flex md:col-span-1 border-t border-border px-3 py-2 items-center">
                <span className="text-[10px] text-muted-foreground font-[family-name:var(--font-mono-family)]">основной текст</span>
              </div>
            </div>

            {/* ── Accent Scale ── */}
            <h3 id="colors-accent" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.01em] mb-2">
              Акцентная шкала
            </h3>
            <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">
              Каждый цвет имеет 5 уровней насыщенности и 2 foreground-токена.
            </p>

            {/* Scale legend */}
            <div className="border border-border rounded-lg overflow-hidden grid grid-cols-6 mb-6 text-[10px] font-[family-name:var(--font-mono-family)] text-muted-foreground">
              {/* Level descriptions row */}
              <div className="col-span-2 px-2 py-2 border-r border-border">
                <p className="font-bold text-foreground mb-0.5">100</p>
                <p className="leading-snug">Solid fill. Кнопка, filled badge, иконка-заливка.</p>
              </div>
              {[
                { level: "300", role: "Subtle border. Граница chip/тега в покое." },
                { level: "500", role: "Component bg active. Нажатое состояние." },
                { level: "700", role: "Component bg hover. Наведение на chip/row." },
                { level: "900", role: "Subtle background. Badge ghost, строка таблицы, фон карточки." },
              ].map((l, i, arr) => (
                <div key={l.level} className={`px-2 py-2 ${i < arr.length - 1 ? "border-r border-border" : ""}`}>
                  <p className="font-bold text-foreground mb-0.5">{l.level}</p>
                  <p className="leading-snug">{l.role}</p>
                </div>
              ))}
              {/* FG footnote row */}
              <div className="col-span-2 border-t border-border px-2 py-2 border-r">
                <span className="font-bold text-foreground">fg</span> — текст поверх solid-100 фона (WCAG AA).
              </div>
              <div className="col-span-4 border-t border-border px-2 py-2">
                <span className="font-bold text-foreground">fg-subtle</span> — текст поверх 300–900 фона (WCAG AA).
              </div>
            </div>

            {/* Color scales */}
            <div className="space-y-8">
              {[
                { name: "Yellow · Бренд-акцент",  token: "yellow",
                  lhex: { 100:"#FFCC00", 300:"#FFE066", 500:"#FFF0AA", 700:"#FFF7CC", 900:"#FFFEF3", fg:"#3D2E00", fgs:"#5C4200" },
                  dhex: { 100:"#FFCC00", 300:"#B38F00", 500:"#7A6200", 700:"#4A3C00", 900:"#3D3300", fg:"#0A0800", fgs:"#FFE566" } },
                { name: "Violet · Категориальный", token: "violet",
                  lhex: { 100:"#A172F8", 300:"#C4A0FB", 500:"#DCC8FF", 700:"#EDE0FF", 900:"#FBFAFE", fg:"#FFF", fgs:"#3D1A8A" },
                  dhex: { 100:"#B48DFA", 300:"#8A5FF5", 500:"#5A3D99", 700:"#2E1F66", 900:"#20143D", fg:"#0A050F", fgs:"#DCC8FF" } },
                { name: "Sky · Категориальный",    token: "sky",
                  lhex: { 100:"#56CAEA", 300:"#8ADCF2", 500:"#C3ECF7", 700:"#E0F6FB", 900:"#F7FDFF", fg:"#FFF", fgs:"#0D4D5C" },
                  dhex: { 100:"#7AD6EF", 300:"#3AAACE", 500:"#1A5F72", 700:"#0A2D38", 900:"#051A20", fg:"#020D10", fgs:"#C3ECF7" } },
                { name: "Terracotta · Категориальный", token: "terracotta",
                  lhex: { 100:"#FE733A", 300:"#FFA07A", 500:"#FFD6AD", 700:"#FFECE0", 900:"#FFFAF7", fg:"#FFF", fgs:"#5C1A00" },
                  dhex: { 100:"#FF8A5C", 300:"#CC5522", 500:"#7A2E10", 700:"#3D1507", 900:"#2A0F05", fg:"#0A0300", fgs:"#FFD6AD" } },
                { name: "Pink · Категориальный",   token: "pink",
                  lhex: { 100:"#FF54AC", 300:"#FF8FCA", 500:"#FFB8D9", 700:"#FFE0EF", 900:"#FFF8FC", fg:"#FFF", fgs:"#6B0033" },
                  dhex: { 100:"#FF7EC5", 300:"#CC3D88", 500:"#7A1A55", 700:"#3D0D2A", 900:"#25061A", fg:"#0A0208", fgs:"#FFB8D9" } },
                { name: "Blue · Категориальный",   token: "blue",
                  lhex: { 100:"#4A56DF", 300:"#8A94EC", 500:"#BFC4F3", 700:"#E0E2FA", 900:"#F9FAFF", fg:"#FFF", fgs:"#0D1466" },
                  dhex: { 100:"#7A84F0", 300:"#3D4ACC", 500:"#1E2870", 700:"#0D1238", 900:"#060A24", fg:"#020310", fgs:"#BFC4F3" } },
                { name: "Red · Семантика: ошибка", token: "red",
                  lhex: { 100:"#ED4843", 300:"#F48A87", 500:"#FFBCBA", 700:"#FFE0DF", 900:"#FFF9F8", fg:"#FFF", fgs:"#5C0A08" },
                  dhex: { 100:"#F47370", 300:"#CC2E2A", 500:"#7A1715", 700:"#3D0908", 900:"#250504", fg:"#0A0202", fgs:"#FFBCBA" } },
                { name: "Green · Семантика: успех", token: "green",
                  lhex: { 100:"#9AF576", 300:"#C0F9A8", 500:"#D8F4CD", 700:"#ECFAE6", 900:"#F7FEF3", fg:"#1A4A05", fgs:"#1A4A05" },
                  dhex: { 100:"#B5FA97", 300:"#6ACC44", 500:"#2A6E15", 700:"#133808", 900:"#0A2005", fg:"#020A01", fgs:"#D8F4CD" } },
              ].map((c) => (
                <div key={c.token}>
                  <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-3">{c.name}</p>
                  <div className="border border-border rounded-lg overflow-hidden">
                    {/* 6-col row: 100 = col-span-2, 300–900 = col-span-1 each */}
                    <div className="grid grid-cols-6">
                      {(["100","300","500","700","900"] as const).map((level, li) => (
                        <div key={level} className={`${level === "100" ? "col-span-2" : ""} flex flex-col gap-1.5 p-2 ${li < 4 ? "border-r border-border" : ""}`}>
                          <ColorHexBlock
                            className="w-full h-12 rounded-sm"
                            style={{ backgroundColor: `var(--rm-${c.token}-${level})` }}
                            badgeColor={level === "100" ? `var(--rm-${c.token}-fg)` : `var(--rm-${c.token}-fg-subtle)`}
                            badge={level}
                          />
                          <div className="flex items-center justify-between gap-0.5">
                            <p className="text-[10px] font-[family-name:var(--font-mono-family)] text-muted-foreground truncate">--rm-{c.token}-{level}</p>
                            <CopyButton value={`--rm-${c.token}-${level}`} label={`Токен: --rm-${c.token}-${level}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* fg / fg-subtle row */}
                    <FgRow token={c.token} />
                  </div>
                </div>
              ))}
            </div>

            {/* ── On-color surfaces ── */}
            <h3 id="colors-inverted" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.01em] mt-12 mb-2">
              Инвертированные поверхности
            </h3>
            <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
              Блоки с акцентным фоном. Добавь класс <code className="font-[family-name:var(--font-mono-family)] text-foreground">.on-{"{color}"}</code> на контейнер —
              все дочерние токены (<code className="font-[family-name:var(--font-mono-family)] text-foreground">--foreground</code>, <code className="font-[family-name:var(--font-mono-family)] text-foreground">--border</code>) автоматически инвертируются.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Yellow block — главный CTA */}
              <div className="on-yellow rounded-xl px-8 py-10">
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.1em] mb-3 opacity-60">Брендовый блок</p>
                <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-2">
                  Готов запустить агента?
                </h4>
                <p className="text-[length:var(--text-16)] mb-6 opacity-70">
                  Попробуй Rocketmind — AI-агенты для твоего бизнеса без написания кода.
                </p>
                <button
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border text-[length:var(--text-14)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider transition-all duration-150"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  Попробовать
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              {/* Violet block */}
              <div className="on-violet rounded-xl px-8 py-10">
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.1em] mb-3 opacity-60">Категориальный блок</p>
                <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-2">
                  Анализ экосистем
                </h4>
                <p className="text-[length:var(--text-16)] mb-6 opacity-70">
                  Агент Катя разбирает связи и делает выводы быстрее любой таблицы.
                </p>
                <button
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border text-[length:var(--text-14)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider transition-colors"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  Узнать больше
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="rounded-md border border-border bg-rm-gray-2/40 px-4 py-3 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] leading-relaxed">
              <span className="text-foreground font-medium">.on-yellow</span> — основной CTA-блок бренда, hero-секции, highlight-полосы.
              Используй только один такой блок на экране. Остальные .on-* — для категориальной маркировки секций.
            </div>
          </Section>

          <Separator />

          {/* ═══════ 2. TYPOGRAPHY ═══════ */}
          <Section id="typography" title="2. Типография" version={DS_VERSION}>
            <p className="text-muted-foreground mb-8">
              4 шрифта с чёткими ролями. 4 категории стилей: Heading, Label, Copy, Accent. Размерная шкала на золотом сечении (phi = 1.618) от минимального размера 12px.
            </p>

            {/* 2.1 ШРИФТЫ */}
            <h3 id="typography-fonts" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              Шрифты
            </h3>
            <div className="border border-border rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 mb-10">
              {(() => {
                const fonts = [
                  { family: "Roboto Condensed", role: "Заголовки (H1–H4)", example: "ЗАГОЛОВОК СТРАНИЦЫ", css: "font-family: 'Roboto Condensed', sans-serif", fontClass: "font-[family-name:var(--font-heading-family)] font-bold uppercase" },
                  { family: "Roboto Mono", role: "Навигация, кнопки, код", example: "НАВИГАЦИЯ / КНОПКИ", css: "font-family: 'Roboto Mono', monospace", fontClass: "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-wider" },
                  { family: "Roboto", role: "Основной текст, body", example: "Основной текст для описаний и контента страниц", css: "font-family: 'Roboto', sans-serif", fontClass: "" },
                  { family: "Shantell Sans", role: "Акцентные подписи, стикеры", example: "Рукописная подпись агента", css: "font-family: 'Shantell Sans', cursive", fontClass: "font-[family-name:var(--font-accent-family)]" },
                ]
                return fonts.map((f, i) => (
                  <div key={f.family} className={`p-4 ${i % 2 === 0 ? "md:border-r border-border" : ""} ${i < 2 ? "border-b border-border" : ""}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[length:var(--text-16)] font-medium">{f.family}</p>
                      <CopyButton value={f.css} label={f.family} />
                    </div>
                    <p className="text-[length:var(--text-12)] text-muted-foreground mb-3">{f.role}</p>
                    <p className={`text-[length:var(--text-19)] ${f.fontClass}`}>{f.example}</p>
                  </div>
                ))
              })()}
            </div>

            {/* 2.2 ТИПОГРАФИКА */}
            <h3 id="typography-scale" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              Типографика
            </h3>

            <Tabs defaultValue="scale" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="scale">Размерная шкала</TabsTrigger>
                <TabsTrigger value="specimens">Текстовые примеры</TabsTrigger>
              </TabsList>

              {/* SCALE */}
              <TabsContent value="scale">
                <div className="border border-border rounded-lg overflow-hidden">
                  {/* Header row */}
                  <div className="flex items-center gap-4 px-4 py-2 border-b border-border bg-rm-gray-2/40">
                    <span className="w-16 shrink-0" />
                    <span className="flex-1 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] uppercase tracking-wider">Пример</span>
                    <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] hidden sm:flex items-center gap-1 shrink-0 w-28 justify-end">
                      <span className="text-[length:var(--text-12)] leading-none">🖥</span> size / weight
                    </span>
                    <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] hidden sm:flex items-center gap-1 shrink-0 w-24 justify-end">
                      <span className="text-[length:var(--text-12)] leading-none">📱</span> size
                    </span>
                    <span className="w-8 shrink-0" />
                  </div>
                  {[
                    // Heading
                    { label: "H1",           size: "81px", mobileSize: "48px", weight: "800", cls: "font-[family-name:var(--font-heading-family)] font-extrabold uppercase tracking-[-0.02em] leading-[1.0]",    tailwind: "text-[length:var(--text-48)] md:text-[length:var(--text-81)]" },
                    { label: "H2",           size: "50px", mobileSize: "31px", weight: "700", cls: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.02em] leading-[1.05]",         tailwind: "text-[length:var(--text-31)] md:text-[length:var(--text-50)]" },
                    { label: "H3",           size: "31px", mobileSize: "25px", weight: "700", cls: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.015em] leading-[1.1]",         tailwind: "text-[length:var(--text-25)] md:text-[length:var(--text-31)]" },
                    { label: "H4",           size: "25px", mobileSize: "19px", weight: "700", cls: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.01em] leading-[1.2]",          tailwind: "text-[length:var(--text-19)] md:text-[length:var(--text-25)]" },
                    // Label
                    { label: "Label-19",     size: "19px", mobileSize: "19px", weight: "600", cls: "font-[family-name:var(--font-mono-family)] font-semibold uppercase tracking-[0.06em] leading-none",           tailwind: "text-[length:var(--text-19)]" },
                    { label: "Label-16",     size: "16px", mobileSize: "16px", weight: "500", cls: "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.08em] leading-none",             tailwind: "text-[length:var(--text-16)]" },
                    { label: "Label-14",     size: "14px", mobileSize: "14px", weight: "500", cls: "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.08em] leading-none",             tailwind: "text-[length:var(--text-14)]" },
                    { label: "Label-12",     size: "12px", mobileSize: "12px", weight: "500", cls: "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.06em] leading-none",             tailwind: "text-[length:var(--text-12)]" },
                    // Copy
                    { label: "Copy-25",      size: "25px", mobileSize: "19px", weight: "400", cls: "leading-[1.4] tracking-[-0.01em]",                                                                       tailwind: "text-[length:var(--text-19)] md:text-[length:var(--text-25)]" },
                    { label: "Copy-19",      size: "19px", mobileSize: "17px", weight: "400", cls: "leading-[1.4]",                                                                                                tailwind: "text-[length:var(--text-16)] md:text-[length:var(--text-19)]" },
                    { label: "Copy-16",      size: "16px", mobileSize: "16px", weight: "400", cls: "leading-[1.4]",                                                                                               tailwind: "text-[length:var(--text-16)]" },
                    { label: "Copy-14",      size: "14px", mobileSize: "14px", weight: "400", cls: "leading-[1.5] tracking-[0.01em]",                                                                             tailwind: "text-[length:var(--text-14)]" },
                    { label: "Copy-12",      size: "12px", mobileSize: "12px", weight: "400", cls: "leading-[1.4] tracking-[0.02em]",                                                                             tailwind: "text-[length:var(--text-12)]" },
                  ].map((t, i, arr) => (
                    <div key={t.label} className={`flex items-center gap-4 py-3 px-4 hover:bg-rm-gray-2/40 transition-colors group ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                      <Badge variant="secondary" className="w-16 justify-center text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] shrink-0">
                        {t.label}
                      </Badge>
                      <span className={`flex-1 ${t.cls}`} style={{ fontSize: t.size }}>
                        {t.label === "Nav/Btn" ? "BUTTON TEXT" : "Пример текста"}
                      </span>
                      <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] hidden sm:flex items-center gap-1 shrink-0 w-28 justify-end">
                        <span className="text-[length:var(--text-12)] leading-none">🖥</span>{t.size} / {t.weight}
                      </span>
                      <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] hidden sm:flex items-center gap-1 shrink-0 w-24 justify-end">
                        <span className="text-[length:var(--text-12)] leading-none">📱</span>{t.mobileSize}
                      </span>
                      <CopyButton value={`${t.tailwind} ${t.cls}`} label={`${t.label} classes`} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* SPECIMENS */}
              <TabsContent value="specimens">
                <div className="border border-border rounded-lg overflow-hidden">
                  {[
                    // Heading
                    {
                      label: "H1",
                      text: "Запускайте AI-агентов быстро",
                      cls: "font-[family-name:var(--font-heading-family)] font-extrabold uppercase tracking-[-0.02em] leading-[1.0]",
                      size: "81px",
                      mobileSize: "48px",
                      letterSpacing: "-0.02em",
                      figmaSpacing: "-2%",
                      lineHeight: "1.0",
                      figmaLineHeight: "100%",
                      twCopy: "text-[length:var(--text-48)] md:text-[length:var(--text-81)] font-[family-name:var(--font-heading-family)] font-extrabold uppercase tracking-[-0.02em] leading-[1.0]",
                    },
                    {
                      label: "H2",
                      text: "AI-агенты для вашего бизнеса",
                      cls: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.02em] leading-[1.05]",
                      size: "50px",
                      mobileSize: "31px",
                      letterSpacing: "-0.02em",
                      figmaSpacing: "-2%",
                      lineHeight: "1.05",
                      figmaLineHeight: "105%",
                      twCopy: "text-[length:var(--text-31)] md:text-[length:var(--text-50)] font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.02em] leading-[1.05]",
                    },
                    {
                      label: "H3",
                      text: "Аналитика и маркетинг без команды",
                      cls: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.015em] leading-[1.1]",
                      size: "31px",
                      mobileSize: "25px",
                      letterSpacing: "-0.015em",
                      figmaSpacing: "-1.5%",
                      lineHeight: "1.1",
                      figmaLineHeight: "110%",
                      twCopy: "text-[length:var(--text-25)] md:text-[length:var(--text-31)] font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.015em] leading-[1.1]",
                    },
                    {
                      label: "H4",
                      text: "Выберите агента под задачу",
                      cls: "font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.01em] leading-[1.2]",
                      size: "25px",
                      mobileSize: "19px",
                      letterSpacing: "-0.01em",
                      figmaSpacing: "-1%",
                      lineHeight: "1.2",
                      figmaLineHeight: "120%",
                      twCopy: "text-[length:var(--text-19)] md:text-[length:var(--text-25)] font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.01em] leading-[1.2]",
                    },
                    // Label
                    {
                      label: "Label-19",
                      text: "AI-POWERED · БЕСПЛАТНО",
                      cls: "font-[family-name:var(--font-mono-family)] font-semibold uppercase tracking-[0.06em] leading-none",
                      size: "19px",
                      mobileSize: "19px",
                      letterSpacing: "0.06em",
                      figmaSpacing: "6%",
                      lineHeight: "1",
                      figmaLineHeight: "100%",
                      twCopy: "text-[length:var(--text-19)] font-[family-name:var(--font-mono-family)] font-semibold uppercase tracking-[0.06em] leading-none",
                    },
                    {
                      label: "Label-16",
                      text: "ПОПРОБОВАТЬ БЕСПЛАТНО",
                      cls: "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.08em] leading-none",
                      size: "16px",
                      mobileSize: "16px",
                      letterSpacing: "0.08em",
                      figmaSpacing: "8%",
                      lineHeight: "1",
                      figmaLineHeight: "100%",
                      twCopy: "text-[length:var(--text-16)] font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.08em] leading-none",
                    },
                    {
                      label: "Label-14",
                      text: "ДОБАВИТЬ АГЕНТА",
                      cls: "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.08em] leading-none",
                      size: "14px",
                      mobileSize: "14px",
                      letterSpacing: "0.08em",
                      figmaSpacing: "8%",
                      lineHeight: "1",
                      figmaLineHeight: "100%",
                      twCopy: "text-[length:var(--text-14)] font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.08em] leading-none",
                    },
                    {
                      label: "Label-12",
                      text: "ОТПРАВИТЬ",
                      cls: "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.06em] leading-none",
                      size: "12px",
                      mobileSize: "12px",
                      letterSpacing: "0.06em",
                      figmaSpacing: "6%",
                      lineHeight: "1",
                      figmaLineHeight: "100%",
                      twCopy: "text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.06em] leading-none",
                    },
                    // Copy
                    {
                      label: "Copy-25",
                      text: "Платформа AI-агентов, которая помогает бизнесу запускать проекты быстро и без лишних затрат.",
                      cls: "leading-[1.4] tracking-[-0.01em]",
                      size: "25px",
                      mobileSize: "19px",
                      letterSpacing: "-0.01em",
                      figmaSpacing: "-1%",
                      lineHeight: "1.4",
                      figmaLineHeight: "140%",
                      twCopy: "text-[length:var(--text-19)] md:text-[length:var(--text-25)] leading-[1.4] tracking-[-0.01em]",
                    },
                    {
                      label: "Copy-19",
                      text: "Платформа AI-агентов, которая помогает малому бизнесу запускать проекты без найма специалистов.",
                      cls: "leading-[1.4]",
                      size: "19px",
                      mobileSize: "17px",
                      letterSpacing: "0",
                      figmaSpacing: "0%",
                      lineHeight: "1.4",
                      figmaLineHeight: "140%",
                      twCopy: "text-[length:var(--text-16)] md:text-[length:var(--text-19)] leading-[1.4]",
                    },
                    {
                      label: "Copy-16",
                      text: "Rocketmind — сервис AI-агентов для ведения кейсов. Подключите нужного агента, опишите задачу и получите результат прямо в чате.",
                      cls: "leading-[1.4]",
                      size: "16px",
                      mobileSize: "16px",
                      letterSpacing: "0",
                      figmaSpacing: "0%",
                      lineHeight: "1.4",
                      figmaLineHeight: "140%",
                      twCopy: "text-[length:var(--text-16)] leading-[1.4]",
                    },
                    {
                      label: "Copy-14",
                      text: "Подключите нужного агента, опишите задачу в свободной форме и получите профессиональный результат без лишних усилий.",
                      cls: "leading-[1.5] tracking-[0.01em]",
                      size: "14px",
                      mobileSize: "14px",
                      letterSpacing: "0.01em",
                      figmaSpacing: "1%",
                      lineHeight: "1.5",
                      figmaLineHeight: "150%",
                      twCopy: "text-[length:var(--text-14)] leading-[1.5] tracking-[0.01em]",
                    },
                    {
                      label: "Copy-12",
                      text: "Последнее обновление: сегодня в 14:32. Версия агента 2.1.4. © 2026 Rocketmind",
                      cls: "leading-[1.4] tracking-[0.02em]",
                      size: "12px",
                      mobileSize: "12px",
                      letterSpacing: "0.02em",
                      figmaSpacing: "2%",
                      lineHeight: "1.4",
                      figmaLineHeight: "140%",
                      twCopy: "text-[length:var(--text-12)] leading-[1.4] tracking-[0.02em]",
                    },
                  ].map((t, i, arr) => (
                    <div key={t.label} className={`flex gap-4 py-4 px-4 hover:bg-rm-gray-2/40 transition-colors group items-start ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                      <Badge variant="secondary" className="w-16 justify-center text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] shrink-0 mt-1">
                        {t.label}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className={t.cls} style={{ fontSize: t.size }}>{t.text}</p>
                        <p className={t.cls} style={{ fontSize: t.size }}>Пример второй строки — {t.label} выглядит так.</p>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1.5 min-w-[200px]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[length:var(--text-12)] leading-none">🖥</span>
                          <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">size</span>
                          <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-foreground bg-rm-gray-2 px-1.5 py-0.5 rounded">{t.size}</code>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[length:var(--text-12)] leading-none">📱</span>
                          <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">size</span>
                          <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-foreground bg-rm-gray-2 px-1.5 py-0.5 rounded">{t.mobileSize}</code>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] uppercase tracking-wider">spacing</span>
                          <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-foreground bg-rm-gray-2 px-1.5 py-0.5 rounded">{t.letterSpacing}</code>
                          <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground bg-rm-gray-2 px-1.5 py-0.5 rounded">{t.figmaSpacing}</code>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] uppercase tracking-wider">line-h</span>
                          <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-foreground bg-rm-gray-2 px-1.5 py-0.5 rounded">{t.lineHeight}</code>
                          <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground bg-rm-gray-2 px-1.5 py-0.5 rounded">{t.figmaLineHeight}</code>
                        </div>
                        <CopyButton value={t.twCopy} label={`${t.label} classes`} />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Section>

          <Separator />

          {/* ═══════ 3. SPACING & GRID ═══════ */}
          <Section id="spacing" title="3. Спейсинг и Сетка" version={DS_VERSION}>
            <p className="text-muted-foreground mb-6">
              Базовый модуль — <strong>8px</strong>. Модуль сетки страницы — <strong>20px</strong>.
              Все отступы кратны 8. Золотое сечение для макетных пропорций.
            </p>

            <h3 id="spacing-scale" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              Шкала отступов
            </h3>
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { label: "1", px: 4 },
                { label: "2", px: 8 },
                { label: "3", px: 12 },
                { label: "4", px: 16 },
                { label: "5", px: 20 },
                { label: "6", px: 24 },
                { label: "8", px: 32 },
                { label: "10", px: 40 },
                { label: "12", px: 48 },
                { label: "16", px: 64 },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1.5">
                  <div
                    className="bg-[var(--rm-yellow-100)] rounded-sm"
                    style={{ width: `${Math.min(s.px, 64)}px`, height: `${Math.min(s.px, 64)}px` }}
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground">
                      {s.px}px
                    </span>
                    <CopyButton value={`p-${s.label}`} label={`space-${s.label}`} />
                  </div>
                </div>
              ))}
            </div>

            <h3 id="spacing-grid" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              Сетка страницы
            </h3>
            <Tabs defaultValue="mobile" className="mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
                <TabsTrigger value="tablet">Tablet</TabsTrigger>
                <TabsTrigger value="desktop">Desktop</TabsTrigger>
                <TabsTrigger value="wide">Wide</TabsTrigger>
              </TabsList>

              {[
                { value: "mobile", label: "Mobile", bp: "< 768px", cols: 4, gutter: 0, margin: 20, tw: "sm:", color: "var(--rm-yellow-100)" },
                { value: "tablet", label: "Tablet", bp: "768–1024px", cols: 8, gutter: 0, margin: 40, tw: "md:", color: "var(--rm-yellow-100)" },
                { value: "desktop", label: "Desktop", bp: "1024–1440px", cols: 12, gutter: 0, margin: 80, tw: "lg:", color: "var(--rm-yellow-100)" },
                { value: "wide", label: "Wide", bp: "> 1440px", cols: 12, gutter: 0, margin: 120, tw: "2xl:", color: "var(--rm-yellow-100)" },
              ].map((g) => (
                <TabsContent key={g.value} value={g.value}>
                  {/* Specs row */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    {[
                      { label: "Breakpoint", val: g.bp },
                      { label: "Columns", val: String(g.cols) },
                      { label: "Gutter", val: `${g.gutter}px` },
                      { label: "Margin", val: `${g.margin}px` },
                    ].map((s) => (
                      <div key={s.label} className="flex flex-col gap-0.5 bg-rm-gray-2 rounded-md px-3 py-2 min-w-[90px]">
                        <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground">{s.label}</span>
                        <span className="text-[length:var(--text-14)] font-[family-name:var(--font-mono-family)] font-medium">{s.val}</span>
                      </div>
                    ))}
                    <div className="flex flex-col gap-0.5 bg-rm-gray-2 rounded-md px-3 py-2 min-w-[90px]">
                      <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground">Tailwind</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[length:var(--text-14)] font-[family-name:var(--font-mono-family)] font-medium">{g.tw}</span>
                        <CopyButton value={g.tw} label={`Breakpoint ${g.tw}`} />
                      </div>
                    </div>
                  </div>

                  {/* Visual grid demo — line-only style */}
                  {(() => {
                    const marginPct = g.cols <= 4 ? 5 : g.cols <= 8 ? 6 : 8
                    const colTemplate = Array.from({ length: g.cols * 2 - 1 }, (_, i) =>
                      i % 2 === 0 ? "1fr" : "1px"
                    ).join(" ")
                    return (
                      <div className="border border-border rounded-md overflow-hidden select-none">
                        {/* Margin labels row */}
                        <div className="flex h-6 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/70 border-b border-dashed border-border/40">
                          <div className="flex items-center justify-center border-r border-dashed border-muted-foreground/30"
                            style={{ width: `${marginPct}%` }}>
                            {g.margin}px
                          </div>
                          <div className="flex-1" />
                          <div className="flex items-center justify-center border-l border-dashed border-muted-foreground/30"
                            style={{ width: `${marginPct}%` }}>
                            {g.margin}px
                          </div>
                        </div>
                        {/* Columns row — 1px guide lines, no fill */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: colTemplate,
                            height: 56,
                            padding: `0 ${marginPct}%`,
                          }}
                        >
                          {Array.from({ length: g.cols }).map((_, i) => (
                            <div
                              key={i}
                              style={{ gridColumn: i * 2 + 1 }}
                              className="flex items-end justify-center pb-2 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/40"
                            >
                              {i + 1}
                            </div>
                          ))}
                          {Array.from({ length: g.cols - 1 }, (_, i) => (
                            <div
                              key={`g${i}`}
                              style={{
                                gridColumn: i * 2 + 2,
                                background: "var(--border)",
                              }}
                            />
                          ))}
                        </div>
                        {/* Gutter label */}
                        <div className="flex items-center justify-center h-5 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/60 border-t border-dashed border-border/40">
                          gutter {g.gutter}px
                        </div>
                      </div>
                    )
                  })()}
                </TabsContent>
              ))}
            </Tabs>

            <h3 id="spacing-phi" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-2">
              Макетные пропорции (phi)
            </h3>
            <p className="text-[length:var(--text-14)] text-muted-foreground mb-6 max-w-[640px]">
              Алгоритм: <strong>1 → контент</strong> диктует ширину зоны, <strong>2 → колонки</strong> привязывают к сетке, <strong>3 → φ (≈ 38/62)</strong> используется как ориентир, не жёсткое правило.
            </p>

            {/* 4 bento layout examples */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

              {/* 1. App: sidebar + content */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-[length:var(--text-12)] font-medium">1. App: навигация + контент</span>
                  <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">3 + 9 col</span>
                </div>
                <div
                  className="rounded-md overflow-hidden border border-border"
                  style={{
                    display: "grid",
                    gap: "1px",
                    background: "var(--border)",
                    gridTemplateColumns: "3fr 9fr",
                    gridTemplateRows: "28px 1fr 1fr",
                    height: 100,
                  }}
                >
                  <div style={{ gridColumn: "1", gridRow: "1 / 4", background: "var(--background)" }}
                    className="flex flex-col items-center justify-center gap-0.5">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/60">Nav</span>
                    <span className="text-[length:var(--text-12)] text-muted-foreground/35 font-[family-name:var(--font-mono-family)]">3 col · 25%</span>
                  </div>
                  <div style={{ gridColumn: "2", gridRow: "1", background: "var(--background)" }}
                    className="flex items-center px-3">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">Header</span>
                  </div>
                  <div style={{ gridColumn: "2", gridRow: "2", background: "var(--background)" }}
                    className="flex items-center px-3">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">Content · 9 col · 75%</span>
                  </div>
                  <div style={{ gridColumn: "2", gridRow: "3", background: "var(--background)" }}
                    className="flex items-center px-3">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">Content</span>
                  </div>
                </div>
                <p className="text-[length:var(--text-12)] text-muted-foreground/60">Контент: список nav → 3 col. Остаток → 9 col. Не φ, но контент-первый.</p>
              </div>

              {/* 2. Hero: text + visual — closest to phi */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-[length:var(--text-12)] font-medium">2. Hero: текст + визуал</span>
                  <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">7 + 5 col · ≈ φ</span>
                </div>
                <div
                  className="rounded-md overflow-hidden border border-border"
                  style={{
                    display: "grid",
                    gap: "1px",
                    background: "var(--border)",
                    gridTemplateColumns: "7fr 5fr",
                    gridTemplateRows: "1fr 1fr",
                    height: 100,
                  }}
                >
                  <div style={{ gridColumn: "1", gridRow: "1", background: "var(--background)" }}
                    className="flex items-center px-3">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">Headline + CTA · 7 col · 58%</span>
                  </div>
                  <div style={{ gridColumn: "1", gridRow: "2", background: "var(--background)" }}
                    className="flex items-center px-3">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">Body copy</span>
                  </div>
                  <div style={{ gridColumn: "2", gridRow: "1 / 3", background: "var(--rm-gray-2)" }}
                    className="flex flex-col items-center justify-center gap-0.5">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/60">Visual</span>
                    <span className="text-[length:var(--text-12)] text-muted-foreground/40 font-[family-name:var(--font-mono-family)]">5 col · 42%</span>
                  </div>
                </div>
                <p className="text-[length:var(--text-12)] text-muted-foreground/60">Текст → 7 col (≈ 58%). Изображение заполняет → 5 col (≈ 42%). Ближайшее к φ.</p>
              </div>

              {/* 3. Feature bento: asymmetric rows */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-[length:var(--text-12)] font-medium">3. Feature bento</span>
                  <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">7+5 / 4+4+4</span>
                </div>
                <div
                  className="rounded-md overflow-hidden border border-border"
                  style={{
                    display: "grid",
                    gap: "1px",
                    background: "var(--border)",
                    gridTemplateColumns: "repeat(12, 1fr)",
                    gridTemplateRows: "1fr 1fr",
                    height: 100,
                  }}
                >
                  <div style={{ gridColumn: "1 / 8", gridRow: "1", background: "var(--background)" }}
                    className="flex items-center px-3">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">Feature A · 7 col</span>
                  </div>
                  <div style={{ gridColumn: "8 / 13", gridRow: "1", background: "var(--background)" }}
                    className="flex items-center justify-center">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">B · 5 col</span>
                  </div>
                  <div style={{ gridColumn: "1 / 5", gridRow: "2", background: "var(--background)" }}
                    className="flex items-center justify-center">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">C · 4</span>
                  </div>
                  <div style={{ gridColumn: "5 / 9", gridRow: "2", background: "var(--background)" }}
                    className="flex items-center justify-center">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">D · 4</span>
                  </div>
                  <div style={{ gridColumn: "9 / 13", gridRow: "2", background: "var(--background)" }}
                    className="flex items-center justify-center">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">E · 4</span>
                  </div>
                </div>
                <p className="text-[length:var(--text-12)] text-muted-foreground/60">Ряд 1: крупный блок → 7, доп. → 5. Ряд 2: три равных → 4+4+4. Колонки фиксируют.</p>
              </div>

              {/* 4. Dashboard: metrics + chart + sidebar */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-[length:var(--text-12)] font-medium">4. Dashboard</span>
                  <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">12 / 8+4</span>
                </div>
                <div
                  className="rounded-md overflow-hidden border border-border"
                  style={{
                    display: "grid",
                    gap: "1px",
                    background: "var(--border)",
                    gridTemplateColumns: "repeat(12, 1fr)",
                    gridTemplateRows: "28px 1fr 1fr",
                    height: 100,
                  }}
                >
                  <div style={{ gridColumn: "1 / 13", gridRow: "1", background: "var(--background)" }}
                    className="flex items-center px-3">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">Metrics strip · 12 col</span>
                  </div>
                  <div style={{ gridColumn: "1 / 9", gridRow: "2 / 4", background: "var(--background)" }}
                    className="flex flex-col items-center justify-center gap-0.5">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">Chart</span>
                    <span className="text-[length:var(--text-12)] text-muted-foreground/35 font-[family-name:var(--font-mono-family)]">8 col · 67%</span>
                  </div>
                  <div style={{ gridColumn: "9 / 13", gridRow: "2 / 4", background: "var(--background)" }}
                    className="flex flex-col items-center justify-center gap-0.5">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/50">Sidebar</span>
                    <span className="text-[length:var(--text-12)] text-muted-foreground/35 font-[family-name:var(--font-mono-family)]">4 col · 33%</span>
                  </div>
                </div>
                <p className="text-[length:var(--text-12)] text-muted-foreground/60">График требует широкой зоны → 8 col. Панель метрик → 4 col. Контент первый.</p>
              </div>

            </div>
            <p className="text-[length:var(--text-14)] text-muted-foreground">
              Золотое сечение 38/62 — ориентир для пар sidebar/content, text/visual в hero-блоках.
            </p>

            <h3 id="spacing-visual" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4 mt-10">
              Сетка как визуальный стиль
            </h3>
            <p className="text-[length:var(--text-14)] text-muted-foreground mb-6 max-w-[640px]">
              Сетка — часть дизайн-кода. Направляющие линии между колонками — не декор, а материализация структуры.
              Реальные 1px CSS-колонки задают ритм и видимый каркас. <code className="bg-rm-gray-2 px-1.5 py-0.5 rounded text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)]">guideVisible</code> управляет видимостью без изменения раскладки.
            </p>

            {/* Механика: три состояния */}
            <p className="text-[length:var(--text-12)] font-medium text-muted-foreground mb-3">Механика: от пустой сетки к контенту</p>
            <p className="text-[length:var(--text-12)] text-muted-foreground mb-4">
              Принцип: вместо CSS gap — реальные 1px CSS-колонки.
              {" "}<code className="bg-rm-gray-2 px-1 rounded font-[family-name:var(--font-mono-family)]">cols=4</code> →
              {" "}template = <code className="bg-rm-gray-2 px-1 rounded font-[family-name:var(--font-mono-family)]">&quot;1fr 1px 1fr 1px 1fr 1px 1fr&quot;</code>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {/* 1: только направляющие */}
              <div className="space-y-2">
                <p className="text-[length:var(--text-12)] font-medium">1. Направляющие без контента</p>
                <div className="border rounded-[var(--radius-lg)]" style={{ minHeight: 120 }}>
                  <GridGuides cols={3} guideVisible={true} cellPadding={16} rowGap={0}>
                    {Array.from({ length: 3 }, (_, i) => (
                      <div key={i} style={{ height: 88 }} />
                    ))}
                  </GridGuides>
                </div>
              </div>

              {/* 2: контент, guide видны */}
              <div className="space-y-2">
                <p className="text-[length:var(--text-12)] font-medium">2. С контентом, направляющие видны</p>
                <div className="border rounded-[var(--radius-lg)]">
                  <GridGuides cols={3} guideVisible={true} cellPadding={8} rowGap={0}>
                    {["AI", "Авто", "Быстро"].map((label) => (
                      <Card key={label} size="sm">
                        <CardHeader>
                          <Badge>{label}</Badge>
                          <CardTitle>Функция</CardTitle>
                        </CardHeader>
                      </Card>
                    ))}
                  </GridGuides>
                </div>
              </div>

              {/* 3: контент, guide скрыты */}
              <div className="space-y-2">
                <p className="text-[length:var(--text-12)] font-medium">3. С контентом, направляющие скрыты</p>
                <div className="border rounded-[var(--radius-lg)]">
                  <GridGuides cols={3} guideVisible={false} cellPadding={8} rowGap={0}>
                    {["AI", "Авто", "Быстро"].map((label) => (
                      <Card key={label} size="sm">
                        <CardHeader>
                          <Badge>{label}</Badge>
                          <CardTitle>Функция</CardTitle>
                        </CardHeader>
                      </Card>
                    ))}
                  </GridGuides>
                </div>
              </div>
            </div>

            {/* Два режима */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2 bg-rm-gray-2/30 rounded-[var(--radius-lg)] p-4">
                <Badge variant="default">Лендинг / маркетинг</Badge>
                <p className="text-[length:var(--text-14)] font-medium">guideVisible = true</p>
                <p className="text-[length:var(--text-12)] text-muted-foreground">
                  Направляющие видны как часть визуального языка. Структура читается через линии.
                </p>
              </div>
              <div className="space-y-2 bg-rm-gray-2/30 rounded-[var(--radius-lg)] p-4">
                <Badge variant="secondary">SaaS-интерфейс</Badge>
                <p className="text-[length:var(--text-14)] font-medium">guideVisible = false</p>
                <p className="text-[length:var(--text-12)] text-muted-foreground">
                  Те же 1px-колонки, но прозрачны. Раскладка идентична — меняется только вид.
                </p>
              </div>
            </div>

            {/* Пример: 3 колонки с направляющими */}
            <p className="text-[length:var(--text-12)] font-medium text-muted-foreground mb-3">Пример: 3 колонки с направляющими</p>
            <div className="border rounded-[var(--radius-xl)] mb-2">
              <GridGuides cols={3} guideVisible={true} cellPadding={12} rowGap={0}>
                {[
                  { badge: "AI", title: "Анализ кейса", desc: "Агент обрабатывает документы и формирует сводку." },
                  { badge: "Авто", title: "Классификация", desc: "Определяет тип дела и маршрутизирует автоматически." },
                  { badge: "Быстро", title: "Результат за секунды", desc: "Формирует ответ и ссылку на оплату." },
                ].map((c) => (
                  <Card key={c.title}>
                    <CardHeader>
                      <Badge>{c.badge}</Badge>
                      <CardTitle>{c.title}</CardTitle>
                      <p className="text-[length:var(--text-14)] text-muted-foreground">{c.desc}</p>
                    </CardHeader>
                  </Card>
                ))}
              </GridGuides>
            </div>
            <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">
              GridGuides cols=3 guideVisible=true cellPadding=12
            </p>
            {/* 3.8 Bento Grid */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4 mt-10">
              Bento Grid — нерегулярная сетка
            </h3>
            <p className="text-[length:var(--text-14)] text-muted-foreground mb-4 max-w-[640px]">
              Секция Features / «Что умеет сервис» — мозаика карточек разного размера. Минимум 4, максимум 6 ячеек. Ни одна строка не одинакова (принцип асимметрии φ).
            </p>
            <div className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-6 border border-border rounded-sm bg-card p-4 flex flex-col gap-1.5 min-h-[100px]">
                <Badge className="w-fit">AI</Badge>
                <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase">Анализ кейса</p>
                <p className="text-[length:var(--text-12)] text-muted-foreground">Агент обрабатывает документы и формирует сводку.</p>
              </div>
              <div className="col-span-6 border border-border rounded-sm bg-card p-4 flex flex-col gap-1.5 min-h-[100px]">
                <Badge variant="secondary" className="w-fit">Авто</Badge>
                <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase">Классификация</p>
                <p className="text-[length:var(--text-12)] text-muted-foreground">Определяет тип дела и маршрутизирует.</p>
              </div>
              <div className="col-span-4 border border-border rounded-sm bg-card p-4 flex flex-col gap-1.5 min-h-[80px]">
                <Badge className="w-fit">Быстро</Badge>
                <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase">Ответ за секунды</p>
              </div>
              <div
                className="col-span-8 border rounded-sm p-5 min-h-[80px] flex items-center"
                style={{ backgroundColor: "var(--rm-yellow-10)", borderColor: "var(--rm-yellow-50)" }}
              >
                <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-tight leading-tight">
                  AI-система для ведения кейсов
                </p>
              </div>
              <div className="col-span-5 border border-border rounded-sm bg-card p-4 flex flex-col gap-1.5 min-h-[80px]">
                <Badge variant="secondary" className="w-fit">n8n</Badge>
                <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase">Интеграции</p>
                <p className="text-[length:var(--text-12)] text-muted-foreground">Подключается к любому воркфлоу.</p>
              </div>
              <div className="col-span-7 border border-border rounded-sm bg-card p-4 flex flex-col gap-1.5 min-h-[80px]">
                <Badge className="w-fit">Оплата</Badge>
                <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase">Ссылка на оплату</p>
                <p className="text-[length:var(--text-12)] text-muted-foreground">Агент формирует ответ со ссылкой автоматически.</p>
              </div>
            </div>
            <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">
              grid-cols-12 → col-span-6+6 / col-span-4+8 / col-span-5+7 — ни одна строка не одинакова
            </p>
          </Section>

          <Separator />

          {/* ═══════ 4. RADIUS & SHADOWS ═══════ */}
          <Section id="radius-shadows" title="4. Скругления" version={DS_VERSION}>
            <p className="text-muted-foreground mb-6">
              <strong>Flat стиль.</strong> Никаких box-shadow. Лёгкое скругление — 3 токена по вложенности и размеру объекта.
              Full только как выделительный элемент в самостоятельных блоках.
            </p>

            <h3 id="radius-scale" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              Border Radius
            </h3>
            <div className="flex flex-wrap gap-6 mb-8">
              {[
                { label: "sm", value: "4px", tw: "rounded-sm", usage: "Внутренние элементы: Badge, Tag, Chip, Input, маленькие кнопки" },
                { label: "md", value: "6px", tw: "rounded-md", usage: "Средние компоненты: Button, Select, Tooltip, Dropdown" },
                { label: "lg", value: "8px", tw: "rounded-lg", usage: "Крупные блоки: Card, Modal, Panel, Sidebar, Toast" },
                { label: "full", value: "9999px", tw: "rounded-full", usage: "Акцентный элемент: Avatar, счётчик, pill-label в standalone-блоках" },
              ].map((r) => (
                <div key={r.label} className="flex flex-col gap-3 w-44">
                  <div
                    className="w-full h-20 border-2 border-[var(--rm-yellow-100)]"
                    style={{ borderRadius: r.value, backgroundColor: "color-mix(in srgb, var(--rm-yellow-100) 10%, transparent)" }}
                  />
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[length:var(--text-14)] font-[family-name:var(--font-mono-family)] font-medium">{r.value}</span>
                      <Badge variant="outline" className="text-[length:var(--text-12)] px-1.5 py-0">{r.label}</Badge>
                      <CopyButton value={r.tw} label={r.label} />
                    </div>
                    <p className="text-[length:var(--text-12)] text-muted-foreground leading-snug">{r.usage}</p>
                  </div>
                </div>
              ))}
            </div>

          </Section>

          <Separator />

          {/* ═══════ 6. COMPONENTS ═══════ */}
          <Section id="components" title="6. Компоненты" version={DS_VERSION}>
            <p className="text-muted-foreground mb-6">
              Все компоненты — надстройка над shadcn/ui. Шрифт интерактивных элементов — Roboto Mono, uppercase.
              Flat-стиль, без glow-эффектов.
            </p>

            {/* ── Кнопки ── */}
            <div className="mb-12">
              <h3 id="components-buttons" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-2">Кнопки</h3>
              <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">Roboto Mono, uppercase, tracking-[0.08em]. Три размера: LG (48px) / MD (40px, default) / SM (32px).</p>

              {/* Variants × Sizes table */}
              {(() => {
                const mono = "font-[family-name:var(--font-mono-family)]"
                const sizes = [
                  { id: "lg", label: "LG / 48px", h: "h-12", px: "px-6", fs: "text-[length:var(--text-14)]" },
                  { id: "md", label: "MD / 40px", h: "h-10", px: "px-4", fs: "text-[length:var(--text-13)]" },
                  { id: "sm", label: "SM / 32px", h: "h-8",  px: "px-3", fs: "text-[length:var(--text-12)]" },
                ]
                const variants: {
                  id: string
                  name: string
                  desc: string
                  token: string
                  render: (h: string, px: string, fs: string) => React.ReactNode
                }[] = [
                  {
                    id: "primary",
                    name: "Primary",
                    desc: "Главное действие на экране. Hero CTA, финальный шаг формы. Один на странице.",
                    token: "btn-primary",
                    render: (h, px, fs) => (
                      <button className={`group relative overflow-hidden inline-flex items-center gap-2 ${h} ${px} rounded-md bg-[var(--rm-yellow-100)] ${mono} ${fs} uppercase tracking-[0.08em] cursor-pointer`}>
                        <span className="shrink-0 w-2 h-2 rounded-full bg-[var(--rm-yellow-fg)] transition-all duration-300 group-hover:scale-[50] group-hover:bg-black" />
                        <span className={`relative z-10 text-[var(--rm-yellow-fg)] whitespace-nowrap transition-colors duration-300 group-hover:text-white`}>Запустить</span>
                      </button>
                    ),
                  },
                  {
                    id: "secondary",
                    name: "Secondary",
                    desc: "Второстепенное действие рядом с primary. Фильтры, переключатели.",
                    token: "btn-secondary",
                    render: (h, px, fs) => (
                      <button className={`inline-flex items-center justify-center gap-2 ${h} ${px} rounded-md border border-border bg-transparent text-foreground ${mono} ${fs} uppercase tracking-[0.08em] transition-all duration-150 hover:bg-accent cursor-pointer`}>
                        Подробнее
                      </button>
                    ),
                  },
                  {
                    id: "ghost",
                    name: "Ghost",
                    desc: "Тихое действие без фона. Навигация, вспомогательные inline-действия.",
                    token: "btn-ghost",
                    render: (h, px, fs) => (
                      <button className={`inline-flex items-center justify-center gap-2 ${h} ${px} rounded-md bg-transparent text-muted-foreground ${mono} ${fs} uppercase tracking-[0.08em] transition-all duration-150 hover:bg-accent hover:text-foreground cursor-pointer`}>
                        Отмена
                      </button>
                    ),
                  },
                  {
                    id: "destructive",
                    name: "Destructive",
                    desc: "Необратимые действия. Удаление, архивация. Требует диалог подтверждения.",
                    token: "btn-destructive",
                    render: (h, px, fs) => (
                      <button className={`inline-flex items-center justify-center gap-2 ${h} ${px} rounded-md bg-destructive text-white ${mono} ${fs} uppercase tracking-[0.08em] transition-all duration-150 hover:opacity-90 cursor-pointer`}>
                        <Trash2 size={13} /> Удалить
                      </button>
                    ),
                  },
                ]
                return (
                  <div className="border border-border rounded-lg overflow-hidden bg-border mb-6">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-[1px]">
                      {/* Header row */}
                      <div className="bg-muted/60 px-4 py-3" />
                      {sizes.map((s) => (
                        <div key={s.id} className="bg-muted/60 px-4 py-3 flex items-center justify-center">
                          <span className={`text-[10px] text-muted-foreground ${mono} uppercase tracking-wider`}>{s.label}</span>
                        </div>
                      ))}
                      {/* Data rows */}
                      {variants.map((v) => (
                        <React.Fragment key={v.id}>
                          {/* Name + description */}
                          <div className="bg-background px-4 py-4 flex flex-col justify-center gap-1">
                            <p className={`${mono} font-medium text-[length:var(--text-13)] uppercase tracking-wider`}>{v.name}</p>
                            <p className={`text-[10px] text-muted-foreground ${mono} leading-relaxed`}>{v.desc}</p>
                          </div>
                          {/* Button + token per size */}
                          {sizes.map((s) => (
                            <div key={s.id} className="bg-background px-4 py-4 flex flex-col items-center justify-center gap-2">
                              {v.render(s.h, s.px, s.fs)}
                              <div className="flex items-center gap-0.5 mt-0.5">
                                <span className={`text-[10px] text-muted-foreground ${mono}`}>{v.token}</span>
                                <CopyButton value={v.token} label={`Скопировать: ${v.token}`} />
                              </div>
                            </div>
                          ))}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* States */}
              <div className="border border-border rounded-lg overflow-hidden">
                <p className="px-4 pt-4 pb-3 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground">Состояния</p>
                <div className="flex flex-wrap items-end gap-4 px-4 pb-4">
                  <div className="flex flex-col items-start gap-1.5">
                    <button className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] font-[family-name:var(--font-mono-family)] text-[length:var(--text-13)] uppercase tracking-[0.08em] opacity-40 cursor-not-allowed">
                      Disabled
                    </button>
                    <span className="text-[10px] text-muted-foreground font-[family-name:var(--font-mono-family)]">opacity-40 pointer-events-none</span>
                  </div>
                  <div className="flex flex-col items-start gap-1.5">
                    <button className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] font-[family-name:var(--font-mono-family)] text-[length:var(--text-13)] uppercase tracking-[0.08em] opacity-80 cursor-wait">
                      <Loader2 size={13} className="animate-spin" /> Loading
                    </button>
                    <span className="text-[10px] text-muted-foreground font-[family-name:var(--font-mono-family)]">opacity-80 + Loader2 spinner</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Инпуты ── */}
            <div className="mb-12">
              <h3 id="components-inputs" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">Инпуты</h3>
              <div className="space-y-6">
                <div className="p-6 rounded-md border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[length:var(--text-12)]">DEFAULT</Badge>
                    <CopyButton
                      value={`w-full h-10 px-4 rounded-md border border-border bg-background text-foreground text-[length:var(--text-16)] placeholder:text-muted-foreground transition-all duration-150 focus:outline-none focus:border-ring`}
                      label="Default Input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 max-w-md">
                    <label className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="example@rocketmind.ai"
                      className="w-full h-10 px-4 rounded-md border border-border bg-background text-foreground text-[length:var(--text-16)] placeholder:text-muted-foreground transition-all duration-150 focus:outline-none focus:border-ring"
                    />
                  </div>
                </div>

                <div className="p-6 rounded-md border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[length:var(--text-12)]">CHAT</Badge>
                    <CopyButton
                      value={`w-full min-h-[48px] max-h-[200px] px-4 py-3 rounded-lg border border-border bg-background text-foreground text-[length:var(--text-16)] leading-[1.618] placeholder:text-muted-foreground resize-none overflow-auto transition-all duration-150 focus:outline-none focus:border-ring`}
                      label="Chat Input"
                    />
                  </div>
                  <textarea
                    placeholder="Напишите сообщение..."
                    rows={2}
                    className="w-full min-h-[48px] max-h-[200px] px-4 py-3 rounded-lg border border-border bg-background text-foreground text-[length:var(--text-16)] leading-[1.618] placeholder:text-muted-foreground resize-none overflow-auto transition-all duration-150 focus:outline-none focus:border-ring max-w-md"
                  />
                </div>

                <div className="p-6 rounded-md border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[length:var(--text-12)]">CODE (OTP)</Badge>
                    <CopyButton
                      value={`w-14 h-14 text-center rounded-md border border-border bg-background text-foreground font-mono text-[length:var(--text-25)] tracking-[0.08em] transition-all duration-150 focus:outline-none focus:border-ring`}
                      label="Code Input"
                    />
                  </div>
                  <div className="flex gap-2">
                    {[1,2,3,4,5,6].map(i => (
                      <input
                        key={i}
                        maxLength={1}
                        className="w-14 h-14 text-center rounded-md border border-border bg-background text-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-25)] tracking-[0.08em] transition-all duration-150 focus:outline-none focus:border-ring"
                        defaultValue={i <= 3 ? String(i) : ""}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-md border border-border space-y-3">
                  <Badge variant="outline" className="text-[length:var(--text-12)]">ERROR STATE</Badge>
                  <div className="flex flex-col gap-1.5 max-w-md">
                    <label className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="invalid-email"
                      className="w-full h-10 px-4 rounded-md border border-destructive bg-background text-foreground text-[length:var(--text-16)] transition-all duration-150 focus:outline-none"
                    />
                    <span className="text-[length:var(--text-14)] text-destructive">
                      Введите корректный email
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Карточки ── */}
            <div>
              <h3 id="components-cards" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">Карточки</h3>
              <Tabs defaultValue="cards" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="cards">Каталог карточек</TabsTrigger>
                  <TabsTrigger value="cards-base">Компоненты карточек</TabsTrigger>
                </TabsList>

                {/* CARDS BASE */}
                <TabsContent value="cards-base">
                  <h3 id="tooltips-variants" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-2">
                    Варианты бордера карточки
                  </h3>
                  <p className="text-muted-foreground text-[length:var(--text-14)] mb-8">
                    Все карточки используют <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">bg-card</code>, <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">rounded-sm</code> и отличаются только поведением бордера при наведении.
                  </p>

                  {/* Базовая структура */}
                  <div className="mb-10">
                    <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-1">Базовая структура</p>
                    <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Фон, скругление, бордер. Без hover-реакции — для статичных блоков и отзывов.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="h-24 rounded-sm border border-border bg-card" />
                      ))}
                    </div>
                    <p className="mt-3 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground">
                      <code>rounded-sm border border-border bg-card</code>
                    </p>
                    <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground">
                      dark: <code>dark:border-white/[0.06]</code>
                    </p>
                  </div>

                  {/* Soft hover */}
                  <div className="mb-10">
                    <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-1">Soft hover</p>
                    <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Бордер меняется на <code className="px-1 py-0.5 bg-rm-gray-2 rounded-sm text-[length:var(--text-12)]">muted-foreground</code> — приглушённый, ненавязчивый. Используется в большинстве каталожных карточек.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="h-24 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer" />
                      ))}
                    </div>
                    <p className="mt-3 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground">
                      <code>hover:border-muted-foreground</code>
                    </p>
                    <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground">
                      dark: <code>dark:hover:border-white/[0.20]</code>
                    </p>
                  </div>

                  {/* Yellow hover */}
                  <div className="mb-10">
                    <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-1">Yellow hover</p>
                    <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Жёлтое свечение бордера следует за курсором. Используется для CTA-карточек: партнёрка, выделенные офферы.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="relative h-24 rounded-sm bg-card cursor-pointer transition-all duration-75 border border-border active:[border:2px_solid_var(--rm-yellow-100)]"
                        >
                          <GlowingEffect
                            spread={40}
                            glow={false}
                            disabled={false}
                            proximity={40}
                            inactiveZone={0.01}
                            borderWidth={2}
                            variant="yellow"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground">
                      <code>GlowingEffect variant="yellow" borderWidth={2}</code> — бордер <code>#FFCC00</code> следует за курсором · pressed — полный жёлтый контур
                    </p>
                  </div>
                </TabsContent>

                {/* CARDS CATALOG */}
                <TabsContent value="cards">
                {/* ── Легенда размеров ── */}
                <div className="flex flex-wrap gap-3 mb-8 p-4 rounded-lg border border-border bg-rm-gray-2/40">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)]">S</Badge>
                    <span className="text-[length:var(--text-14)] text-muted-foreground">Узкая — 20–30% экрана. Сетка 3–4 колонки.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)]">M</Badge>
                    <span className="text-[length:var(--text-14)] text-muted-foreground">Широкая — ~50% экрана. Сетка 2 колонки.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)]">L</Badge>
                    <span className="text-[length:var(--text-14)] text-muted-foreground">Горизонтальная — 100% ширины. Медиа слева, контент справа.</span>
                  </div>
                </div>

                {/* ════════ 1. ПРОДУКТ / УСЛУГА ════════ */}
                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4">
                  1. Продукт / Услуга
                </h3>
                {/* S */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">S — Узкая</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="h-36 bg-rm-gray-2 overflow-hidden flex items-center justify-center text-muted-foreground"><Rocket size={28}/></div>
                      <div className="flex flex-col gap-3 p-5">
                        <span className="w-fit px-2 py-0.5 rounded-sm bg-rm-gray-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Курс</span>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em] leading-snug">Название продукта</h4>
                        <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.5] line-clamp-2">Краткое описание продукта или услуги.</p>
                        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                          <span className="font-[family-name:var(--font-mono-family)] font-semibold text-[length:var(--text-16)]">9 900 ₽</span>
                          <button className="h-7 px-3 rounded-sm bg-primary text-primary-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]">Купить →</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* M */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">M — Широкая</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[1,2].map(i => (
                    <div key={i} className="flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="h-44 bg-rm-gray-2 overflow-hidden flex items-center justify-center text-muted-foreground"><Rocket size={36}/></div>
                      <div className="flex flex-col gap-4 p-6">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-sm bg-rm-gray-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Курс</span>
                          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">· 12 уроков</span>
                        </div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Название продукта</h4>
                        <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-3">Подробное описание продукта — здесь можно разместить больше текста, поскольку карточка шире.</p>
                        <div className="flex items-center gap-2 text-[var(--rm-yellow-100)]">
                          {"★★★★★".split("").map((s,j)=><span key={j} className="text-[length:var(--text-14)]">{s}</span>)}
                          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground ml-1">4.9 (128)</span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                          <div className="flex items-baseline gap-2">
                            <span className="font-[family-name:var(--font-mono-family)] font-semibold text-[length:var(--text-19)]">9 900 ₽</span>
                            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] text-muted-foreground line-through">14 900 ₽</span>
                          </div>
                          <button className="h-8 px-4 rounded-smpx] uppercase tracking-[0.08em]">Купить →</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* L */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">L — Горизонтальная</p>
                <div className="flex flex-col gap-3 mb-10">
                  {[1,2].map(i => (
                    <div key={i} className="flex overflow-hidden rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="w-48 flex-shrink-0 bg-rm-gray-2 flex items-center justify-center text-muted-foreground"><Rocket size={36}/></div>
                      <div className="flex flex-1 flex-col gap-3 p-6">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-sm bg-rm-gray-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Услуга</span>
                        </div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Название продукта</h4>
                        <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-2">Описание продукта. В горизонтальном варианте текст читается слева направо.</p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-baseline gap-2">
                            <span className="font-[family-name:var(--font-mono-family)] font-semibold text-[length:var(--text-19)]">9 900 ₽</span>
                            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] text-muted-foreground line-through">14 900 ₽</span>
                          </div>
                          <button className="h-8 px-4 rounded-smpx] uppercase tracking-[0.08em]">Купить →</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ════════ 2. ЭКСПЕРТ ════════ */}
                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4">
                  2. Эксперт
                </h3>
                {/* S */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">S — Узкая</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer group">
                      <div className="h-40 bg-rm-gray-2 flex items-center justify-center"><User size={36} className="text-muted-foreground"/></div>
                      <div className="flex flex-col gap-3 p-5">
                        <div>
                          <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Иван Петров</h4>
                          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Бизнес-аналитик</span>
                        </div>
                        <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.5] line-clamp-2">10 лет в консалтинге, помог 200+ компаниям.</p>
                        <div className="flex flex-wrap gap-1">
                          {["Стратегия","EdTech"].map(t=><span key={t} className="px-1.5 py-0.5 rounded-sm bg-rm-gray-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">{t}</span>)}
                        </div>
                        <span className="inline-flex items-center gap-1 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mt-auto group/cta">
                          Подробнее <ArrowRight size={12} className="transition-transform group-hover/cta:translate-x-1"/>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* M */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">M — Широкая</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[1,2].map(i => (
                    <div key={i} className="flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer group">
                      <div className="h-52 bg-rm-gray-2 flex items-center justify-center"><User size={48} className="text-muted-foreground"/></div>
                      <div className="flex flex-col gap-4 p-6">
                        <div>
                          <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Иван Петров</h4>
                          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground">Бизнес-аналитик</span>
                        </div>
                        <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-3">10 лет в консалтинге, помог 200+ компаниям выйти на новые рынки. Специализация — стратегия роста.</p>
                        <div className="flex flex-wrap gap-1.5">
                          {["Стратегия","EdTech","SaaS"].map(t=><span key={t} className="px-2 py-0.5 rounded-sm bg-rm-gray-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">{t}</span>)}
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Кейсов: 48</span>
                          <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground group/cta">
                            Подробнее <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-1"/>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* L */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">L — Горизонтальная</p>
                <div className="flex flex-col gap-3 mb-10">
                  {[1,2].map(i => (
                    <div key={i} className="flex overflow-hidden rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="w-52 flex-shrink-0 bg-rm-gray-2 flex items-center justify-center"><User size={48} className="text-muted-foreground"/></div>
                      <div className="flex flex-1 items-center gap-8 p-6">
                        <div className="flex flex-col gap-1 w-48 flex-shrink-0">
                          <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Иван Петров</h4>
                          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground">Бизнес-аналитик</span>
                        </div>
                        <p className="flex-1 text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-3">10 лет в консалтинге, помог 200+ компаниям выйти на новые рынки. Специализация — стратегия роста для tech-стартапов.</p>
                        <div className="flex flex-col gap-3 items-end flex-shrink-0">
                          <div className="flex flex-wrap gap-1.5 justify-end">
                            {["Стратегия","EdTech","SaaS"].map(t=><span key={t} className="px-2 py-0.5 rounded-sm bg-rm-gray-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">{t}</span>)}
                          </div>
                          <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground group/cta">
                            Подробнее <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-1"/>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ════════ 3. ИИ-АГЕНТ ════════ */}
                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4">
                  3. ИИ-Агент
                </h3>
                {/* S */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">S — Узкая</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex flex-col gap-4 p-5 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="relative w-fit">
                        <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center bg-rm-gray-2" style={{borderColor:"var(--rm-yellow-50)"}}>
                          <Rocket size={20} className="text-[var(--rm-yellow-100)]"/>
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-card border border-border">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--rm-green-100)]"/>
                        </span>
                      </div>
                      <div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Маркетолог</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground">@maks</span>
                      </div>
                      <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.5] line-clamp-3">Анализирует рынок, разрабатывает стратегии роста.</p>
                      <span className="inline-flex items-center gap-1 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mt-auto group/cta">
                        Запустить <ArrowRight size={12} className="transition-transform group-hover/cta:translate-x-1"/>
                      </span>
                    </div>
                  ))}
                </div>
                {/* M */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">M — Широкая</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[1,2].map(i => (
                    <div key={i} className="flex flex-col gap-5 p-6 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center bg-rm-gray-2" style={{borderColor:"var(--rm-yellow-50)"}}>
                            <Rocket size={28} className="text-[var(--rm-yellow-100)]"/>
                          </div>
                          <span className="absolute bottom-0.5 right-0.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-card border border-border">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--rm-green-100)]"/>
                            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase text-muted-foreground">Акт</span>
                          </span>
                        </div>
                        <div>
                          <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Маркетолог</h4>
                          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] text-muted-foreground">@maks</span>
                        </div>
                      </div>
                      <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-3">Анализирует рынок, разрабатывает стратегии и помогает находить точки роста бизнеса.</p>
                      <div className="flex items-center justify-between">
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Кейсов: 124</span>
                        <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground group/cta">
                          Запустить <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-1"/>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* L */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">L — Горизонтальная</p>
                <div className="flex flex-col gap-3 mb-10">
                  {[1,2].map(i => (
                    <div key={i} className="flex items-center gap-6 p-6 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center bg-rm-gray-2" style={{borderColor:"var(--rm-yellow-50)"}}>
                          <Rocket size={28} className="text-[var(--rm-yellow-100)]"/>
                        </div>
                        <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-[var(--rm-green-100)] border-2 border-card"/>
                      </div>
                      <div className="flex flex-col gap-0.5 w-40 flex-shrink-0">
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Маркетолог</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] text-muted-foreground">@maks</span>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mt-1">Кейсов: 124</span>
                      </div>
                      <p className="flex-1 text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-3">Анализирует рынок, разрабатывает стратегии и помогает находить точки роста бизнеса. Работает с кейсами в EdTech, SaaS и e-commerce.</p>
                      <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground flex-shrink-0 group/cta">
                        Запустить <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-1"/>
                      </span>
                    </div>
                  ))}
                </div>

                {/* ════════ 4. ОТЗЫВ ════════ */}
                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4">
                  4. Отзыв
                </h3>
                {/* S */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">S — Узкая</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex flex-col gap-4 p-5 rounded-sm border border-border bg-card dark:border-white/[0.06]">
                      <div className="flex gap-0.5 text-[var(--rm-yellow-100)]">{"★★★★★".split("").map((s,j)=><span key={j} className="text-[length:var(--text-14)]">{s}</span>)}</div>
                      <blockquote className="text-[length:var(--text-14)] italic leading-[1.5] text-foreground line-clamp-4">«Агент помог за 2 дня разобраться в структуре рынка, на что раньше уходило 2 недели.»</blockquote>
                      <div className="flex items-center gap-2.5 pt-3 border-t border-border mt-auto">
                        <div className="w-8 h-8 rounded-full bg-rm-gray-2 border border-border flex-shrink-0 flex items-center justify-center text-muted-foreground"><User size={14}/></div>
                        <div>
                          <div className="text-[length:var(--text-14)] font-medium leading-none">Анна Смирнова</div>
                          <div className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mt-0.5">CEO, TechStartup</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* M */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">M — Широкая</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[1,2].map(i => (
                    <div key={i} className="flex flex-col gap-5 p-6 rounded-sm border border-border bg-card dark:border-white/[0.06]">
                      <div className="flex gap-0.5 text-[var(--rm-yellow-100)]">{"★★★★★".split("").map((s,j)=><span key={j} className="text-[length:var(--text-16)]">{s}</span>)}</div>
                      <blockquote className="text-[length:var(--text-16)] italic leading-[1.618] text-foreground">«Агент помог мне за 2 дня разобраться в структуре рынка, на что раньше уходило целых 2 недели работы аналитика.»</blockquote>
                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <div className="w-10 h-10 rounded-full bg-rm-gray-2 border border-border flex-shrink-0 flex items-center justify-center text-muted-foreground"><User size={16}/></div>
                        <div className="flex-1">
                          <div className="text-[length:var(--text-14)] font-medium">Анна Смирнова</div>
                          <div className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">CEO, TechStartup</div>
                        </div>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Март 2026</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* L */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">L — Горизонтальная</p>
                <div className="flex flex-col gap-3 mb-10">
                  {[1,2].map(i => (
                    <div key={i} className="flex gap-8 p-6 rounded-sm border border-border bg-card dark:border-white/[0.06]">
                      <div className="flex flex-col items-center gap-3 flex-shrink-0 w-36">
                        <div className="w-16 h-16 rounded-full bg-rm-gray-2 border border-border flex items-center justify-center text-muted-foreground"><User size={24}/></div>
                        <div className="text-center">
                          <div className="text-[length:var(--text-14)] font-medium">Анна Смирнова</div>
                          <div className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">CEO, TechStartup</div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-0.5 text-[var(--rm-yellow-100)]">{"★★★★★".split("").map((s,j)=><span key={j} className="text-[length:var(--text-16)]">{s}</span>)}</div>
                          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Март 2026</span>
                        </div>
                        <blockquote className="text-[length:var(--text-16)] italic leading-[1.618] text-foreground">«Агент помог мне за 2 дня разобраться в структуре рынка, на что раньше уходило целых 2 недели работы аналитика. Результат превзошёл ожидания.»</blockquote>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ════════ 5. КЕЙС ════════ */}
                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4">
                  5. Кейс
                </h3>
                {/* S */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">S — Узкая</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex flex-col gap-3 p-5 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]"
                          style={{backgroundColor:"var(--rm-green-900)",color:"var(--rm-green-100)"}}>Активен</span>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">@maks</span>
                      </div>
                      <div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em] line-clamp-2">Анализ рынка EdTech</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">2 часа назад</span>
                      </div>
                      <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.5] line-clamp-2">Агент завершил анализ конкурентов...</p>
                      <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                        <div className="w-5 h-5 rounded-full bg-rm-gray-2 border border-border"/>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">3 сообщ.</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* M */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">M — Широкая</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[1,2].map(i => (
                    <div key={i} className="flex flex-col gap-4 p-6 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]"
                          style={{backgroundColor:"var(--rm-green-900)",color:"var(--rm-green-100)"}}>Активен</span>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">@maks</span>
                      </div>
                      <div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Анализ рынка EdTech</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Обновлён 2 часа назад</span>
                      </div>
                      <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-2">Агент завершил анализ конкурентов и подготовил сводный отчёт по основным игрокам рынка.</p>
                      <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-rm-gray-2 border border-border"/>
                          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Маркетолог</span>
                        </div>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">3 сообщения</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* L */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">L — Горизонтальная</p>
                <div className="flex flex-col gap-3 mb-10">
                  {[1,2].map(i => (
                    <div key={i} className="flex items-center gap-6 p-6 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="flex flex-col gap-1 w-40 flex-shrink-0">
                        <span className="px-2 py-0.5 rounded-sm w-fit font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]"
                          style={{backgroundColor:"var(--rm-green-900)",color:"var(--rm-green-100)"}}>Активен</span>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mt-1">2 часа назад</span>
                      </div>
                      <div className="flex flex-col gap-1 w-56 flex-shrink-0">
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Анализ рынка EdTech</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">@maks</span>
                      </div>
                      <p className="flex-1 text-[length:var(--text-14)] text-muted-foreground leading-[1.5] line-clamp-2">Агент завершил анализ конкурентов и подготовил сводный отчёт по основным игрокам рынка EdTech за 2025–2026 год.</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-rm-gray-2 border border-border"/>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">3 сообщ.</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ════════ 6. КУРС ════════ */}
                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase tracking-[0.04em] text-muted-foreground mb-4">
                  6. Курс
                </h3>
                {/* S */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">S — Узкая</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="relative h-32 bg-rm-gray-2 flex items-center justify-center">
                        <GraduationCap size={28} className="text-muted-foreground"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent"/>
                      </div>
                      <div className="flex flex-col gap-2.5 p-5">
                        <div className="flex gap-1.5">
                          <span className="px-1.5 py-0.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]"
                            style={{backgroundColor:"var(--rm-sky-900)",color:"var(--rm-sky-100)"}}>Начинающий</span>
                          <span className="px-1.5 py-0.5 rounded-sm bg-rm-gray-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Видео</span>
                        </div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em] leading-snug">Маркетинг для стартапов</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">12 уроков</span>
                        <div className="flex items-center justify-between pt-2.5 border-t border-border mt-auto">
                          <span className="font-[family-name:var(--font-mono-family)] font-semibold text-[length:var(--text-16)]">4 900 ₽</span>
                          <button className="h-7 px-3 rounded-sm bg-primary text-primary-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]">Начать →</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* M */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">M — Широкая</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[1,2].map(i => (
                    <div key={i} className="flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="relative h-44 bg-rm-gray-2 flex items-center justify-center">
                        <GraduationCap size={40} className="text-muted-foreground"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent"/>
                      </div>
                      <div className="flex flex-col gap-4 p-6">
                        <div className="flex gap-2">
                          <span className="px-2 py-0.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]"
                            style={{backgroundColor:"var(--rm-sky-900)",color:"var(--rm-sky-100)"}}>Начинающий</span>
                          <span className="px-2 py-0.5 rounded-sm bg-rm-gray-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Видео</span>
                        </div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Маркетинг для стартапов</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground">Иван Петров · 12 уроков</span>
                        <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-2">Практический курс по привлечению первых клиентов без большого бюджета.</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--rm-yellow-100)]">★</span>
                          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground">4.8 (234)</span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                          <div className="flex items-baseline gap-2">
                            <span className="font-[family-name:var(--font-mono-family)] font-semibold text-[length:var(--text-19)]">4 900 ₽</span>
                          </div>
                          <button className="h-8 px-4 rounded-smpx] uppercase tracking-[0.08em]">Начать →</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* L */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">L — Горизонтальная</p>
                <div className="flex flex-col gap-3 mb-10">
                  {[1,2].map(i => (
                    <div key={i} className="flex overflow-hidden rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="w-52 flex-shrink-0 bg-rm-gray-2 flex items-center justify-center relative">
                        <GraduationCap size={40} className="text-muted-foreground"/>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20"/>
                      </div>
                      <div className="flex flex-1 items-center gap-6 p-6">
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="flex gap-2">
                            <span className="px-2 py-0.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]"
                              style={{backgroundColor:"var(--rm-sky-900)",color:"var(--rm-sky-100)"}}>Начинающий</span>
                            <span className="px-2 py-0.5 rounded-sm bg-rm-gray-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Видео</span>
                          </div>
                          <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Маркетинг для стартапов</h4>
                          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground">Иван Петров · 12 уроков</span>
                          <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.5] line-clamp-2">Практический курс по привлечению первых клиентов без большого бюджета.</p>
                          <div className="flex items-center gap-1">
                            <span className="text-[var(--rm-yellow-100)] text-[length:var(--text-14)]">★</span>
                            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground">4.8 (234)</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3 flex-shrink-0">
                          <span className="font-[family-name:var(--font-mono-family)] font-semibold text-[length:var(--text-19)]">4 900 ₽</span>
                          <button className="h-8 px-4 rounded-smpx] uppercase tracking-[0.08em]">Начать →</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ════════ 7. ИНСТРУМЕНТ ════════ */}
                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
                  7. Инструмент
                </h3>
                {/* S */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">S — Узкая</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex flex-col gap-3 p-5 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="w-10 h-10 rounded-sm border border-border bg-rm-gray-2 flex items-center justify-center text-muted-foreground flex-shrink-0">
                        <Wrench size={18}/>
                      </div>
                      <div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Notion</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">База знаний</span>
                      </div>
                      <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.5] line-clamp-2">Синхронизирует кейсы с базой знаний автоматически.</p>
                      <span className="w-fit px-1.5 py-0.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]"
                        style={{backgroundColor:"var(--rm-blue-900)",color:"var(--rm-blue-100)"}}>Webhook</span>
                      <span className="inline-flex items-center gap-1 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mt-auto group/cta">
                        Подключить <ArrowRight size={12} className="transition-transform group-hover/cta:translate-x-1"/>
                      </span>
                    </div>
                  ))}
                </div>
                {/* M */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">M — Широкая</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[1,2].map(i => (
                    <div key={i} className="flex flex-col gap-4 p-6 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="w-12 h-12 rounded-sm border border-border bg-rm-gray-2 flex items-center justify-center text-muted-foreground flex-shrink-0">
                        <Wrench size={22}/>
                      </div>
                      <div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Notion</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground">База знаний</span>
                      </div>
                      <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-2">Синхронизирует кейсы с вашей базой знаний Notion автоматически через n8n.</p>
                      <span className="w-fit px-2 py-0.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]"
                        style={{backgroundColor:"var(--rm-blue-900)",color:"var(--rm-blue-100)"}}>Webhook</span>
                      <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground mt-auto group/cta">
                        Подключить <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-1"/>
                      </span>
                    </div>
                  ))}
                </div>
                {/* L */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">L — Горизонтальная</p>
                <div className="flex flex-col gap-3 mb-10">
                  {[1,2].map(i => (
                    <div key={i} className="flex items-center gap-6 p-6 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="w-14 h-14 rounded-sm border border-border bg-rm-gray-2 flex items-center justify-center text-muted-foreground flex-shrink-0">
                        <Wrench size={24}/>
                      </div>
                      <div className="flex flex-col gap-0.5 w-40 flex-shrink-0">
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Notion</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground">База знаний</span>
                      </div>
                      <p className="flex-1 text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-2">Синхронизирует кейсы с вашей базой знаний Notion автоматически через n8n вебхуки.</p>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="px-2 py-0.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]"
                          style={{backgroundColor:"var(--rm-blue-900)",color:"var(--rm-blue-100)"}}>Webhook</span>
                        <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground group/cta">
                          Подключить <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-1"/>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ════════ 8. ПАРТНЁРСКАЯ ПРОГРАММА ════════ */}
                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
                  8. Партнёрская программа
                </h3>
                {/* S */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">S — Узкая</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex flex-col gap-3 p-5 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{backgroundColor:"var(--rm-yellow-900)"}}>
                        <Gem size={18} className="text-[var(--rm-yellow-100)]"/>
                      </div>
                      <div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Реферальная</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">До 30% · Пожизненно</span>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <span className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-25)] uppercase tracking-tight leading-none text-[var(--rm-yellow-100)]">30%</span>
                      </div>
                      <button className="h-7 px-3 rounded-sm bg-primary text-primary-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] w-full mt-auto">
                        Стать партнёром
                      </button>
                    </div>
                  ))}
                </div>
                {/* M */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">M — Широкая</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[1,2].map(i => (
                    <div key={i} className="flex flex-col gap-4 p-6 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{backgroundColor:"var(--rm-yellow-900)"}}>
                        <Gem size={22} className="text-[var(--rm-yellow-100)]"/>
                      </div>
                      <div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Реферальная программа</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground">Доход: до 30% · Пожизненно</span>
                      </div>
                      <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618]">Приглашайте клиентов и получайте процент от каждой их оплаты навсегда.</p>
                      <div className="flex flex-col gap-0.5 pt-3 border-t border-border">
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Комиссия</span>
                        <span className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-25)] uppercase tracking-tight leading-none text-[var(--rm-yellow-100)]">30%</span>
                      </div>
                      <button className="h-8 px-3 rounded-smpx] uppercase tracking-[0.08em] w-full mt-auto">
                        Стать партнёром
                      </button>
                    </div>
                  ))}
                </div>
                {/* L */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">L — Горизонтальная</p>
                <div className="flex flex-col gap-3">
                  {[1,2].map(i => (
                    <div key={i} className="flex items-center gap-6 p-6 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] cursor-pointer">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{backgroundColor:"var(--rm-yellow-900)"}}>
                        <Gem size={24} className="text-[var(--rm-yellow-100)]"/>
                      </div>
                      <div className="flex flex-col gap-0.5 w-48 flex-shrink-0">
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Реферальная программа</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground">Пожизненно</span>
                      </div>
                      <p className="flex-1 text-[length:var(--text-16)] text-muted-foreground leading-[1.618]">Приглашайте клиентов и получайте процент от каждой их оплаты навсегда. Без ограничений по времени.</p>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Комиссия</span>
                        <span className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-31)] uppercase tracking-tight leading-none text-[var(--rm-yellow-100)]">30%</span>
                      </div>
                      <button className="h-9 px-5 rounded-smpx] uppercase tracking-[0.08em] flex-shrink-0">
                        Стать партнёром
                      </button>
                    </div>
                  ))}
                </div>

              </TabsContent>
              </Tabs>
            </div>
          </Section>

          <Separator />

          {/* ═══════ 10. TOOLTIPS ═══════ */}
          <Section id="tooltips" title="10. Тултипы" version={DS_VERSION}>
            <p className="text-muted-foreground mb-6">
              Контекстные подсказки при наведении. Появляются поверх контента через <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-mono-family)]">position: fixed</code>, не обрезаются родителем. Анимация: 120ms ease-out, fade + translateY.
            </p>

            <h3 id="tooltips-animation" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
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

            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              Варианты
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {/* Простой текстовый */}
              <div className="p-6 rounded-md border border-border flex flex-col items-center gap-4">
                <p className="text-[length:var(--text-12)] text-muted-foreground uppercase tracking-wider mb-2">Простой</p>
                <TooltipDemo
                  label="Наведи на меня"
                  content={<span className="text-[length:var(--text-12)] text-popover-foreground">Короткая подсказка</span>}
                />
              </div>
              {/* С заголовком */}
              <div className="p-6 rounded-md border border-border flex flex-col items-center gap-4">
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
              {/* Со списком (как у маскотов) */}
              <div className="p-6 rounded-md border border-border flex flex-col items-center gap-4">
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

            <h3 id="tooltips-rules" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
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
                <div key={item.rule} className="flex gap-3 p-3 rounded-md border border-border">
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

          {/* ═══════ 7. ICONS ═══════ */}
          <Section id="icons" title="7. Иконки" version={DS_VERSION}>
            <p className="text-muted-foreground mb-6">
              Основная библиотека — <strong>Lucide Icons</strong>. Outline, 24px viewbox, stroke 1.5px.
              Цвет наследуется через currentColor.
            </p>

            <h3 id="icons-scale" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              Размерная шкала
            </h3>
            <div className="flex flex-wrap items-end gap-6 mb-8">
              {[
                { size: 12, label: "xs (12px)", tw: "size={12}" },
                { size: 16, label: "sm (16px)", tw: "size={16}" },
                { size: 20, label: "md (20px)", tw: "size={20}" },
                { size: 24, label: "lg (24px)", tw: "size={24}" },
                { size: 32, label: "xl (32px)", tw: "size={32}" },
                { size: 40, label: "2xl (40px)", tw: "size={40}" },
              ].map((icon) => (
                <div key={icon.size} className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center w-16 h-16 rounded-md border border-border">
                    <Rocket size={icon.size} className="text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground">{icon.label}</span>
                    <CopyButton value={icon.tw} label={icon.label} />
                  </div>
                </div>
              ))}
            </div>

            <h3 id="icons-lucide" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              Примеры иконок (Lucide)
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: <Rocket size={20} />, name: "Rocket" },
                { icon: <Sparkles size={20} />, name: "Sparkles" },
                { icon: <Eye size={20} />, name: "Eye" },
                { icon: <Zap size={20} />, name: "Zap" },
                { icon: <Search size={20} />, name: "Search" },
                { icon: <User size={20} />, name: "User" },
                { icon: <Gem size={20} />, name: "Gem" },
                { icon: <BookOpen size={20} />, name: "BookOpen" },
                { icon: <ChevronRight size={20} />, name: "ChevronRight" },
                { icon: <Loader2 size={20} className="animate-spin" />, name: "Loader2" },
              ].map((item) => (
                <div key={item.name} className="flex flex-col items-center gap-1.5 p-3 rounded-md border border-border hover:bg-rm-gray-3 transition-colors cursor-pointer group">
                  <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground">{item.name}</span>
                    <CopyButton value={`<${item.name} size={20} />`} label={item.name} />
                  </div>
                </div>
              ))}
            </div>

            <h3 id="icons-mascots" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4 mt-8">
              AI-агенты (Маскоты)
            </h3>
            <MascotSection />
          </Section>

          <Separator />

          {/* ═══════ 8. ANIMATIONS ═══════ */}
          <Section id="animations" title="8. Анимации и Движение" version={DS_VERSION}>
            <style>{`
              @keyframes typing-pulse {
                0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
                40% { opacity: 1; transform: scale(1); }
              }
              @keyframes shimmer-anim {
                from { background-position: 200% 0; }
                to   { background-position: -200% 0; }
              }
              @keyframes fade-in-down {
                from { opacity: 0; transform: translateY(-8px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              @keyframes slide-in-bottom {
                from { opacity: 0; transform: translateY(16px) scale(0.98); }
                to   { opacity: 1; transform: translateY(0) scale(1); }
              }
              @keyframes toast-enter {
                from { opacity: 0; transform: translateX(24px); }
                to   { opacity: 1; transform: translateX(0); }
              }
              @keyframes bubble-enter {
                from { opacity: 0; transform: translateY(8px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              .skeleton-shimmer {
                background: linear-gradient(90deg, var(--rm-gray-2) 0%, color-mix(in srgb, var(--rm-gray-2) 80%, white) 50%, var(--rm-gray-2) 100%);
                background-size: 200% 100%;
                animation: shimmer-anim 1.5s ease-in-out infinite;
                border-radius: var(--radius);
              }
            `}</style>

            {/* Принципы */}
            <p className="text-muted-foreground mb-6">
              Motion в Rocketmind — <strong>функциональный, не декоративный</strong>. Каждая анимация решает задачу: подтверждает действие, указывает направление, сообщает о смене состояния.
            </p>
            <div className="border border-border rounded-lg overflow-hidden grid grid-cols-1 sm:grid-cols-3 mb-10">
              {(() => {
                const principles = [
                  { num: "01", title: "Минимализм", desc: "Анимировать только то, что несёт смысл. Без декора ради декора." },
                  { num: "02", title: "Скорость", desc: "100–300ms. Длинные анимации раздражают и замедляют восприятие." },
                  { num: "03", title: "Единообразие", desc: "Одни и те же easing-кривые и длительности по всей системе." },
                ]
                return principles.map((p, i) => (
                  <div key={p.num} className={`p-5 bg-card ${i < principles.length - 1 ? "border-r border-border" : ""}`}>
                    <div className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground mb-1">{p.num}</div>
                    <div className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-16)] uppercase tracking-tight mb-2">{p.title}</div>
                    <div className="text-[length:var(--text-14)] text-muted-foreground leading-relaxed">{p.desc}</div>
                  </div>
                ))
              })()}
            </div>

            {/* 8.2 Timing */}
            <h3 id="animations-timing" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-2">
              8.2 Timing-шкала
            </h3>
            <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Полоска показывает относительную длину каждого токена.</p>
            <div className="space-y-1 mb-10">
              {[
                { token: "--duration-instant", ms: 50,  desc: "Немедленная реакция (cursor, checkmark мгновенный)" },
                { token: "--duration-fast",    ms: 100, desc: "Hover-эффекты кнопок, смена цвета" },
                { token: "--duration-base",    ms: 200, desc: "Стандарт: переходы состояний (active/disabled/focus)" },
                { token: "--duration-smooth",  ms: 300, desc: "Появление/скрытие элементов (dropdown, tooltip)" },
                { token: "--duration-enter",   ms: 400, desc: "Входящие элементы (модал, панель)" },
                { token: "--duration-grid",    ms: 1600, desc: "Animated Grid Lines hero reveal — единственная длинная анимация" },
              ].map((t) => (
                <TimingRow key={t.token} token={t.token} ms={t.ms} desc={t.desc} />
              ))}
            </div>

            {/* 8.3 Easing */}
            <h3 id="animations-easing" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-2">
              8.3 Easing-кривые
            </h3>
            <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Нажми «Play», чтобы увидеть как шарик движется с данной кривой.</p>
            <div className="border border-border rounded-lg overflow-hidden grid grid-cols-1 sm:grid-cols-2 mb-10">
              <div className="border-r sm:border-r border-b sm:border-b border-border"><EasingDemo token="--ease-standard" curve="cubic-bezier(0.4, 0, 0.2, 1)" desc="Hover, focus, active — большинство переходов" /></div>
              <div className="border-b border-border"><EasingDemo token="--ease-enter" curve="cubic-bezier(0, 0, 0.2, 1)" desc="Появление элементов (модал, дропдаун, toast)" /></div>
              <div className="sm:border-r border-border"><EasingDemo token="--ease-exit" curve="cubic-bezier(0.4, 0, 1, 1)" desc="Исчезновение элементов (закрытие, скрытие)" /></div>
              <div><EasingDemo token="--ease-spring" curve="cubic-bezier(0.34, 1.56, 0.64, 1)" desc="Hover scale на карточках — небольшой перелёт" /></div>
            </div>

            {/* 8.4 Микроинтерактивы */}
            <h3 id="animations-micro" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-2">
              8.4 Микроинтерактивы
            </h3>
            <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Наведи курсор на каждый элемент.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">

              <AnimDemoCard label="Button hover" desc="Primary button: hover меняет цвет. 100ms ease-standard.">
                <button
                  className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] cursor-pointer select-none"
                  style={{ transition: "background-color 100ms cubic-bezier(0.4,0,0.2,1)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--rm-yellow-300)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--rm-yellow-100)" }}
                >
                  Hover me
                </button>
              </AnimDemoCard>

              <AnimDemoCard label="Ghost button hover" desc="Ghost button: hover заполняет фон muted. 100ms ease-standard.">
                <button
                  className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md border border-border text-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] cursor-pointer select-none"
                  style={{ transition: "background-color 100ms cubic-bezier(0.4,0,0.2,1)", backgroundColor: "transparent" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--rm-gray-2)" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent" }}
                >
                  Ghost button
                </button>
              </AnimDemoCard>

              <AnimDemoCard label="Input focus" desc="Input: при фокусе border жёлтый. 200ms ease-standard.">
                <input
                  type="text"
                  placeholder="Кликни сюда..."
                  className="w-full h-10 px-3 rounded-md border bg-background text-foreground text-[length:var(--text-14)] outline-none"
                  style={{ borderColor: "var(--border)", transition: "border-color 200ms cubic-bezier(0.4,0,0.2,1)" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--rm-yellow-100)" }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)" }}
                />
              </AnimDemoCard>

              <AnimDemoCard label="Agent card hover" desc="Карточка агента: hover меняет border на фиолетовый. 200ms ease-spring.">
                <div
                  className="w-full p-4 rounded-md border bg-card cursor-pointer"
                  style={{ borderColor: "var(--border)", transition: "border-color 200ms cubic-bezier(0.34,1.56,0.64,1)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--rm-violet-100)" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--rm-violet-100)]/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[var(--rm-violet-100)]" />
                    </div>
                    <div>
                      <p className="text-[length:var(--text-14)] font-medium">AI-агент</p>
                      <p className="text-[length:var(--text-12)] text-muted-foreground">Hover this card</p>
                    </div>
                  </div>
                </div>
              </AnimDemoCard>

              <AnimDemoCard label="Link CTA → arrow" desc="Текстовая ссылка: hover сдвигает стрелку на 4px вправо. 100ms ease-standard.">
                <LinkCTADemo />
              </AnimDemoCard>

              <AnimDemoCard label="Nav icon hover" desc="Иконка в сайдбаре: hover меняет цвет с muted-foreground на foreground. 100ms ease-standard.">
                <div className="flex gap-4">
                  {[Sparkles, Eye, Zap, Search].map((Icon, i) => (
                    <button
                      key={i}
                      className="p-2 rounded-md cursor-pointer"
                      style={{ color: "var(--muted-foreground)", transition: "color 100ms cubic-bezier(0.4,0,0.2,1), background-color 100ms cubic-bezier(0.4,0,0.2,1)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--rm-gray-2)" }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent" }}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </AnimDemoCard>
            </div>

            {/* 8.5 Screen transitions */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-2">
              8.5 Переходы между состояниями экрана
            </h3>
            <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Нажми кнопку, чтобы воспроизвести анимацию появления элемента.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <ToggleAnimCard label="Dropdown / Tooltip" desc="Fade + slide 8px вниз. 300ms ease-enter." animClass="fade-in-down" animDuration="300ms" animEasing="cubic-bezier(0,0,0.2,1)">
                <div className="w-full p-3 rounded-md border border-border bg-popover text-[length:var(--text-14)]">
                  <p className="font-medium mb-1">Опции</p>
                  <p className="text-muted-foreground text-[length:var(--text-12)] py-0.5">Редактировать</p>
                  <p className="text-muted-foreground text-[length:var(--text-12)] py-0.5">Удалить</p>
                </div>
              </ToggleAnimCard>
              <ToggleAnimCard label="Модальное окно" desc="Slide + scale от 0.98. 400ms ease-enter." animClass="slide-in-bottom" animDuration="400ms" animEasing="cubic-bezier(0,0,0.2,1)">
                <div className="w-full p-4 rounded-md border border-border bg-card text-[length:var(--text-14)]">
                  <p className="font-medium mb-2">Диалог</p>
                  <p className="text-muted-foreground text-[length:var(--text-12)] mb-3">Вы уверены в этом действии?</p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] text-[length:var(--text-12)] font-medium">Да</span>
                    <span className="px-3 py-1 rounded border border-border text-[length:var(--text-12)] text-muted-foreground">Нет</span>
                  </div>
                </div>
              </ToggleAnimCard>
              <ToggleAnimCard label="Toast / Notification" desc="Slide справа-налево. 300ms ease-enter." animClass="toast-enter" animDuration="300ms" animEasing="cubic-bezier(0,0,0.2,1)">
                <div className="w-full p-3 rounded-md border border-border bg-card flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  <span className="text-[length:var(--text-12)]">Изменения сохранены</span>
                </div>
              </ToggleAnimCard>
              <ToggleAnimCard label="Сообщение в чате" desc="Fade + slide 8px снизу. 300ms ease-enter." animClass="bubble-enter" animDuration="300ms" animEasing="cubic-bezier(0,0,0.2,1)">
                <div className="w-full px-3 py-2 rounded-xl rounded-tl-none bg-rm-gray-2 border border-border/50">
                  <p className="text-[length:var(--text-12)] text-muted-foreground mb-0.5">AI-агент</p>
                  <p className="text-[length:var(--text-12)]">Привет! Чем могу помочь?</p>
                </div>
              </ToggleAnimCard>
            </div>

            {/* 8.6 Loading */}
            <h3 id="animations-loading" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-2">
              8.6 Loading / Skeleton
            </h3>
            <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Skeleton занимает место сразу — нет «прыжков» при загрузке. Shimmer движется бесконечно.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <AnimDemoCard label="Skeleton shimmer" desc="Блоки-заглушки с движущимся блеском. Показываются пока грузятся данные.">
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full skeleton-shimmer shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 skeleton-shimmer" />
                      <div className="h-3 w-3/4 skeleton-shimmer" />
                    </div>
                  </div>
                  <div className="h-3 skeleton-shimmer" />
                  <div className="h-3 w-5/6 skeleton-shimmer" />
                  <div className="h-3 w-2/3 skeleton-shimmer" />
                </div>
              </AnimDemoCard>
              <AnimDemoCard label="Typing indicator" desc="Три точки с stagger 0.2s. Показывает, что агент печатает ответ.">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--rm-violet-100)]/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--rm-violet-100)]" />
                  </div>
                  <div className="px-4 py-2.5 rounded-xl rounded-tl-none bg-rm-gray-2 flex gap-1.5 items-center">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-rm-gray-2-foreground"
                        style={{ animation: "typing-pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-[length:var(--text-12)] text-muted-foreground">агент печатает...</span>
                </div>
              </AnimDemoCard>
            </div>

            {/* 8.7 Page-level */}
            <h3 id="animations-page" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              8.7 Page-level правила
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <Card className="border border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[length:var(--text-16)] text-green-600 dark:text-green-400">✓ Допустимо</CardTitle>
                </CardHeader>
                <CardContent className="text-[length:var(--text-14)] text-muted-foreground space-y-1.5">
                  <p>Fade-in hero-контента: opacity 0→1, 400ms, ease-enter</p>
                  <p>Grid Lines reveal при загрузке (1600ms)</p>
                  <p>Skeleton placeholder до загрузки данных</p>
                  <p>Typing indicator в чате агента</p>
                  <p>Hover-переходы компонентов (100–200ms)</p>
                </CardContent>
              </Card>
              <Card className="border border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[length:var(--text-16)] text-destructive">✗ Запрещено</CardTitle>
                </CardHeader>
                <CardContent className="text-[length:var(--text-14)] text-muted-foreground space-y-1.5">
                  <p>Parallax-scrolling</p>
                  <p>Scroll-triggered transforms/fade</p>
                  <p>Page transitions с морфингом</p>
                  <p>Бесконечные фоновые анимации (pulse, float, orbit)</p>
                  <p>Particle systems</p>
                </CardContent>
              </Card>
            </div>

            {/* 8.8 Reduced Motion */}
            <h3 id="animations-a11y" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              8.8 Доступность (Reduced Motion)
            </h3>
            <div className="p-4 rounded-md border border-border bg-rm-gray-2/30">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[length:var(--text-14)] font-medium">prefers-reduced-motion: reduce</p>
                <CopyButton
                  value={`@media (prefers-reduced-motion: reduce) {\n  *,\n  *::before,\n  *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n    scroll-behavior: auto !important;\n  }\n}`}
                  label="Reduced Motion CSS"
                />
              </div>
              <p className="text-[length:var(--text-14)] text-muted-foreground">
                Все анимации обязаны уважать системные настройки. Исключение — typing-indicator: заменяется на статичный <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-mono-family)]">•••</code>.
              </p>
            </div>

            {/* 8.9 Animated Grid Lines */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4 mt-8">
              8.9 Animated Grid Lines
            </h3>
            <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">
              Тонкие линии hero-секции материализуют каркас дизайна. Только одноразовая анимация при загрузке — после появления статичны. Используется с токеном <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-mono-family)]">--duration-grid</code> (1600ms).
            </p>
            <AnimatedGridLinesDemo />

            {/* 8.10 Dot Grid Lens */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4 mt-10">
              8.10 Dot Grid Lens
            </h3>
            <p className="text-muted-foreground mb-6">
              Фоновый эффект «линзы» на сетке точек: при движении курсора точки вблизи него увеличиваются
              по квадратичному закону. Используется в hero-секции и CTA лендинга. Реализован через Canvas.
            </p>

            {/* Tokens */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              Токены
            </h3>
            <div className="space-y-2 mb-8">
              {[
                { token: "--dot-size",      value: "3px",     desc: "Базовый диаметр точки" },
                { token: "--dot-size-max",  value: "10px",    desc: "Максимальный диаметр в центре линзы" },
                { token: "--dot-gap",       value: "28px",    desc: "Шаг сетки (расстояние между центрами)" },
                { token: "--lens-radius",   value: "120px",   desc: "Радиус влияния курсора" },
                { token: "--dot-color",     value: "#CBCBCB / #404040", desc: "Цвет точек (= --border токен)" },
                { token: "--dot-color-accent", value: "#FFCC00", desc: "Акцентный цвет точек в центре линзы" },
              ].map((t) => (
                <TokenRow key={t.token} token={t.token} value={t.value} desc={t.desc} />
              ))}
            </div>

            {/* Live Demo */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              Live Demo
            </h3>
            <DotGridDemo />

            {/* Algorithm */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mt-8 mb-4">
              Алгоритм
            </h3>
            <div className="p-4 rounded-md border border-border bg-rm-gray-2/30 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground space-y-1">
              <p>distance = sqrt((x − mx)² + (y − my)²)</p>
              <p>t = clamp(1 − distance / LENS_RADIUS, 0, 1)</p>
              <p>scale = 1 + (MAX_SCALE − 1) × t²  // квадратичный easing</p>
              <p>dotRadius = BASE_RADIUS × scale</p>
            </div>

            {/* Usage table */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mt-8 mb-4">
              Применение
            </h3>
            <div className="overflow-auto rounded-md border border-border">
              <table className="w-full text-[length:var(--text-14)]">
                <thead>
                  <tr className="border-b border-border bg-rm-gray-2/30">
                    <th className="text-left px-4 py-2 font-medium">Экран</th>
                    <th className="text-left px-4 py-2 font-medium">Секция</th>
                    <th className="text-left px-4 py-2 font-medium">Вариант</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["Лендинг — Hero",  "Полный фон hero",    "Акцентный (#FFCC00 в линзе)"],
                    ["Лендинг — CTA",   "Фон CTA-блока",      "Монохромный"],
                    ["Auth",            "Фоновый декор",       "Монохромный, opacity: 0.5"],
                    ["Main App",        "—",                   "Не используется"],
                  ].map(([screen, section, variant]) => (
                    <tr key={screen} className="border-b border-border last:border-0">
                      <td className="px-4 py-2">{screen}</td>
                      <td className="px-4 py-2">{section}</td>
                      <td className="px-4 py-2">{variant}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* a11y note */}
            <div className="mt-6 p-4 rounded-md border border-border bg-rm-gray-2/30">
              <p className="text-[length:var(--text-14)] font-medium mb-1">Доступность & Touch</p>
              <p className="text-[length:var(--text-14)] text-muted-foreground">
                На touch-устройствах (<code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded">pointer: coarse</code>) линза отключается — сетка остаётся статичным декором.
                При <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded">prefers-reduced-motion: reduce</code> анимация останавливается, сетка отрисовывается один раз.
              </p>
            </div>
          </Section>


          <Separator />

          {/* ═══════ CROSS-CUTTING BLOCKS ═══════ */}
          <Section id="cross-blocks" title="Сквозные блоки" version={DS_VERSION}>
            <p className="text-muted-foreground mb-8">
              Блоки, которые появляются на нескольких страницах: лендинг, авторизация, main app.
              Их стиль должен быть абсолютно единым — один компонент, ноль дублирования.
            </p>

            {/* ── Header ── */}
            <h3 id="cross-header" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              Header — Шапка
            </h3>
            <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
              Единая шапка для всех страниц. Sticky, backdrop blur при скролле.
              Логотип → навигация → CTA. На мобайле: логотип + гамбургер.
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

            {/* ── Token spec ── */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              Токены
            </h3>
            <div className="overflow-auto rounded-md border border-border mb-8">
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
                    ["Кнопка «Войти»",   "--border / --rm-gray-3",     "Outline, hover: bg-rm-gray-3"],
                    ["CTA «Попробовать»","--rm-yellow-100",             "hover: --rm-yellow-300"],
                    ["Мобайл гамбургер", "Lucide Menu / X",            "18px, stroke 1.5px"],
                    ["Мобайл меню",      "React portal + fixed",       "top-16, backdrop-blur-lg"],
                  ].map(([prop, token, value]) => (
                    <tr key={prop} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 font-medium text-foreground">{prop}</td>
                      <td className="px-4 py-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)]">{token}</td>
                      <td className="px-4 py-2">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── States ── */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              Состояния
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="rounded-md border border-border overflow-hidden">
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
                      <span className="hidden sm:inline-flex items-center justify-center h-8 px-3 rounded-md border border-border text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-foreground">Войти</span>
                      <span className="inline-flex items-center justify-center h-8 px-3 rounded-md bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em]">Попробовать</span>
                    </div>
                  </nav>
                </div>
                <div className="px-4 py-2 bg-rm-gray-2/10">
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground">border-transparent · bg-transparent</span>
                </div>
              </div>

              <div className="rounded-md border border-border overflow-hidden">
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
                      <span className="hidden sm:inline-flex items-center justify-center h-8 px-3 rounded-md border border-border text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-foreground">Войти</span>
                      <span className="inline-flex items-center justify-center h-8 px-3 rounded-md bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em]">Попробовать</span>
                    </div>
                  </nav>
                </div>
                <div className="px-4 py-2 bg-rm-gray-2/10">
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground">border-border · bg-background/95 · backdrop-blur-lg</span>
                </div>
              </div>
            </div>

            {/* ── Usage ── */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              Применение
            </h3>
            <div className="p-4 rounded-md border border-border bg-rm-gray-2/30 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground">
              <p className="mb-1">{'<SiteHeader basePath={BASE_PATH} />'}</p>
              <p className="text-[length:var(--text-12)] text-muted-foreground/60">{'// basePath — для корректных путей к SVG-логотипам в prod'}</p>
            </div>
          </Section>

          <Separator />

          {/* ═══════ MARKETING BLOCKS ═══════ */}
          <Section id="marketing-blocks" title="Маркетинг блоки" version={DS_VERSION}>
            <p className="text-muted-foreground mb-8">
              Готовые блоки для лендинга и маркетинговых страниц. Используют токены дизайн-системы — стиль единый с основным приложением.
            </p>

            {/* ── Accordion 05 ── */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-2">
              Аккордион — FAQ
            </h3>
            <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
              Аккордион для секций FAQ и «Часто задаваемые вопросы». Числа слева — порядковые метки. Заголовок раскрытого пункта подсвечивается акцентным жёлтым. Плавное открытие через <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-mono-family)]">grid-template-rows</code> (200ms, ease-standard).
            </p>

            <div className="-mx-5 md:-mx-10 border-y border-border py-10 px-5 md:px-10 mb-8">
              <Accordion05Demo />
            </div>

            {/* Token spec */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              Токены
            </h3>
            <div className="overflow-auto rounded-md border border-border mb-8">
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
                    ["Закрытый заголовок",   "text-foreground/20",              "Приглушённый текст"],
                    ["Открытый заголовок",   "text-primary (--rm-yellow-100)",   "Акцентный жёлтый"],
                    ["Hover заголовок",      "text-foreground/50",               "Промежуточное состояние"],
                    ["Типографика",          "--font-heading-family, uppercase",  "Bold, tracking -0.02em"],
                    ["Номер",               "--font-mono-family, --text-12",     "Tabular nums, mt-2"],
                    ["Контент",             "--text-14, text-muted-foreground",  "Отступ pl-6 / md:px-20"],
                    ["Разделитель",          "border-b border-border",           "Стандартный бордер ДС"],
                    ["Анимация",             "grid-template-rows, 200ms",        "--ease-standard (0.4,0,0.2,1)"],
                  ].map(([prop, token, desc]) => (
                    <tr key={prop} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 font-medium text-foreground">{prop}</td>
                      <td className="px-4 py-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)]">{token}</td>
                      <td className="px-4 py-2">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Separator />

          {/* ───── VERSION HISTORY ───── */}
          <VersionHistory />

          {/* FOOTER */}
          <footer className="border-t border-border pt-6 pb-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <img src={`${BASE_PATH}/icon_dark_background.svg`} alt="Rocketmind" className="h-5 w-auto hidden dark:block" />
                <img src={`${BASE_PATH}/icon_light_background.svg`} alt="Rocketmind" className="h-5 w-auto dark:hidden" />
                <span className="text-[length:var(--text-14)]">Rocketmind Design System v{DS_VERSION}</span>
              </div>
              <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] uppercase tracking-wider">
                shadcn/ui + Tailwind CSS
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
