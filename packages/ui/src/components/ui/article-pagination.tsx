"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "../../lib/utils"

export interface ArticlePaginationLink {
  label: string
  href: string
}

export interface ArticlePaginationProps extends React.HTMLAttributes<HTMLElement> {
  prev?: ArticlePaginationLink
  next?: ArticlePaginationLink
  /** Кастомный рендер ссылки (например next/link). По умолчанию — нативный <a>. */
  renderLink?: (props: {
    href: string
    className: string
    children: React.ReactNode
    "aria-label"?: string
  }) => React.ReactNode
}

const BUTTON_BASE =
  "group flex min-w-0 items-center gap-3 h-[60px] md:h-[72px] px-4 md:px-6 " +
  "border border-[color:var(--rm-gray-3)] rounded-sm " +
  "text-[color:var(--rm-gray-fg-main)] " +
  "transition-colors duration-[120ms] " +
  "hover:border-[color:var(--rm-gray-fg-main)] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"

const LABEL_CLASS =
  "min-w-0 truncate font-[family-name:var(--font-mono-family)] font-medium " +
  "text-[length:var(--text-12)] md:text-[length:var(--text-14)] " +
  "uppercase tracking-[0.02em]"

const ICON_CLASS = "h-4 w-4 shrink-0"

/**
 * ArticlePagination — навигация между разделами многостраничной статьи.
 * Размещается в потоке тела статьи (cols 2-3 на десктопе) перед блоком «Похожие статьи».
 * Если указано только prev или только next — оставшаяся кнопка занимает всю ширину.
 */
export function ArticlePagination({
  prev,
  next,
  renderLink,
  className,
  ...props
}: ArticlePaginationProps) {
  if (!prev && !next) return null

  const onlyOne = !prev || !next

  const renderButton = (
    link: ArticlePaginationLink,
    direction: "prev" | "next",
  ) => {
    const widthClass = onlyOne ? "w-full" : "flex-1"
    const justifyClass =
      direction === "prev" ? "justify-start" : "justify-end"
    const className = cn(BUTTON_BASE, widthClass, justifyClass)

    const content =
      direction === "prev" ? (
        <>
          <ArrowLeft className={ICON_CLASS} strokeWidth={1.5} />
          <span className={LABEL_CLASS}>{link.label}</span>
        </>
      ) : (
        <>
          <span className={LABEL_CLASS}>{link.label}</span>
          <ArrowRight className={ICON_CLASS} strokeWidth={1.5} />
        </>
      )

    const ariaLabel =
      direction === "prev"
        ? `Предыдущий раздел: ${link.label}`
        : `Следующий раздел: ${link.label}`

    if (renderLink) {
      return renderLink({ href: link.href, className, children: content, "aria-label": ariaLabel })
    }
    return (
      <a href={link.href} className={className} aria-label={ariaLabel}>
        {content}
      </a>
    )
  }

  return (
    <nav
      aria-label="Навигация по разделам статьи"
      className={cn("flex w-full gap-2", className)}
      {...props}
    >
      {prev && renderButton(prev, "prev")}
      {next && renderButton(next, "next")}
    </nav>
  )
}
