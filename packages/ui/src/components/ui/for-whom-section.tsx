"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ForWhomFact = {
  title: string;
  text: string;
};

export type ForWhomSectionProps = {
  /** Section tag, e.g. "для кого" */
  tag: string;
  /** Main heading */
  title: string;
  /** Subtitle / lead text (optional) */
  subtitle?: string;
  /** 2–4 fact cards */
  facts: ForWhomFact[];
  /**
   * When 3 facts: which column gets the wide (single) card.
   * "left" = wide card in column 1 (2 cards in column 2)
   * "right" = wide card in column 2 (2 cards in column 1)
   * Default: "right"
   */
  wideColumn?: "left" | "right";
  className?: string;
};

// ── Fact Card ──────────────────────────────────────────────────────────────────

function FactCard({ title, text }: ForWhomFact) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="h4 text-[#0A0A0A]">{title}</h4>
      <div className="h-0 w-full border-t border-[#404040]" />
      <p className="text-[length:var(--text-16)] leading-[1.28] text-[#0A0A0A]">
        {text}
      </p>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ForWhomSection({
  tag,
  title,
  subtitle,
  facts,
  wideColumn = "right",
  className,
}: ForWhomSectionProps) {
  // Split facts into 2 columns for desktop
  let col1: ForWhomFact[];
  let col2: ForWhomFact[];

  if (facts.length === 2) {
    col1 = [facts[0]];
    col2 = [facts[1]];
  } else if (facts.length === 3) {
    if (wideColumn === "left") {
      col1 = [facts[0]];
      col2 = [facts[1], facts[2]];
    } else {
      col1 = [facts[0], facts[1]];
      col2 = [facts[2]];
    }
  } else {
    // 4+ facts: split evenly
    const mid = Math.ceil(facts.length / 2);
    col1 = facts.slice(0, mid);
    col2 = facts.slice(mid);
  }

  return (
    <section className={cn("w-full bg-[#F0F0F0]", className)}>
      {/* ── Desktop ── */}
      <div className="hidden lg:flex flex-col gap-[104px] mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14 py-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A]">
            {tag}
          </span>
          <div className="flex gap-8">
            <h2 className="h2 text-[#0A0A0A]">{title}</h2>
            {subtitle && (
              <div className="flex-1 flex items-end">
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A]">
                  {subtitle}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cards — 2 columns */}
        <div className="flex gap-8">
          {/* Column 1 */}
          <div className="flex gap-8 shrink-0">
            {col1.map((f, i) => (
              <div key={i} className="w-[310px]">
                <FactCard {...f} />
              </div>
            ))}
          </div>
          {/* Column 2 */}
          <div className="flex-1 flex gap-8">
            {col2.map((f, i) => (
              <div key={i} className="flex-1">
                <FactCard {...f} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile / Tablet ── */}
      <div className="flex lg:hidden flex-col gap-16 px-5 md:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A]">
            {tag}
          </span>
          <h2 className="h3 text-[#0A0A0A]">{title}</h2>
          {subtitle && (
            <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A] mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Cards — stacked */}
        <div className="flex flex-col gap-7">
          {facts.map((f, i) => (
            <FactCard key={i} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
