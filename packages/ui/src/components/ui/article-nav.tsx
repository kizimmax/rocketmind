"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface ArticleNavItem {
  id: string
  label: string
  /** Если задан — рендерится <a href>, навигация cross-page. Иначе — `#id` (anchor scrollspy). */
  href?: string
  /** Явная подсветка активного пункта (для cross-page). Локальный scrollspy уважается через activeId. */
  active?: boolean
  /** Вложенные пункты — раскрываются под активным parent'ом. Поддерживается один уровень. */
  children?: ArticleNavItem[]
}

export interface ArticleNavProps extends React.HTMLAttributes<HTMLElement> {
  items: ArticleNavItem[]
  activeId?: string | null
  /** Called when user clicks a nav item without href. Если задан href — onNavigate не вызывается. */
  onNavigate?: (id: string) => void
}

/**
 * ArticleNav — левая ToC-навигация статьи.
 * - Одностраничная статья: items — H2-якоря, без href, активность через activeId (scrollspy).
 * - Многостраничная: верхний уровень — главы со href, под активной раскрываются её H2-секции (children).
 * Возвращает null если items пусты.
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
          const isActive = item.active ?? item.id === activeId
          const hasChildren =
            isActive && item.children && item.children.length > 0
          return (
            <li key={item.id} className="flex flex-col gap-3">
              <NavLink
                item={item}
                isActive={isActive}
                onNavigate={onNavigate}
              />
              {hasChildren && (
                <ul className="flex flex-col gap-3 pl-4 border-l border-[color:var(--rm-gray-3)]">
                  {item.children!.map((child) => {
                    const childActive =
                      child.active ?? child.id === activeId
                    return (
                      <li key={child.id}>
                        <NavLink
                          item={child}
                          isActive={childActive}
                          onNavigate={onNavigate}
                          variant="child"
                        />
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function NavLink({
  item,
  isActive,
  onNavigate,
  variant = "parent",
}: {
  item: ArticleNavItem
  isActive: boolean
  onNavigate?: (id: string) => void
  variant?: "parent" | "child"
}) {
  const baseClass =
    variant === "parent"
      ? "block font-[family-name:var(--font-mono-family)] font-medium text-[length:var(--text-18)] uppercase tracking-[0.02em] leading-[1.12] transition-colors"
      : "block font-[family-name:var(--font-mono-family)] font-medium text-[length:var(--text-14)] uppercase tracking-[0.02em] leading-[1.16] transition-colors"
  const colorClass = isActive
    ? "text-[color:var(--rm-yellow-100)]"
    : "text-[color:var(--rm-gray-fg-sub)] hover:text-[color:var(--rm-gray-fg-main)]"
  const className = cn(baseClass, colorClass)

  const href = item.href ?? `#${item.id}`
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.href) return // cross-page — обычный переход, scrollspy не нужен
    if (!onNavigate) return
    e.preventDefault()
    onNavigate(item.id)
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      aria-current={isActive ? "true" : undefined}
      className={className}
    >
      {item.label}
    </a>
  )
}
