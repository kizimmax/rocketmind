"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

import { InfiniteLogoMarquee } from "@rocketmind/ui";
import { RoundGlassLens } from "@/components/ui/round-glass-lens";
import { rocketmindHeroRotatingLines } from "@/content/rocketmind-hero";
import type { PartnerLogo } from "@/lib/partner-logos";

import { MobileNav } from "./MobileNav";
import { RocketmindMenu } from "./RocketmindMenu";

const HERO_ROTATION_INTERVAL_MS = 2800;
const HERO_ROTATION_TRANSITION_MS = 640;
const HERO_ROTATION_ENTRY_DELAY_MS = 220;
const LENS_STORAGE_KEY = "rocketmind:lens-controls:v2";
const SHOW_LENS_CONTROLS = false;

const platformTextStyle = {
  textShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
} satisfies CSSProperties;


type HeroSectionClientProps = {
  logos: PartnerLogo[];
};

type BreakpointKey = "mobile" | "tablet" | "desktop" | "wide";
type LensTab = "position" | "size" | "optical" | "motion";

type LensControlSettings = {
  smallLensXOffset: number;
  smallLensYOffset: number;
  largeLensXOffset: number;
  largeLensYOffset: number;
  smallLensSize: number;
  largeLensSize: number;
  refraction: number;
  depth: number;
  dispersion: number;
  distortionRadius: number;
  shadowRadius: number;
  blur: number;
  gradientAngle: number;
  shadowEnabled: boolean;
  motionStrengthX: number;
  motionStrengthY: number;
};

type StoredLensSettings = Partial<Record<BreakpointKey, Partial<LensControlSettings>>>;

type BreakpointPreset = LensControlSettings & {
  label: string;
  largeLensBaseGapX: number;
  largeLensBaseGapY: number;
};

const BREAKPOINT_PRESETS: Record<BreakpointKey, BreakpointPreset> = {
  mobile: {
    label: "Mobile",
    smallLensXOffset: -29,
    smallLensYOffset: -1,
    largeLensXOffset: 104,
    largeLensYOffset: 92,
    smallLensSize: 180,
    largeLensSize: 421,
    refraction: 0.059,
    depth: 0.227,
    dispersion: 1.61,
    distortionRadius: 0.9,
    shadowRadius: 0.98,
    blur: 0.599,
    gradientAngle: 308,
    shadowEnabled: true,
    motionStrengthX: 0.079,
    motionStrengthY: 0.063,
    largeLensBaseGapX: 360,
    largeLensBaseGapY: 40,
  },
  tablet: {
    label: "Tablet",
    smallLensXOffset: -49,
    smallLensYOffset: 4,
    largeLensXOffset: 128,
    largeLensYOffset: 115,
    smallLensSize: 280,
    largeLensSize: 562,
    refraction: 0.05,
    depth: 0.32,
    dispersion: 1.55,
    distortionRadius: 1.026,
    shadowRadius: 0.98,
    blur: 0.691,
    gradientAngle: 215,
    shadowEnabled: true,
    motionStrengthX: 0.086,
    motionStrengthY: 0.063,
    largeLensBaseGapX: 520,
    largeLensBaseGapY: 60,
  },
  desktop: {
    label: "Desktop",
    smallLensXOffset: -60,
    smallLensYOffset: 8,
    largeLensXOffset: 129,
    largeLensYOffset: 129,
    smallLensSize: 320,
    largeLensSize: 666,
    refraction: 0.056,
    depth: 0.308,
    dispersion: 1.04,
    distortionRadius: 1.237,
    shadowRadius: 0.98,
    blur: 0.6,
    gradientAngle: 215,
    shadowEnabled: true,
    motionStrengthX: 0.1,
    motionStrengthY: 0.061,
    largeLensBaseGapX: 640,
    largeLensBaseGapY: 72,
  },
  wide: {
    label: "Wide Desktop",
    smallLensXOffset: -47,
    smallLensYOffset: 11,
    largeLensXOffset: 118,
    largeLensYOffset: 151,
    smallLensSize: 360,
    largeLensSize: 743,
    refraction: 0.056,
    depth: 0.329,
    dispersion: 0.99,
    distortionRadius: 1.12,
    shadowRadius: 0.98,
    blur: 0.547,
    gradientAngle: 195,
    shadowEnabled: true,
    motionStrengthX: 0.032,
    motionStrengthY: 0.032,
    largeLensBaseGapX: 772,
    largeLensBaseGapY: 84,
  },
};

