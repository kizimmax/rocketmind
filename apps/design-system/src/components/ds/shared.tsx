"use client"

import React, { useState, useRef } from "react"
import { Badge } from "@rocketmind/ui"
import { CopyButton } from "@/components/copy-button"
import { TokenChip } from "@/components/ds/color-helpers"
import { ArrowRight, ChevronDown, ChevronRight } from "lucide-react"
import { Accordion } from "@base-ui/react"

/* ───────── SECTION WRAPPER ───────── */
export function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-6">
        <h2 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-30)] md:text-[length:var(--text-52)] uppercase tracking-[-0.015em] leading-[1.05]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

/* ───────── SUBSECTION (H3 — top-level within a Section) ───────── */
export function SubSection({
  id,
  title,
  first,
}: {
  id?: string
  title: string
  first?: boolean
}) {
  return (
    <>
      {!first && <div className="-mx-5 md:-mx-10 h-px bg-border mt-10 mb-8" />}
      <h3
        id={id}
        className={`${id ? "scroll-mt-20 " : ""}font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] md:text-[length:var(--text-32)] uppercase tracking-[-0.01em] mb-4`}
      >
        {title}
      </h3>
    </>
  )
}

/* ───────── SUB-SUBSECTION (H4 — nested within a SubSection) ───────── */
export function SubSubSection({
  id,
  title,
}: {
  id?: string
  title: string
}) {
  return (
    <h4
      id={id}
      className={`${id ? "scroll-mt-20 " : ""}font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-18)] md:text-[length:var(--text-24)] uppercase tracking-[-0.01em] mb-4`}
    >
      {title}
    </h4>
  )
}

/* ───────── SPEC BLOCK (collapsible details) ───────── */
export function SpecBlock({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <details className="group border border-border rounded-lg mb-8 [&_summary]:list-none [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 select-none">
        <ChevronRight size={14} className="text-muted-foreground transition-transform duration-150 group-open:rotate-90" />
        <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground">
          {title}
        </span>
      </summary>
      <div className="px-4 pb-4 pt-0">
        {children}
      </div>
    </details>
  )
}

/* ───────── TOKEN ROW ───────── */
export function TokenRow({
  token,
  value,
  desc,
}: {
  token: string
  value: string
  desc: string
}) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-sm hover:bg-rm-gray-3/50 transition-colors group">
      <TokenChip className="min-w-[180px]">
        {token}
      </TokenChip>
      <span className="ds-token-caption text-muted-foreground min-w-[100px]">
        {value}
      </span>
      <span className="ds-token-copy flex-1">{desc}</span>
      <CopyButton value={token} label={token} />
    </div>
  )
}

