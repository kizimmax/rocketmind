"use client"

import { useCallback, useRef } from "react"
import { toast } from "sonner"
import { CopyButton } from "./copy-button"

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")
}

function useColorCopy() {
  const ref = useRef<HTMLDivElement>(null)

  const copyHex = useCallback(() => {
    if (!ref.current) return
    const bg = getComputedStyle(ref.current).backgroundColor
    const match = bg.match(/(\d+)/g)
    if (!match) return
    const hex = rgbToHex(+match[0], +match[1], +match[2])
    navigator.clipboard.writeText(hex)
    toast.success("Скопировано в буфер обмена", {
      description: `HEX: ${hex}`,
      duration: 2000,
    })
  }, [])

  return { ref, copyHex }
}

interface ColorSwatchProps {
  name: string
  token: string
  lightHex: string
  darkHex: string
  className?: string
}

export function ColorSwatch({ name, token, lightHex, darkHex, className }: ColorSwatchProps) {
  const { ref, copyHex } = useColorCopy()

  return (
    <div className={`flex flex-col gap-2 ${className || ""}`}>
      <div
        ref={ref}
        onClick={copyHex}
        className="w-full h-20 rounded-md border border-border cursor-pointer hover:border-muted-foreground dark:hover:border-white/[0.12] transition-all duration-150"
        style={{ backgroundColor: lightHex }}
      />
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="text-[length:var(--text-14)] font-medium truncate">{name}</p>
          <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] truncate">{token}</p>
          <div className="flex gap-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">
            <span>L: {lightHex}</span>
            <span>D: {darkHex}</span>
          </div>
        </div>
        <CopyButton value={token} label={`Токен: ${token}`} />
      </div>
    </div>
  )
}

export function ColorSwatchLive({
  name,
  cssVar,
  token,
  lightHex,
  darkHex,
  twClass,
}: {
  name: string
  cssVar: string
  token: string
  lightHex?: string
  darkHex?: string
  twClass?: string
}) {
  const { ref, copyHex } = useColorCopy()

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={ref}
        onClick={copyHex}
        className="w-full h-20 rounded-md border border-border cursor-pointer hover:border-muted-foreground dark:hover:border-white/[0.12] transition-all duration-150"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="text-[length:var(--text-14)] font-medium truncate">{name}</p>
          <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] truncate">{token}</p>
          {(lightHex || darkHex) && (
            <div className="flex flex-wrap gap-x-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">
              {lightHex && <span>L: {lightHex}</span>}
              {darkHex && <span>D: {darkHex}</span>}
            </div>
          )}
          {twClass && (
            <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] truncate">{twClass}</p>
          )}
        </div>
        <CopyButton value={token} label={`Токен: ${token}`} />
      </div>
    </div>
  )
}