const HERO_EASE = [0.23, 1, 0.32, 1] as const;

function heroFadeUp(ready: boolean, delay: number) {
  return {
    initial: { opacity: 0, y: 8 } as const,
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
    transition: { duration: 0.65, delay, ease: HERO_EASE },
  };
}

function heroFadeIn(ready: boolean, delay: number) {
  return {
    initial: { opacity: 0 } as const,
    animate: ready ? { opacity: 1 } : { opacity: 0 },
    transition: { duration: 0.75, delay, ease: HERO_EASE },
  };
}

function heroScaleIn(ready: boolean, delay: number) {
  return {
    initial: { opacity: 0, scale: 0.88 } as const,
    animate: ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 },
    transition: { duration: 0.85, delay, ease: HERO_EASE },
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getBreakpointKey(width: number): BreakpointKey {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  if (width < 1440) return "desktop";
  return "wide";
}

function normalizeNumber(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }
  return clamp(value, min, max);
}

function resolveLensSettings(
  partial: Partial<LensControlSettings> | undefined,
  breakpointKey: BreakpointKey,
): LensControlSettings {
  const preset = BREAKPOINT_PRESETS[breakpointKey];
  return {
    smallLensXOffset: normalizeNumber(partial?.smallLensXOffset, preset.smallLensXOffset, -400, 400),
    smallLensYOffset: normalizeNumber(partial?.smallLensYOffset, preset.smallLensYOffset, -240, 420),
    largeLensXOffset: normalizeNumber(partial?.largeLensXOffset, preset.largeLensXOffset, -1200, 1200),
    largeLensYOffset: normalizeNumber(partial?.largeLensYOffset, preset.largeLensYOffset, -600, 600),
    smallLensSize: normalizeNumber(partial?.smallLensSize, preset.smallLensSize, 180, 900),
    largeLensSize: normalizeNumber(partial?.largeLensSize, preset.largeLensSize, 240, 2000),
    refraction: normalizeNumber(partial?.refraction, preset.refraction, 0, 0.12),
    depth: normalizeNumber(partial?.depth, preset.depth, 0, 0.5),
    dispersion: normalizeNumber(partial?.dispersion, preset.dispersion, 0, 5),
    distortionRadius: normalizeNumber(partial?.distortionRadius, preset.distortionRadius, 0.2, 1.5),
    shadowRadius: normalizeNumber(partial?.shadowRadius, preset.shadowRadius, 0.2, 1.5),
    blur: normalizeNumber(partial?.blur, preset.blur, 0, 2),
    gradientAngle: normalizeNumber(partial?.gradientAngle, preset.gradientAngle, 0, 360),
    shadowEnabled:
      typeof partial?.shadowEnabled === "boolean"
        ? partial.shadowEnabled
        : preset.shadowEnabled,
    motionStrengthX: normalizeNumber(partial?.motionStrengthX, preset.motionStrengthX, 0, 0.1),
    motionStrengthY: normalizeNumber(partial?.motionStrengthY, preset.motionStrengthY, 0, 0.1),
  };
}

function readStoredLensSettings(): StoredLensSettings {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LENS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredLensSettings) : {};
  } catch {
    return {};
  }
}

function saveStoredLensSettings(settings: StoredLensSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LENS_STORAGE_KEY, JSON.stringify(settings));
}

function ControlSlider({
  label,
  value,
  min,
  max,
  step,
  disabled,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  format?: (value: number) => string;
  onChange: (value: number) => void;
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
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        style={{ width: "100%", height: 3, accentColor: "#F0F0F0", cursor: "pointer" }}
      />
    </label>
  );
}

