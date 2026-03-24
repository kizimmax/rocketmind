"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "motion/react";

import { rocketmindHeroRotatingLines } from "@/content/rocketmind-hero";
import type { PartnerLogo } from "@/lib/partner-logos";
import { InfiniteLogoMarquee } from "@/components/blocks/InfiniteLogoMarquee";

import { RocketmindMenu } from "./RocketmindMenu";

const HERO_BACKGROUND_IMAGE = "/hero-art/hero-lens.png";
const STATIC_ROUND_LENS_SVG =
  "http://localhost:3845/assets/dc9c87b47d085d0ae48bfd44b86f173a776e8848.svg";

const ROUND_GLASS_VERTEX_SHADER = `
  attribute vec2 aPosition;

  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const ROUND_GLASS_FRAGMENT_SHADER = `
  precision mediump float;

  uniform sampler2D uSceneTexture;
  uniform vec2 uCanvasSize;
  uniform vec2 uLensSize;
  uniform vec2 uLensCenter;
  uniform vec2 uHeroSize;

  void main() {
    vec2 pixel = vec2(gl_FragCoord.x, uCanvasSize.y - gl_FragCoord.y);
    vec2 localOffset = (pixel - (0.5 * uCanvasSize)) * (uLensSize / uCanvasSize);
    float radius = min(uLensSize.x, uLensSize.y) * 0.5;
    float distanceToCenter = length(localOffset);

    if (distanceToCenter > radius) {
      discard;
    }

    float normalized = clamp(distanceToCenter / radius, 0.0, 1.0);
    vec2 direction = distanceToCenter > 0.0001
      ? localOffset / distanceToCenter
      : vec2(0.0, 0.0);

    float edgeBand = smoothstep(0.72, 0.98, normalized);
    float edgeDistortion = edgeBand * edgeBand;
    vec2 sampleOffset =
      localOffset - (direction * radius * 0.06 * edgeDistortion);
    vec2 sceneUv = (uLensCenter + sampleOffset) / uHeroSize;
    sceneUv = clamp(sceneUv, vec2(0.0), vec2(1.0));

    vec4 color = texture2D(uSceneTexture, sceneUv);
    float alpha = 1.0 - smoothstep(0.985, 1.0, normalized);
    float outerHighlight = smoothstep(0.72, 0.96, normalized) *
      (1.0 - smoothstep(0.96, 1.0, normalized));
    float innerHighlight = smoothstep(0.14, 0.42, normalized) *
      (1.0 - smoothstep(0.42, 0.56, normalized));
    float highlight =
      (outerHighlight * 0.08 + innerHighlight * 0.025) *
      smoothstep(0.0, 0.65, 1.0 - distance(pixel / uCanvasSize, vec2(0.28, 0.24)));

    gl_FragColor = vec4(min(color.rgb + highlight, vec3(1.0)), color.a * alpha);
  }
