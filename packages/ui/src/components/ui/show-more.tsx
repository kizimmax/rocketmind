"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"

interface ShowMoreProps {
  expanded: boolean
  onClick: () => void
  label?: string
  labelExpanded?: string
  className?: string
}

function ShowMore({
  expanded,
  onClick,
  label = "Показать ещё",
  labelExpanded = "Скрыть",
  className,
}: ShowMoreProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className={cn(
        "group/show-more flex w-full items-center gap-3 py-1 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground",
        className
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
}

export { ShowMore }
export type { ShowMoreProps }
