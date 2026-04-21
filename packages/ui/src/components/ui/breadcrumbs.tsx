"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  /** Mobile: horizontal scroll anchored to the end (last item visible) */
  mobileScroll?: boolean
}

/**
 * Breadcrumbs — путь навигации.
 *
 * Desktop: row gap-3, item gap-2, text Copy 14.
 * Mobile (`mobileScroll`): горизонтальный скролл, прижатый к концу — видна текущая позиция.
 */
export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ items, mobileScroll = true, className, ...props }, ref) => {
    const scrollRef = React.useRef<HTMLOListElement>(null)

    React.useEffect(() => {
      if (!mobileScroll) return
      const el = scrollRef.current
      if (!el) return
      el.scrollLeft = el.scrollWidth
    }, [items, mobileScroll])

    return (
      <nav
        ref={ref}
        aria-label="Хлебные крошки"
        className={cn(
          mobileScroll && "breadcrumbs-scroll overflow-x-auto",
          className
        )}
        {...props}
      >
        <ol
          ref={scrollRef}
          className={cn(
            "flex items-center gap-3 whitespace-nowrap",
            mobileScroll && "min-w-max"
          )}
        >
          {items.map((item, i) => {
            const isLast = i === items.length - 1
            return (
              <li
                key={`${item.label}-${i}`}
                className="flex items-center gap-2 text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em]"
              >
                {item.href && !isLast ? (
                  <a
                    href={item.href}
                    className="text-[color:var(--rm-gray-4)] transition-colors hover:text-[color:var(--rm-gray-fg-sub)]"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    className={cn(
                      isLast
                        ? "text-[color:var(--rm-gray-fg-sub)]"
                        : "text-[color:var(--rm-gray-4)]"
                    )}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
                {!isLast && (
                  <span
                    className="text-[color:var(--rm-gray-3)]"
                    aria-hidden
                  >
                    /
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }
)
Breadcrumbs.displayName = "Breadcrumbs"
