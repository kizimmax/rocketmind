"use client"

import React, { useRef, useState, useEffect, useCallback, memo, type CSSProperties } from "react"
import { createPortal } from "react-dom"
import { RoundGlassLens, ROUND_GLASS_LENS_DEFAULTS, type RoundGlassLensSettings } from "@/components/ui/round-glass-lens"

/* ───────── DOT GRID LENS DEMO ───────── */
const GRID_GAP = 28
const BASE_R = 1.5
const MAX_SCALE = 3.3
const LENS_RADIUS = 120

export function DotGridDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const rafRef = useRef(0)
  const [accent, setAccent] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const container = canvas.parentElement!

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const w = container.clientWidth
      const h = container.clientHeight
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width = `${w}px`
      canvas!.style.height = `${h}px`
      ctx.scale(dpr, dpr)
    }

    function draw() {
      const w = container.clientWidth
      const h = container.clientHeight
      ctx.clearRect(0, 0, w, h)
      const isDark = document.documentElement.classList.contains("dark")
      // --rm-gray-3: #CBCBCB (light) / #404040 (dark)
      const baseColor = isDark ? [64, 64, 64] : [203, 203, 203]
      // --rm-yellow-100: #FFCC00
      const accentColor = [255, 204, 0]
      const { x: mx, y: my } = mouseRef.current
      const cols = Math.ceil(w / GRID_GAP) + 1
      const rows = Math.ceil(h / GRID_GAP) + 1

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const px = i * GRID_GAP
          const py = j * GRID_GAP
          const dx = px - mx
          const dy = py - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          const t = Math.max(0, 1 - dist / LENS_RADIUS)
          const scale = 1 + (MAX_SCALE - 1) * t * t
          const r = BASE_R * scale

          if (accent && t > 0) {
            const ri = Math.round(baseColor[0] + (accentColor[0] - baseColor[0]) * t * t)
            const gi = Math.round(baseColor[1] + (accentColor[1] - baseColor[1]) * t * t)
            const bi = Math.round(baseColor[2] + (accentColor[2] - baseColor[2]) * t * t)
            ctx.fillStyle = `rgb(${ri},${gi},${bi})`
          } else {
            ctx.fillStyle = isDark ? "#404040" : "#CBCBCB"
          }

          ctx.beginPath()
          ctx.arc(px, py, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    function loop() {
      draw()
      if (!reducedMotion) {
        rafRef.current = requestAnimationFrame(loop)
      }
    }

    resize()
    window.addEventListener("resize", resize)

    if (reducedMotion) {
      draw()
    } else {
      rafRef.current = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [accent])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }
  function handleMouseLeave() {
    mouseRef.current = { x: -9999, y: -9999 }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setAccent(false)}
          className={`text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider px-3 py-1 rounded border transition-colors ${!accent ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}
        >
          Монохромный
        </button>
        <button
          onClick={() => setAccent(true)}
          className={`text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider px-3 py-1 rounded border transition-colors ${accent ? "bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] border-[var(--rm-yellow-100)]" : "border-border text-muted-foreground hover:border-foreground"}`}
        >
          Акцентный
        </button>
      </div>
      <div
        className="relative rounded-lg border border-border overflow-hidden h-[220px] cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground/40 select-none">
            Двигай курсор
          </span>
        </div>
      </div>
    </div>
  )
}


/* ───────── ROUND GLASS LENS SHOWCASE ───────── */

type LensTab = "optical" | "shape" | "style" | "motion"

function loadLensSettings(key: string): Partial<RoundGlassLensSettings> {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as Partial<RoundGlassLensSettings>) : {}
  } catch {
    return {}
  }
}

function saveLensSettings(key: string, settings: RoundGlassLensSettings) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, JSON.stringify(settings))
}

function LensControlSlider({
  label, value, min, max, step, disabled, format, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  disabled?: boolean; format?: (v: number) => string; onChange: (v: number) => void;
}) {
  return (
    <label style={{ display: "grid", gap: 6, opacity: disabled ? 0.35 : 1, pointerEvents: disabled ? "none" : undefined }}>
      <div style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8,
        fontFamily: "var(--font-mono-family, monospace)", fontSize: 11, fontWeight: 500,
        textTransform: "uppercase", letterSpacing: "0.06em", color: "#939393",
      }}>
        <span>{label}</span>
        <span style={{ fontVariantNumeric: "tabular-nums", color: "#F0F0F0" }}>
          {format ? format(value) : value.toFixed(3)}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value} disabled={disabled}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
        style={{ width: "100%", height: 3, accentColor: "#F0F0F0", cursor: "pointer" }}
      />
    </label>
  )
}

const LENS_TABS: { id: LensTab; label: string }[] = [
  { id: "optical", label: "ОПТИКА" },
  { id: "shape", label: "ФОРМА" },
  { id: "style", label: "СТИЛЬ" },
  { id: "motion", label: "ДВИЖЕНИЕ" },
]

const panelStyle: CSSProperties = {
  position: "fixed",
  left: 20,
  bottom: 20,
  zIndex: 9999,
  width: "min(calc(100% - 40px), 420px)",
  border: "1px solid rgba(64,64,64,1)",
  borderRadius: 12,
  background: "#0A0A0A",
  boxShadow: "0 8px 40px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.16)",
  padding: 16,
  color: "#F0F0F0",
  fontFamily: "var(--font-mono-family, monospace)",
}

const labelStyle: CSSProperties = {
  fontFamily: "var(--font-mono-family, monospace)",
  fontSize: 11,
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#939393",
}

export const LensShowcase = memo(function LensShowcase({ storageKey, size = 280 }: { storageKey: string; size?: number }) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const [showPanel, setShowPanel] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<LensTab>("optical")
  const [saveFlash, setSaveFlash] = useState(false)

  const [settings, setSettings] = useState<RoundGlassLensSettings>(() => ({ ...ROUND_GLASS_LENS_DEFAULTS }))

  // Load from localStorage after mount
  useEffect(() => {
    setMounted(true)
    const stored = loadLensSettings(storageKey)
    if (Object.keys(stored).length > 0) {
      setSettings((prev) => ({ ...prev, ...stored }))
    }
  }, [storageKey])

  // Auto-save on change
  const initializedRef = useRef(false)
  useEffect(() => {
    if (!initializedRef.current) { initializedRef.current = true; return }
    saveLensSettings(storageKey, settings)
  }, [storageKey, settings])

  const handleSave = useCallback(() => {
    saveLensSettings(storageKey, settings)
    setSaveFlash(true)
    setTimeout(() => setSaveFlash(false), 800)
  }, [storageKey, settings])

  const handleCopy = useCallback(() => {
    const s = settings
    const code = [
      `refraction={${s.refraction}}`,
      `depth={${s.depth}}`,
      `dispersion={${s.dispersion}}`,
      `distortionRadius={${s.distortionRadius}}`,
      `blur={${s.blur}}`,
      `gradientAngle={${s.gradientAngle}}`,
      `motionStrengthX={${s.motionStrengthX}}`,
      `motionStrengthY={${s.motionStrengthY}}`,
    ].join("\n  ")
    void navigator.clipboard.writeText(`<RoundGlassLens\n  ${code}\n/>`)
  }, [settings])

  const tabBaseStyle = (isActive: boolean): CSSProperties => ({
    padding: "6px 10px 8px",
    border: "none",
    borderBottom: `2px solid ${isActive ? "#F0F0F0" : "transparent"}`,
    background: "transparent",
    color: isActive ? "#F0F0F0" : "#939393",
    fontSize: 11,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    cursor: "pointer",
    fontFamily: "inherit",
    marginBottom: -1,
  })

  const monoSm = "text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider"

  const controls = mounted && showPanel
    ? createPortal(
        <div style={panelStyle} data-lens-hide="true">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", textTransform: "uppercase" as const }}>
                LENS CONTROLS
              </div>
              <div style={{ ...labelStyle, marginTop: 2, opacity: 0.5 }}>
                {storageKey}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" onClick={handleCopy} style={{
                height: 28, padding: "0 10px", border: "1px solid rgba(64,64,64,1)", borderRadius: 6,
                background: "transparent", color: "#939393", fontSize: 11, fontWeight: 500,
                textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer", fontFamily: "inherit",
              }}>
                COPY
              </button>
              <button type="button" onClick={handleSave} style={{
                height: 28, padding: "0 10px",
                border: `1px solid ${saveFlash ? "#FFCC00" : "rgba(64,64,64,1)"}`,
                borderRadius: 6,
                background: saveFlash ? "rgba(255,204,0,0.12)" : "transparent",
                color: saveFlash ? "#FFCC00" : "#939393",
                fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em",
                cursor: "pointer", fontFamily: "inherit", transition: "all 150ms",
              }}>
                {saveFlash ? "SAVED ✓" : "SAVE"}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 4, marginBottom: 14, borderBottom: "1px solid rgba(64,64,64,1)", paddingBottom: 0 }}>
            {LENS_TABS.map((tab) => (
              <button key={tab.id} type="button" style={tabBaseStyle(activeTab === tab.id)} onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            {activeTab === "optical" && (
              <>
                <LensControlSlider label="REFRACTION" value={settings.refraction}
                  min={0} max={0.12} step={0.001}
                  onChange={(v) => setSettings((p) => ({ ...p, refraction: v }))} />
                <LensControlSlider label="DEPTH" value={settings.depth}
                  min={0} max={0.5} step={0.001}
                  onChange={(v) => setSettings((p) => ({ ...p, depth: v }))} />
                <LensControlSlider label="DISPERSION" value={settings.dispersion}
                  min={0} max={5} step={0.01}
                  onChange={(v) => setSettings((p) => ({ ...p, dispersion: v }))} />
              </>
            )}
            {activeTab === "shape" && (
              <>
                <LensControlSlider label="DISTORTION RADIUS" value={settings.distortionRadius}
                  min={0.2} max={1.5} step={0.001}
                  onChange={(v) => setSettings((p) => ({ ...p, distortionRadius: v }))} />
                <LensControlSlider label="BLUR" value={settings.blur}
                  min={0} max={2} step={0.001}
                  onChange={(v) => setSettings((p) => ({ ...p, blur: v }))} />
              </>
            )}
            {activeTab === "style" && (
              <LensControlSlider label="GRADIENT ANGLE" value={settings.gradientAngle}
                min={0} max={360} step={1}
                format={(v) => `${Math.round(v)}°`}
                onChange={(v) => setSettings((p) => ({ ...p, gradientAngle: v }))} />
            )}
            {activeTab === "motion" && (
              <>
                <LensControlSlider label="FOLLOW X" value={settings.motionStrengthX}
                  min={0} max={0.1} step={0.001}
                  onChange={(v) => setSettings((p) => ({ ...p, motionStrengthX: v }))} />
                <LensControlSlider label="FOLLOW Y" value={settings.motionStrengthY}
                  min={0} max={0.1} step={0.001}
                  onChange={(v) => setSettings((p) => ({ ...p, motionStrengthY: v }))} />
              </>
            )}
          </div>
        </div>,
        document.body,
      )
    : null

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowPanel(v => !v)}
          className={`${monoSm} px-3 py-1 rounded border transition-colors cursor-pointer ${showPanel ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}
        >
          {showPanel ? "Скрыть" : "Настроить"}
        </button>
      </div>

      {/* Demo scene — inline hex/rgba colors only (html2canvas can't parse oklch) */}
      <div
        ref={sceneRef}
        className="relative overflow-hidden cursor-crosshair select-none"
        style={{
          height: 380,
          borderRadius: 8,
          border: "1px solid rgba(64,64,64,1)",
          background: "#0A0A0A",
        }}
      >
        {/* Background image */}
        <img
          src="/hero-art/hero-lens.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", pointerEvents: "none", userSelect: "none", opacity: 0.45,
          }}
        />
        {/* Yellow radial glow */}
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 70% 55% at 50% 42%, rgba(255, 204, 0, 0.08) 0%, transparent 68%)",
          }}
        />
        {/* Center content */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 24, pointerEvents: "none",
        }}>
          <img
            src="/text_logo_dark_background_en.svg"
            alt="Rocketmind"
            style={{ width: "100%", height: "auto", opacity: 0.9, paddingLeft: 20, paddingRight: 20 }}
          />
          <span style={{
            fontFamily: "var(--font-mono-family, monospace)", fontSize: 12, fontWeight: 500,
            textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(250,250,250,0.2)",
          }}>
            Двигай курсор
          </span>
        </div>
        {/* WebGL Lens — settings controlled externally */}
        <RoundGlassLens
          sceneRef={sceneRef}
          size={size}
          refraction={settings.refraction}
          depth={settings.depth}
          dispersion={settings.dispersion}
          distortionRadius={settings.distortionRadius}
          shadowRadius={settings.shadowRadius}
          blur={settings.blur}
          gradientAngle={settings.gradientAngle}
          shadowEnabled={settings.shadowEnabled}
          motionStrengthX={settings.motionStrengthX}
          motionStrengthY={settings.motionStrengthY}
          motionParallax
        />
      </div>

      {controls}
    </div>
  )
})

