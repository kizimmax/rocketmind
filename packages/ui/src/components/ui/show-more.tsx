"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"

interface ShowMoreProps {
  expanded: boolean
  onClick: () => void
  label?: string
  labelExpanded?: string
  /**
   * Fade mode: renders a gradient above the button that fades out
   * the last portion of the collapsed content.
   * Use together with ShowMorePanel fade + collapsedHeight.
   */
  fade?: boolean
  /** CSS color value for gradient end. Default: var(--background) */
  fadeBg?: string
  /** Height of the fade gradient above the button (px). Default: 72 */
  fadeHeight?: number
  /** Height of the solid background skirt below the button's center line (px).
   *  Use to hide content sitting visually behind the button when ShowMore is
   *  pulled up over preceding content via negative margin. Default: 0 */
  fadeBelow?: number
  className?: string
}

function ShowMore({
  expanded,
  onClick,
  label = "Показать ещё",
  labelExpanded = "Скрыть",
  fade = false,
  fadeBg = "var(--background)",
  fadeHeight = 72,
  fadeBelow = 0,
  className,
}: ShowMoreProps) {
  const btn = (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className={cn(
        "group/show-more flex w-full items-center gap-3 py-1 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground",
        !fade && className
      )}
    >
      <span className="h-px flex-1 bg-border transition-colors duration-[var(--duration-fast)] group-hover/show-more:bg-muted-foreground/30" />
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-border bg-background px-3 py-1 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] transition-all duration-[var(--duration-fast)] group-hover/show-more:border-muted-foreground/40 group-hover/show-more:bg-[var(--rm-gray-1)]">
        {expanded ? labelExpanded : label}
        <ChevronDown
          size={12}
          strokeWidth={2.5}
          className={cn(
            "transition-transform duration-[var(--duration-base)]",
            expanded && "rotate-180"
          )}
        />
      </span>
      <span className="h-px flex-1 bg-border transition-colors duration-[var(--duration-fast)] group-hover/show-more:bg-muted-foreground/30" />
    </button>
  )

  if (!fade) return btn

  return (
    <div style={{ position: "relative" }} className={className}>
      {/* Gradient: transparent at top, fully opaque at the button's center line. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -fadeHeight,
          left: 0,
          right: 0,
          bottom: "50%",
          background: `linear-gradient(to bottom, transparent, ${fadeBg})`,
          opacity: expanded ? 0 : 1,
          transition: `opacity var(--duration-base) var(--ease-standard)`,
          pointerEvents: "none",
        }}
      />
      {/* Solid skirt: from the center line down, hides content behind the button. */}
      {fadeBelow > 0 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: fadeBelow,
            background: fadeBg,
            opacity: expanded ? 0 : 1,
            transition: `opacity var(--duration-base) var(--ease-standard)`,
            pointerEvents: "none",
          }}
        />
      )}
      {/* Button must render above gradient/skirt — relative positioning lifts it. */}
      <div style={{ position: "relative" }}>{btn}</div>
    </div>
  )
}

interface ShowMorePanelProps {
  expanded: boolean
  children: React.ReactNode
  className?: string
  /**
   * Show partial content when collapsed (instead of collapsing to zero).
   * Pairs with fade on ShowMore for the gradient hint effect.
   */
  fade?: boolean
  /** Visible height when collapsed. Only used when fade=true. Default: 180 */
  collapsedHeight?: number
}

/**
 * Animated container for ShowMore content.
 * Uses CSS grid-template-rows trick for smooth height animation — no JS measurement needed.
 */
function ShowMorePanel({
  expanded,
  children,
  className,
  fade = false,
  collapsedHeight = 180,
}: ShowMorePanelProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: expanded ? "1fr" : "0fr",
        transition: `grid-template-rows var(--duration-smooth) var(--ease-standard)`,
      }}
    >
      <div
        style={{ overflow: "hidden", minHeight: fade ? collapsedHeight : 0 }}
        className={className}
      >
        {children}
      </div>
    </div>
  )
}

export { ShowMore, ShowMorePanel }
export type { ShowMoreProps, ShowMorePanelProps }
