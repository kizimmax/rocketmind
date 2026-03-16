import React from "react"
import { Coffee } from "lucide-react"
import { cn } from "@/lib/utils"

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  icon?: React.ReactNode
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(
  (
    {
      text = "Попробовать",
      icon = <Coffee size={14} className="shrink-0" />,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-md border border-border bg-transparent font-[family-name:var(--font-mono-family)] text-[length:var(--text-13)] uppercase tracking-[0.08em]",
          className,
        )}
        {...props}
      >
        {/* Default text — slides out to the right */}
        <span
          className="relative z-10 inline-block px-5 py-2.5 whitespace-nowrap transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0"
          style={{ color: "var(--foreground)" }}
        >
          {text}
        </span>

        {/* Hover content — icon + text slides in from right */}
        <div
          className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100"
          style={{ color: "var(--rm-yellow-100)" }}
        >
          {icon}
          <span className="whitespace-nowrap">{text}</span>
        </div>

        {/* Expanding dot — fills the button on hover */}
        <div
          className="absolute left-[20%] top-[40%] h-2 w-2 rounded-md transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8]"
          style={{ backgroundColor: "var(--foreground)" }}
        />
      </button>
    )
  },
)

InteractiveHoverButton.displayName = "InteractiveHoverButton"

export { InteractiveHoverButton }
