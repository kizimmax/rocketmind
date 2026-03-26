"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { RoundGlassLens, ROUND_GLASS_LENS_DEFAULTS } from "@/components/ui/round-glass-lens";

// ── Demo scenes ───────────────────────────────────────────────────────────────

function SceneHero({ storageKey }: { storageKey: string }) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={sceneRef}
      className="relative overflow-hidden rounded-2xl bg-black"
      style={{ minHeight: 320 }}
    >
      {/* Noise layer */}
      <div className="hero-background-noise absolute inset-0 pointer-events-none" />
      <div className="hero-background-fade absolute inset-0 pointer-events-none" />

      {/* Background art */}
      <div className="absolute inset-0 opacity-30 mix-blend-exclusion pointer-events-none">
        <img
          alt=""
          aria-hidden="true"
          src="/hero-art/hero-lens.png"
          className="absolute"
          style={{
            height: "120%",
            left: "-5%",
            maxWidth: "none",
            top: "-10%",
            width: "110%",
          } as CSSProperties}
        />
      </div>

      {/* Wordmark */}
      <div className="relative z-0 flex items-center justify-center px-8 py-16">
        <div ref={anchorRef} className="w-full max-w-2xl">
          <Image
            src="/text_logo_dark_background_en.svg"
            alt="Rocketmind"
            width={800}
            height={134}
            className="w-full h-auto"
          />
        </div>
      </div>

      <RoundGlassLens
        sceneRef={sceneRef}
        anchorRef={anchorRef}
        size={280}
        xOffset={60}
        yOffset={18}
        motionParallax
        showControls
        storageKey={storageKey}
      />
    </div>
  );
}

function SceneGradient({ storageKey }: { storageKey: string }) {
  const sceneRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={sceneRef}
      className="relative overflow-hidden rounded-2xl"
      style={{
        minHeight: 300,
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 40%, #16213e 70%, #0f3460 100%)",
      }}
    >
      <div className="relative z-0 flex flex-col items-center justify-center gap-4 px-8 py-16 text-center">
        <p
          className="font-heading text-5xl font-bold uppercase tracking-tight text-white"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
        >
          AI AGENTS
        </p>
        <p className="font-mono text-sm uppercase tracking-widest text-white/60">
          Powered by Rocketmind
        </p>
      </div>

      <RoundGlassLens
        sceneRef={sceneRef}
        size={220}
        xOffset={-40}
        yOffset={0}
        refraction={0.04}
        depth={0.22}
        dispersion={0.55}
        distortionRadius={1.1}
        shadowRadius={0.9}
        blur={0.22}
        gradientAngle={135}
        motionParallax
        showControls
        storageKey={storageKey}
      />
    </div>
  );
}

function SceneMinimal({ storageKey }: { storageKey: string }) {
  const sceneRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={sceneRef}
      className="relative overflow-hidden rounded-2xl bg-neutral-950"
      style={{ minHeight: 280 }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,220,0,0.08) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-0 flex flex-col items-center justify-center gap-6 px-8 py-14 text-center">
        <div className="flex items-center gap-3">
          <Image
            src="/icon_dark_background.svg"
            alt="Rocketmind"
            width={56}
            height={56}
            className="h-14 w-14"
          />
          <span className="font-heading text-3xl font-bold tracking-tight text-white uppercase">
            Rocketmind
          </span>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-white/40">
          Strategic growth platform
        </p>
      </div>

      <RoundGlassLens
        sceneRef={sceneRef}
        size={180}
        xOffset={30}
        yOffset={10}
        refraction={0.025}
        depth={0.14}
        dispersion={0.28}
        distortionRadius={0.95}
        blur={0.12}
        gradientAngle={220}
        shadowEnabled={false}
        motionParallax
        showControls
        storageKey={storageKey}
      />
    </div>
  );
}

// ── Main demo page ────────────────────────────────────────────────────────────

