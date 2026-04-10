"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "../../lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ProcessStep = {
  number: string;
  title: string;
  text: string;
  duration: string;
};

export type ProcessParticipant = {
  role: string;
  text: string;
};

export type ProcessSectionProps = {
  tag: string;
  title: string;
  subtitle: string;
  description?: string;
  steps: ProcessStep[];
  participantsTag?: string;
  participants?: ProcessParticipant[];
  /** "product" (default) = timeline animation, "academy" = horizontal flat steps */
  variant?: "product" | "academy";
  className?: string;
};

// ── Timeline column for one step ───────────────────────────────────────────────

function TimelineColumn({
  isActive,
  isLast,
  fillProgress,
}: {
  isActive: boolean;
  isLast: boolean;
  /** 0–1 for the line below this dot */
  fillProgress: number;
}) {
  return (
    <div className="relative w-px shrink-0 self-stretch">
      {/* Vertical line — full height */}
      <div className="absolute inset-0 bg-[#404040]" />
      <div
        className="absolute top-0 left-0 right-0 h-full origin-top bg-[#F0F0F0]"
        style={{
          transform: `scaleY(${isLast ? (isActive ? 1 : 0) : fillProgress})`,
          transition: "transform 0.2s ease-out",
        }}
      />

      {/* Square dot 16×16 — centered on the line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 shrink-0 transition-all duration-300"
        style={{
          backgroundColor: isActive ? "#F0F0F0" : "#0A0A0A",
          border: `2px solid ${isActive ? "#F0F0F0" : "#404040"}`,
        }}
      />
    </div>
  );
}

// ── Step card ──────────────────────────────────────────────────────────────────

function StepCard({
  step,
  isActive,
  isLast,
  fillProgress,
  className,
  titleClass,
}: {
  step: ProcessStep;
  isActive: boolean;
  isLast: boolean;
  fillProgress: number;
  className?: string;
  titleClass?: string;
}) {
  return (
    <div className={cn("flex gap-10 max-w-[364px]", className)}>
      <TimelineColumn isActive={isActive} isLast={isLast} fillProgress={fillProgress} />
      <div className="flex flex-col gap-3 pb-16">
        <div className="flex flex-col gap-2">
          <span
            className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] transition-colors duration-300"
            style={{ color: isActive ? "#F0F0F0" : "#404040" }}
          >
            {step.number}
          </span>
          <h3
            className={cn(titleClass || "h3", "transition-colors duration-300")}
            style={{ color: isActive ? "#F0F0F0" : "#939393" }}
          >
            {step.title}
          </h3>
        </div>
        <p
          className="text-[length:var(--text-16)] leading-[1.28] transition-colors duration-300"
          style={{ color: isActive ? "#939393" : "rgba(147,147,147,0.5)" }}
        >
          {step.text}
        </p>
        <span
          className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] font-medium uppercase leading-[1.16] tracking-[0.02em] transition-colors duration-300"
          style={{ color: isActive ? "#FFCC00" : "#939393" }}
        >
          {step.duration}
        </span>
      </div>
    </div>
  );
}

// ── Participants block ─────────────────────────────────────────────────────────

function ParticipantsBlock({
  tag,
  participants,
  className,
}: {
  tag: string;
  participants: ProcessParticipant[];
  className?: string;
}) {
  return (
    <div className={cn("bg-[#121212] rounded p-8 flex flex-col gap-8 max-w-[648px]", className)}>
      <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
        {tag}
      </span>
      <div className="flex flex-col gap-5">
        {participants.map((p, i) => (
          <div key={i} className="flex flex-col gap-2">
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]">
              {p.role}
            </span>
            <p className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]">
              {p.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Academy step card (horizontal, no timeline) ─────────────────────────────

function AcademyStepCard({
  step,
  isFirst,
  className,
}: {
  step: ProcessStep;
  isFirst: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-[#404040] py-5 lg:flex-row lg:items-center lg:gap-4 lg:py-8",
        isFirst ? "border-t border-b" : "border-b",
        className
      )}
    >
      {/* Title + number row */}
      <div className="flex items-end gap-6 lg:w-1/2 lg:items-center">
        <span className="flex-1 h4 text-[#F0F0F0]">{step.title}</span>
        <span className="w-[100px] shrink-0 text-right lg:text-left lg:order-first font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
          {step.number}
        </span>
      </div>
      {/* Description */}
      <div className="pl-0 lg:w-1/2 lg:pl-4">
        <p className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]">
          {step.text}
        </p>
      </div>
    </div>
  );
}

// ── Scroll progress hook ───────────────────────────────────────────────────────

