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
  ChevronRight, ArrowRight, Loader2, Trash2, Menu, X,
  Wrench, GraduationCap
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { GlowingEffect } from "@/components/ui/glowing-effect"

const DS_VERSION = "1.2.0"
const DS_DATE = "2026-03-12"

/* ───────── NAV DATA ───────── */
const sections = [
  { id: "logos", label: "Логотипы" },
  { id: "colors", label: "Цвета" },
  { id: "typography", label: "Типография" },
  { id: "spacing", label: "Спейсинг и сетка" },
  { id: "radius-shadows", label: "Скругления" },
  { id: "visual-language", label: "Визуальный язык" },
  { id: "components", label: "Компоненты" },
  { id: "icons", label: "Иконки" },
  { id: "animations", label: "Анимации" },
  { id: "tooltips", label: "Тултипы" },
  { id: "dot-grid", label: "Точечная сетка" },
]

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
  const imgPath = `/ai-mascots/${mascot.key}/${currentFile}`
  const downloadName = `rocketmind_${mascot.key}_${currentFile}`
  const hasMultiple = files.length > 1

  function showTooltip() {
    if (!btnRef.current) return
    const r = btnRef.current.getBoundingClientRect()
    setTooltip({ top: r.bottom + 6, right: window.innerWidth - r.right })
  }

  return (
    <div className="flex flex-col rounded-sm border border-border overflow-hidden">
      <div className="bg-muted/30 flex items-end justify-center h-44 relative">
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
      const baseColor = isDark ? [64, 64, 64] : [203, 203, 203]
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
          className={`text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider px-3 py-1 rounded border transition-colors ${accent ? "bg-[#FFCC00] text-[#121212] border-[#FFCC00]" : "border-border text-muted-foreground hover:border-foreground"}`}
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
    <div className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-accent/50 transition-colors group">
      <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-foreground bg-muted px-2 py-0.5 rounded min-w-[180px]">
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
  const maxMs = 800
  const width = Math.round((ms / maxMs) * 100)
  return (
    <div className="py-2.5 px-3 rounded-md hover:bg-accent/50 transition-colors group">
      <div className="flex items-center gap-3 mb-1.5">
        <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-foreground bg-muted px-2 py-0.5 rounded min-w-[200px]">
          {token}
        </code>
        <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground min-w-[50px]">{ms}ms</span>
        <span className="text-[length:var(--text-14)] text-muted-foreground flex-1">{desc}</span>
        <CopyButton value={token} label={token} />
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden ml-3">
        <div className="h-full rounded-full bg-[#FFCC00]" style={{ width: `${width}%` }} />
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
    <div className="p-4 rounded-md border border-border bg-card">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div>
          <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-foreground bg-muted px-1.5 py-0.5 rounded">{token}</code>
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
      <div className="h-8 bg-muted/50 rounded-md relative overflow-hidden flex items-center px-2">
        <div ref={ballRef} className="w-4 h-4 rounded-full bg-[#FFCC00] shrink-0" style={{ transform: "translateX(0)" }} />
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

/* ═══════════════════════════════════ MAIN PAGE ═══════════════════════════════════ */
export default function DesignSystemPage() {
  const [mobileNav, setMobileNav] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ───── HEADER ───── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1 text-muted-foreground"
              onClick={() => setMobileNav(!mobileNav)}
            >
              {mobileNav ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <img
                src="/text_logo_dark_background_en.svg"
                alt="Rocketmind"
                className="h-7 hidden dark:block"
              />
              <img
                src="/text_logo_light_background_en.svg"
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
        <aside className="hidden md:block w-[220px] shrink-0 sticky top-14 self-start h-[calc(100vh-56px)] overflow-y-auto py-8 pl-10 pr-4">
          <nav className="space-y-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block py-1.5 text-[length:var(--text-12)] text-muted-foreground hover:text-foreground transition-colors
                           font-[family-name:var(--font-mono-family)] uppercase tracking-wider"
              >
                {s.label}
              </a>
            ))}
          </nav>

          <Separator className="my-6" />

          <div className="space-y-2">
            <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] uppercase tracking-wider">
              Версия
            </p>
            <div className="flex items-center gap-2">
              <Badge className="bg-[var(--rm-yellow-100)] text-[#121212] text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] hover:bg-[var(--rm-yellow-100)]">
                {DS_VERSION}
              </Badge>
            </div>
            <p className="text-[length:var(--text-12)] text-muted-foreground">{DS_DATE}</p>
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
                        <img src={`/${item.file}.svg`} alt={item.label} className={`${group.imgH} w-auto`} />
                      </div>
                      <div className="px-4 py-3 bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[length:var(--text-14)] font-medium">{item.label}</p>
                          <div className="flex gap-2">
                            <a href={`/${item.file}.svg`} download className="text-[length:var(--text-12)] text-muted-foreground hover:text-foreground border border-border rounded px-2 py-1 font-[family-name:var(--font-mono-family)] transition-colors">SVG</a>
                            <a href={`/${item.file}.png`} download className="text-[length:var(--text-12)] text-muted-foreground hover:text-foreground border border-border rounded px-2 py-1 font-[family-name:var(--font-mono-family)] transition-colors">PNG</a>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground bg-muted px-2 py-0.5 rounded flex-1 truncate">
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
            <p className="text-muted-foreground mb-6">
              Все цвета определяются через CSS-переменные. Единственный акцентный цвет — <strong className="text-[var(--rm-yellow-100)]">#FFCC00</strong> (жёлтый).
              Фиолетовый используется только как категориальный цвет в графиках и тегах.
            </p>

            <Tabs defaultValue="brand" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="brand">Брендовые</TabsTrigger>
                <TabsTrigger value="neutral">Нейтральные</TabsTrigger>
                <TabsTrigger value="semantic">Семантические</TabsTrigger>
                <TabsTrigger value="categorical">Категориальные</TabsTrigger>
              </TabsList>

              <TabsContent value="brand">
                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
                  Жёлтый (Accent)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <ColorSwatchLive name="Yellow 100" cssVar="--rm-yellow-100" token="--color-yellow-100" lightHex="#FFCC00" darkHex="#FFCC00" twClass="bg-[var(--rm-yellow-100)]" />
                  <ColorSwatchLive name="Yellow 50" cssVar="--rm-yellow-50" token="--color-yellow-50" lightHex="#FFF0AA" darkHex="#7A6200" twClass="bg-[var(--rm-yellow-50)]" />
                  <ColorSwatchLive name="Yellow 10" cssVar="--rm-yellow-10" token="--color-yellow-10" lightHex="#FFFEF3" darkHex="#3D3300" twClass="bg-[var(--rm-yellow-10)]" />
                </div>
              </TabsContent>

              <TabsContent value="neutral">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[
                    { name: "Background", var: "--background", token: "--background", lhex: "#FAFAFA", dhex: "#121212", tw: "bg-background" },
                    { name: "Foreground", var: "--foreground", token: "--foreground", lhex: "#2D2D2D", dhex: "#F0F0F0", tw: "text-foreground" },
                    { name: "Card", var: "--card", token: "--card", lhex: "#FFFFFF", dhex: "#1A1A1A", tw: "bg-card" },
                    { name: "Card Foreground", var: "--card-foreground", token: "--card-foreground", lhex: "#2D2D2D", dhex: "#F0F0F0", tw: "text-card-foreground" },
                    { name: "Muted", var: "--muted", token: "--muted", lhex: "#F0F0F0", dhex: "#1E1E1E", tw: "bg-muted" },
                    { name: "Muted Foreground", var: "--muted-foreground", token: "--muted-foreground", lhex: "#666666", dhex: "#939393", tw: "text-muted-foreground" },
                    { name: "Border", var: "--border", token: "--border", lhex: "#CBCBCB", dhex: "#404040", tw: "border-border" },
                    { name: "Input", var: "--input", token: "--input", lhex: "#CBCBCB", dhex: "#404040", tw: "border-input" },
                  ].map((c) => (
                    <ColorSwatchLive key={c.token} name={c.name} cssVar={c.var} token={c.token} lightHex={c.lhex} darkHex={c.dhex} twClass={c.tw} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="semantic">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <ColorSwatchLive name="Primary" cssVar="--primary" token="--primary" lightHex="#FFCC00" darkHex="#FFCC00" twClass="bg-primary" />
                  <ColorSwatchLive name="Primary Foreground" cssVar="--primary-foreground" token="--primary-foreground" lightHex="#121212" darkHex="#121212" twClass="text-primary-foreground" />
                  <ColorSwatchLive name="Destructive" cssVar="--destructive" token="--destructive" lightHex="#ED4843" darkHex="#FF6B6B" twClass="bg-destructive" />
                  <ColorSwatchLive name="Ring" cssVar="--ring" token="--ring" lightHex="#FFCC00" darkHex="#FFCC00" twClass="ring-ring" />
                </div>
              </TabsContent>

              <TabsContent value="categorical">
                <div className="space-y-6">
                  {[
                    { name: "Фиолетовый", token: "violet",      lhex: ["#A172F8","#DCC8FF","#FBFAFE"], dhex: ["#B48DFA","#5A3D99","#20143D"] },
                    { name: "Терракот",   token: "terracotta",   lhex: ["#FE733A","#FFD6AD","#FFFAF7"], dhex: ["#FF8A5C","#7A2E10","#2A0F05"] },
                    { name: "Голубой",    token: "sky",          lhex: ["#56CAEA","#C3ECF7","#F7FDFF"], dhex: ["#7AD6EF","#1A5F72","#051A20"] },
                    { name: "Розовый",    token: "pink",         lhex: ["#FF54AC","#FFB8D9","#FFF8FC"], dhex: ["#FF7EC5","#7A1A55","#25061A"] },
                    { name: "Синий",      token: "blue",         lhex: ["#4A56DF","#BFC4F3","#F9FAFF"], dhex: ["#7A84F0","#1E2870","#060A24"] },
                    { name: "Красный",    token: "red",          lhex: ["#ED4843","#FFBCBA","#FFF9F8"], dhex: ["#F47370","#7A1715","#250504"] },
                    { name: "Зелёный",    token: "green",        lhex: ["#9AF576","#D8F4CD","#F7FEF3"], dhex: ["#B5FA97","#2A6E15","#0A2005"] },
                  ].map((c) => (
                    <div key={c.token}>
                      <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">{c.name}</p>
                      <div className="grid grid-cols-3 gap-3">
                        {(["100","50","10"] as const).map((level, i) => (
                          <ColorSwatchLive
                            key={level}
                            name={level}
                            cssVar={`--rm-${c.token}-${level}`}
                            token={`--color-${c.token}-${level}`}
                            lightHex={c.lhex[i]}
                            darkHex={c.dhex[i]}
                            twClass={`bg-[var(--rm-${c.token}-${level})]`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Section>

          <Separator />

          {/* ═══════ 2. TYPOGRAPHY ═══════ */}
          <Section id="typography" title="2. Типография" version={DS_VERSION}>
            <p className="text-muted-foreground mb-8">
              4 шрифта с чёткими ролями. 4 категории стилей: Heading, Label, Copy, Accent. Размерная шкала на золотом сечении (phi = 1.618) от минимального размера 12px.
            </p>

            {/* 2.1 ШРИФТЫ */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              Шрифты
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {[
                {
                  family: "Roboto Condensed",
                  role: "Заголовки (H1–H4)",
                  example: "ЗАГОЛОВОК СТРАНИЦЫ",
                  css: "font-family: 'Roboto Condensed', sans-serif",
                  fontClass: "font-[family-name:var(--font-heading-family)] font-bold uppercase",
                },
                {
                  family: "Roboto Mono",
                  role: "Навигация, кнопки, код",
                  example: "НАВИГАЦИЯ / КНОПКИ",
                  css: "font-family: 'Roboto Mono', monospace",
                  fontClass: "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-wider",
                },
                {
                  family: "Roboto",
                  role: "Основной текст, body",
                  example: "Основной текст для описаний и контента страниц",
                  css: "font-family: 'Roboto', sans-serif",
                  fontClass: "",
                },
                {
                  family: "Shantell Sans",
                  role: "Акцентные подписи, стикеры",
                  example: "Рукописная подпись агента",
                  css: "font-family: 'Shantell Sans', cursive",
                  fontClass: "font-[family-name:var(--font-accent-family)]",
                },
              ].map((f) => (
                <Card key={f.family} className="border border-border">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-[length:var(--text-16)]">{f.family}</CardTitle>
                      <CopyButton value={f.css} label={f.family} />
                    </div>
                    <p className="text-[length:var(--text-12)] text-muted-foreground">{f.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-[length:var(--text-19)] ${f.fontClass}`}>{f.example}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 2.2 ТИПОГРАФИКА */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              Типографика
            </h3>

            <Tabs defaultValue="scale" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="scale">Размерная шкала</TabsTrigger>
                <TabsTrigger value="specimens">Текстовые примеры</TabsTrigger>
              </TabsList>

              {/* SCALE */}
              <TabsContent value="scale">
                <div className="space-y-2">
                  {/* Header row */}
                  <div className="flex items-center gap-4 px-4 pb-2 border-b border-border">
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
                    { label: "Copy-19",      size: "19px", mobileSize: "17px", weight: "400", cls: "leading-[1.5]",                                                                                               tailwind: "text-[length:var(--text-16)] md:text-[length:var(--text-19)]" },
                    { label: "Copy-16",      size: "16px", mobileSize: "16px", weight: "400", cls: "leading-[1.618]",                                                                                             tailwind: "text-[length:var(--text-16)]" },
                    { label: "Copy-14",      size: "14px", mobileSize: "14px", weight: "400", cls: "leading-[1.5] tracking-[0.01em]",                                                                             tailwind: "text-[length:var(--text-14)]" },
                    { label: "Copy-12",      size: "12px", mobileSize: "12px", weight: "400", cls: "leading-[1.4] tracking-[0.02em]",                                                                             tailwind: "text-[length:var(--text-12)]" },
                  ].map((t) => (
                    <div key={t.label} className="flex items-center gap-4 py-3 px-4 rounded-md border border-border hover:bg-accent/30 transition-colors group">
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
                <div className="space-y-3">
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
                      cls: "leading-[1.5]",
                      size: "19px",
                      mobileSize: "17px",
                      letterSpacing: "0",
                      figmaSpacing: "0%",
                      lineHeight: "1.5",
                      figmaLineHeight: "150%",
                      twCopy: "text-[length:var(--text-16)] md:text-[length:var(--text-19)] leading-[1.5]",
                    },
                    {
                      label: "Copy-16",
                      text: "Rocketmind — сервис AI-агентов для ведения кейсов. Подключите нужного агента, опишите задачу и получите результат прямо в чате.",
                      cls: "leading-[1.618]",
                      size: "16px",
                      mobileSize: "16px",
                      letterSpacing: "0",
                      figmaSpacing: "0%",
                      lineHeight: "1.618",
                      figmaLineHeight: "161.8%",
                      twCopy: "text-[length:var(--text-16)] leading-[1.618]",
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
                  ].map((t) => (
                    <div key={t.label} className="flex gap-4 py-4 px-4 rounded-md border border-border hover:bg-accent/30 transition-colors group items-start">
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
                          <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-foreground bg-muted px-1.5 py-0.5 rounded">{t.size}</code>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[length:var(--text-12)] leading-none">📱</span>
                          <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">size</span>
                          <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-foreground bg-muted px-1.5 py-0.5 rounded">{t.mobileSize}</code>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] uppercase tracking-wider">spacing</span>
                          <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-foreground bg-muted px-1.5 py-0.5 rounded">{t.letterSpacing}</code>
                          <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{t.figmaSpacing}</code>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] uppercase tracking-wider">line-h</span>
                          <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-foreground bg-muted px-1.5 py-0.5 rounded">{t.lineHeight}</code>
                          <code className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{t.figmaLineHeight}</code>
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

            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
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

            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
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
                { value: "mobile", label: "Mobile", bp: "< 768px", cols: 4, gutter: 16, margin: 20, tw: "sm:", color: "var(--rm-yellow-100)" },
                { value: "tablet", label: "Tablet", bp: "768–1024px", cols: 8, gutter: 20, margin: 40, tw: "md:", color: "var(--rm-yellow-100)" },
                { value: "desktop", label: "Desktop", bp: "1024–1440px", cols: 12, gutter: 20, margin: 80, tw: "lg:", color: "var(--rm-yellow-100)" },
                { value: "wide", label: "Wide", bp: "> 1440px", cols: 12, gutter: 24, margin: 120, tw: "2xl:", color: "var(--rm-yellow-100)" },
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
                      <div key={s.label} className="flex flex-col gap-0.5 bg-muted rounded-md px-3 py-2 min-w-[90px]">
                        <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground">{s.label}</span>
                        <span className="text-[length:var(--text-14)] font-[family-name:var(--font-mono-family)] font-medium">{s.val}</span>
                      </div>
                    ))}
                    <div className="flex flex-col gap-0.5 bg-muted rounded-md px-3 py-2 min-w-[90px]">
                      <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground">Tailwind</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[length:var(--text-14)] font-[family-name:var(--font-mono-family)] font-medium">{g.tw}</span>
                        <CopyButton value={g.tw} label={`Breakpoint ${g.tw}`} />
                      </div>
                    </div>
                  </div>

                  {/* Visual grid demo — margins as % so columns always fit */}
                  {(() => {
                    const marginPct = g.cols <= 4 ? 5 : g.cols <= 8 ? 6 : 8
                    const gutterPx = Math.max(2, Math.round(g.gutter / 5))
                    return (
                      <div className="border border-border rounded-md overflow-hidden select-none">
                        {/* Margin labels row */}
                        <div className="flex h-6 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/70">
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
                        {/* Columns row */}
                        <div className="flex h-14" style={{ padding: `0 ${marginPct}%`, gap: `${gutterPx}px` }}>
                          {Array.from({ length: g.cols }).map((_, i) => (
                            <div
                              key={i}
                              className="flex-1 flex items-center justify-center rounded-sm text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)]"
                              style={{
                                backgroundColor: `color-mix(in srgb, var(--rm-yellow-100) ${i % 2 === 0 ? "30%" : "15%"}, transparent)`,
                                color: "color-mix(in srgb, var(--rm-yellow-100) 80%, var(--foreground))",
                              }}
                            >
                              {i + 1}
                            </div>
                          ))}
                        </div>
                        {/* Gutter label */}
                        <div className="flex items-center justify-center h-5 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/60">
                          gutter {g.gutter}px
                        </div>
                      </div>
                    )
                  })()}
                </TabsContent>
              ))}
            </Tabs>

            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              Макетные пропорции (phi)
            </h3>
            {/* phi bar aligned to 12-col grid: 5/12 ≈ 41.67% / 7/12 ≈ 58.33% — snaps to column boundary */}
            <div className="rounded-md border border-border overflow-hidden mb-1">
              {/* Grid overlay */}
              <div className="flex h-24" style={{ padding: "0 8%", gap: "3px" }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 flex items-end justify-center pb-1 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)]"
                    style={{
                      backgroundColor: `color-mix(in srgb, var(--rm-yellow-100) ${i % 2 === 0 ? "35%" : "20%"}, transparent)`,
                      color: "color-mix(in srgb, var(--rm-yellow-100) 80%, var(--foreground))",
                    }}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              {/* Labels */}
              <div className="flex h-7 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)]">
                <div className="flex items-center justify-center text-muted-foreground"
                  style={{ width: "calc(8% + (5/12) * 84%)" }}>
                  5 col — 38%
                </div>
                <div className="flex items-center justify-center text-muted-foreground"
                  style={{ width: "calc(8% + (7/12) * 84%)" }}>
                  7 col — 62%
                </div>
              </div>
            </div>
            <p className="text-[length:var(--text-14)] text-muted-foreground">
              Золотое сечение 38/62 — для sidebar/content, text/visual в hero-блоках.
            </p>
          </Section>

          <Separator />

          {/* ═══════ 4. RADIUS & SHADOWS ═══════ */}
          <Section id="radius-shadows" title="4. Скругления" version={DS_VERSION}>
            <p className="text-muted-foreground mb-6">
              <strong>Flat стиль.</strong> Никаких box-shadow. Лёгкое скругление — 3 токена по вложенности и размеру объекта.
              Full только как выделительный элемент в самостоятельных блоках.
            </p>

            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
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

          {/* ═══════ 5. VISUAL LANGUAGE ═══════ */}
          <Section id="visual-language" title="5. Визуальный язык" version={DS_VERSION}>
            <p className="text-muted-foreground mb-6">
              Технологичная архитектура. Сетка как каркас, линии как структура, свет как энергия.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Corner Brackets",
                  desc: "L-образные маркеры в углах блоков. Точность чертежа.",
                  cls: ".bracket",
                },
                {
                  title: "Animated Grid Lines",
                  desc: "Тонкие линии при загрузке hero. stroke-dashoffset, 0.8s, ease-out.",
                  cls: ".grid-lines",
                },
                {
                  title: "Bento Grid",
                  desc: "Нерегулярная мозаика карточек разного размера. 4–6 ячеек.",
                  cls: "grid-cols-[6fr_6fr] / [4fr_8fr]",
                },
                {
                  title: "Connection Graph",
                  desc: "Граф связей агентов. Центральный узел + лучи. SVG, не интерактивный.",
                  cls: "SVG + absolute positioning",
                },
                {
                  title: "Thin Border Cards",
                  desc: "Карточки сливаются с фоном. Граница — намёк, не рамка.",
                  cls: "border border-white/[0.06]",
                },
              ].map((item) => (
                <Card key={item.title} className="border border-border">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-[length:var(--text-16)] font-[family-name:var(--font-heading-family)] uppercase">{item.title}</CardTitle>
                      <CopyButton value={item.cls} label={item.title} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[length:var(--text-14)] text-muted-foreground">{item.desc}</p>
                    <code className="block mt-2 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-[var(--rm-yellow-100)] bg-muted/50 px-2 py-1 rounded">
                      {item.cls}
                    </code>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Corner Brackets Demo */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4 mt-8">
              Corner Brackets — Demo
            </h3>
            <div className="relative p-8 border border-border rounded-md">
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[var(--rm-yellow-100)]" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[var(--rm-yellow-100)]" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[var(--rm-yellow-100)]" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[var(--rm-yellow-100)]" />
              <p className="text-center text-muted-foreground text-[length:var(--text-14)]">
                Блок с угловыми маркерами — технический чертёжный стиль
              </p>
            </div>

            {/* Text-link CTA demo */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4 mt-8">
              Text-link CTA
            </h3>
            <div className="flex items-center gap-6">
              <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-150 group">
                See More <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-1" />
              </span>
              <CopyButton
                value={`font-mono text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground`}
                label="Text-link CTA classes"
              />
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
              <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[0.04em] text-muted-foreground mb-6 pb-2 border-b border-border">Кнопки</h3>
              <div className="space-y-6">
                {/* Primary */}
                <div className="flex flex-wrap items-end gap-4 p-6 rounded-md border border-border">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-[length:var(--text-12)]">PRIMARY</Badge>
                    <div className="flex items-center gap-3">
                      <button className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md bg-[#FFCC00] text-[#121212] font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[#FFE040] cursor-pointer">
                        Попробовать
                      </button>
                      <button className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-[#FFCC00] text-[#121212] font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[#FFE040] cursor-pointer">
                        Начать
                      </button>
                      <button className="inline-flex items-center justify-center gap-2 h-8 px-3 rounded-md bg-[#FFCC00] text-[#121212] font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[#FFE040] cursor-pointer">
                        SM
                      </button>
                    </div>
                  </div>
                  <CopyButton
                    value={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-[#FFCC00] text-[#121212] font-mono text-[length:var(--text-14)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[#FFE040]`}
                    label="Primary Button"
                  />
                </div>

                {/* Secondary */}
                <div className="flex flex-wrap items-end gap-4 p-6 rounded-md border border-border">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-[length:var(--text-12)]">SECONDARY</Badge>
                    <div className="flex items-center gap-3">
                      <button className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md border border-border bg-transparent text-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-accent cursor-pointer">
                        Подробнее
                      </button>
                      <button className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-border bg-transparent text-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-accent cursor-pointer">
                        Узнать
                      </button>
                      <button className="inline-flex items-center justify-center gap-2 h-8 px-3 rounded-md border border-border bg-transparent text-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-accent cursor-pointer">
                        SM
                      </button>
                    </div>
                  </div>
                  <CopyButton
                    value={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-border bg-transparent text-foreground font-mono text-[length:var(--text-14)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-accent`}
                    label="Secondary Button"
                  />
                </div>

                {/* Ghost */}
                <div className="flex flex-wrap items-end gap-4 p-6 rounded-md border border-border">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-[length:var(--text-12)]">GHOST</Badge>
                    <div className="flex items-center gap-3">
                      <button className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-transparent text-muted-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-accent hover:text-foreground cursor-pointer">
                        Ghost
                      </button>
                    </div>
                  </div>
                  <CopyButton
                    value={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-transparent text-muted-foreground font-mono text-[length:var(--text-14)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-accent hover:text-foreground`}
                    label="Ghost Button"
                  />
                </div>

                {/* Destructive */}
                <div className="flex flex-wrap items-end gap-4 p-6 rounded-md border border-border">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-[length:var(--text-12)]">DESTRUCTIVE</Badge>
                    <div className="flex items-center gap-3">
                      <button className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-destructive text-white font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] transition-all duration-150 hover:opacity-90 cursor-pointer">
                        <Trash2 size={14} /> Удалить
                      </button>
                    </div>
                  </div>
                  <CopyButton
                    value={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-destructive text-white font-mono text-[length:var(--text-14)] uppercase tracking-[0.08em]`}
                    label="Destructive Button"
                  />
                </div>

                {/* States */}
                <div className="flex flex-wrap items-end gap-4 p-6 rounded-md border border-border">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-[length:var(--text-12)]">СОСТОЯНИЯ</Badge>
                    <div className="flex items-center gap-3">
                      <button className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-[#FFCC00] text-[#121212] font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] opacity-40 cursor-not-allowed">
                        Disabled
                      </button>
                      <button className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-[#FFCC00] text-[#121212] font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] opacity-80 cursor-wait">
                        <Loader2 size={14} className="animate-spin" /> Loading
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Инпуты ── */}
            <div className="mb-12">
              <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[0.04em] text-muted-foreground mb-6 pb-2 border-b border-border">Инпуты</h3>
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
              <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[0.04em] text-muted-foreground mb-6 pb-2 border-b border-border">Карточки</h3>
              <Tabs defaultValue="cards" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="cards">Каталог карточек</TabsTrigger>
                  <TabsTrigger value="cards-base">Компоненты карточек</TabsTrigger>
                </TabsList>

                {/* CARDS BASE */}
                <TabsContent value="cards-base">
                  <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-2">
                    Варианты бордера карточки
                  </h3>
                  <p className="text-muted-foreground text-[length:var(--text-14)] mb-8">
                    Все карточки используют <code className="px-1 py-0.5 bg-muted rounded-sm text-[length:var(--text-12)]">bg-card</code>, <code className="px-1 py-0.5 bg-muted rounded-sm text-[length:var(--text-12)]">rounded-sm</code> и отличаются только поведением бордера при наведении.
                  </p>

                  {/* Базовая структура */}
                  <div className="mb-10">
                    <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-1">Базовая структура</p>
                    <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Фон, скругление, бордер. Без hover-реакции — для статичных блоков и отзывов.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {["", "", "", ""].map((_, i) => (
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
                    <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Бордер меняется на <code className="px-1 py-0.5 bg-muted rounded-sm text-[length:var(--text-12)]">muted-foreground</code> — приглушённый, ненавязчивый. Используется в большинстве каталожных карточек.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {["", "", "", ""].map((_, i) => (
                        <div key={i} className="h-24 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer" />
                      ))}
                    </div>
                    <p className="mt-3 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground">
                      <code>hover:border-muted-foreground</code>
                    </p>
                    <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground">
                      dark: <code>dark:hover:border-white/[0.12]</code>
                    </p>
                  </div>

                  {/* Yellow hover */}
                  <div className="mb-10">
                    <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-1">Yellow hover</p>
                    <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Жёлтое свечение бордера следует за курсором. Используется для CTA-карточек: партнёрка, выделенные офферы.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {["", "", "", ""].map((_, i) => (
                        <div
                          key={i}
                          className="relative h-24 rounded-sm bg-card cursor-pointer transition-all duration-75 border border-border active:[border:2px_solid_#FFCC00]"
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
                <div className="flex flex-wrap gap-3 mb-8 p-4 rounded-lg border border-border bg-muted/40">
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
                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
                  1. Продукт / Услуга
                </h3>
                {/* S */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">S — Узкая</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="h-36 bg-muted overflow-hidden flex items-center justify-center text-muted-foreground"><Rocket size={28}/></div>
                      <div className="flex flex-col gap-3 p-5">
                        <span className="w-fit px-2 py-0.5 rounded-sm bg-muted font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Курс</span>
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
                    <div key={i} className="flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="h-44 bg-muted overflow-hidden flex items-center justify-center text-muted-foreground"><Rocket size={36}/></div>
                      <div className="flex flex-col gap-4 p-6">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-sm bg-muted font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Курс</span>
                          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">· 12 уроков</span>
                        </div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Название продукта</h4>
                        <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-3">Подробное описание продукта — здесь можно разместить больше текста, поскольку карточка шире.</p>
                        <div className="flex items-center gap-2 text-[#FFCC00]">
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
                    <div key={i} className="flex overflow-hidden rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="w-48 flex-shrink-0 bg-muted flex items-center justify-center text-muted-foreground"><Rocket size={36}/></div>
                      <div className="flex flex-1 flex-col gap-3 p-6">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-sm bg-muted font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Услуга</span>
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
                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
                  2. Эксперт
                </h3>
                {/* S */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">S — Узкая</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer group">
                      <div className="h-40 bg-muted flex items-center justify-center"><User size={36} className="text-muted-foreground"/></div>
                      <div className="flex flex-col gap-3 p-5">
                        <div>
                          <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Иван Петров</h4>
                          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Бизнес-аналитик</span>
                        </div>
                        <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.5] line-clamp-2">10 лет в консалтинге, помог 200+ компаниям.</p>
                        <div className="flex flex-wrap gap-1">
                          {["Стратегия","EdTech"].map(t=><span key={t} className="px-1.5 py-0.5 rounded-sm bg-muted font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">{t}</span>)}
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
                    <div key={i} className="flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer group">
                      <div className="h-52 bg-muted flex items-center justify-center"><User size={48} className="text-muted-foreground"/></div>
                      <div className="flex flex-col gap-4 p-6">
                        <div>
                          <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Иван Петров</h4>
                          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground">Бизнес-аналитик</span>
                        </div>
                        <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-3">10 лет в консалтинге, помог 200+ компаниям выйти на новые рынки. Специализация — стратегия роста.</p>
                        <div className="flex flex-wrap gap-1.5">
                          {["Стратегия","EdTech","SaaS"].map(t=><span key={t} className="px-2 py-0.5 rounded-sm bg-muted font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">{t}</span>)}
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
                    <div key={i} className="flex overflow-hidden rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="w-52 flex-shrink-0 bg-muted flex items-center justify-center"><User size={48} className="text-muted-foreground"/></div>
                      <div className="flex flex-1 items-center gap-8 p-6">
                        <div className="flex flex-col gap-1 w-48 flex-shrink-0">
                          <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Иван Петров</h4>
                          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground">Бизнес-аналитик</span>
                        </div>
                        <p className="flex-1 text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-3">10 лет в консалтинге, помог 200+ компаниям выйти на новые рынки. Специализация — стратегия роста для tech-стартапов.</p>
                        <div className="flex flex-col gap-3 items-end flex-shrink-0">
                          <div className="flex flex-wrap gap-1.5 justify-end">
                            {["Стратегия","EdTech","SaaS"].map(t=><span key={t} className="px-2 py-0.5 rounded-sm bg-muted font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">{t}</span>)}
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
                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
                  3. ИИ-Агент
                </h3>
                {/* S */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">S — Узкая</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex flex-col gap-4 p-5 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="relative w-fit">
                        <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center bg-muted" style={{borderColor:"var(--rm-yellow-50)"}}>
                          <Rocket size={20} className="text-[var(--rm-yellow-100)]"/>
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-card border border-border">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#9AF576]"/>
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
                    <div key={i} className="flex flex-col gap-5 p-6 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center bg-muted" style={{borderColor:"var(--rm-yellow-50)"}}>
                            <Rocket size={28} className="text-[var(--rm-yellow-100)]"/>
                          </div>
                          <span className="absolute bottom-0.5 right-0.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-card border border-border">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#9AF576]"/>
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
                    <div key={i} className="flex items-center gap-6 p-6 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center bg-muted" style={{borderColor:"var(--rm-yellow-50)"}}>
                          <Rocket size={28} className="text-[var(--rm-yellow-100)]"/>
                        </div>
                        <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-[#9AF576] border-2 border-card"/>
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
                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
                  4. Отзыв
                </h3>
                {/* S */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">S — Узкая</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex flex-col gap-4 p-5 rounded-sm border border-border bg-card dark:border-white/[0.06]">
                      <div className="flex gap-0.5 text-[#FFCC00]">{"★★★★★".split("").map((s,j)=><span key={j} className="text-[length:var(--text-14)]">{s}</span>)}</div>
                      <blockquote className="text-[length:var(--text-14)] italic leading-[1.5] text-foreground line-clamp-4">«Агент помог за 2 дня разобраться в структуре рынка, на что раньше уходило 2 недели.»</blockquote>
                      <div className="flex items-center gap-2.5 pt-3 border-t border-border mt-auto">
                        <div className="w-8 h-8 rounded-full bg-muted border border-border flex-shrink-0 flex items-center justify-center text-muted-foreground"><User size={14}/></div>
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
                      <div className="flex gap-0.5 text-[#FFCC00]">{"★★★★★".split("").map((s,j)=><span key={j} className="text-[length:var(--text-16)]">{s}</span>)}</div>
                      <blockquote className="text-[length:var(--text-16)] italic leading-[1.618] text-foreground">«Агент помог мне за 2 дня разобраться в структуре рынка, на что раньше уходило целых 2 недели работы аналитика.»</blockquote>
                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <div className="w-10 h-10 rounded-full bg-muted border border-border flex-shrink-0 flex items-center justify-center text-muted-foreground"><User size={16}/></div>
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
                        <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground"><User size={24}/></div>
                        <div className="text-center">
                          <div className="text-[length:var(--text-14)] font-medium">Анна Смирнова</div>
                          <div className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">CEO, TechStartup</div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-0.5 text-[#FFCC00]">{"★★★★★".split("").map((s,j)=><span key={j} className="text-[length:var(--text-16)]">{s}</span>)}</div>
                          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Март 2026</span>
                        </div>
                        <blockquote className="text-[length:var(--text-16)] italic leading-[1.618] text-foreground">«Агент помог мне за 2 дня разобраться в структуре рынка, на что раньше уходило целых 2 недели работы аналитика. Результат превзошёл ожидания.»</blockquote>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ════════ 5. КЕЙС ════════ */}
                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
                  5. Кейс
                </h3>
                {/* S */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">S — Узкая</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex flex-col gap-3 p-5 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]"
                          style={{backgroundColor:"rgba(154,245,118,0.15)",color:"#9AF576"}}>Активен</span>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">@maks</span>
                      </div>
                      <div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em] line-clamp-2">Анализ рынка EdTech</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">2 часа назад</span>
                      </div>
                      <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.5] line-clamp-2">Агент завершил анализ конкурентов...</p>
                      <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                        <div className="w-5 h-5 rounded-full bg-muted border border-border"/>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">3 сообщ.</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* M */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">M — Широкая</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[1,2].map(i => (
                    <div key={i} className="flex flex-col gap-4 p-6 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]"
                          style={{backgroundColor:"rgba(154,245,118,0.15)",color:"#9AF576"}}>Активен</span>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">@maks</span>
                      </div>
                      <div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Анализ рынка EdTech</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Обновлён 2 часа назад</span>
                      </div>
                      <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-2">Агент завершил анализ конкурентов и подготовил сводный отчёт по основным игрокам рынка.</p>
                      <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-muted border border-border"/>
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
                    <div key={i} className="flex items-center gap-6 p-6 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="flex flex-col gap-1 w-40 flex-shrink-0">
                        <span className="px-2 py-0.5 rounded-sm w-fit font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]"
                          style={{backgroundColor:"rgba(154,245,118,0.15)",color:"#9AF576"}}>Активен</span>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mt-1">2 часа назад</span>
                      </div>
                      <div className="flex flex-col gap-1 w-56 flex-shrink-0">
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Анализ рынка EdTech</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">@maks</span>
                      </div>
                      <p className="flex-1 text-[length:var(--text-14)] text-muted-foreground leading-[1.5] line-clamp-2">Агент завершил анализ конкурентов и подготовил сводный отчёт по основным игрокам рынка EdTech за 2025–2026 год.</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-muted border border-border"/>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">3 сообщ.</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ════════ 6. КУРС ════════ */}
                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
                  6. Курс
                </h3>
                {/* S */}
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground mb-2">S — Узкая</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="relative h-32 bg-muted flex items-center justify-center">
                        <GraduationCap size={28} className="text-muted-foreground"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent"/>
                      </div>
                      <div className="flex flex-col gap-2.5 p-5">
                        <div className="flex gap-1.5">
                          <span className="px-1.5 py-0.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]"
                            style={{backgroundColor:"rgba(86,202,234,0.15)",color:"#56CAEA"}}>Начинающий</span>
                          <span className="px-1.5 py-0.5 rounded-sm bg-muted font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Видео</span>
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
                    <div key={i} className="flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="relative h-44 bg-muted flex items-center justify-center">
                        <GraduationCap size={40} className="text-muted-foreground"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent"/>
                      </div>
                      <div className="flex flex-col gap-4 p-6">
                        <div className="flex gap-2">
                          <span className="px-2 py-0.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]"
                            style={{backgroundColor:"rgba(86,202,234,0.15)",color:"#56CAEA"}}>Начинающий</span>
                          <span className="px-2 py-0.5 rounded-sm bg-muted font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Видео</span>
                        </div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Маркетинг для стартапов</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground">Иван Петров · 12 уроков</span>
                        <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-2">Практический курс по привлечению первых клиентов без большого бюджета.</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[#FFCC00]">★</span>
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
                    <div key={i} className="flex overflow-hidden rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="w-52 flex-shrink-0 bg-muted flex items-center justify-center relative">
                        <GraduationCap size={40} className="text-muted-foreground"/>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20"/>
                      </div>
                      <div className="flex flex-1 items-center gap-6 p-6">
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="flex gap-2">
                            <span className="px-2 py-0.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]"
                              style={{backgroundColor:"rgba(86,202,234,0.15)",color:"#56CAEA"}}>Начинающий</span>
                            <span className="px-2 py-0.5 rounded-sm bg-muted font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Видео</span>
                          </div>
                          <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Маркетинг для стартапов</h4>
                          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground">Иван Петров · 12 уроков</span>
                          <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.5] line-clamp-2">Практический курс по привлечению первых клиентов без большого бюджета.</p>
                          <div className="flex items-center gap-1">
                            <span className="text-[#FFCC00] text-[length:var(--text-14)]">★</span>
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
                    <div key={i} className="flex flex-col gap-3 p-5 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="w-10 h-10 rounded-sm border border-border bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                        <Wrench size={18}/>
                      </div>
                      <div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Notion</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">База знаний</span>
                      </div>
                      <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.5] line-clamp-2">Синхронизирует кейсы с базой знаний автоматически.</p>
                      <span className="w-fit px-1.5 py-0.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]"
                        style={{backgroundColor:"rgba(74,86,223,0.15)",color:"#4A56DF"}}>Webhook</span>
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
                    <div key={i} className="flex flex-col gap-4 p-6 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="w-12 h-12 rounded-sm border border-border bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                        <Wrench size={22}/>
                      </div>
                      <div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Notion</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground">База знаний</span>
                      </div>
                      <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-2">Синхронизирует кейсы с вашей базой знаний Notion автоматически через n8n.</p>
                      <span className="w-fit px-2 py-0.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]"
                        style={{backgroundColor:"rgba(74,86,223,0.15)",color:"#4A56DF"}}>Webhook</span>
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
                    <div key={i} className="flex items-center gap-6 p-6 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="w-14 h-14 rounded-sm border border-border bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                        <Wrench size={24}/>
                      </div>
                      <div className="flex flex-col gap-0.5 w-40 flex-shrink-0">
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Notion</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground">База знаний</span>
                      </div>
                      <p className="flex-1 text-[length:var(--text-16)] text-muted-foreground leading-[1.618] line-clamp-2">Синхронизирует кейсы с вашей базой знаний Notion автоматически через n8n вебхуки.</p>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="px-2 py-0.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]"
                          style={{backgroundColor:"rgba(74,86,223,0.15)",color:"#4A56DF"}}>Webhook</span>
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
                    <div key={i} className="flex flex-col gap-3 p-5 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{backgroundColor:"rgba(255,204,0,0.15)"}}>
                        <Gem size={18} className="text-[#FFCC00]"/>
                      </div>
                      <div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Реферальная</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">До 30% · Пожизненно</span>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <span className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-25)] uppercase tracking-tight leading-none text-[#FFCC00]">30%</span>
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
                    <div key={i} className="flex flex-col gap-4 p-6 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{backgroundColor:"rgba(255,204,0,0.15)"}}>
                        <Gem size={22} className="text-[#FFCC00]"/>
                      </div>
                      <div>
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Реферальная программа</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground">Доход: до 30% · Пожизненно</span>
                      </div>
                      <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618]">Приглашайте клиентов и получайте процент от каждой их оплаты навсегда.</p>
                      <div className="flex flex-col gap-0.5 pt-3 border-t border-border">
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Комиссия</span>
                        <span className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-25)] uppercase tracking-tight leading-none text-[#FFCC00]">30%</span>
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
                    <div key={i} className="flex items-center gap-6 p-6 rounded-sm border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] cursor-pointer">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{backgroundColor:"rgba(255,204,0,0.15)"}}>
                        <Gem size={24} className="text-[#FFCC00]"/>
                      </div>
                      <div className="flex flex-col gap-0.5 w-48 flex-shrink-0">
                        <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] uppercase tracking-[-0.005em]">Реферальная программа</h4>
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground">Пожизненно</span>
                      </div>
                      <p className="flex-1 text-[length:var(--text-16)] text-muted-foreground leading-[1.618]">Приглашайте клиентов и получайте процент от каждой их оплаты навсегда. Без ограничений по времени.</p>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Комиссия</span>
                        <span className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-31)] uppercase tracking-tight leading-none text-[#FFCC00]">30%</span>
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

          {/* ═══════ 7. ICONS ═══════ */}
          <Section id="icons" title="7. Иконки" version={DS_VERSION}>
            <p className="text-muted-foreground mb-6">
              Основная библиотека — <strong>Lucide Icons</strong>. Outline, 24px viewbox, stroke 1.5px.
              Цвет наследуется через currentColor.
            </p>

            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
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

            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
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
                <div key={item.name} className="flex flex-col items-center gap-1.5 p-3 rounded-md border border-border hover:bg-accent transition-colors cursor-pointer group">
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

            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4 mt-8">
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
                background: linear-gradient(90deg, var(--muted) 0%, color-mix(in srgb, var(--muted) 80%, white) 50%, var(--muted) 100%);
                background-size: 200% 100%;
                animation: shimmer-anim 1.5s ease-in-out infinite;
                border-radius: var(--radius);
              }
            `}</style>

            {/* Принципы */}
            <p className="text-muted-foreground mb-6">
              Motion в Rocketmind — <strong>функциональный, не декоративный</strong>. Каждая анимация решает задачу: подтверждает действие, указывает направление, сообщает о смене состояния.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { num: "01", title: "Минимализм", desc: "Анимировать только то, что несёт смысл. Без декора ради декора." },
                { num: "02", title: "Скорость", desc: "100–300ms. Длинные анимации раздражают и замедляют восприятие." },
                { num: "03", title: "Единообразие", desc: "Одни и те же easing-кривые и длительности по всей системе." },
              ].map((p) => (
                <div key={p.num} className="p-5 rounded-md border border-border bg-card">
                  <div className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground mb-1">{p.num}</div>
                  <div className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-16)] uppercase tracking-tight mb-2">{p.title}</div>
                  <div className="text-[length:var(--text-14)] text-muted-foreground leading-relaxed">{p.desc}</div>
                </div>
              ))}
            </div>

            {/* 8.2 Timing */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-2">
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
                { token: "--duration-grid",    ms: 800, desc: "Animated Grid Lines — единственная длинная анимация" },
              ].map((t) => (
                <TimingRow key={t.token} token={t.token} ms={t.ms} desc={t.desc} />
              ))}
            </div>

            {/* 8.3 Easing */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-2">
              8.3 Easing-кривые
            </h3>
            <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Нажми «Play», чтобы увидеть как шарик движется с данной кривой.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <EasingDemo token="--ease-standard"  curve="cubic-bezier(0.4, 0, 0.2, 1)"       desc="Hover, focus, active — большинство переходов" />
              <EasingDemo token="--ease-enter"     curve="cubic-bezier(0, 0, 0.2, 1)"         desc="Появление элементов (модал, дропдаун, toast)" />
              <EasingDemo token="--ease-exit"      curve="cubic-bezier(0.4, 0, 1, 1)"         desc="Исчезновение элементов (закрытие, скрытие)" />
              <EasingDemo token="--ease-spring"    curve="cubic-bezier(0.34, 1.56, 0.64, 1)"  desc="Hover scale на карточках — небольшой перелёт" />
            </div>

            {/* 8.4 Микроинтерактивы */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-2">
              8.4 Микроинтерактивы
            </h3>
            <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Наведи курсор на каждый элемент.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">

              <AnimDemoCard label="Button hover" desc="Primary button: hover меняет цвет. 100ms ease-standard.">
                <button
                  className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md bg-[#FFCC00] text-[#121212] font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] cursor-pointer select-none"
                  style={{ transition: "background-color 100ms cubic-bezier(0.4,0,0.2,1)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FFE040" }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#FFCC00" }}
                >
                  Hover me
                </button>
              </AnimDemoCard>

              <AnimDemoCard label="Ghost button hover" desc="Ghost button: hover заполняет фон muted. 100ms ease-standard.">
                <button
                  className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md border border-border text-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] cursor-pointer select-none"
                  style={{ transition: "background-color 100ms cubic-bezier(0.4,0,0.2,1)", backgroundColor: "transparent" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--muted)" }}
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
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#FFCC00" }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)" }}
                />
              </AnimDemoCard>

              <AnimDemoCard label="Agent card hover" desc="Карточка агента: hover меняет border на фиолетовый. 200ms ease-spring.">
                <div
                  className="w-full p-4 rounded-md border bg-card cursor-pointer"
                  style={{ borderColor: "var(--border)", transition: "border-color 200ms cubic-bezier(0.34,1.56,0.64,1)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#A172F8" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#A172F8]/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#A172F8]" />
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
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--muted)" }}
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
                    <span className="px-3 py-1 rounded bg-[#FFCC00] text-[#121212] text-[length:var(--text-12)] font-medium">Да</span>
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
                <div className="w-full px-3 py-2 rounded-xl rounded-tl-none bg-muted border border-border/50">
                  <p className="text-[length:var(--text-12)] text-muted-foreground mb-0.5">AI-агент</p>
                  <p className="text-[length:var(--text-12)]">Привет! Чем могу помочь?</p>
                </div>
              </ToggleAnimCard>
            </div>

            {/* 8.6 Loading */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-2">
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
                  <div className="w-8 h-8 rounded-full bg-[#A172F8]/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-[#A172F8]" />
                  </div>
                  <div className="px-4 py-2.5 rounded-xl rounded-tl-none bg-muted flex gap-1.5 items-center">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                        style={{ animation: "typing-pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-[length:var(--text-12)] text-muted-foreground">агент печатает...</span>
                </div>
              </AnimDemoCard>
            </div>

            {/* 8.7 Page-level */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              8.7 Page-level правила
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <Card className="border border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[length:var(--text-16)] text-green-600 dark:text-green-400">✓ Допустимо</CardTitle>
                </CardHeader>
                <CardContent className="text-[length:var(--text-14)] text-muted-foreground space-y-1.5">
                  <p>Fade-in hero-контента: opacity 0→1, 400ms, ease-enter</p>
                  <p>Grid Lines reveal при загрузке (800ms)</p>
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
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
              8.8 Доступность (Reduced Motion)
            </h3>
            <div className="p-4 rounded-md border border-border bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[length:var(--text-14)] font-medium">prefers-reduced-motion: reduce</p>
                <CopyButton
                  value={`@media (prefers-reduced-motion: reduce) {\n  *,\n  *::before,\n  *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n    scroll-behavior: auto !important;\n  }\n}`}
                  label="Reduced Motion CSS"
                />
              </div>
              <p className="text-[length:var(--text-14)] text-muted-foreground">
                Все анимации обязаны уважать системные настройки. Исключение — typing-indicator: заменяется на статичный <code className="text-[length:var(--text-12)] bg-muted px-1 py-0.5 rounded font-[family-name:var(--font-mono-family)]">•••</code>.
              </p>
            </div>
          </Section>

          <Separator />

          {/* ═══════ 10. TOOLTIPS ═══════ */}
          <Section id="tooltips" title="10. Тултипы" version={DS_VERSION}>
            <p className="text-muted-foreground mb-6">
              Контекстные подсказки при наведении. Появляются поверх контента через <code className="text-[length:var(--text-12)] bg-muted px-1 py-0.5 rounded font-[family-name:var(--font-mono-family)]">position: fixed</code>, не обрезаются родителем. Анимация: 120ms ease-out, fade + translateY.
            </p>

            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
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

            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4">
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

          {/* ───── DOT GRID LENS ───── */}
          <Section id="dot-grid" title="11. Точечная сетка" version={DS_VERSION}>
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
            <div className="p-4 rounded-md border border-border bg-muted/30 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground space-y-1">
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
                  <tr className="border-b border-border bg-muted/30">
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
            <div className="mt-6 p-4 rounded-md border border-border bg-muted/30">
              <p className="text-[length:var(--text-14)] font-medium mb-1">Доступность & Touch</p>
              <p className="text-[length:var(--text-14)] text-muted-foreground">
                На touch-устройствах (<code className="text-[length:var(--text-12)] bg-muted px-1 py-0.5 rounded">pointer: coarse</code>) линза отключается — сетка остаётся статичным декором.
                При <code className="text-[length:var(--text-12)] bg-muted px-1 py-0.5 rounded">prefers-reduced-motion: reduce</code> анимация останавливается, сетка отрисовывается один раз.
              </p>
            </div>
          </Section>

          <Separator />

          {/* ───── VERSION HISTORY ───── */}
          <section id="version-history" className="scroll-mt-20 pb-16">
            <h2 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-50)] uppercase tracking-[-0.01em] leading-[1.2] mb-6">
              История версий
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-md border border-border">
                <Badge className="bg-[var(--rm-yellow-100)] text-[#121212] text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] hover:bg-[var(--rm-yellow-100)] shrink-0 h-5">
                  v{DS_VERSION}
                </Badge>
                <div>
                  <p className="text-[length:var(--text-14)] font-medium">2026-03-10 — Dot Grid Lens</p>
                  <p className="text-[length:var(--text-14)] text-muted-foreground mt-1">
                    Добавлен раздел 9: Dot Grid Lens — фоновый эффект линзы на сетке точек.
                    Токены, алгоритм, live demo (монохромный / акцентный), таблица применения.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-md border border-border">
                <Badge variant="outline" className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] hover:bg-transparent shrink-0 h-5">
                  v1.0.0
                </Badge>
                <div>
                  <p className="text-[length:var(--text-14)] font-medium">2026-03-09 — Начальная версия</p>
                  <p className="text-[length:var(--text-14)] text-muted-foreground mt-1">
                    Полная дизайн-система: цвета, типография, spacing, radius, visual language, компоненты, иконки, анимации.
                    Поддержка light/dark тем. 8 секций документации.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-border pt-6 pb-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <img src="/icon_dark_background.svg" alt="Rocketmind" className="h-5 w-auto hidden dark:block" />
                <img src="/icon_light_background.svg" alt="Rocketmind" className="h-5 w-auto dark:hidden" />
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
