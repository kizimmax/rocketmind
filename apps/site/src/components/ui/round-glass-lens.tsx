"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

// ── WebGL Shaders ─────────────────────────────────────────────────────────────

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  uniform sampler2D uSceneTexture;
  uniform vec2 uCanvasSize;
  uniform vec2 uLensSize;
  uniform vec2 uLensCenter;
  uniform vec2 uSceneSize;
  uniform float uRefractionStrength;
  uniform float uDepthStrength;
  uniform float uDispersionStrength;
  uniform float uDistortionRadius;
  uniform float uShadowRadius;
  uniform float uBlurStrength;
  uniform float uShadowEnabled;

  float luminance(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
  }

  vec4 sampleScene(vec2 uv) {
    return texture2D(uSceneTexture, clamp(uv, vec2(0.0), vec2(1.0)));
  }

  void main() {
    vec2 pixel = vec2(gl_FragCoord.x, uCanvasSize.y - gl_FragCoord.y);
    vec2 localOffset = (pixel - (0.5 * uCanvasSize)) * (uLensSize / uCanvasSize);
    float radius = min(uLensSize.x, uLensSize.y) * 0.5;
    float distanceToCenter = length(localOffset);

    if (distanceToCenter > radius) { discard; }

    float normalized = clamp(distanceToCenter / radius, 0.0, 1.0);
    vec2 direction = distanceToCenter > 0.0001
      ? localOffset / distanceToCenter
      : vec2(1.0, 0.0);
    vec2 tangent = vec2(-direction.y, direction.x);

    float distortionCenter = clamp(uDistortionRadius / 1.5, 0.18, 1.0);
    float distortionBand = smoothstep(
      max(0.0, distortionCenter - 0.24),
      min(1.0, distortionCenter + 0.04),
      normalized
    );
    float distortionFalloff = pow(normalized, 2.35) * distortionBand;
    vec2 refractOffset = direction * radius * uRefractionStrength *
      (0.65 + uDepthStrength * 2.2) * distortionFalloff;
    vec2 sampleOffset = localOffset - refractOffset;

    vec2 baseUv = (uLensCenter + sampleOffset) / uSceneSize;
    vec4 baseSample = sampleScene(baseUv);

    float blurAmount = radius * uBlurStrength * 0.0085 * distortionBand;
    vec2 blurDirUv = (direction * blurAmount) / uSceneSize;
    vec2 blurTanUv = (tangent * blurAmount) / uSceneSize;

    vec4 blurredBase = (
      baseSample * 2.0 +
      sampleScene(baseUv + blurDirUv) +
      sampleScene(baseUv - blurDirUv) +
      sampleScene(baseUv + blurTanUv) +
      sampleScene(baseUv - blurTanUv)
    ) / 6.0;

    vec3 baseColor = mix(
      baseSample.rgb,
      blurredBase.rgb,
      clamp(uBlurStrength * 0.22 * distortionBand, 0.0, 0.85)
    );

    float chromaticBand = smoothstep(
      max(0.0, distortionCenter - 0.18),
      min(1.0, distortionCenter + 0.16 + uDispersionStrength * 0.035),
      normalized
    );

    float dispersionDistance = radius *
      (0.0018 + uDispersionStrength * 0.0026) *
      (0.55 + chromaticBand);
    vec2 chromaticUvOffset = (direction * dispersionDistance) / uSceneSize;
    vec2 fringeBlurUv = ((direction + tangent * 0.75) * blurAmount * 1.3) / uSceneSize;
    vec2 fringeBlurOppositeUv = ((direction - tangent * 0.75) * blurAmount * 1.3) / uSceneSize;

    vec2 warmUv = baseUv + chromaticUvOffset;
    vec2 coolUv = baseUv - chromaticUvOffset;

    vec4 warmSample = (
      sampleScene(warmUv) * 2.0 +
      sampleScene(warmUv + fringeBlurUv) +
      sampleScene(warmUv - fringeBlurUv) +
      sampleScene(warmUv + fringeBlurOppositeUv) +
      sampleScene(warmUv - fringeBlurOppositeUv)
    ) / 6.0;

    vec4 coolSample = (
      sampleScene(coolUv) * 2.0 +
      sampleScene(coolUv + fringeBlurUv) +
      sampleScene(coolUv - fringeBlurUv) +
      sampleScene(coolUv + fringeBlurOppositeUv) +
      sampleScene(coolUv - fringeBlurOppositeUv)
    ) / 6.0;

    float baseLum = luminance(baseSample.rgb);
    float warmContrast = max(0.0, luminance(warmSample.rgb) - baseLum);
    float coolContrast = max(0.0, luminance(coolSample.rgb) - baseLum);
    float contrastMask = smoothstep(0.012, 0.24, warmContrast + coolContrast);

    vec3 warmTint = vec3(1.0, 0.913, 0.0);
    vec3 coolTint = vec3(0.631, 0.447, 0.973);

    float warmMask = chromaticBand * contrastMask * (0.22 + uDispersionStrength * 0.42);
    float coolMask = chromaticBand * contrastMask * (0.26 + uDispersionStrength * 0.54);

    vec3 warmFringe = max(warmSample.rgb - baseSample.rgb, vec3(0.0));
    vec3 coolFringe = max(coolSample.rgb - baseSample.rgb, vec3(0.0));

    vec3 color = baseColor;
    color += warmFringe * warmTint * warmMask * 2.2;
    color += coolFringe * coolTint * coolMask * 2.8;

    vec3 fringeBlurredColor = (baseColor + warmSample.rgb + coolSample.rgb + blurredBase.rgb) / 4.0;
    color = mix(color, fringeBlurredColor,
      clamp(uBlurStrength * chromaticBand * contrastMask * 0.42, 0.0, 0.9));

    float logoMask = smoothstep(0.62, 0.94, baseLum);
    float shadowBand = smoothstep(
      max(0.0, clamp(uShadowRadius / 1.5, 0.18, 1.0) - 0.18),
      1.0,
      normalized
    );
    float shadowStrength = uShadowEnabled * shadowBand * (1.0 - logoMask) * 0.12;
    color = mix(color, color * 0.58, shadowStrength);

    float alpha = 1.0 - smoothstep(0.985, 1.0, normalized);
    gl_FragColor = vec4(color, baseSample.a * alpha);
  }
