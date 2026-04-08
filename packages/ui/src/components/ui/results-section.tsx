"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "../../lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ResultCard = {
  title: string;
  text: string;
};

export type ResultsSectionProps = {
  tag: string;
  title: string;
  description?: string;
  cards: ResultCard[];
  className?: string;
};

// ── Scroll hook — staircase with staggered continuous progress ─────────────────

const STEP_OFFSET = 88; // px per staircase step
const STAGGER = 0.06;   // tiny delay between each card starting (6% of scroll range)
const CARD_DURATION = 0.45; // each card takes 45% of scroll range to fully descend

function useResultsScroll(cardCount: number) {
  const [progresses, setProgresses] = useState<number[]>(() => {
    const arr = Array(cardCount).fill(0);
    arr[0] = 1; // first card always descended
    return arr;
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  const update = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const trigger = window.innerHeight * 0.45;
    const scrollProgress = Math.max(
      0,
      Math.min(1, (trigger - rect.top) / rect.height),
    );

    const newProgresses: number[] = [];
    for (let i = 0; i < cardCount; i++) {
      if (i === 0) {
        newProgresses.push(1);
        continue;
      }
      const start = (i - 1) * STAGGER;
      const p = Math.max(0, Math.min(1, (scrollProgress - start) / CARD_DURATION));
      newProgresses.push(p);
    }

    setProgresses(newProgresses);
  }, [cardCount]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    requestAnimationFrame(update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [update]);

  return { progresses, sectionRef };
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function ResultsSection({
  tag,
  title,
  description,
  cards,
  className,
}: ResultsSectionProps) {
  const { progresses, sectionRef } = useResultsScroll(cards.length);
  const contentHeight = STEP_OFFSET * (cards.length - 1) + 240;

  // Current yellow card = last fully descended
  let currentIndex = 0;
  for (let j = cards.length - 1; j >= 0; j--) {
    if (progresses[j] >= 1) { currentIndex = j; break; }
  }

  return (
    <section
      ref={sectionRef}
      className={cn("w-full bg-[#0A0A0A] border-t border-border py-10 lg:py-20", className)}
    >
      {/* ── Desktop ── */}
      <div className="hidden lg:block mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
        {/* Header + cards share the same vertical space */}
        <div className="relative" style={{ minHeight: `${contentHeight}px` }}>
          {/* Header — top left */}
          <div className="flex flex-col gap-2 max-w-[560px]">
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
              {tag}
            </span>
            <div className="flex flex-col gap-6">
              <h2 className="h2 text-[#F0F0F0]">{title}</h2>
              {description && (
                <p className="text-[length:var(--text-18)] leading-[1.2] text-[#939393]">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Cards — staircase, pinned to bottom */}
          <div className="absolute bottom-0 left-0 right-0 flex">
            {cards.map((card, i) => {
              const progress = progresses[i];
              const offset = i === 0 ? 0 : -i * STEP_OFFSET * (1 - progress);
              const isCurrent = i === currentIndex;
              const isPast = progress >= 1 && !isCurrent;

              return (
                <div
                  key={i}
                  className="flex-1"
                  style={{ transform: `translateY(${offset}px)` }}
                >
                  <div
                    className={cn(
                      "flex flex-col justify-between p-8 h-[240px] border transition-colors duration-300",
                      isCurrent
                        ? "bg-[#FFCC00] border-[#FFCC00]"
                        : "border-[#404040]",
                    )}
                  >
                    <h3
                      className={cn(
                        "font-[family-name:var(--font-heading-family)] text-[length:var(--text-20)] font-bold uppercase leading-[1.2] tracking-[-0.01em] transition-colors duration-300",
                        isCurrent
                          ? "text-[#0A0A0A]"
                          : isPast
                            ? "text-[#FFCC00]"
                            : "text-[#F0F0F0]",
                      )}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={cn(
                        "text-[length:var(--text-16)] leading-[1.28] transition-colors duration-300",
                        isCurrent ? "text-[#0A0A0A]" : "text-[#939393]",
                      )}
                    >
                      {card.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Mobile / Tablet ── */}
      <div className="flex lg:hidden flex-col px-5 md:px-8">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-6">
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
            {tag}
          </span>
          <div className="flex flex-col gap-4">
            <h2 className="h3 text-[#F0F0F0]">{title}</h2>
            {description && (
              <p className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Cards — horizontal carousel 2×N */}
        <div
          className="overflow-x-auto -mx-5 md:-mx-8"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="px-5 md:px-8 w-fit">
            <div
              className="grid grid-rows-2 gap-2"
              style={{
                gridTemplateColumns: `repeat(${Math.ceil(cards.length / 2)}, 350px)`,
              }}
            >
              {cards.map((card, i) => (
                <div
                  key={i}
                  className="bg-[#FFCC00] flex flex-col justify-between p-5 h-[240px]"
                >
                  <h3 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-20)] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#0A0A0A]">
                    {card.title}
                  </h3>
                  <p className="text-[length:var(--text-16)] leading-[1.28] text-[#0A0A0A]">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
