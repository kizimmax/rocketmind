"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-[72px] h-8" />

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center gap-2 h-8 px-3 rounded-sm border border-border
                 bg-card text-[length:var(--text-14)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider
                 text-muted-foreground hover:text-foreground transition-all duration-150 cursor-pointer"
    >
      {isDark ? (
        <>
          <Sun size={14} />
          <span className="text-[length:var(--text-12)]">Light</span>
        </>
      ) : (
        <>
          <Moon size={14} />
          <span className="text-[length:var(--text-12)]">Dark</span>
        </>
      )}
    </button>
  )
}
