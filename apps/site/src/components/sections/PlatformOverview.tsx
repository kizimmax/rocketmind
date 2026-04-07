"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas3DCarousel } from "@/components/blocks/Canvas3DCarousel";
import { MascotCarousel } from "@/components/blocks/MascotCarousel";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/* ─────────────────────────────────────────────────────────────
   Figma source of truth:
     Desktop — node 259:985  (1400 × 867, 2 cols: 536 + 864)
     Tablet  — node 296:1102 (715 × 1321, col01 715×443 + col02 713×878)
     Mobile  — node 278:1150 (443 wide, stacked)

   Breakpoints:
     Mobile  — < md  (< 768px)
     Tablet  — md–1099px (768–1099px)
     Desktop — 1100px+ (compact mascot 1100–1279, full 1280+)
   ─────────────────────────────────────────────────────────── */

export function PlatformOverview() {
  /* Carousel auto-scale via ResizeObserver (desktop + tablet only) */
  const carouselDesktopRef = useRef<HTMLDivElement>(null);
  const carouselTabletRef = useRef<HTMLDivElement>(null);
  const [dScale, setDScale] = useState(1);
  const [tScale, setTScale] = useState(1);

  useEffect(() => {
    function observe(
      ref: React.RefObject<HTMLDivElement | null>,
      set: React.Dispatch<React.SetStateAction<number>>,
    ) {
      const el = ref.current;
      if (!el) return;
      const ro = new ResizeObserver((entries) => {
        const w = entries[0].contentRect.width;
        set(Math.min(w / 768, 1));
      });
      ro.observe(el);
      return () => ro.disconnect();
    }
    const d1 = observe(carouselDesktopRef, setDScale);
    const d2 = observe(carouselTabletRef, setTScale);
    return () => {
      d1?.();
      d2?.();
    };
  }, []);

  return (
    <section className="relative isolate w-full bg-background pb-12 lg:pb-[108px]" id="platform-overview">
      <div className="mx-auto w-full max-w-[1512px] px-5 md:px-8 xl:px-14">
        {/* ═══════════════ DESKTOP (1100px+) ═══════════════ */}
        <div
          className="platform-desktop relative w-full"
          style={{ aspectRatio: "1400 / 867" }}
        >
          {/* SVG background — Fibonacci spiral + grid borders */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE_PATH}/images/platform-block/methodology-bg-desktop.svg`}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full select-none"
            aria-hidden="true"
            draggable={false}
          />

          {/* ── Div 01: Методология ──────────────────── */}
          <div
            className="absolute overflow-hidden"
            style={{ top: 0, left: 0, width: "38.286%", height: "38.293%" }}
          >
            <div
              className="absolute flex flex-col gap-4"
              style={{ left: "8.955%", top: "14.458%", width: "82.09%" }}
            >
              <Heading label="Методология" title="бизнес-дизайн" />
              <BodyText>
                Методология, которая помогает проектировать бизнес как
                систему: от&nbsp;ценности для клиента и&nbsp;модели дохода
                до&nbsp;логики роста, развития новых направлений
                и&nbsp;принятия стратегических решений.
              </BodyText>
            </div>
          </div>

          {/* ── Div 02: Синергия ─────────────────────── */}
          <div
            className="absolute overflow-hidden"
            style={{
              top: "38.293%",
              left: 0,
              width: "38.286%",
              height: "61.707%",
            }}
          >
            <div
              className="absolute flex flex-col gap-4"
              style={{ left: "8.955%", top: "8.972%", width: "82.09%" }}
            >
              <Heading
                label="AI-продукты и опыт экспертов"
                title="Синергия ОПЫТА с ИИ"
              />
              <BodyText>
                В&nbsp;работе с&nbsp;клиентами мы соединяем искусственный
                и&nbsp;естественный интеллект: ИИ&nbsp;ускоряет анализ
                и&nbsp;проработку решений, а&nbsp;эксперты добавляют
                стратегическое мышление и&nbsp;практику внедрения.
                Методология даёт путь к&nbsp;росту и&nbsp;запуску новых
                моделей развития.
              </BodyText>
            </div>

            {/* Animated mascot carousel — compact 1100–1279, default 1280+ */}
            <div
              className="absolute"
              style={{
                left: "8.955%",
                bottom: "6%",
                width: "82.09%",
              }}
            >
              <div className="mascot-desktop-default">
                <MascotCarousel />
              </div>
              <div className="mascot-desktop-compact">
                <MascotCarousel size="compact" />
              </div>
            </div>
          </div>

          {/* ── Div 03: Канвасы ──────────────────────── */}
          <div
            className="absolute overflow-hidden"
            style={{
              top: 0,
              left: "38.286%",
              width: "61.714%",
              height: "100%",
            }}
          >
            <div
              className="absolute z-10 flex flex-col gap-4"
              style={{ left: "5.556%", top: "5.536%", width: "88.889%" }}
            >
              <Heading
                label="Канвасы"
                title="цифровые платформы и&nbsp;экосистемы"
              />
              <BodyText>
                Особый фокус Rocketmind&nbsp;— цифровые платформы
                и&nbsp;бизнес-экосистемы. Мы&nbsp;используем
                и&nbsp;развиваем международную методологию Platform
                Innovation Kit, а&nbsp;также представляем её в&nbsp;России
                и&nbsp;странах Азии, помогая компаниям проектировать
                платформенные модели, находить новые точки роста
                и&nbsp;выстраивать более сильную архитектуру бизнеса.
              </BodyText>
            </div>

            {/* Carousel — (48,242) in div03 864×867 */}
            <div
              ref={carouselDesktopRef}
              className="absolute overflow-hidden"
              style={{
                left: "5.556%",
                top: "27.913%",
                width: "88.889%",
                height: "71.856%",
              }}
            >
              <div
                style={{
                  width: 768,
                  transformOrigin: "top left",
                  transform: `scale(${dScale})`,
                }}
              >
                <Canvas3DCarousel />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ TABLET (md – 1099px) ═══════════════ */}
        <div className="platform-tablet flex-col">
          {/* ── Column 01 (715×443) — div 01 + div 02 side by side ── */}
          <div
            className="relative w-full"
            style={{ aspectRatio: "715 / 443" }}
          >
            {/* SVG background — tablet Fibonacci spiral + grid */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE_PATH}/images/platform-block/methodology-bg-tablet.svg`}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full select-none"
              aria-hidden="true"
              draggable={false}
            />

            {/* Div 01 (left cell ≈ 274 / 715 = 38.322%) */}
            <div
              className="absolute overflow-hidden"
              style={{ top: 0, left: 0, width: "38.322%", height: "100%" }}
            >
              {/* content at (24,24) in 274×443 cell */}
              <div
                className="absolute flex flex-col gap-4"
                style={{
                  left: "8.759%",
                  top: "5.418%",
                  width: "82.482%",
                }}
              >
                <Heading label="Методология" title="бизнес-дизайн" />
                <BodyText>
                  Методология, которая помогает проектировать бизнес как
                  систему: от&nbsp;ценности для клиента и&nbsp;модели дохода
                  до&nbsp;логики роста, развития новых направлений
                  и&nbsp;принятия стратегических решений.
                </BodyText>
              </div>
            </div>

            {/* Div 02 (right cell ≈ 441 / 715 = 61.678%) */}
            <div
              className="absolute overflow-hidden"
              style={{
                top: 0,
                left: "38.322%",
                width: "61.678%",
                height: "100%",
              }}
            >
              {/* content at (24,24) in 441×443 cell */}
              <div
                className="absolute flex flex-col gap-4"
                style={{
                  left: "5.442%",
                  top: "5.418%",
                  width: "89.116%",
                }}
              >
                <Heading
                  label="AI-продукты и опыт экспертов"
                  title="Синергия ОПЫТА с ИИ"
                />
                <BodyText>
                  В&nbsp;работе с&nbsp;клиентами мы соединяем искусственный
                  и&nbsp;естественный интеллект: ИИ&nbsp;ускоряет анализ
                  и&nbsp;проработку решений, а&nbsp;эксперты добавляют
                  стратегическое мышление и&nbsp;практику внедрения.
                  Методология даёт путь к&nbsp;росту и&nbsp;запуску новых
                  моделей развития.
                </BodyText>
              </div>

              {/* Animated mascot carousel */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: "5.442%",
                  top: "70.203%",
                  width: "89.116%",
                }}
              >
                <MascotCarousel size="compact" />
              </div>
            </div>
          </div>

          {/* ── Column 02 / Div 03 — Канвасы ── */}
          <div className="relative border border-t-0 border-[#404040] p-6 md:p-8">
            <div className="relative z-10 flex flex-col gap-4">
              <Heading
                label="Канвасы"
                title="цифровые платформы и&nbsp;экосистемы"
              />
              <BodyText>
                Особый фокус Rocketmind&nbsp;— цифровые платформы
                и&nbsp;бизнес-экосистемы. Мы&nbsp;используем
                и&nbsp;развиваем международную методологию Platform
                Innovation Kit, а&nbsp;также представляем её в&nbsp;России
                и&nbsp;странах Азии, помогая компаниям проектировать
                платформенные модели, находить новые точки роста
                и&nbsp;выстраивать более сильную архитектуру бизнеса.
              </BodyText>
            </div>

            {/* Carousel */}
            <div
              ref={carouselTabletRef}
              className="relative mt-8 overflow-hidden"
              style={{ height: `${Math.round(623 * tScale)}px` }}
            >
              <div
                style={{
                  width: 768,
                  transformOrigin: "top left",
                  transform: `scale(${tScale})`,
                }}
              >
                <Canvas3DCarousel />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ MOBILE (< md) ═══════════════ */}
        <div className="flex flex-col md:hidden">
          {/* Column 01 (353×569) — div01 + div02, SVG bg */}
          <div
            className="relative w-full"
            style={{ aspectRatio: "353 / 569" }}
          >
            {/* SVG background — mobile Fibonacci spiral + grid */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE_PATH}/images/platform-block/methodology-bg-mobile.svg`}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full select-none"
              aria-hidden="true"
              draggable={false}
            />

            {/* Div 01 (top 38.49% = 219/569) */}
            <div
              className="absolute overflow-hidden"
              style={{ top: 0, left: 0, width: "100%", height: "38.49%" }}
            >
              {/* content at (20,20) in 353×219 cell */}
              <div
                className="absolute flex flex-col gap-2"
                style={{
                  left: "5.67%",
                  top: "9.13%",
                  width: "88.67%",
                }}
              >
                <Heading label="Методология" title="бизнес-дизайн" />
                <BodyText>
                  Методология, которая помогает проектировать бизнес как
                  систему: от&nbsp;ценности для клиента и&nbsp;модели дохода
                  до&nbsp;логики роста, развития новых направлений
                  и&nbsp;принятия стратегических решений.
                </BodyText>
              </div>
            </div>

            {/* Div 02 (bottom 61.51% = 350/569) */}
            <div
              className="absolute overflow-hidden"
              style={{
                top: "38.49%",
                left: 0,
                width: "100%",
                height: "61.51%",
              }}
            >
              {/* content at (20,20) in 353×350 cell */}
              <div
                className="absolute flex flex-col gap-2"
                style={{
                  left: "5.67%",
                  top: "5.71%",
                  width: "88.67%",
                }}
              >
                <Heading
                  label="AI-продукты и опыт экспертов"
                  title="Синергия ОПЫТА с ИИ"
                />
                <BodyText>
                  В&nbsp;работе с&nbsp;клиентами мы соединяем искусственный
                  и&nbsp;естественный интеллект: ИИ&nbsp;ускоряет анализ
                  и&nbsp;проработку решений, а&nbsp;эксперты добавляют
                  стратегическое мышление и&nbsp;практику внедрения.
                  Методология даёт путь к&nbsp;росту и&nbsp;запуску новых
                  моделей развития.
                </BodyText>
              </div>

              {/* Animated mascot carousel — at (24,238) in 353×350 cell */}
              <div
                className="absolute"
                style={{
                  left: "6.8%",
                  bottom: "6.86%",
                  width: "86.4%",
                }}
              >
                <MascotCarousel size="compact" />
              </div>
            </div>
          </div>

          {/* Column 02 / Div 03 — Канвасы (353×818) */}
          <div
            className="relative border border-t-0 border-[#404040]"
            style={{ aspectRatio: "353 / 818" }}
          >
            {/* Content on top, z-10 since canvas overlaps */}
            <div
              className="absolute z-10 flex flex-col gap-2"
              style={{ left: 20, top: 20, right: 20 }}
            >
              <Heading
                label="Канвасы"
                title="цифровые платформы и&nbsp;экосистемы"
              />
              <BodyText>
                Особый фокус Rocketmind&nbsp;— цифровые платформы
                и&nbsp;бизнес-экосистемы. Мы&nbsp;используем
                и&nbsp;развиваем международную методологию Platform
                Innovation Kit, а&nbsp;также представляем её в&nbsp;России
                и&nbsp;странах Азии, помогая компаниям проектировать
                платформенные модели, находить новые точки роста
                и&nbsp;выстраивать более сильную архитектуру бизнеса.
              </BodyText>
            </div>

            {/* Canvas carousel — native size, clipped. Overlaps text area */}
            <div
              className="absolute bottom-0 left-0 w-full overflow-hidden"
              style={{ top: "21.64%" }}
            >
              <div style={{ paddingLeft: 20 }}>
                <Canvas3DCarousel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Sub-components ──────────────────────────────────────── */

function Heading({ label, title }: { label: string; title: string }) {
  return (
    <div className="flex flex-col gap-4 md:gap-2">
      <p
        className="font-['Loos_Condensed',sans-serif] text-[16px] font-medium uppercase leading-[1.16] tracking-[0.02em] text-[#FFCC00] md:text-[18px]"
        dangerouslySetInnerHTML={{ __html: label }}
      />
      <p
        className="font-['Roboto_Condensed',sans-serif] text-[28px] font-bold uppercase leading-[1.16] tracking-[-0.01em] text-[#F0F0F0] md:text-[32px]"
        dangerouslySetInnerHTML={{ __html: title }}
      />
    </div>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-['Roboto',sans-serif] text-[14px] font-normal leading-[1.3] text-[#F0F0F0] md:text-[18px] md:leading-[1.2]">
      {children}
    </p>
  );
}

