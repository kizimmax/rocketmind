"use client"

import type { CSSProperties } from "react"
import { cn } from "../../lib/utils"

export interface SliderProps {
  /** Current value (ignored in animate mode) */
  value?: number
  /** Minimum value. Default 0. */
  min?: number
  /** Maximum value. Default 1. */
  max?: number
  /** Step increment (interactive mode only) */
  step?: number
  /** Width in px or CSS string ("100%"). Default 62. */
  width?: number | string
  /** Extra className on the root element */
  className?: string

  // ── Progress / animation mode ──────────────────────────────────────────────
  /** Run CSS keyframe animation: fill 0 → 100% */
  animate?: boolean
  /**
   * Changing this value re-mounts the animated fill/dot, restarting the
   * animation. Pass `activeCase` (or any key) that changes on each cycle.
   */
  animateKey?: unknown
  /** Animation duration in ms. Default 15 000. */
  animationDuration?: number
  /** Animation delay in ms. Default 200. */
  animationDelay?: number

  // ── Interactive mode ───────────────────────────────────────────────────────
  /** When provided, overlays an invisible <input type="range"> for interaction. */
  onChange?: (value: number) => void
  disabled?: boolean
}

/**
 * Slider — визуальный индикатор прогресса / интерактивный слайдер.
 *
 * Figma: 62 × 8 px | track #border | fill + dot #foreground
 *
 * Режимы:
 * - `animate` — CSS-анимация заполнения (прогресс-бар, блок кейсов)
 * - `onChange` — интерактивный, поверх рисует невидимый <input type="range">
 * - статический — отображает `value` без анимации и без взаимодействия
 */
export function Slider({
  value = 0,
  min = 0,
  max = 1,
  step,
  width = 62,
  className,
  animate = false,
  animateKey,
  animationDuration = 15_000,
  animationDelay = 200,
  onChange,
  disabled = false,
}: SliderProps) {
  const range = max - min || 1
  const ratio = Math.max(0, Math.min(1, (value - min) / range))
  const fillPct = `${ratio * 100}%`

  const animStyle = (name: string): CSSProperties => ({
    animationName: name,
    animationDuration: `${animationDuration}ms`,
    animationTimingFunction: "linear",
    animationFillMode: "both",
    animationDelay: `${animationDelay}ms`,
  })

  return (
    <div
      className={cn("relative flex-none", className)}
      style={{ width: typeof width === "number" ? `${width}px` : width, height: "8px" }}
    >
      {/* Track */}
      <div className="absolute inset-x-0 top-[3px] h-[2px] bg-border" />

      {/* Fill */}
      <div
        key={animate ? `fill-${String(animateKey)}` : undefined}
        className="absolute left-0 top-[3px] h-[2px] bg-foreground"
        style={animate ? animStyle("rm-slider-fill") : { width: fillPct }}
      />

      {/* Dot */}
      <div
        key={animate ? `dot-${String(animateKey)}` : undefined}
        className="absolute top-0 w-2 h-2 bg-foreground"
        style={
          animate
            ? animStyle("rm-slider-dot")
            : { left: `calc(${fillPct} - 4px)` }
        }
      />

      {/* Interactive overlay */}
      {onChange && !disabled && (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.currentTarget.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      )}
    </div>
  )
}