`;

const HERO_ROTATION_INTERVAL_MS = 2800;
const HERO_ROTATION_TRANSITION_MS = 640;
const HERO_ROTATION_ENTRY_DELAY_MS = 220;
const HERO_ROTATING_LINE_HEIGHT_EM = 1.08;
const LENS_CAPTURE_INTERVAL_MS = 180;
const LENS_CAPTURE_THROTTLE_MS = 90;
const LENS_MAX_CAPTURE_SCALE = 2.0;
const PRIMARY_LENS_OFFSET_X = 120;
const PRIMARY_LENS_OFFSET_Y = 72;
const STATIC_LENS_VERTICAL_OFFSET = 84;

const platformTextStyle = {
  textShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
} satisfies CSSProperties;

const heroBackgroundImageStyle = {
  height: "115.42%",
  left: "-8.38%",
  maxWidth: "none",
  top: "-15.42%",
  width: "120.19%",
} satisfies CSSProperties;

const heroRotatingLineViewportStyle = {
  height: `${HERO_ROTATING_LINE_HEIGHT_EM}em`,
} satisfies CSSProperties;

type HeroSectionClientProps = {
  logos: PartnerLogo[];
};

export function HeroSectionClient({ logos }: HeroSectionClientProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const wordmarkRef = useRef<HTMLDivElement | null>(null);
  const glassRef = useRef<HTMLDivElement | null>(null);
  const staticGlassRef = useRef<HTMLDivElement | null>(null);
  const lensCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgXOffset = -86;

  const [activeRotatingLineIndex, setActiveRotatingLineIndex] = useState(0);

  useEffect(() => {
    const hero = heroRef.current;
    const wordmark = wordmarkRef.current;
    const glass = glassRef.current;
    const staticGlass = staticGlassRef.current;
    const canvas = lensCanvasRef.current;

    if (!hero || !wordmark || !glass || !staticGlass || !canvas) {
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
    });

    const prefersFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const cleanupStaticLens = () => {
      const heroRect = hero.getBoundingClientRect();
      const wordmarkImage =
        wordmark.querySelector("img") ||
        wordmark.querySelector("svg") ||
        wordmark;
      const wordmarkRect = wordmarkImage.getBoundingClientRect();
      const parentRect = glass.parentElement!.getBoundingClientRect();
      const parentLeft = parentRect.left - heroRect.left;
      const parentTop = parentRect.top - heroRect.top;
      const primaryLensLeft = heroRect.width / 2 + PRIMARY_LENS_OFFSET_X;
      const primaryLensTop =
        wordmarkRect.top - heroRect.top + wordmarkRect.height / 2 + PRIMARY_LENS_OFFSET_Y;

      glass.style.left = `${primaryLensLeft - parentLeft}px`;
      glass.style.top = `${primaryLensTop - parentTop}px`;
      staticGlass.style.left = `${heroRect.width + 136 - parentLeft}px`;
      staticGlass.style.top = `${primaryLensTop + STATIC_LENS_VERTICAL_OFFSET - parentTop}px`;
      glass.style.transform = "translate3d(-50%, -50%, 0)";
      staticGlass.style.transform = "translate3d(-50%, -50%, 0)";
    };

    if (!gl) {
      cleanupStaticLens();
      return;
    }

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);

      if (!shader) {
        return null;
      }

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Round glass shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const vertexShader = createShader(
      gl.VERTEX_SHADER,
      ROUND_GLASS_VERTEX_SHADER,
    );
    const fragmentShader = createShader(
      gl.FRAGMENT_SHADER,
      ROUND_GLASS_FRAGMENT_SHADER,
    );

    if (!vertexShader || !fragmentShader) {
      cleanupStaticLens();
      return;
    }

    const program = gl.createProgram();

    if (!program) {
      cleanupStaticLens();
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Round glass program error:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      cleanupStaticLens();
      return;
    }

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    const sceneTextureLocation = gl.getUniformLocation(program, "uSceneTexture");
    const canvasSizeLocation = gl.getUniformLocation(program, "uCanvasSize");
    const lensSizeLocation = gl.getUniformLocation(program, "uLensSize");
    const lensCenterLocation = gl.getUniformLocation(program, "uLensCenter");
    const heroSizeLocation = gl.getUniformLocation(program, "uHeroSize");

    if (
      positionLocation < 0 ||
      !sceneTextureLocation ||
      !canvasSizeLocation ||
      !lensSizeLocation ||
      !lensCenterLocation ||
      !heroSizeLocation
    ) {
      gl.deleteProgram(program);
      cleanupStaticLens();
      return;
    }

    const positionBuffer = gl.createBuffer();
    const sceneTexture = gl.createTexture();

    if (!positionBuffer || !sceneTexture) {
      gl.deleteProgram(program);
      cleanupStaticLens();
      return;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sceneTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(sceneTextureLocation, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let frameId = 0;
    let captureIntervalId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let disposed = false;
    let html2canvasModule: null | ((typeof import("html2canvas"))["default"]) =
      null;
    let captureInFlight = false;
    let pendingCapture = false;
    let hasSceneTexture = false;
    let lastCaptureRequest = 0;

    const base = { x: 0, y: 0 };
    const staticBase = { x: 0, y: 0 };
    const lensCenter = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const staticCurrent = { x: 0, y: 0 };
    const staticTarget = { x: 0, y: 0 };
    const limit = 64;

    const canvasSize = { width: 1, height: 1 };
    const lensSize = { width: 1, height: 1 };
    const heroSize = { width: 1, height: 1 };

    const syncBasePosition = () => {
      const heroRect = hero.getBoundingClientRect();
      const wordmarkImage =
        wordmark.querySelector("img") ||
        wordmark.querySelector("svg") ||
        wordmark;
      const wordmarkRect = wordmarkImage.getBoundingClientRect();
      const parentRect = glass.parentElement!.getBoundingClientRect();
      const parentLeft = parentRect.left - heroRect.left;
      const parentTop = parentRect.top - heroRect.top;
      const primaryLensLeft = heroRect.width / 2 + PRIMARY_LENS_OFFSET_X;
      const primaryLensTop =
        wordmarkRect.top - heroRect.top + wordmarkRect.height / 2 + PRIMARY_LENS_OFFSET_Y;

      base.x = primaryLensLeft;
      base.y = primaryLensTop;
      staticBase.x = heroRect.width + 136;
      staticBase.y = primaryLensTop + STATIC_LENS_VERTICAL_OFFSET;
      heroSize.width = heroRect.width;
      heroSize.height = heroRect.height;
      glass.style.left = `${base.x - parentLeft}px`;
      glass.style.top = `${base.y - parentTop}px`;
      staticGlass.style.left = `${staticBase.x - parentLeft}px`;
      staticGlass.style.top = `${staticBase.y - parentTop}px`;
    };

    const syncLensCenter = () => {
      const heroRect = hero.getBoundingClientRect();
      const glassRect = glass.getBoundingClientRect();
      lensCenter.x = glassRect.left - heroRect.left + glassRect.width / 2;
      lensCenter.y = glassRect.top - heroRect.top + glassRect.height / 2;
    };

    const resizeCanvas = () => {
      const nextWidth = Math.max(1, glass.clientWidth);
      const nextHeight = Math.max(1, glass.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      lensSize.width = nextWidth;
      lensSize.height = nextHeight;
      canvasSize.width = Math.round(nextWidth * dpr);
      canvasSize.height = Math.round(nextHeight * dpr);

      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      canvas.style.width = `${nextWidth}px`;
      canvas.style.height = `${nextHeight}px`;
    };

    const drawLens = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (!hasSceneTexture) {
        return;
      }

      gl.useProgram(program);
      syncLensCenter();
      gl.uniform2f(canvasSizeLocation, canvasSize.width, canvasSize.height);
      gl.uniform2f(lensSizeLocation, lensSize.width, lensSize.height);
      gl.uniform2f(
        lensCenterLocation,
        lensCenter.x,
        lensCenter.y,
      );
      gl.uniform2f(heroSizeLocation, heroSize.width, heroSize.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const render = () => {
      frameId = 0;
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      staticCurrent.x += (staticTarget.x - staticCurrent.x) * (0.08 / 3);
      staticCurrent.y += (staticTarget.y - staticCurrent.y) * (0.08 / 3);
      glass.style.transform = `translate3d(calc(-50% + ${current.x}px), calc(-50% + ${current.y}px), 0)`;
      staticGlass.style.transform = `translate3d(calc(-50% + ${staticCurrent.x}px), calc(-50% + ${staticCurrent.y}px), 0)`;
      drawLens();

      if (
        Math.abs(target.x - current.x) > 0.1 ||
        Math.abs(target.y - current.y) > 0.1 ||
        Math.abs(staticTarget.x - staticCurrent.x) > 0.1 ||
        Math.abs(staticTarget.y - staticCurrent.y) > 0.1
      ) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const scheduleRender = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const syncLayout = () => {
      syncBasePosition();
      resizeCanvas();
      scheduleRender();
    };

    const captureScene = async () => {
      if (disposed) {
        return;
      }

      if (captureInFlight) {
        pendingCapture = true;
        return;
      }

      captureInFlight = true;

      try {
        if (!html2canvasModule) {
          const imported = await import("html2canvas");
          html2canvasModule = imported.default;
        }

        const captureScale = Math.min(
          window.devicePixelRatio || 1,
          LENS_MAX_CAPTURE_SCALE,
        );

        const snapshot = await html2canvasModule(hero, {
          backgroundColor: null,
          logging: false,
          onclone: (clonedDocument) => {
            clonedDocument
              .querySelectorAll<HTMLElement>("[data-lens-hide='true']")
              .forEach((element) => {
                element.style.visibility = "hidden";
              });
          },
          scale: captureScale,
          useCORS: true,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          width: hero.offsetWidth,
          height: hero.offsetHeight,
          ignoreElements: (element) =>
            element instanceof HTMLElement &&
            element.dataset.lensIgnore === "true",
        });

        if (disposed) {
          return;
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, sceneTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          snapshot,
        );
        hasSceneTexture = true;
        scheduleRender();
      } catch (error) {
        console.error("Failed to capture round glass scene:", error);
      } finally {
        captureInFlight = false;

        if (pendingCapture) {
          pendingCapture = false;
          void captureScene();
        }
      }
    };

    const requestCapture = (force = false) => {
      const now = performance.now();

      if (!force && now - lastCaptureRequest < LENS_CAPTURE_THROTTLE_MS) {
        return;
      }

      lastCaptureRequest = now;
      void captureScene();
    };

    const handleMove = (event: PointerEvent) => {
      if (!prefersFinePointer || prefersReducedMotion) {
        return;
      }

      const rect = hero.getBoundingClientRect();
      const relativeX = event.clientX - rect.left - rect.width / 2;
      const relativeY = event.clientY - rect.top - rect.height / 2;

      target.x = Math.max(-limit, Math.min(limit, relativeX * 0.02));
      target.y = Math.max(-limit, Math.min(limit, relativeY * 0.02));
      staticTarget.x = Math.max(-(limit / 3), Math.min(limit / 3, relativeX * 0.005));
      staticTarget.y = Math.max(-(limit / 3), Math.min(limit / 3, relativeY * 0.005));
      scheduleRender();
      requestCapture();
    };

    const reset = () => {
      target.x = 0;
      target.y = 0;
      staticTarget.x = 0;
      staticTarget.y = 0;
      scheduleRender();
    };

    const handleResize = () => {
      syncLayout();
      requestCapture(true);
    };

    syncLayout();
    glass.style.transform = "translate3d(-50%, -50%, 0)";
    staticGlass.style.transform = "translate3d(-50%, -50%, 0)";
    scheduleRender();
    requestCapture(true);

    if (!prefersReducedMotion) {
      captureIntervalId = window.setInterval(() => {
        requestCapture(true);
      }, LENS_CAPTURE_INTERVAL_MS);
    }

    if (prefersFinePointer && !prefersReducedMotion) {
      hero.addEventListener("pointermove", handleMove);
      hero.addEventListener("pointerleave", reset);
    }

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        syncLayout();
        requestCapture(true);
      });
      resizeObserver.observe(hero);
      resizeObserver.observe(wordmark);
      resizeObserver.observe(glass);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;

      if (captureIntervalId) {
        window.clearInterval(captureIntervalId);
      }

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      hero.removeEventListener("pointermove", handleMove);
      hero.removeEventListener("pointerleave", reset);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", handleResize);
      gl.deleteTexture(sceneTexture);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  useEffect(() => {
    if (rocketmindHeroRotatingLines.length <= 1) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const intervalId = window.setInterval(() => {
      setActiveRotatingLineIndex((prev) => (prev + 1) % rocketmindHeroRotatingLines.length);
    }, HERO_ROTATION_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative isolate overflow-hidden bg-background text-foreground dark"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30 mix-blend-exclusion">
          <div className="absolute inset-[0_0_0.12%_0] overflow-hidden">
            <img
              alt=""
              aria-hidden="true"
              src={HERO_BACKGROUND_IMAGE}
              className="absolute"
              style={{
                ...heroBackgroundImageStyle,
                transform: `translateX(${bgXOffset}px)`,
              }}
            />
          </div>
        </div>
        <div className="hero-background-noise" />
        <div className="hero-background-fade" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1512px] flex-col px-5 pb-10 pt-10 md:px-8 xl:px-14">
        <div className="relative z-20 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <InfiniteLogoMarquee logos={logos} />

          <div className="w-full max-w-[312px] text-left xl:pt-0.5 xl:text-right">
            <p className="font-heading text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-foreground">
              <span className="text-muted-foreground">120+ клиентов </span>
              19 лет опыта
            </p>
            <p className="font-heading text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-foreground">
              в бизнес-моделировании
            </p>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col justify-center gap-[44px] py-8">
          <div
            ref={wordmarkRef}
            className="relative z-0 w-full"
          >
            <Image
              src="/text_logo_dark_background_en.svg"
              alt="Rocketmind"
              width={1600}
              height={267}
              priority
              className="mx-auto h-auto w-full max-w-none"
            />
          </div>

          <div
            ref={glassRef}
            aria-hidden="true"
            data-lens-ignore="true"
            data-node-id="65:41"
            className="round-glass-lens pointer-events-none absolute z-10 h-[clamp(280px,30vw,360px)] w-[clamp(280px,30vw,360px)] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[rgba(255,233,0,0.8)] bg-transparent"
          >
            <canvas
              ref={lensCanvasRef}
              aria-hidden="true"
              className="round-glass-lens-canvas"
            />
          </div>

          <div
            ref={staticGlassRef}
            aria-hidden="true"
            data-node-id="65:42"
            className="round-glass-lens round-glass-lens--static pointer-events-none absolute z-10 h-[clamp(520px,47vw,706px)] w-[clamp(520px,47vw,706px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
          >
            <img
              alt=""
              aria-hidden="true"
              src={STATIC_ROUND_LENS_SVG}
              className="round-glass-lens-static-border"
            />
          </div>

          <div data-lens-hide="true" className="relative z-30">
            <RocketmindMenu className="flex w-full flex-wrap items-center justify-end gap-x-12 gap-y-4 text-right" />
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,888px)_212px] lg:items-end lg:justify-between">
          <div className="flex flex-col items-start gap-10">
            <h1 className="w-full max-w-[888px] font-heading text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em]">
              <span className="block text-foreground">Помогаем бизнесу расти</span>
              <span className="block text-foreground">и масштабироваться</span>
              <span
                className="hero-rotating-line-viewport relative block text-muted-foreground"
                style={heroRotatingLineViewportStyle}
              >
                <AnimatePresence initial={false}>
                  <motion.p
                    key={activeRotatingLineIndex}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                    className="absolute inset-x-0 top-0 whitespace-nowrap"
                  >
                    {rocketmindHeroRotatingLines[activeRotatingLineIndex]}
                  </motion.p>
                </AnimatePresence>
              </span>
            </h1>

            <Link
              href="#contact"
              className="inline-flex items-center gap-3 font-heading text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-foreground transition-[opacity,color] duration-150 hover:opacity-88"
            >
              <span>Обсудить стратегию</span>
              <ArrowRight size={18} strokeWidth={2.1} />
            </Link>
          </div>

          <div className="flex flex-col items-start gap-5 self-end lg:items-end">
            <Image
              src="/hero-art/pik-logo.svg"
              alt="Platform Innovation Kit"
              width={200}
              height={45}
              className="h-[45px] w-[200px]"
            />
            <p
              className="w-full max-w-[200px] text-right font-mono text-[14px] uppercase leading-[1.32] tracking-[0.01em] text-muted-foreground"
              style={platformTextStyle}
            >
              Развиваем методологию
              <br />
              и представляем PIK
              <br />
              в России и странах Азии
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
