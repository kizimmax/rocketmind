"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { VersionHistory } from "@/components/ds/shared"
import { Badge } from "@rocketmind/ui"
import { useTheme } from "next-themes"
import {
  ChevronRight, Menu, X, PanelLeftOpen, PanelLeftClose,
  Layers, Palette, Type, LayoutGrid, Square, Package,
  MessageSquare, Sparkles, Zap, LayoutDashboard, LayoutTemplate, FileText,
  Home,
  Sun, Moon,
} from "lucide-react"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ""
const DS_VERSION = "1.5.7"
const DS_DATE = "2026-03-26"

/** Compact rail width (px) — icon-only column always visible */
const RAIL_W = 48
/** Full sidebar width (px) — on hover-overlay or pinned */
const FULL_W = 220

type SubSection = { id: string; label: string }
type NavSection = {
  id: string
  label: string
  subsections: SubSection[]
  Icon: React.ComponentType<{ size?: number; className?: string }>
}

const sections: NavSection[] = [
  { id: "introduction", label: "Интро",         subsections: [], Icon: Home },
  { id: "guidebook", label: "ДС Гайдбук",      subsections: [], Icon: FileText },
  { id: "logos",    label: "Логотипы",        subsections: [], Icon: Layers },
  { id: "colors",   label: "Цвета",           Icon: Palette, subsections: [
    { id: "colors-bg",       label: "Фоны" },
    { id: "colors-gray",     label: "Серая шкала" },
    { id: "colors-accent",   label: "Акцентная" },
    { id: "colors-inverted", label: "Инвертированные" },
  ]},
  { id: "typography", label: "Типография",    Icon: Type, subsections: [
    { id: "typography-fonts", label: "Шрифты" },
    { id: "typography-scale", label: "Типографика" },
  ]},
  { id: "spacing", label: "Спейсинг и сетка", Icon: LayoutGrid, subsections: [
    { id: "spacing-scale",  label: "Шкала отступов" },
    { id: "spacing-grid",   label: "Сетка страницы" },
    { id: "spacing-phi",    label: "Пропорции (phi)" },
    { id: "spacing-visual", label: "Визуальный стиль" },
  ]},
  { id: "radius-shadows", label: "Скругления", Icon: Square, subsections: [
    { id: "radius-scale", label: "Border Radius" },
  ]},
  { id: "components", label: "Компоненты",    Icon: Package, subsections: [
    { id: "components-buttons",    label: "Кнопки" },
    { id: "components-badges",     label: "Бейджи" },
    { id: "components-tabs",       label: "Табы" },
    { id: "components-checkboxes", label: "Чекбоксы" },
    { id: "components-radio",      label: "Радио" },
    { id: "components-switch",     label: "Тумблер" },
    { id: "components-notes",      label: "Примечания / Notes" },
    { id: "components-tables",     label: "Таблицы" },
    { id: "components-inputs",     label: "Инпуты" },
    { id: "components-textarea",   label: "Textarea" },
    { id: "components-search",     label: "Поиск / Combobox" },
    { id: "components-cards",      label: "Карточки" },
    { id: "components-avatar",     label: "Аватар" },
    { id: "components-dialog",     label: "Диалог" },
    { id: "components-dropdown",   label: "Dropdown Menu" },
    { id: "components-separator",  label: "Разделитель" },
    { id: "components-skeleton",   label: "Skeleton" },
    { id: "components-scroll-area",label: "Scroll Area" },
    { id: "components-toasts",     label: "Toasts" },
    { id: "components-show-more",  label: "Show More" },
    { id: "components-slider",     label: "Слайдер" },
    { id: "components-pagination", label: "Пагинация" },
  ]},
  { id: "tooltips", label: "Тултипы",         Icon: MessageSquare, subsections: [
    { id: "tooltips-animation", label: "Анимация" },
    { id: "tooltips-variants",  label: "Варианты" },
    { id: "tooltips-rules",     label: "Правила" },
  ]},
  { id: "icons",    label: "Иконки",           Icon: Sparkles, subsections: [
    { id: "icons-scale",   label: "Размерная шкала" },
    { id: "icons-lucide",  label: "Lucide" },
    { id: "icons-mascots", label: "Маскоты" },
  ]},
  { id: "animations", label: "Анимации",      Icon: Zap, subsections: [
    { id: "animations-timing",      label: "Timing-шкала" },
    { id: "animations-easing",      label: "Easing-кривые" },
    { id: "animations-micro",       label: "Микроинтерактивы" },
    { id: "animations-loading",     label: "Loading" },
    { id: "animations-page",        label: "Page-level" },
    { id: "animations-a11y",        label: "Доступность" },
    { id: "animations-round-glass", label: "Round Glass Lens" },
    { id: "animations-wave",        label: "Wave Animation" },
  ]},
  { id: "cross-blocks", label: "Сквозные блоки", Icon: LayoutDashboard, subsections: [
    { id: "cross-header",  label: "Header" },
    { id: "cross-marquee", label: "Logo Marquee" },
  ]},
  { id: "marketing-blocks", label: "Маркетинг блоки", Icon: LayoutTemplate, subsections: [
    { id: "marketing-blocks-faq",         label: "FAQ / Аккордион" },
    { id: "marketing-blocks-cta-dark",    label: "CTA — Тёмный" },
    { id: "marketing-blocks-cta-yellow",  label: "CTA — Жёлтый" },
    { id: "marketing-blocks-cases",       label: "Кейсы + Отзывы" },
    { id: "marketing-blocks-page-bottom", label: "Состав PageBottom" },
  ]},
  { id: "article", label: "Статья", Icon: FileText, subsections: [
    { id: "article-breadcrumbs",  label: "Хлебные крошки" },
    { id: "article-tag",          label: "Tag / Тег" },
    { id: "article-author",       label: "Author / Автор" },
    { id: "article-key-thoughts", label: "Key Thoughts / Ключевые мысли" },
    { id: "article-nav",          label: "ArticleNav / Левая ToC" },
    { id: "article-card",         label: "ArticleCard / Карточка" },
  ]},
]