export function HeroSectionClient({ logos }: HeroSectionClientProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const wordmarkRef = useRef<HTMLDivElement | null>(null);
  const staticGlassRef = useRef<HTMLDivElement | null>(null);
  // settingsRef + breakpointRef used inside the static-lens effect closure
  const settingsRef = useRef<LensControlSettings>(BREAKPOINT_PRESETS.wide);
  const breakpointRef = useRef<BreakpointKey>("wide");
  const staticSyncRef = useRef<(() => void) | null>(null);

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<LensTab>("position");
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [breakpointKey, setBreakpointKey] = useState<BreakpointKey>("wide");
  const [activeRotatingLineIndex, setActiveRotatingLineIndex] = useState(0);
  const [settings, setSettings] = useState<LensControlSettings>(
    BREAKPOINT_PRESETS.wide,
  );
  const [heroReady, setHeroReady] = useState(false);
  const [smallLensReady, setSmallLensReady] = useState(false);
  const [largeLensReady, setLargeLensReady] = useState(false);

  const breakpointPreset = BREAKPOINT_PRESETS[breakpointKey];

  const effectiveLargeLensSize = useMemo(() => {
    return clamp(
      breakpointPreset.largeLensSize +
        (settings.largeLensSize - breakpointPreset.largeLensSize) * 2,
      240,
      2200,
    );
  }, [breakpointPreset.largeLensSize, settings.largeLensSize]);

  const smallLensStyle = useMemo<CSSProperties>(
    () => ({
      opacity: smallLensReady ? 1 : 0,
      transition: "opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
    }),
    [smallLensReady],
  );

  const largeLensStyle = useMemo(
    () =>
      ({
        "--lens-gradient-angle": `${settings.gradientAngle}deg`,
        height: `${effectiveLargeLensSize}px`,
        width: `${effectiveLargeLensSize}px`,
      }) as CSSProperties,
    [effectiveLargeLensSize, settings.gradientAngle],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Hero entrance animations ──────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!heroReady) return;
    const t1 = setTimeout(() => setSmallLensReady(true), 2100);
    const t2 = setTimeout(() => setLargeLensReady(true), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [heroReady]);

  // ── Viewport / breakpoint sync ────────────────────────────────────────────
  useEffect(() => {
    const syncViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const nextBreakpoint = getBreakpointKey(width);
      setViewport({ width, height });
      if (breakpointRef.current !== nextBreakpoint) {
        breakpointRef.current = nextBreakpoint;
        setBreakpointKey(nextBreakpoint);
        const stored = readStoredLensSettings();
        const nextSettings = resolveLensSettings(stored[nextBreakpoint], nextBreakpoint);
        settingsRef.current = nextSettings;
        setSettings(nextSettings);
      }
    };

    const width = window.innerWidth;
    const initialBreakpoint = getBreakpointKey(width);
    const stored = readStoredLensSettings();
    const initialSettings = resolveLensSettings(stored[initialBreakpoint], initialBreakpoint);
    breakpointRef.current = initialBreakpoint;
    settingsRef.current = initialSettings;
    setBreakpointKey(initialBreakpoint);
    setViewport({ width, height: window.innerHeight });
    setSettings(initialSettings);

    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  // ── Rotating headline ────────────────────────────────────────────────────
  useEffect(() => {
    if (rocketmindHeroRotatingLines.length <= 1) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    const intervalId = window.setInterval(() => {
      setActiveRotatingLineIndex((prev) => (prev + 1) % rocketmindHeroRotatingLines.length);
    }, HERO_ROTATION_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, []);

  // ── Keep settingsRef in sync + re-position static lens ───────────────────
  useEffect(() => {
    settingsRef.current = settings;
    staticSyncRef.current?.();
  }, [settings, effectiveLargeLensSize]);

  // ── Static (large) lens: position + subtle parallax ──────────────────────
  useEffect(() => {
    const hero = heroRef.current;
    const wordmark = wordmarkRef.current;
    const staticGlass = staticGlassRef.current;
    if (!hero || !wordmark || !staticGlass) return;

    const prefersFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frameId = 0;
    let resizeObserver: ResizeObserver | null = null;
    const current = { x: 0, y: 0 };
    const target  = { x: 0, y: 0 };
    const limit   = 102.4;
    const parallaxStrength = 0.008;

    const syncStaticPosition = () => {
      const currentSettings = settingsRef.current;
      const preset = BREAKPOINT_PRESETS[breakpointRef.current];
      const heroRect = hero.getBoundingClientRect();
      const wordmarkImage =
        wordmark.querySelector("img") ||
        wordmark.querySelector("svg") ||
        wordmark;
      const wordmarkRect = wordmarkImage.getBoundingClientRect();
      const parent = (staticGlass.offsetParent ?? hero) as HTMLElement;
      const parentRect = parent.getBoundingClientRect();
      const parentLeft = parentRect.left - heroRect.left;
      const parentTop  = parentRect.top  - heroRect.top;

      const primaryLensLeft =
        heroRect.width / 2 + currentSettings.smallLensXOffset;
      const primaryLensTop =
        wordmarkRect.top - heroRect.top +
        wordmarkRect.height / 2 +
        currentSettings.smallLensYOffset;

      const staticLensLeft =
        primaryLensLeft +
        preset.largeLensBaseGapX +
        currentSettings.largeLensXOffset * 2;
      const staticLensTop =
        primaryLensTop +
        preset.largeLensBaseGapY +
        currentSettings.largeLensYOffset * 2;

      staticGlass.style.left = `${staticLensLeft - parentLeft}px`;
      staticGlass.style.top  = `${staticLensTop  - parentTop}px`;
    };

    const render = () => {
      frameId = 0;
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      staticGlass.style.transform = `translate3d(calc(-50% + ${current.x}px), calc(-50% + ${current.y}px), 0)`;
      if (Math.abs(target.x - current.x) > 0.1 || Math.abs(target.y - current.y) > 0.1) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const scheduleRender = () => {
      if (!frameId) frameId = window.requestAnimationFrame(render);
    };

    const syncAll = () => { syncStaticPosition(); scheduleRender(); };

    staticSyncRef.current = syncAll;
    syncAll();
    staticGlass.style.transform = "translate3d(-50%, -50%, 0)";

    const handleMove = (event: PointerEvent) => {
      if (!prefersFinePointer || prefersReducedMotion) return;
      const rect = hero.getBoundingClientRect();
      target.x = clamp((event.clientX - rect.left - rect.width  / 2) * parallaxStrength, -limit, limit);
      target.y = clamp((event.clientY - rect.top  - rect.height / 2) * parallaxStrength, -limit, limit);
      scheduleRender();
    };

    const handleLeave = () => { target.x = 0; target.y = 0; scheduleRender(); };

    if (prefersFinePointer && !prefersReducedMotion) {
      hero.addEventListener("pointermove", handleMove);
      hero.addEventListener("pointerleave", handleLeave);
    }

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => syncAll());
      resizeObserver.observe(hero);
      resizeObserver.observe(wordmark);
      resizeObserver.observe(staticGlass);
    }

    window.addEventListener("resize", syncAll);

    return () => {
      staticSyncRef.current = null;
      if (frameId) window.cancelAnimationFrame(frameId);
      hero.removeEventListener("pointermove", handleMove);
      hero.removeEventListener("pointerleave", handleLeave);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", syncAll);
    };
  }, []);

  // ── Dev controls panel save ───────────────────────────────────────────────
  const [saveFlash, setSaveFlash] = useState(false);
  const handleSave = () => {
    const stored = readStoredLensSettings();
    stored[breakpointKey] = settings;
    saveStoredLensSettings(stored);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 800);
  };

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
  };

  const labelStyle: CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#939393",
  };

  const valueStyle: CSSProperties = {
    fontVariantNumeric: "tabular-nums",
    color: "#F0F0F0",
  };

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
  });

  const controls =
    mounted && SHOW_LENS_CONTROLS
      ? createPortal(
          <div style={panelStyle} data-lens-hide="true">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontFamily: "var(--font-heading-family, sans-serif)", fontSize: 16, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", textTransform: "uppercase" as const }}>
                  LENS CONTROLS
                </div>
                <div style={{ ...labelStyle, marginTop: 2, opacity: 0.5 }}>
                  {breakpointPreset.label} · {viewport.width}px × {viewport.height}px
                </div>
              </div>
              <button
                type="button"
                onClick={handleSave}
                style={{
                  height: 28,
                  padding: "0 10px",
                  border: `1px solid ${saveFlash ? "#FFCC00" : "rgba(64,64,64,1)"}`,
                  borderRadius: 6,
                  background: saveFlash ? "rgba(255,204,0,0.12)" : "transparent",
                  color: saveFlash ? "#FFCC00" : "#939393",
                  fontSize: 11,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 150ms",
                }}
              >
                {saveFlash ? "SAVED ✓" : "СОХРАНИТЬ"}
              </button>
            </div>

            <div style={{ display: "flex", gap: 4, marginBottom: 14, borderBottom: "1px solid rgba(64,64,64,1)", paddingBottom: 0 }}>
              {([
                { id: "position", label: "ПОЗИЦИЯ" },
                { id: "size", label: "РАЗМЕР" },
                { id: "optical", label: "ИСКАЖЕНИЕ" },
                { id: "motion", label: "ДВИЖЕНИЕ" },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  style={tabBaseStyle(activeTab === tab.id)}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              {activeTab === "position" && (
                <>
                  <ControlSlider label="МАЛАЯ ЛИНЗА X" value={settings.smallLensXOffset}
                    min={-400} max={400} step={1} format={(v) => `${Math.round(v)}PX`}
                    onChange={(v) => setSettings((p) => ({ ...p, smallLensXOffset: v }))} />
                  <ControlSlider label="МАЛАЯ ЛИНЗА Y" value={settings.smallLensYOffset}
                    min={-240} max={420} step={1} format={(v) => `${Math.round(v)}PX`}
                    onChange={(v) => setSettings((p) => ({ ...p, smallLensYOffset: v }))} />
                  <ControlSlider label="БОЛЬШАЯ ЛИНЗА X" value={settings.largeLensXOffset}
                    min={-1200} max={1200} step={1} format={(v) => `${Math.round(v)}PX`}
                    onChange={(v) => setSettings((p) => ({ ...p, largeLensXOffset: v }))} />
                  <ControlSlider label="БОЛЬШАЯ ЛИНЗА Y" value={settings.largeLensYOffset}
                    min={-600} max={600} step={1} format={(v) => `${Math.round(v)}PX`}
                    onChange={(v) => setSettings((p) => ({ ...p, largeLensYOffset: v }))} />
                </>
              )}
              {activeTab === "size" && (
                <>
                  <ControlSlider label="МАЛАЯ ЛИНЗА" value={settings.smallLensSize}
                    min={180} max={900} step={1} format={(v) => `${Math.round(v)}PX`}
                    onChange={(v) => setSettings((p) => ({ ...p, smallLensSize: v }))} />
                  <ControlSlider label="БОЛЬШАЯ ЛИНЗА" value={settings.largeLensSize}
                    min={240} max={2000} step={1} format={(v) => `${Math.round(v)}PX`}
                    onChange={(v) => setSettings((p) => ({ ...p, largeLensSize: v }))} />
                </>
              )}
              {activeTab === "optical" && (
                <>
                  <ControlSlider label="REFRACTION" value={settings.refraction}
                    min={0} max={0.12} step={0.001}
                    onChange={(v) => setSettings((p) => ({ ...p, refraction: v }))} />
                  <ControlSlider label="DEPTH" value={settings.depth}
                    min={0} max={0.5} step={0.001}
                    onChange={(v) => setSettings((p) => ({ ...p, depth: v }))} />
                  <ControlSlider label="DISPERSION" value={settings.dispersion}
                    min={0} max={5} step={0.01}
                    onChange={(v) => setSettings((p) => ({ ...p, dispersion: v }))} />
                  <ControlSlider label="DISTORTION RADIUS" value={settings.distortionRadius}
                    min={0.2} max={1.5} step={0.001}
                    onChange={(v) => setSettings((p) => ({ ...p, distortionRadius: v }))} />
                  <ControlSlider label="BLUR" value={settings.blur}
                    min={0} max={2} step={0.001}
                    onChange={(v) => setSettings((p) => ({ ...p, blur: v }))} />
                  <ControlSlider label="GRADIENT ANGLE" value={settings.gradientAngle}
                    min={0} max={360} step={1}
                    format={(v) => `${Math.round(v)}°`}
                    onChange={(v) => setSettings((p) => ({ ...p, gradientAngle: v }))} />
                </>
              )}
              {activeTab === "motion" && (
                <>
                  <ControlSlider label="FOLLOW X" value={settings.motionStrengthX}
                    min={0} max={0.1} step={0.001}
                    onChange={(v) => setSettings((p) => ({ ...p, motionStrengthX: v }))} />
                  <ControlSlider label="FOLLOW Y" value={settings.motionStrengthY}
                    min={0} max={0.1} step={0.001}
                    onChange={(v) => setSettings((p) => ({ ...p, motionStrengthY: v }))} />
                </>
              )}
            </div>

            <div style={{ ...labelStyle, marginTop: 14, opacity: 0.5, lineHeight: 1.4 }}>
              Сохраняется отдельно для текущего адаптива.
              Параметры искажения — в панели линзы (showControls).
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <section
        ref={heroRef}
        className="relative isolate overflow-hidden bg-background text-foreground dark"
      >
        <div className="absolute inset-0">
          <img
            alt=""
            aria-hidden="true"
            src="/hero-art/hero-bg.png"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="hero-background-fade" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1512px] flex-col px-5 pb-6 pt-6 md:px-8 md:pb-10 md:pt-10 xl:px-14">
          <motion.div className="hero-top-bar relative z-20 flex flex-col gap-6" {...heroFadeUp(heroReady, 0)}>
            <InfiniteLogoMarquee logos={logos} maxLogoHeight={breakpointKey === "mobile" ? 27 : 39} reverse />

            <div
              data-lens-hide="true"
              className="hero-top-bar-right flex shrink-0 items-start justify-between gap-4"
            >
              <div className="hero-top-bar-stats text-left">
                <p className="font-heading text-[20px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-foreground md:text-[24px]">
                  <span className="text-muted-foreground">120+ клиентов </span>
                  19 лет опыта
                </p>
                <p className="font-heading text-[20px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-foreground md:text-[24px]">
                  в бизнес-моделировании
                </p>
              </div>

              <MobileNav />
            </div>
          </motion.div>

          <div className="relative flex flex-1 flex-col justify-center gap-6 py-4 md:gap-[44px] md:py-8">
            <motion.div ref={wordmarkRef} className="relative z-0 w-full" {...heroFadeIn(heroReady, 0.15)}>
              <Image
                src="/text_logo_dark_background_en.svg"
                alt="Rocketmind"
                width={1600}
                height={267}
                priority
                className="mx-auto h-auto w-full max-w-none"
              />
            </motion.div>

            {/* Small WebGL lens — managed by RoundGlassLens component */}
            <RoundGlassLens
              sceneRef={heroRef}
              anchorRef={wordmarkRef}
              xOffset={settings.smallLensXOffset}
              yOffset={settings.smallLensYOffset}
              size={settings.smallLensSize}
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
              showControls={false}
              style={smallLensStyle}
            />

            {/* Large static CSS lens */}
            <div
              ref={staticGlassRef}
              aria-hidden="true"
              data-lens-ignore="true"
              className="round-glass-lens round-glass-lens--static pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                ...largeLensStyle,
                opacity: largeLensReady ? 1 : 0,
                transition: "opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            />

            <motion.div data-lens-hide="true" className="relative z-30" {...heroFadeUp(heroReady, 0.28)}>
              <RocketmindMenu className="hero-menu-desktop w-full flex-wrap items-center justify-end gap-x-7 gap-y-4 text-right" />
            </motion.div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,888px)_212px] lg:items-end lg:justify-between">
            <motion.div className="flex flex-col items-start gap-6" {...heroFadeUp(heroReady, 0.22)}>
              <h1 className="h2 w-full max-w-[888px]">
                <span className="block text-foreground">Помогаем бизнесу&nbsp;расти</span>
                <span className="block text-foreground">и масштабироваться</span>
                <span className="hero-rotating-line-viewport relative block text-muted-foreground">
                  <AnimatePresence initial={false}>
                    <motion.p
                      key={activeRotatingLineIndex}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{
                        delay: HERO_ROTATION_ENTRY_DELAY_MS / 1000,
                        duration: HERO_ROTATION_TRANSITION_MS / 1000,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                      className="absolute inset-x-0 top-0 md:whitespace-nowrap"
                    >
                      {rocketmindHeroRotatingLines[activeRotatingLineIndex]}
                    </motion.p>
                  </AnimatePresence>
                </span>
              </h1>

              <Link
                href="#contact"
                className="h4 inline-flex items-center gap-3 text-foreground transition-[opacity,color] duration-150 hover:opacity-88"
              >
                <span>Обсудить стратегию</span>
                <ArrowRight size={20} strokeWidth={2.1} className="text-primary" />
              </Link>
            </motion.div>

            <motion.div className="flex flex-row items-center gap-4 self-end lg:flex-col lg:items-end lg:gap-5" {...heroFadeUp(heroReady, 0.38)}>
              <Image
                src="/hero-art/pik-logo.svg"
                alt="Platform Innovation Kit"
                width={200}
                height={45}
                className="h-[40px] w-auto min-w-0 flex-1 object-contain object-left md:h-[56px] lg:h-auto lg:flex-none lg:w-[200px]"
              />
              <p
                className="min-w-0 flex-1 text-left font-mono text-[10px] uppercase leading-[1.32] tracking-[0.01em] text-muted-foreground md:text-[14px] lg:flex-none lg:text-right"
                style={platformTextStyle}
              >
                Развиваем методологию
                <br />
                и представляем PIK
                <br />
                в России и странах Азии
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      {controls}
    </>
  );
}