export function LensDemoClient() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16 space-y-16">

        {/* Header */}
        <header className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Design System · Components
          </p>
          <h1 className="font-heading text-5xl font-bold uppercase tracking-tight">
            RoundGlassLens
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            WebGL-линза с оптическим преломлением, хроматической дисперсией и параллаксом.
            Наводите курсор на сцену. Нажмите COPY в панели управления для экспорта пропсов.
          </p>
        </header>

        {/* Demo 1 — Hero-style */}
        <section className="space-y-4">
          <div className="flex items-baseline gap-3">
            <h2 className="font-heading text-xl font-bold uppercase">Пример 1</h2>
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              anchorRef + motion
            </span>
          </div>
          <SceneHero storageKey="lens-demo:hero" />
          <pre className="rounded-xl bg-muted p-5 text-sm overflow-x-auto">
            <code>{`const sceneRef = useRef<HTMLDivElement>(null);
const anchorRef = useRef<HTMLDivElement>(null);

<div ref={sceneRef} className="relative overflow-hidden">
  <div ref={anchorRef}>
    <Image src="/logo.svg" />
  </div>

  <RoundGlassLens
    sceneRef={sceneRef}
    anchorRef={anchorRef}
    size={280}
    xOffset={60}
    yOffset={18}
    motionParallax
  />
</div>`}</code>
          </pre>
        </section>

        {/* Demo 2 — Gradient scene */}
        <section className="space-y-4">
          <div className="flex items-baseline gap-3">
            <h2 className="font-heading text-xl font-bold uppercase">Пример 2</h2>
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Custom optical settings
            </span>
          </div>
          <SceneGradient storageKey="lens-demo:gradient" />
          <pre className="rounded-xl bg-muted p-5 text-sm overflow-x-auto">
            <code>{`<RoundGlassLens
  sceneRef={sceneRef}
  size={220}
  xOffset={-40}
  refraction={0.04}
  depth={0.22}
  dispersion={0.55}
  distortionRadius={1.1}
  blur={0.22}
  gradientAngle={135}
  motionParallax
/>`}</code>
          </pre>
        </section>

        {/* Demo 3 — Minimal */}
        <section className="space-y-4">
          <div className="flex items-baseline gap-3">
            <h2 className="font-heading text-xl font-bold uppercase">Пример 3</h2>
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Subtle / no shadow
            </span>
          </div>
          <SceneMinimal storageKey="lens-demo:minimal" />
          <pre className="rounded-xl bg-muted p-5 text-sm overflow-x-auto">
            <code>{`<RoundGlassLens
  sceneRef={sceneRef}
  size={180}
  refraction={0.025}
  depth={0.14}
  dispersion={0.28}
  blur={0.12}
  shadowEnabled={false}
  motionParallax
/>`}</code>
          </pre>
        </section>

        {/* Props reference */}
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-bold uppercase">Props</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-muted-foreground">Prop</th>
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-muted-foreground">Default</th>
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-muted-foreground">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["sceneRef", "RefObject<HTMLElement>", "—", "Элемент для захвата (обязательно)"],
                  ["size", "number", "320", "Диаметр линзы в px"],
                  ["x / y", "number", "center", "Центр в координатах sceneRef"],
                  ["anchorRef", "RefObject<HTMLElement>", "—", "Привязка к элементу (приоритет над x/y)"],
                  ["xOffset / yOffset", "number", "0", "Смещение от центра анкора или сцены"],
                  ["refraction", "number", String(ROUND_GLASS_LENS_DEFAULTS.refraction), "Сила преломления (0–0.12)"],
                  ["depth", "number", String(ROUND_GLASS_LENS_DEFAULTS.depth), "Глубина кривизны (0–0.5)"],
                  ["dispersion", "number", String(ROUND_GLASS_LENS_DEFAULTS.dispersion), "Хроматическая дисперсия (0–5)"],
                  ["distortionRadius", "number", String(ROUND_GLASS_LENS_DEFAULTS.distortionRadius), "Радиус зоны искажения (0.2–1.5)"],
                  ["shadowRadius", "number", String(ROUND_GLASS_LENS_DEFAULTS.shadowRadius), "Радиус краевой тени (0.2–1.5)"],
                  ["blur", "number", String(ROUND_GLASS_LENS_DEFAULTS.blur), "Радиальный блур (0–2)"],
                  ["gradientAngle", "number", String(ROUND_GLASS_LENS_DEFAULTS.gradientAngle), "Угол градиента ободка (0–360°)"],
                  ["shadowEnabled", "boolean", "true", "Краевое затемнение"],
                  ["motionParallax", "boolean", "auto", "Параллакс по курсору"],
                  ["motionStrength", "number", "0.032", "Сила параллакса"],
                  ["showControls", "boolean", "false", "Показать панель настройки (dev)"],
                  ["storageKey", "string", "—", "Ключ localStorage для сохранения настроек"],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs text-foreground">{prop}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{type}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{def}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Dev workflow */}
        <section className="space-y-4 rounded-2xl border border-border bg-muted/30 p-8">
          <h2 className="font-heading text-lg font-bold uppercase">Dev-воркфлоу</h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="font-mono text-xs font-bold text-foreground bg-muted rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>Добавьте <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">showControls storageKey="my-page:lens"</code> в компонент.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-xs font-bold text-foreground bg-muted rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>Настраивайте параметры в плавающей панели. Нажмите <strong className="text-foreground">COPY</strong> — в буфере обмена JSX-пропсы.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-xs font-bold text-foreground bg-muted rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>Вставьте пропсы в код, уберите <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">showControls storageKey</code>.</span>
            </li>
          </ol>
        </section>

      </div>
    </div>
  );
}