/* ───────── ANIMATED GRID LINES DEMO ───────── */
export function AnimatedGridLinesDemo() {
  const [key, setKey] = useState(0)
  const hLines = [0, 1, 2, 3]
  const vLines = [0, 1, 2, 3, 4]
  return (
    <div className="space-y-3">
      <button
        onClick={() => setKey((k) => k + 1)}
        className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider px-3 py-1 rounded border border-border text-muted-foreground hover:border-foreground transition-colors"
      >
        ↺ Повторить
      </button>
      <div className="relative rounded-lg border border-border overflow-hidden h-[280px] bg-background">
        <style>{`
          @keyframes line-h {
            from { opacity: 0; transform: scaleX(0); }
            to   { opacity: 1; transform: scaleX(1); }
          }
          @keyframes line-v {
            from { opacity: 0; transform: scaleY(0); }
            to   { opacity: 1; transform: scaleY(1); }
          }
        `}</style>
        {hLines.map((i) => (
          <div
            key={`h-${key}-${i}`}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${(i + 1) * 20}%`,
              transformOrigin: "left",
              backgroundColor: "var(--rm-gray-3)",
              animation: `line-h 1.6s ease-out ${i * 0.1}s both`,
            }}
          />
        ))}
        {vLines.map((i) => (
          <div
            key={`v-${key}-${i}`}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${(i + 1) * (100 / (vLines.length + 1))}%`,
              transformOrigin: "top",
              backgroundColor: "var(--rm-gray-3)",
              animation: `line-v 1.6s ease-out ${(hLines.length + i) * 0.1}s both`,
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground/40 select-none">
            Hero background grid
          </span>
        </div>
      </div>
      <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">
        scaleX/scaleY 0→1 · 1600ms ease-out · stagger 0.1s между линиями
      </p>
    </div>
  )
}
