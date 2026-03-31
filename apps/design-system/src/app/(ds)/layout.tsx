"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@rocketmind/ui"
import { ChevronRight, Menu, X } from "lucide-react"

const BASE_PATH = process.env.NODE_ENV === "production" ? "/rocketmind/ds" : ""
const DS_VERSION = "1.5.7"
const DS_DATE = "2026-03-18"

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
    { id: "components-buttons",  label: "Кнопки" },
    { id: "components-badges",   label: "Бейджи" },
    { id: "components-tabs",     label: "Табы" },
    { id: "components-checkboxes", label: "Чекбоксы" },
    { id: "components-radio",    label: "Радио" },
    { id: "components-switch",   label: "Тумблер" },
    { id: "components-notes",    label: "Примечания / Notes" },
    { id: "components-tables",   label: "Таблицы" },
    { id: "components-inputs",   label: "Инпуты" },
    { id: "components-textarea", label: "Textarea" },
    { id: "components-search",   label: "Поиск / Combobox" },
    { id: "components-cards",    label: "Карточки" },
    { id: "components-avatar",   label: "Аватар" },
    { id: "components-dialog",   label: "Диалог" },
    { id: "components-dropdown", label: "Dropdown Menu" },
    { id: "components-separator", label: "Разделитель" },
    { id: "components-skeleton", label: "Skeleton" },
    { id: "components-scroll-area", label: "Scroll Area" },
    { id: "components-toasts",   label: "Toasts" },
    { id: "components-show-more", label: "Show More" },
    { id: "components-slider",    label: "Слайдер" },
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
    { id: "animations-timing",      label: "Timing-шкала" },
    { id: "animations-easing",      label: "Easing-кривые" },
    { id: "animations-micro",       label: "Микроинтерактивы" },
    { id: "animations-loading",     label: "Loading" },
    { id: "animations-page",        label: "Page-level" },
    { id: "animations-a11y",        label: "Доступность" },
    { id: "animations-round-glass", label: "Round Glass Lens" },
  ]},
  { id: "cross-blocks", label: "Сквозные блоки", subsections: [
    { id: "cross-header",  label: "Header" },
    { id: "cross-marquee", label: "Logo Marquee" },
  ]},
  { id: "marketing-blocks", label: "Маркетинг блоки", subsections: [
    { id: "marketing-blocks-faq",         label: "FAQ / Аккордион" },
    { id: "marketing-blocks-page-bottom", label: "Кейсы + CTA" },
  ]},
]

export default function DSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileNav, setMobileNav] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [hoverArrowId, setHoverArrowId] = useState<string | null>(null)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingAnchorRef = useRef<string | null>(null)

  // Derive active section from pathname: /logos → "logos", /radius-shadows → "radius-shadows"
  const activeId = pathname.replace(/^\//, "") || "logos"

  // Auto-expand active section + instant scroll on route changes
  useEffect(() => {
    setExpandedId(activeId)
    const pending = pendingAnchorRef.current
    if (pending) {
      pendingAnchorRef.current = null
      // Two rAFs to let Next.js render the new page before scrolling
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(pending)
          if (el) {
            el.scrollIntoView({ behavior: "instant", block: "start" })
          } else {
            window.scrollTo({ top: 0, behavior: "instant" })
          }
        })
      })
    } else {
      window.scrollTo({ top: 0, behavior: "instant" })
    }
  }, [activeId])

  const startHover = (id: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    setHoverArrowId(id)
  }
  const endHover = () => {
    hoverTimeout.current = setTimeout(() => setHoverArrowId(null), 200)
  }

  /* ── Sidebar yellow scroll indicator (positional) ── */
  const trackRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const subnavInnerRefs = useRef<Map<string, HTMLDivElement>>(new Map())
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
    const timer = setTimeout(measure, 310)
    return () => clearTimeout(timer)
  }, [activeId, expandedId])

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
            <nav className="relative space-y-0.5">
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
                      <Link
                        href={`/${s.id}`}
                        scroll={false}
                        onClick={() => setExpandedId(s.id)}
                        className={`flex-1 py-1.5 text-[length:var(--text-12)] transition-colors
                                   font-[family-name:var(--font-mono-family)] uppercase tracking-wider
                                   ${isActive
                                     ? "text-foreground font-medium"
                                     : "text-muted-foreground hover:text-foreground"
                                   }`}
                      >
                        {s.label}
                      </Link>
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
                              href={`/${s.id}#${sub.id}`}
                              className="block py-0.5 text-[length:var(--text-12)] text-muted-foreground hover:text-foreground transition-colors font-[family-name:var(--font-mono-family)] uppercase tracking-wider opacity-80"
                              onClick={(e) => {
                                e.preventDefault()
                                if (activeId === s.id) {
                                  // Already on correct page — scroll instantly
                                  const el = document.getElementById(sub.id)
                                  if (el) el.scrollIntoView({ behavior: "instant", block: "start" })
                                } else {
                                  // Navigate to section, then scroll after render
                                  pendingAnchorRef.current = sub.id
                                  router.push(`/${s.id}`, { scroll: false })
                                }
                              }}
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
            <Badge variant="neutral" size="md">
              v{DS_VERSION}
            </Badge>
            <p className="text-[length:var(--text-12)] text-muted-foreground mt-1">{DS_DATE}</p>
          </div>
        </aside>

        {/* ───── MAIN CONTENT ───── */}
        <main className="flex-1 min-w-0 px-5 md:px-10 py-10 space-y-16">
          {children}
        </main>
      </div>
    </div>
  )
}
