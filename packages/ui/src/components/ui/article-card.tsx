"use client"

import * as React from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "../../lib/utils"
import { Tag } from "./tag"
import { Author } from "./author"

export interface ArticleCardProps extends React.HTMLAttributes<HTMLElement> {
  /** If omitted — карточка рендерится как статичное превью без ссылки и без стрелки-выноски. */
  href?: string
  title: string
  description?: string
  coverUrl?: string | null
  tags?: string[]
  authorName?: string
  authorAvatarUrl?: string | null
  date?: string
  /** Max tags to show (excess are clipped). Default 3. */
  maxTags?: number
}

/**
 * ArticleCard — floating glass-панель.
 * 350px fixed width, bg rgba(10,10,10,0.8) + backdrop-blur 10, pad 32.
 * Image 224h с линейным затемнением снизу → контент над ней (overlap).
 * Если передан `href` — карточка кликабельна и показывает стрелку-выноску.
 */
export function ArticleCard({
  href,
  title,
  description,
  coverUrl,
  tags,
  authorName,
  authorAvatarUrl,
  date,
  maxTags = 3,
  className,
  ...props
}: ArticleCardProps) {
  const visibleTags = (tags ?? []).slice(0, maxTags)

  return (
    <article
      className={cn(
        "group relative flex w-[350px] flex-col",
        "rounded-sm border border-[color:var(--rm-gray-3)]",
        "bg-[rgba(10,10,10,0.8)] backdrop-blur-[10px]",
        "p-8",
        className
      )}
      {...props}
    >
      {href && (
        <>
          <a
            href={href}
            className="absolute inset-0 z-[1] rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--rm-yellow-100)]"
            aria-label={title}
          />
          <span
            className="absolute right-2 top-2 z-[2] inline-flex h-10 w-10 items-center justify-center rounded-sm text-[color:var(--rm-gray-fg-main)] transition-colors group-hover:text-[color:var(--rm-yellow-100)]"
            aria-hidden
          >
            <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
          </span>
        </>
      )}

      {/* Image */}
      <div className="relative -mx-[0] mb-[-53px] h-56 overflow-hidden">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt=""
            className="h-full w-full object-cover"
            aria-hidden
          />
        ) : (
          <div className="h-full w-full bg-[color:var(--rm-gray-1)]" aria-hidden />
        )}
        {/* Gradient overlay bottom → dark */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0.72) 22%, rgba(10,10,10,0) 100%)",
          }}
          aria-hidden
        />
      </div>

      {/* Tags */}
      {visibleTags.length > 0 && (
        <div className="relative z-[1] mt-[-24px] flex flex-wrap gap-x-2 gap-y-1">
          {visibleTags.map((t) => (
            <Tag key={t} size="s">
              {t}
            </Tag>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-[1] mt-7 flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] uppercase tracking-[-0.01em] leading-[1.2] text-[color:var(--rm-gray-fg-main)]">
            {title}
          </h3>
          {description && (
            <p className="line-clamp-3 text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[color:var(--rm-gray-fg-sub)]">
              {description}
            </p>
          )}
        </div>

        {authorName && (
          <Author
            variant="short"
            name={authorName}
            avatarUrl={authorAvatarUrl}
            date={date}
          />
        )}
      </div>
    </article>
  )
}
