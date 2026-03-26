"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const noteVariants = cva(
  "rounded-lg border p-4 transition-[border-color,background-color,color,opacity] duration-150",
  {
    variants: {
      variant: {
        neutral: "",
        info: "",
        success: "",
        warning: "",
        error: "",
        action: "",
      },
      tone: {
        soft: "",
        filled: "",
      },
      disabled: {
        true: "pointer-events-none opacity-40",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: ["neutral", "action"],
        tone: "soft",
        className: "border-border bg-card text-foreground",
      },
      {
        variant: ["neutral", "action"],
        tone: "filled",
        className: "border-border bg-[var(--rm-gray-1)] text-foreground",
      },
      {
        variant: "info",
        tone: "soft",
        className: "border-[var(--rm-blue-300)] bg-[var(--rm-blue-900)] text-[var(--rm-blue-fg-subtle)]",
      },
      {
        variant: "info",
        tone: "filled",
        className: "border-[var(--rm-blue-100)] bg-[var(--rm-blue-100)] text-[var(--rm-blue-fg)]",
      },
      {
        variant: "success",
        tone: "soft",
        className: "border-[var(--rm-green-300)] bg-[var(--rm-green-900)] text-[var(--rm-green-fg-subtle)]",
      },
      {
        variant: "success",
        tone: "filled",
        className: "border-[var(--rm-green-100)] bg-[var(--rm-green-100)] text-[var(--rm-green-fg)]",
      },
      {
        variant: "warning",
        tone: "soft",
        className: "border-[var(--rm-yellow-300)] bg-[var(--rm-yellow-900)] text-[var(--rm-yellow-fg-subtle)]",
      },
      {
        variant: "warning",
        tone: "filled",
        className: "border-[var(--rm-yellow-100)] bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)]",
      },
      {
        variant: "error",
        tone: "soft",
        className: "border-[var(--rm-red-300)] bg-[var(--rm-red-900)] text-[var(--rm-red-fg-subtle)]",
      },
      {
        variant: "error",
        tone: "filled",
        className: "border-[var(--rm-red-100)] bg-[var(--rm-red-100)] text-[var(--rm-red-fg)]",
      },
    ],
    defaultVariants: {
      variant: "neutral",
      tone: "soft",
      disabled: false,
    },
  }
)

function Note({
  className,
  variant,
  tone,
  disabled,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof noteVariants>) {
  return (
    <div
      data-slot="note"
      className={cn(noteVariants({ variant, tone, disabled }), className)}
      {...props}
    />
  )
}

function NoteEyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="note-eyebrow"
      className={cn(
        "text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] opacity-70",
        className
      )}
      {...props}
    />
  )
}

function NoteTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="note-title"
      className={cn("text-[length:var(--text-14)] font-medium text-current", className)}
      {...props}
    />
  )
}

function NoteDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="note-description"
      className={cn("text-[length:var(--text-14)] leading-[1.5] opacity-80", className)}
      {...props}
    />
  )
}

export { Note, NoteDescription, NoteEyebrow, NoteTitle, noteVariants }
