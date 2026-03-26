"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { toast } from "sonner"
import { CopyButton } from "./copy-button"

function computeHex(el: HTMLElement): string {
  const bg = getComputedStyle(el).backgroundColor
  const m = bg.match(/(\d+)/g)
  if (!m) return ""
  return "#" + [+m[0], +m[1], +m[2]].map(v => v.toString(16).padStart(2, "0")).join("")
}

function computeLumColor(hex: string): string {
  if (!hex || hex.length < 7) return "#000000"
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const lin = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  return lum > 0.5 ? "#000000" : "#ffffff"
}

function useColorBlock() {
  const ref = useRef<HTMLDivElement>(null)
  const [hex, setHex] = useState("")
  const [autoColor, setAutoColor] = useState("#000000")
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const h = computeHex(ref.current)
    if (h) { setHex(h); setAutoColor(computeLumColor(h)) }
  }, [])

  const onMouseEnter = useCallback(() => {
    if (!ref.current) return
    const h = computeHex(ref.current)
    if (h) { setHex(h); setAutoColor(computeLumColor(h)) }
    setHovered(true)
  }, [])

  const onMouseLeave = useCallback(() => setHovered(false), [])

  const onClick = useCallback(() => {
    if (!ref.current) return
    const h = computeHex(ref.current)
    if (!h) return
    navigator.clipboard.writeText(h)
    toast.success("Скопировано в буфер обмена", { description: `HEX: ${h}`, duration: 2000 })
  }, [])

  return { ref, hex, autoColor, hovered, onMouseEnter, onMouseLeave, onClick }
}

interface ColorSwatchProps {
  name: string
  token: string
  lightHex: string
  darkHex: string
  className?: string
}

export function ColorSwatch({ name, token, lightHex, darkHex, className }: ColorSwatchProps) {
  const { ref, hex, autoColor, hovered, onMouseEnter, onMouseLeave, onClick } = useColorBlock()

  return (
    <div className={`flex flex-col gap-2 ${className || ""}`}>
      <div
        ref={ref}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="relative w-full h-20 rounded-lg border border-border cursor-pointer"
        style={{ backgroundColor: lightHex }}
      >
        {hex && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-150"
            style={{ opacity: hovered ? 1 : 0.3 }}
          >
            <span className="text-[11px] font-[family-name:var(--font-mono-family)]" style={{ color: autoColor }}>{hex}</span>
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="text-[length:var(--text-14)] font-medium truncate">{name}</p>
          <code className="ds-token-chip max-w-full">{token}</code>
          <div className="mt-1 flex gap-2 ds-token-caption text-muted-foreground">
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
  const { ref, hex, autoColor, hovered, onMouseEnter, onMouseLeave, onClick } = useColorBlock()

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={ref}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="relative w-full h-20 rounded-lg border border-border cursor-pointer"
        style={{ backgroundColor: `var(${cssVar})` }}
      >
        {hex && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-150"
            style={{ opacity: hovered ? 1 : 0.3 }}
          >
            <span className="text-[11px] font-[family-name:var(--font-mono-family)]" style={{ color: autoColor }}>{hex}</span>
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="text-[length:var(--text-14)] font-medium truncate">{name}</p>
          <code className="ds-token-chip max-w-full">{token}</code>
          {(lightHex || darkHex) && (
            <div className="mt-1 flex flex-wrap gap-x-2 ds-token-caption text-muted-foreground">
              {lightHex && <span>L: {lightHex}</span>}
              {darkHex && <span>D: {darkHex}</span>}
            </div>
          )}
          {twClass && (
            <code className="ds-token-chip mt-1 max-w-full">{twClass}</code>
          )}
        </div>
        <CopyButton value={token} label={`Токен: ${token}`} />
      </div>
    </div>
  )
}