/* ───────── TIMING ROW WITH BAR ───────── */
export function TimingRow({ token, ms, desc }: { token: string; ms: number; desc: string }) {
  const maxMs = 1600
  const width = Math.round((ms / maxMs) * 100)
  return (
    <div className="py-2.5 px-3 rounded-sm hover:bg-rm-gray-3/50 transition-colors group">
      <div className="flex items-center gap-3 mb-1.5">
        <TokenChip className="min-w-[200px]">
          {token}
        </TokenChip>
        <span className="ds-token-caption text-muted-foreground min-w-[50px]">{ms}ms</span>
        <span className="ds-token-copy flex-1">{desc}</span>
        <CopyButton value={token} label={token} />
      </div>
      <div className="h-1.5 bg-rm-gray-2 rounded-full overflow-hidden ml-3">
        <div className="h-full rounded-full bg-[var(--rm-yellow-100)]" style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

/* ───────── EASING DEMO ───────── */
export function EasingDemo({ token, curve, desc }: { token: string; curve: string; desc: string }) {
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
          <code className="text-[length:var(--text-12)] font-[family-name:var(--font-caption-family)] text-foreground bg-rm-gray-2 px-1.5 py-0.5 rounded">{token}</code>
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
      <div className="h-8 bg-rm-gray-2/50 rounded-sm relative overflow-hidden flex items-center px-2">
        <div ref={ballRef} className="w-4 h-4 rounded-full bg-[var(--rm-yellow-100)] shrink-0" style={{ transform: "translateX(0)" }} />
      </div>
      <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground/60 mt-2 truncate">{curve}</p>
    </div>
  )
}

/* ───────── ANIMATION DEMO CARD ───────── */
export function AnimDemoCard({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-lg border border-border bg-card flex flex-col gap-3">
      <div>
        <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-foreground font-medium">{label}</p>
        <p className="text-[length:var(--text-12)] text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
      </div>
      <div className="flex-1 flex items-center justify-center">{children}</div>
    </div>
  )
}

/* ───────── TOGGLE ANIM CARD (screen transitions) ───────── */
export function ToggleAnimCard({
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
    <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-3">
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

/* ───────── RADIUS TOKEN CARD ───────── */
export function RadiusTokenCard({
  label,
  value,
  token,
  tailwind,
  usage,
  note,
  children,
}: {
  label: string
  value: string
  token: string
  tailwind: string
  usage: string
  note: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant="outline" className="px-2 py-0">{label}</Badge>
          <span className="text-[length:var(--text-14)] font-[family-name:var(--font-mono-family)] font-medium">{value}</span>
        </div>
        <p className="text-[length:var(--text-12)] text-muted-foreground">{usage}</p>
      </div>

      <div className="p-4 bg-rm-gray-2/20">
        {children}
      </div>

      <div className="border-t border-border px-4 py-3 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground font-[family-name:var(--font-mono-family)]">Token</span>
          <TokenChip>{token}</TokenChip>
          <CopyButton value={token} label={`Токен: ${token}`} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground font-[family-name:var(--font-mono-family)]">Tailwind</span>
          <TokenChip>{tailwind}</TokenChip>
          <CopyButton value={tailwind} label={`Tailwind: ${tailwind}`} />
        </div>
        <p className="text-[length:var(--text-12)] text-muted-foreground">{note}</p>
      </div>
    </div>
  )
}

/* ───────── LINK CTA DEMO ───────── */
export function LinkCTADemo() {
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

/* ═══════════════════════════════════ ACCORDION 05 ═══════════════════════════════════ */
const accordion05Items = [
  { id: "1", q: "Что такое Rocketmind?", a: "Rocketmind — SaaS-платформа с готовыми AI-агентами для ведения кейсов. Каждый агент специализируется на конкретной задаче: анализ, стратегия, исследование рынка, тестирование гипотез." },
  { id: "2", q: "Как начать работу?", a: "Перейдите по ссылке /a/{agent_slug}, введите email — и сразу начинайте диалог. Никаких долгих регистраций и настроек." },
  { id: "3", q: "Что умеют агенты?", a: "Агенты ведут структурированный диалог, задают уточняющие вопросы и в конце формируют готовый результат: отчёт, стратегию или ссылку на следующий шаг." },
  { id: "4", q: "Безопасны ли мои данные?", a: "Все данные зашифрованы и хранятся изолированно. Агент видит только историю вашего конкретного кейса — ничего больше." },
  { id: "5", q: "Какие тарифы?", a: "Первый кейс — бесплатно. Далее подписка от 990 ₽/мес, включает неограниченные диалоги с выбранными агентами." },
]

export function Accordion05Demo() {
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
                <span className="font-[family-name:var(--font-heading-family)] font-bold uppercase text-3xl md:text-[length:var(--text-52)] leading-none tracking-[-0.02em]">
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

/* ───────── TOOLTIP DEMO ───────── */
export function TooltipDemo({ label, content }: { label: string; content: React.ReactNode }) {
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
        className="px-3 py-1.5 rounded-sm border border-border text-[length:var(--text-12)] text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
      >
        {label}
      </button>
      {pos && (
        <div
          className="tooltip-enter fixed z-50 pointer-events-none"
          style={{ top: pos.top, left: pos.left, transform: "translateX(-50%)" }}
        >
          <div className="rounded-sm border border-border bg-popover shadow-xl p-3 w-48 text-[length:var(--text-12)] leading-relaxed">
            {content}
          </div>
        </div>
      )}
    </>
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
    version: "1.5.6",
    date: "2026-03-18",
    title: "Tables for DS Web",
    current: true,
    added: [
      "В раздел «Компоненты» добавлен новый подраздел Таблицы с инструкцией и живыми примерами",
      "Зафиксированы основные паттерны таблиц: basic, striped, bordered, interactive, operational и large dataset",
      "Добавлен showcase для базовой, striped, bordered, interactive и operational-таблиц на токенах Rocketmind",
    ],
    improved: [
      "Virtualized table адаптирован как large dataset pattern: визуально без нового стиля, с progressive reveal через `Show more`",
      "Документация синхронизирована между `design-system.md` и `design-system-docs`",
    ],
  },
  {
    version: "1.5.5",
    date: "2026-03-18",
    title: "Checkbox + Radio for DS Web",
    added: [
      "В раздел «Компоненты» добавлены новые подразделы Чекбоксы и Радио с инструкцией и живыми примерами",
      "Зафиксированы состояния checkbox: default, disabled, disabled checked, disabled indeterminate, indeterminate",
      "Зафиксированы сценарии radio: default, disabled, required, headless, standalone",
      "Добавлены UI-примитивы Checkbox и Radio на токенах Rocketmind для дальнейшего переиспользования",
    ],
    improved: [
      "Семантика сведена к operational-набору Rocketmind без лишних декоративных вариантов",
      "Документация синхронизирована между `design-system.md` и `design-system-docs`",
    ],
  },
  {
    version: "1.5.3",
    date: "2026-03-18",
    title: "Textarea for DS Web",
    added: [
      "В раздел «Компоненты» добавлен новый подраздел Textarea с инструкцией и живыми примерами",
      "Зафиксированы состояния Textarea: default, disabled и error",
      "Добавлен UI-примитив Textarea с вариантами `default` и `chat` на токенах Rocketmind",
    ],
    improved: [
      "Multiline-поле вынесено из частного примера внутри Inputs в отдельный компонентный паттерн",
      "Документация синхронизирована между `design-system.md` и `design-system-docs`",
    ],
  },
  {
    version: "1.5.1",
    date: "2026-03-17",
    title: "Roboto Mono for Caption & Code",
    added: [
      "В раздел «Шрифты» добавлен Roboto Mono как отдельная гарнитура для caption и code",
      "В подраздел «Типографика» добавлены отдельные начертания Caption-14 и Code-14",
    ],
    improved: [
      "Все code-элементы на странице используют Roboto Mono через глобальное правило",
      "Caption-стили на странице дизайн-системы приведены к Roboto Mono Regular без изменения label/navigation/button-паттернов",
    ],
  },
  {
    version: "1.5.0",
    date: "2026-03-17",
    title: "Loos Condensed & Badge System Cleanup",
    added: [
      "Полный summary версии 1.5.0 добавлен в конец страницы дизайн-системы",
      "Сайдбарный бейдж версии приведён к общему стилю Badge-компонента",
    ],
    improved: [
      "Шрифт label-типографики переключён с Roboto Mono на Loos Condensed",
      "Токен --font-mono-family теперь используется консистентно в кнопках, навигации, тегах и badge",
      "Badge-система упрощена: neutral + цветные subtle-варианты без отдельного solid-набора",
    ],
    removed: [
      "Бейдж версии из шапки страницы",
      "Бейджи версии у заголовков всех разделов дизайн-системы",
    ],
  },
  {
    version: "1.4.0",
    date: "2026-03-16",
    title: "Typography Refactor & Sidebar Accordion",
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

export function VersionHistory({ compact = false }: { compact?: boolean }) {
  const [openVersions, setOpenVersions] = React.useState<string[]>(["1.5.0"])

  function toggle(version: string) {
    setOpenVersions(prev =>
      prev.includes(version) ? prev.filter(v => v !== version) : [...prev, version]
    )
  }

  return (
    <div className={compact ? "" : "scroll-mt-20 pb-16"}>
      {!compact && (
        <h2 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-52)] uppercase tracking-[-0.01em] leading-[1.2] mb-6">
          История версий
        </h2>
      )}
      <div className="space-y-2">
        {VERSION_HISTORY.map((entry) => {
          const isOpen = openVersions.includes(entry.version)
          return (
            <div key={entry.version} className="rounded-lg border border-border overflow-hidden">
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
    </div>
  )
}
