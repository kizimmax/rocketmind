"use client";

import { useEffect, useRef } from "react";

// ── Constants ──────────────────────────────────────────────────────────────────

export const DOT_GRID_LENS_DEFAULTS = {
  gridGap: 28,
  baseRadius: 1.5,
  maxScale: 3.3,
  lensRadius: 120,
  accentColor: false,
} as const;

// ── Types ──────────────────────────────────────────────────────────────────────

export interface DotGridLensProps {
  /** Grid step in px (min 16 recommended for performance). Default: 28 */
  gridGap?: number;
  /** Base dot radius in px. Default: 1.5 */
  baseRadius?: number;
  /** Dot scale multiplier at lens center. Default: 3.3 */
  maxScale?: number;
  /** Lens influence radius in px. Default: 120 */
  lensRadius?: number;
  /** Enable yellow accent color interpolation on hover (hero variant). Default: false */
  accentColor?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DotGridLens({
  gridGap = DOT_GRID_LENS_DEFAULTS.gridGap,
  baseRadius = DOT_GRID_LENS_DEFAULTS.baseRadius,
  maxScale = DOT_GRID_LENS_DEFAULTS.maxScale,
  lensRadius = DOT_GRID_LENS_DEFAULTS.lensRadius,
  accentColor = DOT_GRID_LENS_DEFAULTS.accentColor,
  className,
  style,
}: DotGridLensProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isTouchOnly = !window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const mouse = { x: -9999, y: -9999 };
    let raf = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      ctx!.clearRect(0, 0, w, h);

      const isDark = document.documentElement.classList.contains("dark");
      // Base dot color: #CBCBCB (light) / #404040 (dark)
      const baseRgb = isDark ? [64, 64, 64] : [203, 203, 203];
      const accentRgb = [255, 204, 0]; // #FFCC00

      const cols = Math.ceil(w / gridGap) + 1;
      const rows = Math.ceil(h / gridGap) + 1;
      const { x: mx, y: my } = mouse;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const px = i * gridGap;
          const py = j * gridGap;

          const dx = px - mx;
          const dy = py - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const t = Math.max(0, 1 - dist / lensRadius);
          const scale = 1 + (maxScale - 1) * t * t; // quadratic falloff
          const r = baseRadius * scale;

          let fillStyle: string;
          if (accentColor && t > 0) {
            const ri = Math.round(baseRgb[0] + (accentRgb[0] - baseRgb[0]) * t * t);
            const gi = Math.round(baseRgb[1] + (accentRgb[1] - baseRgb[1]) * t * t);
            const bi = Math.round(baseRgb[2] + (accentRgb[2] - baseRgb[2]) * t * t);
            fillStyle = `rgb(${ri},${gi},${bi})`;
          } else {
            fillStyle = isDark ? "#404040" : "#CBCBCB";
          }

          ctx!.beginPath();
          ctx!.arc(px, py, r, 0, Math.PI * 2);
          ctx!.fillStyle = fillStyle;
          ctx!.fill();
        }
      }
    }

    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    if (isTouchOnly || reducedMotion) {
      draw();
      return () => ro.disconnect();
    }

    window.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [gridGap, baseRadius, maxScale, lensRadius, accentColor]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ overflow: "hidden", ...style }}
    >
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}