`;

// ── Constants ─────────────────────────────────────────────────────────────────

const CAPTURE_THROTTLE_MS = 90;
// Capture at 1× regardless of devicePixelRatio — the glass distortion blurs
// fine detail anyway, and lower resolution dramatically reduces capture time.
const MAX_CAPTURE_SCALE = 1.0;
const PARALLAX_LIMIT = 102.4;

// ── Types ─────────────────────────────────────────────────────────────────────

export type RoundGlassLensSettings = {
  /** Refraction strength. Range: 0–0.12. */
  refraction: number;
  /** Depth (lens curvature). Range: 0–0.5. */
  depth: number;
  /** Chromatic dispersion. Range: 0–5. */
  dispersion: number;
  /** Distortion ring radius factor. Range: 0.2–1.5. */
  distortionRadius: number;
  /** Inner shadow radius. Range: 0.2–1.5. */
  shadowRadius: number;
  /** Radial blur strength. Range: 0–2. */
  blur: number;
  /** Border ring gradient angle in degrees. Range: 0–360. */
  gradientAngle: number;
  /** Enable inner edge shadow. */
  shadowEnabled: boolean;
  /** Parallax strength along X axis. Range: 0–0.1. */
  motionStrengthX: number;
  /** Parallax strength along Y axis. Range: 0–0.1. */
  motionStrengthY: number;
};

export const ROUND_GLASS_LENS_DEFAULTS: RoundGlassLensSettings = {
  refraction: 0.03,
  depth: 0.18,
  dispersion: 0.36,
  distortionRadius: 1.08,
  shadowRadius: 0.98,
  blur: 0.18,
  gradientAngle: 205,
  shadowEnabled: true,
  motionStrengthX: 0.032,
  motionStrengthY: 0.032,
};

export type RoundGlassLensProps = {
  /**
   * The DOM element whose contents will be captured and distorted.
   * Must be a parent or overlapping ancestor of the lens position.
   */
  sceneRef: RefObject<HTMLElement | null>;

  /** Diameter of the lens in px. Default: 320 */
  size?: number;

  /**
   * Center X of the lens in px, relative to the sceneRef element.
   * Defaults to the scene's horizontal center.
   */
  x?: number;

  /**
   * Center Y of the lens in px, relative to the sceneRef element.
   * Defaults to the scene's vertical center.
   */
  y?: number;

  /**
   * Alternative positioning: follow this element's center.
   * Takes priority over x/y if provided.
   */
  anchorRef?: RefObject<HTMLElement | null>;

  /**
   * Horizontal offset from the anchor's center in px. Default: 0.
   * Also used as offset from scene center when neither x/y nor anchorRef is set.
   */
  xOffset?: number;

  /**
   * Vertical offset from the anchor's center in px. Default: 0.
   * Also used as offset from scene center when neither x/y nor anchorRef is set.
   */
  yOffset?: number;

  // ── Optical settings (all optional, defaults applied) ────────────────────

  /** Refraction strength. Range: 0–0.12. Default: 0.03 */
  refraction?: number;
  /** Depth (lens curvature). Range: 0–0.5. Default: 0.18 */
  depth?: number;
  /** Chromatic dispersion. Range: 0–5. Default: 0.36 */
  dispersion?: number;
  /** Distortion ring radius factor. Range: 0.2–1.5. Default: 1.08 */
  distortionRadius?: number;
  /** Inner shadow radius. Range: 0.2–1.5. Default: 0.98 */
  shadowRadius?: number;
  /** Radial blur strength. Range: 0–2. Default: 0.18 */
  blur?: number;
  /** Border ring gradient angle in degrees. Range: 0–360. Default: 205 */
  gradientAngle?: number;
  /** Enable inner edge shadow. Default: true */
  shadowEnabled?: boolean;

  /** Parallax strength along X axis. Range: 0–0.1. Default: 0.032 */
  motionStrengthX?: number;
  /** Parallax strength along Y axis. Range: 0–0.1. Default: 0.032 */
  motionStrengthY?: number;

  // ── Behaviour ────────────────────────────────────────────────────────────

  /**
   * Enable mouse-follow parallax motion. Listens on `sceneRef`.
   * Defaults to `true` on pointer:fine devices.
   */
  motionParallax?: boolean;

  /**
   * When true, pointer events are captured on `window` and the parallax
   * displacement is calculated relative to the viewport center instead of
   * the sceneRef center. Use this when the lens should react to the cursor
   * anywhere on the screen, not just within the scene element.
   */
  parallaxOnWindow?: boolean;

  /**
   * Called once after the first successful WebGL render with a captured scene texture.
   * On mobile (CSS-only mode) it fires after the initial position sync.
   * Use this to fade in the lens container only when the effect is ready.
   */
  onReady?: () => void;

  // ── Dev controls ─────────────────────────────────────────────────────────

  /**
   * Show the floating dev controls panel for live tweaking.
   * When true, the panel overrides optical prop values.
   */
  showControls?: boolean;

  /**
   * localStorage key for persisting panel settings across reloads.
   * Only used when showControls is true.
   */
  storageKey?: string;

  /** Additional CSS classes on the lens container div. */
  className?: string;

  /** Additional inline styles on the lens container div. */
  style?: CSSProperties;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function clampVal(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function loadStoredSettings(key: string): Partial<RoundGlassLensSettings> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Partial<RoundGlassLensSettings>) : {};
  } catch {
    return {};
  }
}

function saveStoredSettings(key: string, settings: RoundGlassLensSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(settings));
}

function resolveSettings(
  props: RoundGlassLensProps,
  overrides?: Partial<RoundGlassLensSettings>,
): RoundGlassLensSettings {
  const D = ROUND_GLASS_LENS_DEFAULTS;
  return {
    refraction: overrides?.refraction ?? props.refraction ?? D.refraction,
    depth: overrides?.depth ?? props.depth ?? D.depth,
    dispersion: overrides?.dispersion ?? props.dispersion ?? D.dispersion,
    distortionRadius: overrides?.distortionRadius ?? props.distortionRadius ?? D.distortionRadius,
    shadowRadius: overrides?.shadowRadius ?? props.shadowRadius ?? D.shadowRadius,
    blur: overrides?.blur ?? props.blur ?? D.blur,
    gradientAngle: overrides?.gradientAngle ?? props.gradientAngle ?? D.gradientAngle,
    shadowEnabled: overrides?.shadowEnabled ?? props.shadowEnabled ?? D.shadowEnabled,
    motionStrengthX: overrides?.motionStrengthX ?? props.motionStrengthX ?? D.motionStrengthX,
    motionStrengthY: overrides?.motionStrengthY ?? props.motionStrengthY ?? D.motionStrengthY,
  };
}

// ── Sub-component: ControlSlider ──────────────────────────────────────────────

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
    <label className={`lens-controls-row${disabled ? " is-disabled" : ""}`}>
      <div className="lens-controls-row__header">
        <span>{label}</span>
        <span>{format ? format(value) : value.toFixed(3)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </label>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

/**
 * RoundGlassLens — a WebGL round glass lens effect that captures and distorts
 * the underlying scene with refraction, chromatic dispersion, and blur.
 *
 * Must be placed inside a `position: relative` container.
 * The `sceneRef` should point to the element to capture (usually the same container
 * or a parent ancestor).
 *
 * @example
 * ```tsx
 * const sceneRef = useRef<HTMLDivElement>(null);
 * const logoRef  = useRef<HTMLImageElement>(null);
 *
 * <div ref={sceneRef} className="relative overflow-hidden">
 *   <img ref={logoRef} src="/logo.svg" />
 *   <RoundGlassLens
 *     sceneRef={sceneRef}
 *     anchorRef={logoRef}
 *     size={320}
 *     dispersion={0.4}
 *     motionParallax
 *   />
 * </div>
 * ```
 */
export function RoundGlassLens(props: RoundGlassLensProps) {
  const {
    sceneRef,
    size = 320,
    x,
    y,
    anchorRef,
    xOffset = 0,
    yOffset = 0,
    motionParallax,
    parallaxOnWindow = false,
    onReady,
    showControls = false,
    storageKey,
    className,
    style: externalStyle,
  } = props;

  const glassRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const syncRef = useRef<(() => void) | null>(null);
  const settingsRef = useRef<RoundGlassLensSettings>(resolveSettings(props));
  const onReadyRef = useRef<(() => void) | undefined>(onReady);
  onReadyRef.current = onReady;

  // Position props kept in a ref so syncPosition() always reads latest values
  // without requiring a WebGL context teardown/rebuild.
  const positionRef = useRef({ x, y, xOffset, yOffset, anchorRef });

  const [mounted, setMounted] = useState(false);
  // containerVisible: ring + backdrop-blur show after first position sync (before capture)
  const [containerVisible, setContainerVisible] = useState(false);
  // canvasReady: canvas fades in after first successful WebGL render with captured texture
  const [canvasReady, setCanvasReady] = useState(false);
  const [activeTab, setActiveTab] = useState<"optical" | "shape" | "style" | "motion">("optical");

  // Panel settings — initialized from props, localStorage loaded after mount (SSR-safe)
  const [panelSettings, setPanelSettings] = useState<RoundGlassLensSettings>(() =>
    resolveSettings(props),
  );

  // Load saved settings from localStorage after mount (client-only)
  useEffect(() => {
    if (!showControls || !storageKey) return;
    const stored = loadStoredSettings(storageKey);
    if (Object.keys(stored).length > 0) {
      setPanelSettings((prev) => ({ ...prev, ...stored }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save to localStorage when panel settings change
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!showControls || !storageKey) return;
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    saveStoredSettings(storageKey, panelSettings);
  }, [showControls, storageKey, panelSettings]);

  // Effective settings: panel takes over when showControls=true, otherwise follow props.
  // useMemo prevents a new object reference on every parent re-render, which would otherwise
  // cause the settings effect below to fire (and trigger html2canvas) on every re-render.
  const effectiveSettings = useMemo<RoundGlassLensSettings>(
    () => (showControls ? panelSettings : resolveSettings(props)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      showControls, panelSettings,
      props.refraction, props.depth, props.dispersion,
      props.distortionRadius, props.shadowRadius, props.blur,
      props.gradientAngle, props.shadowEnabled,
      props.motionStrengthX, props.motionStrengthY,
    ],
  );

  // Container (ring + backdrop-blur) fades in after first position sync
  const lensStyle = useMemo<CSSProperties>(
    () => ({
      "--lens-gradient-angle": `${effectiveSettings.gradientAngle}deg`,
      width: `${size}px`,
      height: `${size}px`,
      opacity: containerVisible ? 1 : 0,
      transition: containerVisible ? "opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1)" : undefined,
      ...externalStyle,
    } as CSSProperties),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [effectiveSettings.gradientAngle, size, externalStyle, containerVisible],
  );

  // Canvas (distortion) cross-fades in over the blur when WebGL texture is ready
  const canvasStyle = useMemo<CSSProperties>(
    () => ({
      opacity: canvasReady ? 1 : 0,
      transition: canvasReady ? "opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1)" : undefined,
    }),
    [canvasReady],
  );

  // Sync position props to ref → triggers re-position without WebGL teardown
  useEffect(() => {
    positionRef.current = { x, y, xOffset, yOffset, anchorRef };
    syncRef.current?.();
  }, [x, y, xOffset, yOffset, anchorRef]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Preload html2canvas during browser idle time so the first capture starts
  // without waiting for the dynamic import to resolve.
  useEffect(() => {
    const preload = () => { void import("html2canvas"); };
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(preload, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(preload, 200);
    return () => clearTimeout(id);
  }, []);

  // Keep settingsRef in sync so the WebGL render loop always reads latest values
  useEffect(() => {
    settingsRef.current = effectiveSettings;
    syncRef.current?.();
  }, [effectiveSettings]);

  // ── WebGL lifecycle ───────────────────────────────────────────────────────
  useEffect(() => {
    const glass = glassRef.current;
    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    if (!glass || !canvas || !scene) return;

    // ── CSS-only mode on mobile (<640px): gradient border ring, no WebGL ──────
    if (window.innerWidth < 640) {
      let mobileResizeObserver: ResizeObserver | null = null;

      const syncMobile = () => {
        const { x: cx, y: cy, xOffset: cxo, yOffset: cyo, anchorRef: car } = positionRef.current;
        const sceneRect = scene.getBoundingClientRect();
        const parent = (glass.offsetParent ?? document.body) as HTMLElement;
        const parentRect = parent.getBoundingClientRect();
        let vx: number;
        let vy: number;
        if (car?.current) {
          const r = car.current.getBoundingClientRect();
          vx = r.left + r.width / 2 + (cxo ?? 0);
          vy = r.top + r.height / 2 + (cyo ?? 0);
        } else if (cx !== undefined && cy !== undefined) {
          vx = sceneRect.left + cx;
          vy = sceneRect.top + cy;
        } else {
          vx = sceneRect.left + sceneRect.width / 2 + (cxo ?? 0);
          vy = sceneRect.top + sceneRect.height / 2 + (cyo ?? 0);
        }
        glass.style.left = `${vx - parentRect.left}px`;
        glass.style.top = `${vy - parentRect.top}px`;
        glass.style.transform = "translate3d(-50%, -50%, 0)";
      };

      syncRef.current = syncMobile;
      syncMobile();
      setContainerVisible(true);
      onReadyRef.current?.();

      if (typeof ResizeObserver !== "undefined") {
        mobileResizeObserver = new ResizeObserver(syncMobile);
        mobileResizeObserver.observe(scene);
        mobileResizeObserver.observe(glass);
        if (anchorRef?.current) mobileResizeObserver.observe(anchorRef.current);
      }
      window.addEventListener("resize", syncMobile);

      return () => {
        syncRef.current = null;
        mobileResizeObserver?.disconnect();
        window.removeEventListener("resize", syncMobile);
      };
    }

    // ── Full WebGL mode (desktop) ─────────────────────────────────────────────
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
    });
    if (!gl) return;

    const prefersFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const parallaxEnabled = motionParallax !== undefined ? motionParallax : prefersFinePointer;

    // ── Shader setup ─────────────────────────────────────────────────────────
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("RoundGlassLens shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("RoundGlassLens program error:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    const positionLocation   = gl.getAttribLocation(program, "aPosition");
    const sceneTexLoc        = gl.getUniformLocation(program, "uSceneTexture");
    const canvasSizeLoc      = gl.getUniformLocation(program, "uCanvasSize");
    const lensSizeLoc        = gl.getUniformLocation(program, "uLensSize");
    const lensCenterLoc      = gl.getUniformLocation(program, "uLensCenter");
    const sceneSizeLoc       = gl.getUniformLocation(program, "uSceneSize");
    const refractionLoc      = gl.getUniformLocation(program, "uRefractionStrength");
    const depthLoc           = gl.getUniformLocation(program, "uDepthStrength");
    const dispersionLoc      = gl.getUniformLocation(program, "uDispersionStrength");
    const distortionRadLoc   = gl.getUniformLocation(program, "uDistortionRadius");
    const shadowRadLoc       = gl.getUniformLocation(program, "uShadowRadius");
    const blurLoc            = gl.getUniformLocation(program, "uBlurStrength");
    const shadowEnabledLoc   = gl.getUniformLocation(program, "uShadowEnabled");

    if (
      positionLocation < 0 || !sceneTexLoc || !canvasSizeLoc || !lensSizeLoc ||
      !lensCenterLoc || !sceneSizeLoc || !refractionLoc || !depthLoc ||
      !dispersionLoc || !distortionRadLoc || !shadowRadLoc || !blurLoc || !shadowEnabledLoc
    ) {
      gl.deleteProgram(program);
      return;
    }

    const positionBuffer = gl.createBuffer();
    const sceneTexture   = gl.createTexture();
    if (!positionBuffer || !sceneTexture) { gl.deleteProgram(program); return; }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sceneTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(sceneTexLoc, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // ── Mutable state ────────────────────────────────────────────────────────
    let frameId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let disposed = false;
    let html2canvasModule: null | (typeof import("html2canvas"))["default"] = null;
    let captureInFlight = false;
    let pendingCapture = false;
    let hasSceneTexture = false;
    let readyFired = false;
    let sceneImagesAwaited = false;
    let lastCaptureRequest = 0;
    // Crop region used for the last successful scene capture.
    // drawLens() adjusts UV uniforms so the shader samples correctly from
    // the cropped texture rather than the full scene.
    let cropX = 0;
    let cropY = 0;
    let cropW = 1;
    let cropH = 1;

    const canvasSize  = { width: 1, height: 1 };
    const lensSize    = { width: 1, height: 1 };
    const sceneSize   = { width: 1, height: 1 };
    const lensCenter  = { x: 0, y: 0 };
    const current     = { x: 0, y: 0 };
    const target      = { x: 0, y: 0 };

    // ── Position sync ─────────────────────────────────────────────────────────
    const syncPosition = () => {
      const { x: cx, y: cy, xOffset: cxo, yOffset: cyo, anchorRef: car } = positionRef.current;
      const sceneRect  = scene.getBoundingClientRect();
      const parent     = (glass.offsetParent ?? document.body) as HTMLElement;
      const parentRect = parent.getBoundingClientRect();

      let centerViewportX: number;
      let centerViewportY: number;

      if (car?.current) {
        const anchorRect = car.current.getBoundingClientRect();
        centerViewportX = anchorRect.left + anchorRect.width  / 2 + (cxo ?? 0);
        centerViewportY = anchorRect.top  + anchorRect.height / 2 + (cyo ?? 0);
      } else if (cx !== undefined && cy !== undefined) {
        // x, y are relative to sceneRef — convert to viewport
        centerViewportX = sceneRect.left + cx;
        centerViewportY = sceneRect.top  + cy;
      } else {
        // Default: center of scene + optional offset
        centerViewportX = sceneRect.left + sceneRect.width  / 2 + (cxo ?? 0);
        centerViewportY = sceneRect.top  + sceneRect.height / 2 + (cyo ?? 0);
      }

      // Convert viewport position to parent-relative for CSS left/top
      glass.style.left = `${centerViewportX - parentRect.left}px`;
      glass.style.top  = `${centerViewportY - parentRect.top}px`;

      sceneSize.width  = sceneRect.width;
      sceneSize.height = sceneRect.height;
    };

    const syncLensCenter = () => {
      const glassRect = glass.getBoundingClientRect();
      const sceneRect = scene.getBoundingClientRect();
      lensCenter.x = glassRect.left - sceneRect.left + glassRect.width  / 2;
      lensCenter.y = glassRect.top  - sceneRect.top  + glassRect.height / 2;
    };

    const resizeCanvas = () => {
      const dpr       = Math.min(window.devicePixelRatio || 1, 2);
      const nextW     = Math.max(1, glass.clientWidth);
      const nextH     = Math.max(1, glass.clientHeight);
      lensSize.width  = nextW;
      lensSize.height = nextH;
      canvasSize.width  = Math.round(nextW * dpr);
      canvasSize.height = Math.round(nextH * dpr);
      canvas.width      = canvasSize.width;
      canvas.height     = canvasSize.height;
      canvas.style.width  = `${nextW}px`;
      canvas.style.height = `${nextH}px`;
    };

    // ── Render ────────────────────────────────────────────────────────────────
    const drawLens = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (!hasSceneTexture) return;

      const s = settingsRef.current;
      gl.useProgram(program);
      syncLensCenter();
      gl.uniform2f(canvasSizeLoc,   canvasSize.width,  canvasSize.height);
      gl.uniform2f(lensSizeLoc,     lensSize.width,    lensSize.height);
      // Adjust lensCenter to be relative to the captured crop origin so the
      // shader's UV calculation samples the correct region of the texture.
      gl.uniform2f(lensCenterLoc,   lensCenter.x - cropX, lensCenter.y - cropY);
      gl.uniform2f(sceneSizeLoc,    cropW,                cropH);
      gl.uniform1f(refractionLoc,   s.refraction);
      gl.uniform1f(depthLoc,        s.depth);
      gl.uniform1f(dispersionLoc,   s.dispersion);
      gl.uniform1f(distortionRadLoc, s.distortionRadius);
      gl.uniform1f(shadowRadLoc,    s.shadowRadius);
      gl.uniform1f(blurLoc,         s.blur);
      gl.uniform1f(shadowEnabledLoc, s.shadowEnabled ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const scheduleRender = () => {
      if (!frameId) frameId = window.requestAnimationFrame(render);
    };

    const render = () => {
      frameId = 0;
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      glass.style.transform = `translate3d(calc(-50% + ${current.x}px), calc(-50% + ${current.y}px), 0)`;
      drawLens();
      if (Math.abs(target.x - current.x) > 0.1 || Math.abs(target.y - current.y) > 0.1) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const syncLayout = () => {
      syncPosition();
      resizeCanvas();
      drawLens();
      scheduleRender();
      requestCapture(true);
    };

    // ── Scene capture ─────────────────────────────────────────────────────────
    const captureScene = async () => {
      if (disposed) return;
      if (captureInFlight) { pendingCapture = true; return; }
      captureInFlight = true;
      try {
        // On the first capture, wait for all images in the scene to finish
        // loading so html2canvas captures the fully-rendered content.
        if (!sceneImagesAwaited) {
          sceneImagesAwaited = true;
          const imgs = Array.from(scene.querySelectorAll<HTMLImageElement>("img"));
          const pending = imgs.filter((img) => !img.complete);
          if (pending.length > 0) {
            await Promise.all(
              pending.map(
                (img) =>
                  new Promise<void>((resolve) => {
                    img.addEventListener("load",  () => resolve(), { once: true });
                    img.addEventListener("error", () => resolve(), { once: true });
                  }),
              ),
            );
          }
          if (disposed) return;
        }
        if (!html2canvasModule) {
          const imported = await import("html2canvas");
          html2canvasModule = imported.default;
        }
        // ── Crop the capture to the region the lens actually sees ─────────────
        // Instead of capturing the entire hero section, we capture only the area
        // around the lens center. Padding = parallax range + refraction headroom.
        // This reduces captured pixels by ~10-15× vs the full scene.
        syncLensCenter();
        const capturePad = PARALLAX_LIMIT + lensSize.width * 0.5 + 20;
        const rawLeft   = lensCenter.x - lensSize.width  * 0.5 - capturePad;
        const rawTop    = lensCenter.y - lensSize.height * 0.5 - capturePad;
        const rawRight  = lensCenter.x + lensSize.width  * 0.5 + capturePad;
        const rawBottom = lensCenter.y + lensSize.height * 0.5 + capturePad;
        const snapX = Math.max(0, Math.round(rawLeft));
        const snapY = Math.max(0, Math.round(rawTop));
        const snapW = Math.max(1, Math.min(sceneSize.width,  Math.round(rawRight))  - snapX);
        const snapH = Math.max(1, Math.min(sceneSize.height, Math.round(rawBottom)) - snapY);

        const snapshot = await html2canvasModule(scene, {
          backgroundColor: null,
          logging: false,
          scale: MAX_CAPTURE_SCALE,
          useCORS: true,
          x: snapX, y: snapY, scrollX: 0, scrollY: 0,
          width: snapW,
          height: snapH,
          onclone: (clonedDoc) => {
            clonedDoc.querySelectorAll<HTMLElement>("[data-lens-hide='true']")
              .forEach((el) => { el.style.visibility = "hidden"; });
          },
          ignoreElements: (el) =>
            el instanceof HTMLElement && el.dataset.lensIgnore === "true",
        });
        // Store crop coordinates so drawLens() can adjust UV uniforms
        cropX = snapX;
        cropY = snapY;
        cropW = snapW;
        cropH = snapH;
        if (disposed) return;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, sceneTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, snapshot);
        hasSceneTexture = true;
        drawLens();
        if (!readyFired) {
          readyFired = true;
          // Wait one frame so the GPU has time to composite the rendered
          // WebGL frame before the lens container fades in from opacity 0.
          window.requestAnimationFrame(() => {
            if (!disposed) {
              setCanvasReady(true);
              onReadyRef.current?.();
            }
          });
        }
      } catch (err) {
        console.error("RoundGlassLens: scene capture failed", err);
      } finally {
        captureInFlight = false;
        if (pendingCapture) { pendingCapture = false; void captureScene(); }
      }
    };

    const requestCapture = (force = false) => {
      const now = performance.now();
      if (!force && now - lastCaptureRequest < CAPTURE_THROTTLE_MS) return;
      lastCaptureRequest = now;
      void captureScene();
    };

    // ── Parallax ──────────────────────────────────────────────────────────────
    const handleMove = (event: PointerEvent) => {
      if (!parallaxEnabled || prefersReducedMotion) return;
      const rect = scene.getBoundingClientRect();
      const s = settingsRef.current;
      const refCenterX = rect.left + rect.width  / 2;
      const refCenterY = rect.top  + rect.height / 2;
      // When parallaxOnWindow, the limit scales with viewport so the full
      // motionStrength fraction is realized without artificial capping.
      const limit = parallaxOnWindow ? window.innerWidth : PARALLAX_LIMIT;
      target.x = clampVal((event.clientX - refCenterX) * s.motionStrengthX, -limit, limit);
      target.y = clampVal((event.clientY - refCenterY) * s.motionStrengthY, -limit, limit);
      scheduleRender();
      requestCapture();
    };

    const handleLeave = () => {
      target.x = 0;
      target.y = 0;
      scheduleRender();
    };

    // ── Bootstrap ─────────────────────────────────────────────────────────────
    syncRef.current = syncLayout;
    syncLayout();
    glass.style.transform = "translate3d(-50%, -50%, 0)";
    scheduleRender();
    // Show ring + backdrop-blur after position is set, before capture completes
    window.requestAnimationFrame(() => {
      if (!disposed) setContainerVisible(true);
    });

    // Single initial capture is triggered by syncLayout() above.
    // Scene content is static — no need for continuous recapture.

    if (parallaxEnabled && !prefersReducedMotion) {
      if (parallaxOnWindow) {
        window.addEventListener("pointermove", handleMove as EventListener);
      } else {
        scene.addEventListener("pointermove", handleMove);
        scene.addEventListener("pointerleave", handleLeave);
      }
    }

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => syncLayout());
      resizeObserver.observe(scene);
      resizeObserver.observe(glass);
      if (anchorRef?.current) resizeObserver.observe(anchorRef.current);
    }

    window.addEventListener("resize", syncLayout);

    return () => {
      disposed = true;
      syncRef.current = null;
      if (frameId) window.cancelAnimationFrame(frameId);
      if (parallaxOnWindow) {
        window.removeEventListener("pointermove", handleMove as EventListener);
      } else {
        scene.removeEventListener("pointermove", handleMove);
        scene.removeEventListener("pointerleave", handleLeave);
      }
      resizeObserver?.disconnect();
      window.removeEventListener("resize", syncLayout);
      gl.deleteTexture(sceneTexture);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
    // Position props & parallax settings are used via refs/closures captured at mount.
    // Re-mount is not needed when they change — syncLayout/settingsRef handles updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Dev controls panel ────────────────────────────────────────────────────
  const [saveFlash, setSaveFlash] = useState(false);
  const handleSave = () => {
    if (storageKey) {
      saveStoredSettings(storageKey, panelSettings);
      setSaveFlash(true);
      setTimeout(() => setSaveFlash(false), 800);
    }
  };

  const handleCopy = () => {
    const s = panelSettings;
    const code = [
      `refraction={${s.refraction}}`,
      `depth={${s.depth}}`,
      `dispersion={${s.dispersion}}`,
      `distortionRadius={${s.distortionRadius}}`,
      `blur={${s.blur}}`,
      `gradientAngle={${s.gradientAngle}}`,
      `motionStrengthX={${s.motionStrengthX}}`,
      `motionStrengthY={${s.motionStrengthY}}`,
    ].join("\n  ");
    void navigator.clipboard.writeText(`<RoundGlassLens\n  ${code}\n/>`);
  };

  const TABS = [
    { key: "optical" as const, label: "ОПТИКА" },
    { key: "shape"   as const, label: "ФОРМА"  },
    { key: "style"   as const, label: "СТИЛЬ"  },
    { key: "motion"  as const, label: "ДВИЖЕНИЕ" },
  ];

  const controls =
    mounted && showControls
      ? createPortal(
          <div className="lens-controls-panel" data-lens-hide="true">
            <div className="lens-controls-panel__header">
              <div>
                <div className="lens-controls-panel__title">LENS CONTROLS</div>
                {storageKey && (
                  <div className="lens-controls-panel__meta">{storageKey}</div>
                )}
              </div>
              <div className="lens-controls-panel__actions">
                <button type="button" className="lens-controls-panel__btn" onClick={handleCopy}>
                  COPY
                </button>
                {storageKey && (
                  <button type="button" className={`lens-controls-panel__btn${saveFlash ? " is-saved" : ""}`} onClick={handleSave}>
                    {saveFlash ? "SAVED" : "SAVE"}
                  </button>
                )}
              </div>
            </div>

            <div className="lens-controls-tabs">
              {TABS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  className={`lens-controls-tab${activeTab === key ? " is-active" : ""}`}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="lens-controls-group">
              {activeTab === "optical" && (
                <>
                  <ControlSlider label="REFRACTION" value={panelSettings.refraction}
                    min={0} max={0.12} step={0.001}
                    onChange={(v) => setPanelSettings((p) => ({ ...p, refraction: v }))} />
                  <ControlSlider label="DEPTH" value={panelSettings.depth}
                    min={0} max={0.5} step={0.001}
                    onChange={(v) => setPanelSettings((p) => ({ ...p, depth: v }))} />
                  <ControlSlider label="DISPERSION" value={panelSettings.dispersion}
                    min={0} max={5} step={0.01}
                    onChange={(v) => setPanelSettings((p) => ({ ...p, dispersion: v }))} />
                </>
              )}
              {activeTab === "shape" && (
                <>
                  <ControlSlider label="DISTORTION RADIUS" value={panelSettings.distortionRadius}
                    min={0.2} max={1.5} step={0.001}
                    onChange={(v) => setPanelSettings((p) => ({ ...p, distortionRadius: v }))} />
                  <ControlSlider label="BLUR" value={panelSettings.blur}
                    min={0} max={2} step={0.001}
                    onChange={(v) => setPanelSettings((p) => ({ ...p, blur: v }))} />
                </>
              )}
              {activeTab === "style" && (
                <ControlSlider label="GRADIENT ANGLE" value={panelSettings.gradientAngle}
                  min={0} max={360} step={1}
                  format={(v) => `${Math.round(v)}°`}
                  onChange={(v) => setPanelSettings((p) => ({ ...p, gradientAngle: v }))} />
              )}
              {activeTab === "motion" && (
                <>
                  <ControlSlider label="FOLLOW X" value={panelSettings.motionStrengthX}
                    min={0} max={0.1} step={0.001}
                    onChange={(v) => setPanelSettings((p) => ({ ...p, motionStrengthX: v }))} />
                  <ControlSlider label="FOLLOW Y" value={panelSettings.motionStrengthY}
                    min={0} max={0.1} step={0.001}
                    onChange={(v) => setPanelSettings((p) => ({ ...p, motionStrengthY: v }))} />
                </>
              )}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div
        ref={glassRef}
        aria-hidden="true"
        data-lens-ignore="true"
        className={`round-glass-lens pointer-events-none absolute z-10 rounded-full${className ? ` ${className}` : ""}`}
        style={lensStyle}
      >
        <canvas ref={canvasRef} aria-hidden="true" className="round-glass-lens-canvas" style={canvasStyle} />
      </div>
      {controls}
    </>
  );
}
