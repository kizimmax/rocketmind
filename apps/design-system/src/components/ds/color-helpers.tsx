"use client"

import React, { useRef, useState, useEffect } from "react"
import { toast } from "sonner"
import { CopyButton } from "@/components/copy-button"

/** Returns a counter that increments when the theme class on <html> changes */
export function useThemeKey() {
  const [key, setKey] = useState(0)
  useEffect(() => {
    const observer = new MutationObserver(() => setKey(k => k + 1))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])
  return key
}

export function computeHex(el: HTMLElement): string {
  const bg = getComputedStyle(el).backgroundColor
  const m = bg.match(/(\d+)/g)
  if (!m) return ""
  return "#" + [+m[0], +m[1], +m[2]].map(v => v.toString(16).padStart(2, "0")).join("")
}

/** Returns black or white based on WCAG perceived luminance */
export function computeLumColor(hex: string): string {
  if (!hex || hex.length < 7) return "#000000"
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const lin = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  return lum > 0.5 ? "#000000" : "#ffffff"
}

/** Clickable color block: hex on click, hex overlay 30% always / 100% on hover, optional badge */
export function ColorHexBlock({
  style, className, badgeColor, badge,
}: {
  style: React.CSSProperties
  className: string
  badgeColor?: string
  badge?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hex, setHex] = useState("")
  const [autoColor, setAutoColor] = useState("#000000")
  const [hovered, setHovered] = useState(false)
  const themeKey = useThemeKey()

  useEffect(() => {
    if (!ref.current) return
    const h = computeHex(ref.current)
    if (h) { setHex(h); setAutoColor(computeLumColor(h)) }
  }, [themeKey])

  return (
    <div
      ref={ref}
      className={`relative cursor-pointer transition-all duration-150 ${className}`}
      style={style}
      onMouseEnter={() => {
        if (ref.current) {
          const h = computeHex(ref.current)
          if (h) { setHex(h); setAutoColor(computeLumColor(h)) }
        }
        setHovered(true)
      }}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (!ref.current) return
        const h = computeHex(ref.current)
        if (!h) return
        navigator.clipboard.writeText(h)
        toast.success("Скопировано в буфер обмена", { description: `HEX: ${h}`, duration: 2000 })
      }}
    >
      {badge && (
        <span
          className="absolute top-1 left-1 text-[9px] font-[family-name:var(--font-mono-family)] font-bold"
          style={{ color: badgeColor }}
        >{badge}</span>
      )}
      {hex && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-150"
          style={{ opacity: hovered ? 1 : 0.3 }}
        >
          <span className="text-[11px] font-[family-name:var(--font-mono-family)]" style={{ color: autoColor }}>
            {hex}
          </span>
        </div>
      )}
    </div>
  )
}

/** Bottom row of accent card: fg on 100-bg (col-span-2) + fg-subtle (col-span-4) */
export function FgRow({ token }: { token: string }) {
  const fgProbeRef = useRef<HTMLDivElement>(null)
  const fgsProbeRef = useRef<HTMLDivElement>(null)
  const [fgHex, setFgHex] = useState("")
  const [fgsHex, setFgsHex] = useState("")

  const themeKey = useThemeKey()

  const fgToken = `--rm-${token}-fg`
  const fgsToken = `--rm-${token}-fg-subtle`

  const readHexes = () => {
    if (fgProbeRef.current) { const h = computeHex(fgProbeRef.current); if (h) setFgHex(h) }
    if (fgsProbeRef.current) { const h = computeHex(fgsProbeRef.current); if (h) setFgsHex(h) }
  }

  useEffect(() => { readHexes() }, [themeKey])

  return (
    <div className="grid grid-cols-6 border-t border-border relative">
      {/* Invisible probes to read fg/fg-subtle hex values */}
      <div ref={fgProbeRef}  className="sr-only" style={{ backgroundColor: `var(${fgToken})` }} />
      <div ref={fgsProbeRef} className="sr-only" style={{ backgroundColor: `var(${fgsToken})` }} />
      {/* fg cell */}
      <div
        className="col-span-2 px-3 py-2 flex items-center justify-between border-r border-border cursor-pointer"
        style={{ backgroundColor: `var(--rm-${token}-100)`, color: `var(${fgToken})` }}
        onMouseEnter={readHexes}
        onClick={() => { if (fgHex) { navigator.clipboard.writeText(fgHex); toast.success("Скопировано в буфер обмена", { description: `HEX: ${fgHex}`, duration: 2000 }) } }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] shrink-0">fg · {fgHex}</span>
          <span className="text-[10px] font-[family-name:var(--font-mono-family)] opacity-50 truncate">{fgToken}</span>
        </div>
        <div className="shrink-0" onClick={e => e.stopPropagation()}>
          <CopyButton value={fgToken} label={fgToken} iconColor={`var(${fgToken})`} />
        </div>
      </div>
      {/* fg-subtle cell */}
      <div
        className="col-span-4 px-3 py-2 flex items-center justify-between cursor-pointer"
        style={{ backgroundColor: `var(--rm-${token}-900)`, color: `var(${fgsToken})` }}
        onMouseEnter={readHexes}
        onClick={() => { if (fgsHex) { navigator.clipboard.writeText(fgsHex); toast.success("Скопировано в буфер обмена", { description: `HEX: ${fgsHex}`, duration: 2000 }) } }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] shrink-0">fg-subtle · {fgsHex}</span>
          <span className="text-[10px] font-[family-name:var(--font-mono-family)] opacity-50 truncate">{fgsToken}</span>
        </div>
        <div className="shrink-0" onClick={e => e.stopPropagation()}>
          <CopyButton value={fgsToken} label={fgsToken} iconColor={`var(${fgsToken})`} />
        </div>
      </div>
    </div>
  )
}

export function TokenChip({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <code className={`ds-token-chip ${className}`.trim()}>{children}</code>
}
