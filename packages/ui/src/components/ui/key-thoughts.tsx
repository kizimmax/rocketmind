"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface KeyThoughtsProps extends React.HTMLAttributes<HTMLUListElement> {
  thoughts: string[]
}

/**
 * KeyThoughts — закреплённые «ключевые мысли» редактора.
 * Вертикальная полоса слева + Label 16 UPPER.
 */
export function KeyThoughts({ thoughts, className, ...props }: KeyThoughtsProps) {
  if (!thoughts.length) return null
  return (
    <ul
      className={cn(
        "flex flex-col gap-5 border-l border-[color:var(--rm-gray-3)] pl-[26px]",
        className
      )}
      {...props}
    >
      {thoughts.map((t, i) => (
        <li
          key={i}
          className="font-[family-name:var(--font-mono-family)] font-medium text-[length:var(--text-16)] uppercase tracking-[0.02em] leading-[1.12] text-[color:var(--rm-gray-fg-sub)]"
        >
          {t}
        </li>
      ))}
    </ul>
  )
}
