"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">

const radioBaseClassName =
  "peer size-4 shrink-0 appearance-none rounded-full border border-border bg-rm-gray-1 transition-[background-color,border-color,opacity] duration-150 outline-none checked:border-[var(--rm-yellow-100)] checked:bg-background focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40"

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(({ className, ...props }, ref) => {
  return (
    <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
      <input
        {...props}
        ref={ref}
        type="radio"
        data-slot="radio"
        className={cn(radioBaseClassName, className)}
      />
      <span className="pointer-events-none absolute size-2 rounded-full bg-[var(--rm-yellow-100)] opacity-0 transition-opacity duration-150 peer-checked:opacity-100" />
    </span>
  )
})

Radio.displayName = "Radio"

export { Radio, radioBaseClassName }
