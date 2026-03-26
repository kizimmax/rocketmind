"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const textareaVariants = cva(
  "flex w-full rounded-sm border border-border bg-rm-gray-1 text-foreground placeholder:text-muted-foreground transition-all duration-150 outline-none focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "min-h-[120px] resize-y px-4 py-3 text-[length:var(--text-14)] leading-[1.5]",
        chat: "min-h-[48px] max-h-[200px] resize-none overflow-auto px-4 py-3 text-[length:var(--text-16)] leading-[1.618]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textareaVariants>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(textareaVariants({ variant, className }))}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
