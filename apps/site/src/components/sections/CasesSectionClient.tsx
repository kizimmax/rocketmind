"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import { InfiniteLogoMarquee, Slider } from "@rocketmind/ui";
import type { PartnerLogo } from "@/lib/partner-logos";
import type { CaseEntry } from "@/lib/cases";
import type { Testimonial } from "@/lib/testimonials";
import { TestimonialsColumn } from "./cases/TestimonialsColumn";
import { CaseArrow } from "./cases/CaseCard";

const CASE_DURATION_MS = 15_000;
const FADE_MS = 280;
const STAGGER_MS = 60;
const SLIDE_PX = 40;

/** Replace spaces after ≤2-letter words with non-breaking spaces. */
function nb(text: string): string {
  const apply = (t: string) =>
    t.replace(/(^|[ \t\u00A0])([а-яёА-ЯЁa-zA-Z]{1,2}) (?=\S)/gm, "$1$2\u00A0");
  return apply(apply(apply(text)));
}

function CaseNavigator({
  count,
  activeCase,
  onSelect,
}: {
  count: number;
  activeCase: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>
          <button
            onClick={() => onSelect(i)}
            aria-label={`Кейс ${i + 1}`}
            className={[
              "font-['Loos_Condensed',sans-serif] text-[16px] font-medium uppercase tracking-[0.02em] leading-[1.16] transition-colors cursor-pointer",
              i === activeCase
                ? "text-[#F0F0F0]"
                : "text-[#939393] hover:text-[#F0F0F0]",
            ].join(" ")}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
          {i === activeCase && (
            <Slider animate animateKey={activeCase} animationDuration={CASE_DURATION_MS} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/** Returns inline style for a staggered slide animation block. */
function staggerStyle(
  phase: "out" | "in" | null,
  dir: number,
  index: number,
): React.CSSProperties {
  if (phase === null) {
    return {
      opacity: 1,
      transform: "translateX(0)",
      transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
    };
  }
  const delay = index * STAGGER_MS;
  if (phase === "out") {
    return {
      opacity: 0,
      transform: `translateX(${-dir * SLIDE_PX}px)`,
      transition: `opacity ${FADE_MS}ms ease ${delay}ms, transform ${FADE_MS}ms ease ${delay}ms`,
    };
  }
  return {
    opacity: 1,
    transform: "translateX(0)",
    transition: `opacity ${FADE_MS}ms ease ${delay}ms, transform ${FADE_MS}ms ease ${delay}ms`,
  };
}

export function CasesSectionClient({
  logos,
  cases,
  testimonials,
}: {
  logos: PartnerLogo[];
  cases: CaseEntry[];
  testimonials: Testimonial[];
}) {
  const [activeCase, setActiveCase] = useState(0);
  const [displayCase, setDisplayCase] = useState(0);
  const [phase, setPhase] = useState<"out" | "in" | null>(null);
  const [direction, setDirection] = useState(1);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const casesColumnRef = useRef<HTMLDivElement>(null);
  const testimonialsBoxRef = useRef<HTMLDivElement>(null);
  const swipeTouchStart = useRef<{ x: number; y: number } | null>(null);

  const total = cases.length;

  const switchToCase = useCallback(
    (i: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      setDirection(
        i > displayCase || (i === 0 && displayCase === total - 1) ? 1 : -1,
      );
      setPhase("out");
      setActiveCase(i);
      fadeTimerRef.current = setTimeout(() => {
        setDisplayCase(i);
        setPhase("in");
        fadeTimerRef.current = setTimeout(() => {
          setPhase(null);
        }, FADE_MS + STAGGER_MS * 4);
      }, FADE_MS + STAGGER_MS * 3);
    },
    [displayCase, total],
  );

  const handleSwipeTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    swipeTouchStart.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleSwipeTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!swipeTouchStart.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - swipeTouchStart.current.x;
      const dy = t.clientY - swipeTouchStart.current.y;
      swipeTouchStart.current = null;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) {
        switchToCase((activeCase + 1) % total);
      } else {
        switchToCase((activeCase - 1 + total) % total);
      }
    },
    [activeCase, switchToCase, total],
  );

  useEffect(() => {
    if (total < 2) return;
    timerRef.current = setTimeout(
      () => switchToCase((activeCase + 1) % total),
      CASE_DURATION_MS,
    );
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeCase, switchToCase, total]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, []);

  // Sync testimonials box height to cases column height (lg+ only)
  useEffect(() => {
    const casesEl = casesColumnRef.current;
    const boxEl = testimonialsBoxRef.current;
    if (!casesEl || !boxEl) return;
    const update = () => {
      if (window.innerWidth >= 1024) {
        boxEl.style.height = `${casesEl.offsetHeight}px`;
      } else {
        boxEl.style.height = "380px";
      }
    };
    const ro = new ResizeObserver(update);
    ro.observe(casesEl);
    window.addEventListener("resize", update);
    update();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  if (total === 0) {
    return null;
  }

  const currentEntry = cases[displayCase];
  const current = currentEntry.card;
  const isBig = currentEntry.caseType === "big";

  return (
    <section className="dark bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1512px] px-5 md:px-8 xl:px-14">
        <div className="h-px bg-[#404040]" />

        <div className="flex flex-col lg:flex-row lg:gap-8 pt-10 md:pt-16 lg:pt-12 pb-10 md:pb-16 lg:pb-12 lg:items-start">
          {/* LEFT: Testimonials */}
          <div
            ref={testimonialsBoxRef}
            className="order-2 lg:order-1 lg:w-[320px] lg:flex-none"
          >
            <TestimonialsColumn testimonials={testimonials} />
          </div>

          {/* RIGHT: Cases */}
          <div
            ref={casesColumnRef}
            className="flex-1 flex flex-col order-1 lg:order-2 mb-10 lg:mb-0"
            onTouchStart={handleSwipeTouchStart}
            onTouchEnd={handleSwipeTouchEnd}
          >
            {/* Label + mobile slider row */}
            <div className="flex items-center justify-between gap-2.5 mb-4">
              <span className="font-['Loos_Condensed',sans-serif] text-[16px] md:text-[18px] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[#FFCC00]">
                кейсы
              </span>
              <div className="block lg:hidden">
                <CaseNavigator count={total} activeCase={activeCase} onSelect={switchToCase} />
              </div>
            </div>

            <div className="flex flex-col gap-5 lg:gap-11">
              <div className="flex flex-col gap-2 lg:gap-5">
                <div className="flex flex-col gap-2 overflow-hidden">
                  <h2
                    className="font-heading text-[24px] md:text-[36px] xl:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0] min-h-[78px] md:min-h-[117px] xl:min-h-[168px]"
                    style={staggerStyle(phase, direction, 0)}
                  >
                    {nb(current.title)}
                  </h2>
                </div>
                <div className="overflow-hidden">
                  <p
                    className="text-[16px] xl:text-[18px] leading-[1.32] text-[#939393] max-w-none xl:max-w-[70%] xl:min-h-[72px]"
                    style={staggerStyle(phase, direction, 1)}
                  >
                    {nb(current.description)}
                  </p>
                </div>
              </div>

              <div className="overflow-hidden">
                {(() => {
                  const box = (
                    <div
                      className={[
                        "relative border p-5 sm:p-6 xl:p-8 transition-[border-color] duration-200",
                        isBig
                          ? "border-[#404040] group-hover:border-[var(--rm-yellow-100)]"
                          : "border-[#404040]",
                      ].join(" ")}
                      style={staggerStyle(phase, direction, 2)}
                    >
                      {isBig && <CaseArrow />}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        {current.stats.map((stat, i) => (
                          <div key={i} className="flex flex-col gap-1 sm:gap-5 xl:justify-between">
                            <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-start sm:gap-1 xl:flex-row xl:items-center xl:gap-3">
                              <div className="font-heading text-[52px] sm:text-[40px] xl:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0] flex-none">
                                {stat.value}
                              </div>
                              <div className="font-['Loos_Condensed',sans-serif] text-[18px] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[#F0F0F0] whitespace-pre-wrap">
                                {stat.label}
                              </div>
                            </div>
                            <p className="text-[12px] sm:text-[14px] leading-[1.4] tracking-[0.01em] text-[#939393]">
                              {nb(stat.description)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                  return isBig ? (
                    <Link href={`/media/${currentEntry.slug}`} className="block group">
                      {box}
                    </Link>
                  ) : (
                    box
                  );
                })()}
              </div>
            </div>

            {/* Bottom row: result + desktop navigator */}
            <div className="mt-5 lg:mt-11 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-[80px]">
              <div className="md:flex-1 overflow-hidden">
                <p
                  className="font-['Loos_Condensed',sans-serif] text-[16px] font-medium uppercase tracking-[0.04em] leading-[1.16] text-[#F0F0F0]"
                  style={staggerStyle(phase, direction, 3)}
                >
                  {nb(current.result)}
                </p>
              </div>
              <div className="hidden lg:block">
                <CaseNavigator count={total} activeCase={activeCase} onSelect={switchToCase} />
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-[#404040]" />

        <div className="py-8 opacity-55">
          <InfiniteLogoMarquee logos={logos} reverse />
        </div>

        <div className="h-px bg-[#404040]" />
      </div>
    </section>
  );
}
