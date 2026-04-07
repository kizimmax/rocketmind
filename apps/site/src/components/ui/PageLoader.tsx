"use client"

import { useEffect, useState } from "react"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ""

export function PageLoader() {
  const [progress, setProgress] = useState(0)
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    let raf: number
    let startTime: number | null = null
    const duration = 1200

    const tick = (ts: number) => {
      if (startTime === null) startTime = ts
      const p = Math.min(Math.floor(((ts - startTime) / duration) * 100), 100)
      setProgress(p)
      if (p < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        setFading(true)
        setTimeout(() => setGone(true), 500)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (gone) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#090909",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        opacity: fading ? 0 : 1,
        transition: "opacity 0.5s ease",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      <img
        src={`${BASE_PATH}/icon_dark_background.svg`}
        alt=""
        style={{ width: 64, height: 64, objectFit: "contain" }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          fontFamily: "'Roboto Mono', 'Courier New', monospace",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          userSelect: "none",
        }}
      >
        <span style={{ fontSize: 10, color: "#555", fontWeight: 500 }}>
          ЗАГРУЗКА
        </span>
        <span
          style={{
            fontSize: 10,
            color: "#383838",
            fontVariantNumeric: "tabular-nums",
            minWidth: "3ch",
            textAlign: "center",
            fontWeight: 400,
          }}
        >
          {progress}%
        </span>
      </div>
    </div>
  )
}
