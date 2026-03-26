"use client"

import * as React from "react"
import { Check, Minus } from "lucide-react"

import { cn } from "../../lib/utils"

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  indeterminate?: boolean
}

const checkboxBaseClassName =
  "peer size-4 shrink-0 appearance-none rounded-sm border border-border bg-rm-gray-1 transition-[background-color,border-color,opacity] duration-150 outline-none checked:border-[var(--rm-yellow-100)] checked:bg-[var(--rm-yellow-100)] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40"

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate = false, ...props }, forwardedRef) => {
    const internalRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(forwardedRef, () => internalRef.current as HTMLInputElement)

    React.useEffect(() => {
      if (!internalRef.current) return
      internalRef.current.indeterminate = indeterminate
    }, [indeterminate])

    return (
      <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
        <input
          {...props}
          ref={internalRef}
          type="checkbox"
          data-slot="checkbox"
          aria-checked={indeterminate ? "mixed" : props["aria-checked"]}
          className={cn(
            checkboxBaseClassName,
            indeterminate && "border-[var(--rm-yellow-100)] bg-[var(--rm-yellow-100)]",
            className
          )}
        />
        {indeterminate ? (
          <Minus className="pointer-events-none absolute size-3 text-[var(--rm-yellow-fg)]" strokeWidth={2.4} />
        ) : (
          <Check
            className="pointer-events-none absolute size-3 text-[var(--rm-yellow-fg)] opacity-0 transition-opacity duration-150 peer-checked:opacity-100"
            strokeWidth={2.4}
          />
        )}
      </span>
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox, checkboxBaseClassName }
