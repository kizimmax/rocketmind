"use client"

import * as React from "react"
import { Calendar } from "lucide-react"
import { cn } from "../../lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

export interface AuthorProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  avatarUrl?: string | null
  /** ISO date string */
  date?: string
  /** Full — 2-line (name, date on separate row with calendar). Short — single row (name + date). */
  variant?: "full" | "short"
  /**
   * Если `false` и `avatarUrl` отсутствует/пустой — не рендерим круглый блок
   * с инициалами (в карточках медиа дизайнер решает не показывать заглушку).
   * По умолчанию `true` — прежнее поведение с fallback-инициалами.
   */
  showAvatarFallback?: boolean
}

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

function formatDate(iso?: string): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return dateFormatter.format(d)
}

/**
 * Author — блок «автор + дата» для hero статьи (Full) и карточки (Short).
 */
export function Author({
  name,
  avatarUrl,
  date,
  variant = "full",
  showAvatarFallback = true,
  className,
  ...props
}: AuthorProps) {
  const formatted = formatDate(date)
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
  const showAvatar = !!avatarUrl || showAvatarFallback

  if (variant === "short") {
    return (
      <div
        className={cn("flex items-center gap-2 text-[length:var(--text-14)] min-w-0 flex-nowrap", className)}
        {...props}
      >
        {showAvatar && (
          <Avatar size="xs" className="shrink-0 border-0">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
            <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
          </Avatar>
        )}
        <span className="min-w-0 flex-1 truncate font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[color:var(--rm-gray-fg-sub)]">
          {name}
        </span>
        {formatted && (
          <>
            <span className="mx-1 h-3 w-px shrink-0 bg-[color:var(--rm-gray-3)]" aria-hidden />
            <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[color:var(--rm-gray-fg-sub)] leading-[1.32] tracking-[0.01em]">
              <Calendar className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              {formatted}
            </span>
          </>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn("flex items-stretch gap-3", className)}
      {...props}
    >
      {showAvatar && (
        <Avatar size="md" className="shrink-0 border-0">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
          <AvatarFallback className="text-[length:var(--text-12)]">{initials}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col justify-center gap-1 min-w-0 flex-1">
        <span className="font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[color:var(--rm-gray-fg-main)] truncate">
          {name}
        </span>
        {formatted && (
          <span className="inline-flex items-center gap-1 text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[color:var(--rm-gray-fg-sub)]">
            <Calendar className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            {formatted}
          </span>
        )}
      </div>
    </div>
  )
}
