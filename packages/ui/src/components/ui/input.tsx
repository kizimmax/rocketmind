"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const inputVariants = cva(
  "flex w-full rounded-sm border border-border bg-rm-gray-1 text-foreground placeholder:text-muted-foreground transition-all duration-150 outline-none focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-destructive",
  {
    variants: {
      size: {
        xs: "h-7 px-3 text-[length:var(--text-12)]",
        sm: "h-8 px-3 text-[length:var(--text-12)]",
        md: "h-10 px-4 text-[length:var(--text-14)]",
        lg: "h-12 px-6 text-[length:var(--text-16)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof inputVariants>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(inputVariants({ size, className }))}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input, inputVariants }
