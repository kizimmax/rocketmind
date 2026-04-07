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
  className?: string;
};

// ── Timeline mark (square dot + line with scroll-driven fill) ──────────────────

function TimelineMark({
  isActive,
  isLast,
  lineFill,
}: {
  isActive: boolean;
  isLast: boolean;
  /** 0–1 how much of the line below this dot is filled */
  lineFill: number;
}) {
  return (
    <div className="relative w-4 shrink-0 flex flex-col items-center">
      <div className="w-px h-[2px] bg-[#404040]" />
      {/* Square dot */}
      <div
        className="w-4 h-4 border-2 transition-colors duration-300"
        style={{
          backgroundColor: isActive ? "#F0F0F0" : "#0A0A0A",
          borderColor: isActive ? "#F0F0F0" : "#404040",
        }}
      />
      {/* Bottom line with progressive fill */}
      {!isLast && (
        <div className="w-px flex-1 min-h-[40px] relative overflow-hidden">
          {/* Base gray line */}
          <div className="absolute inset-0 bg-[#404040]" />
          {/* White fill — scaleY based on scroll progress */}
          <div
            className="absolute top-0 left-0 right-0 origin-top"
            style={{
              height: "100%",
              background: "linear-gradient(180deg, #F0F0F0 0%, #F0F0F0 70%, #404040 100%)",
              transform: `scaleY(${lineFill})`,
              transition: "transform 0.15s ease-out",
            }}
          />
        </div>
      )}
    </div>
  );
}

// ── Step card ──────────────────────────────────────────────────────────────────

function StepCard({
  step,
  isActive,
  isLast,
  lineFill,
  onRef,
}: {
  step: ProcessStep;
  isActive: boolean;
  isLast: boolean;
  lineFill: number;
  onRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={onRef} className="flex gap-10 max-w-[364px]">
      <TimelineMark isActive={isActive} isLast={isLast} lineFill={lineFill} />
      <div className="flex flex-col gap-3 pb-16">
        <div className="flex flex-col gap-2">
          <span
            className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] transition-colors duration-300"
            style={{ color: isActive ? "#F0F0F0" : "#404040" }}
          >
            {step.number}
          </span>
          <h3
            className="h3 transition-colors duration-300"
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
}: {
  tag: string;
  participants: ProcessParticipant[];
}) {
  return (
    <div className="bg-[#121212] rounded p-8 flex flex-col gap-8 max-w-[648px]">
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

// ── Main Component ─────────────────────────────────────────────────────────────

export function ProcessSection({
  tag,
  title,
  subtitle,
  description,
  steps,
  participantsTag,
  participants,
  className,
}: ProcessSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lineFills, setLineFills] = useState<number[]>(() => Array(steps.length).fill(0));
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  if (stepRefs.current.length !== steps.length) {
    stepRefs.current = Array(steps.length).fill(null);
  }

  const updateProgress = useCallback(() => {
    const viewportCenter = window.innerHeight * 0.45;
    let newActive = 0;
    const newFills = Array(steps.length).fill(0);

    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const stepTop = rect.top;

      // Step is active when its top passes viewport center
      if (stepTop < viewportCenter) {
        newActive = i;
      }

      // Line fill: progress from when step top reaches viewport center
      // to when the NEXT step top reaches viewport center
      const nextEl = stepRefs.current[i + 1];
      if (nextEl && i <= newActive) {
        const nextRect = nextEl.getBoundingClientRect();
        const totalDistance = nextRect.top - stepTop;
        if (totalDistance > 0) {
          const scrolled = viewportCenter - stepTop;
          const progress = Math.max(0, Math.min(1, scrolled / totalDistance));
          newFills[i] = progress;
        }
      }
      // Already passed: full fill
      if (i < newActive) {
        newFills[i] = 1;
      }
    });

    setActiveIndex(newActive);
    setLineFills(newFills);
  }, [steps.length]);

  useEffect(() => {
    function onScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateProgress);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial calculation
    updateProgress();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateProgress]);

  const hasParticipants = participants && participants.length > 0 && participantsTag;

  return (
    <section
      ref={sectionRef}
      className={cn("w-full bg-[#0A0A0A] border-t border-border", className)}
    >
      {/* ── Desktop ── */}
      <div className="hidden lg:flex mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
        {/* Left: sticky header + participants */}
        <div className="w-1/2 shrink-0 pr-8">
          <div className="sticky top-24 py-14">
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
              {hasParticipants && (
                <ParticipantsBlock tag={participantsTag} participants={participants} />
              )}
            </div>
          </div>
        </div>

        {/* Right: steps */}
        <div className="w-1/2 pt-10 pb-14">
          <div className="flex flex-col">
            {steps.map((step, i) => (
              <StepCard
                key={i}
                step={step}
                isActive={i <= activeIndex}
                isLast={i === steps.length - 1}
                lineFill={lineFills[i]}
                onRef={(el) => { stepRefs.current[i] = el; }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile / Tablet ── */}
      <div className="flex lg:hidden flex-col px-5 md:px-8 py-10">
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
          {steps.map((step, i) => (
            <StepCard
              key={i}
              step={step}
              isActive={i <= activeIndex}
              isLast={i === steps.length - 1}
              lineFill={lineFills[i]}
              onRef={(el) => { stepRefs.current[i] = el; }}
            />
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
