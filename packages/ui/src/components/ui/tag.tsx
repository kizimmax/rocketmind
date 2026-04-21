"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const tagVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm border transition-colors",
    "font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.02em] leading-[1.16]",
  ],
  {
    variants: {
      size: {
        // Large — hero article page
        l: "h-7 px-2.5 text-[length:var(--text-14)]",
        // Medium — mobile hero
        m: "h-7 px-2.5 text-[length:var(--text-12)]",
        // Small — card tile
        s: "py-1 px-2 text-[length:var(--text-12)]",
      },
      state: {
        default:
          "bg-[color:var(--rm-gray-1)] border-[color:var(--rm-gray-3)] text-[color:var(--rm-gray-fg-sub)]",
        interactive:
          "bg-[color:var(--rm-gray-1)] border-[color:var(--rm-gray-3)] text-[color:var(--rm-gray-fg-sub)] hover:border-[color:var(--rm-gray-4)] hover:text-[color:var(--rm-gray-fg-main)] cursor-pointer",
        active:
          "bg-[color:var(--rm-yellow-100)] border-[color:var(--rm-yellow-100)] text-[color:var(--rm-yellow-fg)] cursor-pointer",
        disabled:
          "bg-[color:var(--rm-gray-1)] border-[color:var(--rm-gray-3)] text-[color:var(--rm-gray-3)] cursor-not-allowed opacity-60",
      },
    },
    defaultVariants: {
      size: "l",
      state: "default",
    },
  }
)

export type TagSize = NonNullable<VariantProps<typeof tagVariants>["size"]>
export type TagState = NonNullable<VariantProps<typeof tagVariants>["state"]>

type TagOwnProps = VariantProps<typeof tagVariants> & {
  asChild?: boolean
}

type TagAsButton = TagOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> & {
    as: "button"
  }

type TagAsAnchor = TagOwnProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "size"> & {
    as: "a"
  }

type TagAsSpan = TagOwnProps &
  Omit<React.HTMLAttributes<HTMLSpanElement>, "size"> & {
    as?: "span"
  }

export type TagProps = TagAsButton | TagAsAnchor | TagAsSpan

/**
 * Tag — тег для статьи / медиа-раздела.
 * Размеры: L (article hero), M (mobile hero), S (article card).
 * Состояния: default, interactive, active (yellow), disabled.
 */
export function Tag(props: TagProps) {
  const { size, state, className, as, ...rest } = props as TagOwnProps & {
    as?: "button" | "a" | "span"
    className?: string
  }
  const classes = cn(tagVariants({ size, state }), className)

  if (as === "button") {
    return (
      <button
        type="button"
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        className={classes}
      />
    )
  }
  if (as === "a") {
    return <a {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)} className={classes} />
  }
  return <span {...(rest as React.HTMLAttributes<HTMLSpanElement>)} className={classes} />
}

export { tagVariants }
