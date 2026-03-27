"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

interface InputOTPProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
  "aria-invalid"?: boolean
}

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  ({ length = 6, value = "", onChange, disabled, className, "aria-invalid": ariaInvalid, ...props }, ref) => {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
    const chars = value.split("")

    function handleChange(index: number, char: string) {
      if (char.length > 1) {
        // Paste handling
        const pasted = char.replace(/\D/g, "").slice(0, length)
        onChange?.(pasted)
        const focusIndex = Math.min(pasted.length, length - 1)
        inputRefs.current[focusIndex]?.focus()
        return
      }

      if (!/^\d?$/.test(char)) return

      const next = [...chars]
      next[index] = char
      // Fill gaps with empty strings
      for (let i = 0; i < length; i++) {
        if (next[i] === undefined) next[i] = ""
      }
      const newValue = next.join("").slice(0, length)
      onChange?.(newValue)

      if (char && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Backspace" && !chars[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
      if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
      if (e.key === "ArrowRight" && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    return (
      <div
        ref={ref}
        data-slot="input-otp"
        className={cn("flex gap-2", className)}
        {...props}
      >
        {Array.from({ length }, (_, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={length}
            value={chars[i] ?? ""}
            disabled={disabled}
            aria-invalid={ariaInvalid}
            autoComplete={i === 0 ? "one-time-code" : "off"}
            className={cn(
              "w-14 h-14 text-center",
              "rounded-sm border border-border",
              "bg-rm-gray-1 text-foreground",
              "font-[family-name:var(--font-mono-family)] text-[length:var(--text-25)] tracking-[0.08em]",
              "transition-all duration-150",
              "outline-none focus-visible:border-ring",
              "disabled:cursor-not-allowed disabled:opacity-40",
              "aria-invalid:border-destructive"
            )}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
    )
  }
)

InputOTP.displayName = "InputOTP"

export { InputOTP }
export type { InputOTPProps }