function useStepProgress(stepCount: number) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [fills, setFills] = useState<number[]>(() => Array(stepCount).fill(0));
  const containerRef = useRef<HTMLDivElement>(null);

  const update = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Filter only visible step elements (display:none or 0-height = hidden)
    const allStepEls = container.querySelectorAll<HTMLElement>("[data-step]");
    const stepEls = Array.from(allStepEls).filter((el) => el.offsetHeight > 0);
    if (stepEls.length === 0) return;

    const trigger = window.innerHeight * 0.45;
    let newActive = -1;
    const newFills = Array(stepCount).fill(0);

    stepEls.forEach((el, i) => {
      const rect = el.getBoundingClientRect();

      // Step activates when its top passes the trigger line
      if (rect.top <= trigger) {
        newActive = i;
      }

      // Fill progress: from when THIS step's top passes trigger
      // to when NEXT step's top passes trigger
      if (i < stepEls.length - 1) {
        const nextRect = stepEls[i + 1].getBoundingClientRect();
        const distance = nextRect.top - rect.top;
        if (distance > 0) {
          const progress = (trigger - rect.top) / distance;
          newFills[i] = Math.max(0, Math.min(1, progress));
        }
      }
    });

    setActiveIndex(newActive);
    setFills(newFills);
  }, [stepCount]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // Run once on mount
    requestAnimationFrame(update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [update]);

  return { activeIndex, fills, containerRef };
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function ProcessSection({
  tag,
  title,
  subtitle,
  description,
  steps,
  participantsTag,
  participants,
  variant = "product",
  className,
}: ProcessSectionProps) {
  const { activeIndex, fills, containerRef } = useStepProgress(steps.length);
  const hasParticipants = participants && participants.length > 0 && participantsTag;
  const isAcademy = variant === "academy";

  return (
    <section
      ref={containerRef}
      className={cn("w-full bg-[#0A0A0A] border-t border-border py-10 md:py-16 lg:py-20", className)}
    >
      {/* ── Desktop ── */}
      <div className="hidden lg:flex mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
        {/* Left: sticky header at top, participants at bottom */}
        <div className="w-1/2 shrink-0 pr-8 flex flex-col">
          <div className="flex-1 pb-10">
            <div className="sticky top-24">
              <div className="flex flex-col gap-8 max-w-[560px]">
                <div className="flex flex-col gap-2">
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                    {tag}
                  </span>
                  <h2 className="h2 text-[#F0F0F0]">{title}</h2>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]">
                    {subtitle}
                  </p>
                  {description && (
                    <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393]">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {hasParticipants && (
            <div className="max-w-[648px]">
              <ParticipantsBlock tag={participantsTag} participants={participants} />
            </div>
          )}
        </div>

        {/* Right: steps */}
        <div className="w-1/2 pt-10">
          <div className="flex flex-col">
            {isAcademy
              ? steps.map((step, i) => (
                  <AcademyStepCard key={i} step={step} isFirst={i === 0} />
                ))
              : steps.map((step, i) => (
                  <div key={i} data-step>
                    <StepCard
                      step={step}
                      isActive={i <= activeIndex}
                      isLast={i === steps.length - 1}
                      fillProgress={fills[i]}
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* ── Tablet (md → lg) — two-column layout ── */}
      <div className="hidden md:flex lg:hidden gap-10 px-8">
        {/* Left: sticky header at top, participants at bottom */}
        <div className="w-[45%] shrink-0 flex flex-col">
          <div className="flex-1 pb-10">
            <div className="sticky top-24">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                    {tag}
                  </span>
                  <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-28)] font-bold uppercase leading-[1.16] tracking-[-0.01em] text-[#F0F0F0]">
                    {title}
                  </h2>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]">
                    {subtitle}
                  </p>
                  {description && (
                    <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393]">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {hasParticipants && (
            <ParticipantsBlock
              tag={participantsTag}
              participants={participants}
              className="p-5 max-w-none"
            />
          )}
        </div>

        {/* Right: steps */}
        <div className="flex-1 pt-10">
          <div className="flex flex-col">
            {isAcademy
              ? steps.map((step, i) => (
                  <AcademyStepCard key={i} step={step} isFirst={i === 0} className="lg:flex-col lg:items-start" />
                ))
              : steps.map((step, i) => (
                  <div key={i} data-step>
                    <StepCard
                      step={step}
                      isActive={i <= activeIndex}
                      isLast={i === steps.length - 1}
                      fillProgress={fills[i]}
                      className="max-w-none"
                      titleClass="font-[family-name:var(--font-heading-family)] text-[length:var(--text-28)] font-bold uppercase leading-[1.16] tracking-[-0.01em]"
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="flex md:hidden flex-col px-5">
        <div className="flex flex-col gap-4 mb-10">
          <div className="flex flex-col gap-2">
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
              {tag}
            </span>
            <h2 className="h3 text-[#F0F0F0]">{title}</h2>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]">
              {subtitle}
            </p>
            {description && (
              <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393]">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {isAcademy
            ? steps.map((step, i) => (
                <AcademyStepCard key={i} step={step} isFirst={i === 0} />
              ))
            : steps.map((step, i) => (
                <div key={i} data-step>
                  <StepCard
                    step={step}
                    isActive={i <= activeIndex}
                    isLast={i === steps.length - 1}
                    fillProgress={fills[i]}
                  />
                </div>
              ))}
        </div>

        {hasParticipants && (
          <div className="mt-4">
            <ParticipantsBlock tag={participantsTag} participants={participants} />
          </div>
        )}
      </div>
    </section>
  );
}
