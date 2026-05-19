"use client"

import React from "react"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ""
const TOTAL_PAGES = 36

const pad = (n: number) => String(n).padStart(2, "0")
const slideSrc = (n: number) => `${BASE_PATH}/guidebook/pages/p${pad(n)}.jpg`

export default function GuidebookPage() {
  const [current, setCurrent] = React.useState(1)
  const railRef = React.useRef<HTMLDivElement>(null)
  const activeBtnRef = React.useRef<HTMLButtonElement>(null)

  // Keep the active thumbnail visible in the rail.
  React.useEffect(() => {
    activeBtnRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [current])

  // Keyboard navigation: ←/→ + Home/End.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        setCurrent((c) => Math.max(1, c - 1))
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault()
        setCurrent((c) => Math.min(TOTAL_PAGES, c + 1))
      } else if (e.key === "Home") {
        e.preventDefault()
        setCurrent(1)
      } else if (e.key === "End") {
        e.preventDefault()
        setCurrent(TOTAL_PAGES)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div
      id="guidebook"
      className="-mx-5 md:-mx-8 -my-10 flex bg-[var(--rm-gray-1)]"
      style={{ height: "100vh" }}
    >
      {/* ── Slide rail (left) — edge-to-edge thumbnails, only borders between ── */}
      <aside
        ref={railRef}
        className="shrink-0 w-[154px] overflow-y-auto border-r border-border bg-[var(--rm-gray-1)] [scrollbar-width:thin]"
      >
        {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((n) => {
          const isActive = n === current
          return (
            <button
              key={n}
              ref={isActive ? activeBtnRef : undefined}
              type="button"
              onClick={() => setCurrent(n)}
              className={`group relative block w-full overflow-hidden border-b border-border focus:outline-none ${
                isActive ? "z-10" : ""
              }`}
              aria-label={`Слайд ${n}`}
              aria-current={isActive ? "page" : undefined}
            >
              <img
                src={slideSrc(n)}
                alt=""
                draggable={false}
                loading={n <= 6 ? "eager" : "lazy"}
                className={`block w-full aspect-[16/9] object-cover transition-opacity duration-150 ${
                  isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                }`}
              />
              {/* Page number — bottom-left chip */}
              <span
                className={`absolute left-1.5 bottom-1.5 px-1.5 py-0.5 rounded-[2px] font-[family-name:var(--font-mono-family)] text-[10px] font-medium uppercase tracking-[0.04em] leading-none ${
                  isActive
                    ? "bg-[var(--rm-yellow-100)] text-[#0A0A0A]"
                    : "bg-black/60 text-white/70 group-hover:text-white"
                }`}
              >
                {pad(n)}
              </span>
              {/* Active marker — left vertical yellow stripe */}
              {isActive && (
                <span
                  aria-hidden
                  className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--rm-yellow-100)]"
                />
              )}
            </button>
          )
        })}
      </aside>

      {/* ── Main viewer ── */}
      <main className="relative flex-1 min-w-0 flex flex-col">
        <div className="flex-1 min-h-0 flex items-center justify-center p-6 md:p-10">
          <img
            key={current}
            src={slideSrc(current)}
            alt={`Слайд ${current} из ${TOTAL_PAGES}`}
            draggable={false}
            className="max-h-full max-w-full object-contain rounded-sm shadow-[0_12px_40px_-16px_rgba(0,0,0,0.6)] select-none"
          />
        </div>

        {/* Bottom toolbar — prev / counter / next + download */}
        <div className="shrink-0 flex items-center justify-center gap-3 px-6 py-4 border-t border-border bg-[var(--rm-gray-1)]">
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.max(1, c - 1))}
            disabled={current === 1}
            className="h-9 w-9 rounded-sm border border-border bg-card text-foreground flex items-center justify-center transition-colors hover:border-muted-foreground disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Предыдущий слайд"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground tabular-nums select-none min-w-[78px] text-center">
            <span className="text-foreground">{pad(current)}</span>
            <span className="opacity-50"> / {TOTAL_PAGES}</span>
          </div>

          <button
            type="button"
            onClick={() => setCurrent((c) => Math.min(TOTAL_PAGES, c + 1))}
            disabled={current === TOTAL_PAGES}
            className="h-9 w-9 rounded-sm border border-border bg-card text-foreground flex items-center justify-center transition-colors hover:border-muted-foreground disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Следующий слайд"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <span className="mx-3 h-5 w-px bg-border" aria-hidden />

          <a
            href={`${BASE_PATH}/guidebook/rm-design-system.pdf`}
            download
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-sm border border-border bg-card text-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-colors hover:border-muted-foreground"
            aria-label="Скачать PDF"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v9M5 8l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            PDF
          </a>
        </div>
      </main>
    </div>
  )
}