/** Theme toggle row inside sidebar — mirrors the rail/overlay split. */
function SidebarThemeRow({ railW }: { railW: number }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = mounted ? theme === "dark" : true
  const Icon = isDark ? Sun : Moon
  const label = isDark ? "Светлая" : "Тёмная"
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="shrink-0 border-t border-border w-full flex items-center text-left hover:bg-rm-gray-2/50 transition-colors cursor-pointer"
      style={{ height: 44 }}
      title={`Переключить на ${label.toLowerCase()} тему`}
    >
      <div className="shrink-0 flex items-center justify-center" style={{ width: railW }}>
        <Icon size={15} className="text-muted-foreground" />
      </div>
      <span className="flex-1 min-w-0 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
        {label} тема
      </span>
    </button>
  )
}

export default function DSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileNav, setMobileNav] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const pendingAnchorRef = useRef<string | null>(null)

  /* ── Version history panel ── */
  const [versionOpen, setVersionOpen] = useState(false)

  /* ── Sidebar rail / overlay / pinned state ── */
  const [pinned, setPinned] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isExpanded = pinned || sidebarOpen
  const sidebarW   = isExpanded ? FULL_W : RAIL_W

  useEffect(() => {
    if (localStorage.getItem("ds-sidebar-pinned") === "true") setPinned(true)
  }, [])

  const togglePinned = () => {
    const next = !pinned
    setPinned(next)
    localStorage.setItem("ds-sidebar-pinned", String(next))
    if (next) setSidebarOpen(false)
  }

  const onSidebarEnter = () => {
    if (pinned) return
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setSidebarOpen(true)
  }
  const onSidebarLeave = () => {
    if (pinned) return
    hoverTimer.current = setTimeout(() => setSidebarOpen(false), 150)
  }

  /* ── Active section from URL ── */
  const activeId = pathname.replace(/^\//, "")

  useEffect(() => {
    setExpandedId(activeId)
    const pending = pendingAnchorRef.current
    if (pending) {
      pendingAnchorRef.current = null
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(pending)
          if (el) el.scrollIntoView({ behavior: "instant", block: "start" })
          else window.scrollTo({ top: 0, behavior: "instant" })
        })
      })
    } else {
      window.scrollTo({ top: 0, behavior: "instant" })
    }
  }, [activeId])

  /* ── Yellow active-item indicator ──
      Lives inside the scrollable nav so it scrolls with the menu.
      Pixel-precise: top/height match the active trigger row (+ open subnav).
  ──── */
  const triggerRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const subnavInnerRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const [indicator, setIndicator] = useState<{ top: number; height: number; visible: boolean }>({ top: 0, height: 0, visible: false })

  useEffect(() => {
    const measure = () => {
      const trigger = triggerRefs.current.get(activeId)
      if (!trigger) {
        setIndicator((s) => ({ ...s, visible: false }))
        return
      }
      const isOpen  = expandedId === activeId
      const inner   = subnavInnerRefs.current.get(activeId)
      const subnavH = isOpen && inner ? inner.scrollHeight : 0
      setIndicator({
        top:     trigger.offsetTop,
        height:  trigger.offsetHeight + subnavH,
        visible: true,
      })
    }
    measure()
    // Re-measure after the subnav accordion finishes animating.
    const t = setTimeout(measure, 310)
    return () => clearTimeout(t)
  }, [activeId, expandedId])

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ───── MOBILE HEADER ─────
          Desktop has no header — logo and theme toggle live inside the sidebar.
          Mobile keeps a compact sticky header since the sidebar is hidden.
      ──── */}
      <header className="md:hidden sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between h-14 px-5">
          <div className="flex items-center gap-3">
            <button className="p-1 text-muted-foreground" onClick={() => setMobileNav(!mobileNav)}>
              {mobileNav ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/" scroll={false} className="flex items-center gap-2">
              <img
                src={`${BASE_PATH}/icon_dark_background.svg`}
                alt=""
                className="h-6 w-6 hidden dark:block"
              />
              <img
                src={`${BASE_PATH}/icon_light_background.svg`}
                alt=""
                className="h-6 w-6 dark:hidden"
              />
              <img
                src={`${BASE_PATH}/text_logo_dark_background_en.svg`}
                alt="Rocketmind"
                className="h-6 hidden dark:block"
              />
              <img
                src={`${BASE_PATH}/text_logo_light_background_en.svg`}
                alt="Rocketmind"
                className="h-6 dark:hidden"
              />
            </Link>
          </div>
          <ThemeToggle />
        </div>

        {/* Mobile nav drawer */}
        {mobileNav && (
          <nav className="border-t border-border bg-card px-5 py-3 space-y-1">
            {sections.map((s) => (
              <Link
                key={s.id}
                href={`/${s.id}`}
                scroll={false}
                onClick={() => setMobileNav(false)}
                className="block py-1.5 text-[length:var(--text-14)] text-muted-foreground hover:text-foreground transition-colors font-[family-name:var(--font-mono-family)] uppercase tracking-wider"
              >
                {s.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* ───── SIDEBAR ─────
          One component — rail (48px) or full (220px).
          Inner div is always 220px wide; the aside clips it via overflow:hidden.
          Rail zone  (left 48px): section icons / subsection first-2-chars
          Overlay zone (right 172px): full labels — revealed as width animates
          Yellow indicator is fixed at x = RAIL_W - 4 (right edge of icon zone)
      ──── */}
      <aside
        className="fixed left-0 top-0 bottom-0 z-40 bg-background border-r border-border overflow-hidden transition-[width] duration-200 ease-out hidden md:block"
        style={{ width: sidebarW }}
        onMouseEnter={onSidebarEnter}
        onMouseLeave={onSidebarLeave}
      >
        {/* Inner nav — always 220px wide; clips horizontally inside aside */}
        <div className="relative w-[220px] h-full flex flex-col">

          {/* ── Logo row — icon in rail, text in overlay ── */}
          <div className="shrink-0 flex items-center border-b border-border" style={{ height: 56 }}>
            <Link
              href="/"
              scroll={false}
              className="flex items-center flex-1 min-w-0 group/logo"
              title="На главную"
            >
              {/* Icon zone */}
              <div
                className="shrink-0 flex items-center justify-center"
                style={{ width: RAIL_W }}
              >
                <img
                  src={`${BASE_PATH}/icon_dark_background.svg`}
                  alt=""
                  className="h-6 w-6 hidden dark:block transition-transform duration-150 group-hover/logo:scale-105"
                />
                <img
                  src={`${BASE_PATH}/icon_light_background.svg`}
                  alt=""
                  className="h-6 w-6 dark:hidden transition-transform duration-150 group-hover/logo:scale-105"
                />
              </div>
              {/* Text logo — visible only when sidebar is expanded */}
              <span className="flex-1 min-w-0 whitespace-nowrap">
                <img
                  src={`${BASE_PATH}/text_logo_dark_background_en.svg`}
                  alt="Rocketmind"
                  className="h-5 w-auto hidden dark:block"
                />
                <img
                  src={`${BASE_PATH}/text_logo_light_background_en.svg`}
                  alt="Rocketmind"
                  className="h-5 w-auto dark:hidden"
                />
              </span>
            </Link>
            {/* Pin toggle — only meaningful when sidebar is expanded */}
            <button
              onClick={togglePinned}
              title={pinned ? "Открепить меню" : "Закрепить меню"}
              className="shrink-0 w-9 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {pinned ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
            </button>
          </div>

          {/* Scrollable nav list */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
            <nav className="relative">
              {/* Yellow active-item indicator — aligned with active trigger.
                  Positioned at the icon/text boundary (right edge of rail zone). */}
              <div
                aria-hidden
                className="sidebar-indicator absolute pointer-events-none z-10 bg-[var(--rm-yellow-100)] transition-[left] duration-200 ease-out"
                style={{
                  left: sidebarW - 4,
                  width: 4,
                  top: indicator.top,
                  height: indicator.height,
                  opacity: indicator.visible ? 1 : 0,
                }}
              />
              {sections.map((s) => {
                const isActive = activeId === s.id
                const isOpen   = expandedId === s.id
                const hasSubs  = s.subsections.length > 0
                const { Icon } = s

                return (
                  <div key={s.id}>

                    {/* ── Section trigger row ── */}
                    <div
                      className="flex items-center"
                      style={{ height: 34 }}
                      ref={(el) => {
                        if (el) triggerRefs.current.set(s.id, el)
                        else    triggerRefs.current.delete(s.id)
                      }}
                    >
                      {/* Icon zone: w = RAIL_W */}
                      <div
                        className="shrink-0 flex items-center justify-center"
                        style={{ width: RAIL_W }}
                      >
                        <Icon
                          size={15}
                          className={isActive ? "text-foreground" : "text-muted-foreground"}
                        />
                      </div>

                      {/* Label + chevron — revealed when sidebar expands */}
                      <Link
                        href={`/${s.id}`}
                        scroll={false}
                        onClick={() => setExpandedId(s.id)}
                        className={`flex-1 min-w-0 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider whitespace-nowrap transition-colors ${
                          isActive
                            ? "text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {s.label}
                      </Link>
                      {hasSubs && (
                        <button
                          onClick={() =>
                            setExpandedId(isOpen ? null : s.id)
                          }
                          className="shrink-0 w-6 self-stretch flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={isOpen ? "Скрыть подразделы" : "Показать подразделы"}
                        >
                          <ChevronRight
                            size={12}
                            className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                          />
                        </button>
                      )}
                    </div>

                    {/* ── Subsection rows (accordion) ── */}
                    {hasSubs && (
                      <div className={`sidebar-subnav${isOpen ? " is-open" : ""}`}>
                        <div
                          className="sidebar-subnav-inner"
                          ref={(el) => {
                            if (el) subnavInnerRefs.current.set(s.id, el)
                            else    subnavInnerRefs.current.delete(s.id)
                          }}
                        >
                          {s.subsections.map((sub) => (
                            <a
                              key={sub.id}
                              href={`/${s.id}#${sub.id}`}
                              className="flex items-center"
                              style={{ height: 26 }}
                              onClick={(e) => {
                                e.preventDefault()
                                if (activeId === s.id) {
                                  document.getElementById(sub.id)
                                    ?.scrollIntoView({ behavior: "instant", block: "start" })
                                } else {
                                  pendingAnchorRef.current = sub.id
                                  router.push(`/${s.id}`, { scroll: false })
                                }
                              }}
                            >
                              {/* Abbreviated label in icon zone — aligns with section icons */}
                              <div
                                className="shrink-0 flex items-center justify-center"
                                style={{ width: RAIL_W }}
                              >
                                <span className="text-[9px] font-[family-name:var(--font-mono-family)] text-muted-foreground/40 uppercase tracking-wider select-none">
                                  {sub.label.slice(0, 2)}
                                </span>
                              </div>
                              {/* Full label — visible in overlay */}
                              <span className="flex-1 min-w-0 text-[length:var(--text-12)] text-muted-foreground hover:text-foreground transition-colors font-[family-name:var(--font-mono-family)] uppercase tracking-wider whitespace-nowrap opacity-80 pr-2">
                                {sub.label}
                              </span>
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

          {/* ── Theme toggle row — above version ── */}
          <SidebarThemeRow railW={RAIL_W} />

          {/* Version footer — click to open version history */}
          <button
            className="shrink-0 border-t border-border w-full text-left hover:bg-rm-gray-2/50 transition-colors cursor-pointer"
            style={{ height: 60 }}
            onClick={() => setVersionOpen(true)}
            title="История версий"
          >
            <div className="flex items-center h-full">
              {/* Icon zone */}
              <div
                className="shrink-0 flex items-center justify-center"
                style={{ width: RAIL_W }}
              >
                <span className="text-[8px] font-[family-name:var(--font-mono-family)] text-muted-foreground/40 uppercase tracking-wider select-none">
                  DS
                </span>
              </div>
              {/* Version info — visible in overlay */}
              <div className="min-w-0 overflow-hidden pr-3">
                <Badge variant="neutral" size="md">v{DS_VERSION}</Badge>
                <p className="text-[length:var(--text-12)] text-muted-foreground mt-1 whitespace-nowrap">
                  {DS_DATE}
                </p>
              </div>
            </div>
          </button>

        </div>
      </aside>

      {/* ───── VERSION HISTORY OVERLAY ───── */}
      {versionOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-sm"
            onClick={() => setVersionOpen(false)}
          />
          {/* Panel */}
          <div className="fixed inset-4 md:inset-8 lg:inset-y-12 lg:inset-x-16 z-[61] bg-background border border-border rounded-lg shadow-lg flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <h2 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] uppercase tracking-[-0.01em]">
                История версий
              </h2>
              <button
                onClick={() => setVersionOpen(false)}
                className="inline-flex items-center justify-center h-8 w-8 rounded-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                aria-label="Закрыть"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <VersionHistory compact />
            </div>
          </div>
        </>
      )}

      {/* ───── MAIN CONTENT ─────
          margin-left = RAIL_W (always in rail mode)
          margin-left = FULL_W when pinned
          Marketing blocks inside pages control their own max-width,
          so they get full benefit of the wider viewport.
      ──── */}
      <div
        className={`transition-[padding-left] duration-200 ease-out ${
          pinned ? "md:pl-[220px]" : "md:pl-12"
        }`}
      >
        <main className="min-w-0 px-5 md:px-8 py-10 space-y-16">
          {children}
        </main>
      </div>

    </div>
  )
}
