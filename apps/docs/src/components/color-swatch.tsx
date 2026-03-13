"use client"

import { CopyButton } from "./copy-button"

interface ColorSwatchProps {
  name: string
  token: string
  lightHex: string
  darkHex: string
  className?: string
}

export function ColorSwatch({ name, token, lightHex, darkHex, className }: ColorSwatchProps) {
  return (
    <div className={`flex flex-col gap-2 ${className || ""}`}>
      <div
        className="w-full h-20 rounded-md border border-border"
        style={{ backgroundColor: lightHex }}
      />
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{name}</p>
          <p className="text-xs text-muted-foreground font-[family-name:var(--font-mono-family)] truncate">{token}</p>
          <div className="flex gap-2 text-[11px] text-muted-foreground font-[family-name:var(--font-mono-family)]">
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
  return (
    <div className="flex flex-col gap-2">
      <div
        className="w-full h-20 rounded-md border border-border"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{name}</p>
          <p className="text-xs text-muted-foreground font-[family-name:var(--font-mono-family)] truncate">{token}</p>
          {(lightHex || darkHex) && (
            <div className="flex flex-wrap gap-x-2 text-[11px] text-muted-foreground font-[family-name:var(--font-mono-family)]">
              {lightHex && <span>L: {lightHex}</span>}
              {darkHex && <span>D: {darkHex}</span>}
            </div>
          )}
          {twClass && (
            <p className="text-[11px] text-muted-foreground font-[family-name:var(--font-mono-family)] truncate">{twClass}</p>
          )}
        </div>
        <CopyButton value={token} label={`Токен: ${token}`} />
      </div>
    </div>
  )
}
