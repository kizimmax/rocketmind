"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
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
  /** e.g. "Общий срок проекта: ~10 недель" */
  subtitle: string;
  /** Secondary description */
  description?: string;
  steps: ProcessStep[];
  /** Optional "who to include" block */
  participantsTag?: string;
  participants?: ProcessParticipant[];
  className?: string;
};

// ── Timeline dot + line ────────────────────────────────────────────────────────

function TimelineMark({ isActive, isLast }: { isActive: boolean; isLast: boolean }) {
  return (
    <div className="relative w-4 shrink-0 flex flex-col items-center">
      {/* Top line */}
      <div className="w-px h-2 bg-[#404040]" />
      {/* Dot */}
      <div
        className={cn(
          "w-4 h-4 rounded-full border-2 transition-colors duration-500",
          isActive
            ? "bg-[#F0F0F0] border-[#F0F0F0]"
            : "bg-[#0A0A0A] border-[#404040]",
        )}
      />
      {/* Bottom line */}
      {!isLast && (
        <div className="w-px flex-1 min-h-[40px] relative">
          <div className="absolute inset-0 bg-[#404040]" />
          {isActive && (
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                background: "linear-gradient(180deg, #F0F0F0 0%, #404040 90%)",
              }}
            />
          )}
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
  onRef,
}: {
  step: ProcessStep;
  isActive: boolean;
  isLast: boolean;
  onRef: (el: HTMLDivElement | null) => void;
}) {
  const activeText = isActive ? "text-[#F0F0F0]" : "text-[#939393]";
  const activeNumber = isActive ? "text-[#F0F0F0]" : "text-[#404040]";

  return (
    <div ref={onRef} className="flex gap-10">
      <TimelineMark isActive={isActive} isLast={isLast} />
      <div className="flex flex-col gap-3 pb-16">
        <div className="flex flex-col gap-2">
          <span
            className={cn(
              "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] transition-colors duration-500",
              activeNumber,
            )}
          >
            {step.number}
          </span>
          <h3
            className={cn(
              "h3 transition-colors duration-500",
              activeText,
            )}
          >
            {step.title}
          </h3>
        </div>
        <p
          className={cn(
            "text-[length:var(--text-16)] leading-[1.28] transition-colors duration-500",
            isActive ? "text-[#939393]" : "text-[#939393]/50",
          )}
        >
          {step.text}
        </p>
        <span
          className={cn(
            "font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] font-medium uppercase leading-[1.16] tracking-[0.02em] transition-colors duration-500",
            isActive ? "text-[#FFCC00]" : "text-[#939393]",
          )}
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
    <div className="bg-[#121212] rounded p-8 flex flex-col gap-8">
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
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Ensure refs array matches steps length
  if (stepRefs.current.length !== steps.length) {
    stepRefs.current = Array(steps.length).fill(null);
  }

  // Scroll-based activation using IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(i);
          }
        },
        { threshold: 0.6, rootMargin: "-30% 0px -30% 0px" },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [steps.length]);

  return (
    <section
      ref={sectionRef}
      className={cn("w-full bg-[#0A0A0A] border-t border-border", className)}
    >
      {/* ── Desktop ── */}
      <div className="hidden lg:flex mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
        {/* Left: sticky header */}
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
            </div>
          </div>
        </div>

        {/* Right: steps + participants */}
        <div className="w-1/2 pt-10">
          <div className="flex flex-col">
            {steps.map((step, i) => (
              <StepCard
                key={i}
                step={step}
                isActive={i <= activeIndex}
                isLast={i === steps.length - 1}
                onRef={(el) => { stepRefs.current[i] = el; }}
              />
            ))}
          </div>
          {participants && participants.length > 0 && participantsTag && (
            <div className="mt-4 mb-14">
              <ParticipantsBlock tag={participantsTag} participants={participants} />
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile / Tablet ── */}
      <div className="flex lg:hidden flex-col px-5 md:px-8 py-10">
        {/* Header */}
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

        {/* Steps */}
        <div className="flex flex-col">
          {steps.map((step, i) => (
            <StepCard
              key={i}
              step={step}
              isActive={i <= activeIndex}
              isLast={i === steps.length - 1}
              onRef={(el) => { stepRefs.current[i] = el; }}
            />
          ))}
        </div>

        {/* Participants */}
        {participants && participants.length > 0 && participantsTag && (
          <div className="mt-4">
            <ParticipantsBlock tag={participantsTag} participants={participants} />
          </div>
        )}
      </div>
    </section>
  );
}
