"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface ArticleNavItem {
  id: string
  label: string
}

export interface ArticleNavProps extends React.HTMLAttributes<HTMLElement> {
  items: ArticleNavItem[]
  activeId?: string | null
  /** Called when user clicks a nav item. If omitted, uses href="#id". */
  onNavigate?: (id: string) => void
}

/**
 * ArticleNav — левая ToC-навигация статьи, автосборка из H2-заголовков тела.
 * Width 268 (fixed), items Label 18 UPPER, activeId подсвечивается жёлтым.
 * Возвращает null если items пусты — компонент не рендерится.
 */
export function ArticleNav({
  items,
  activeId,
  onNavigate,
  className,
  ...props
}: ArticleNavProps) {
  if (!items.length) return null

  return (
    <nav
      aria-label="Содержание статьи"
      className={cn("flex w-[268px] flex-col gap-6", className)}
      {...props}
    >
      <ul className="flex flex-col gap-5">
        {items.map((item) => {
          const isActive = item.id === activeId
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  if (!onNavigate) return
                  e.preventDefault()
                  onNavigate(item.id)
                }}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "block font-[family-name:var(--font-mono-family)] font-medium text-[length:var(--text-18)] uppercase tracking-[0.02em] leading-[1.12] transition-colors",
                  isActive
                    ? "text-[color:var(--rm-yellow-100)]"
                    : "text-[color:var(--rm-gray-fg-sub)] hover:text-[color:var(--rm-gray-fg-main)]"
                )}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
