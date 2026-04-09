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
    <div className="grid grid-rows-[subgrid] row-span-3 gap-4">
      <div className="flex items-end">
        <h4 className="h4 text-[#0A0A0A]">{title}</h4>
      </div>
      <div className="h-0 w-full border-t border-[#404040]" />
      <div>
        <p className="text-[length:var(--text-16)] leading-[1.28] text-[#0A0A0A] max-w-[480px]">
          {text}
        </p>
      </div>
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
  return (
    <section className={cn("w-full bg-[#F0F0F0] py-10 md:py-16 lg:py-20", className)}>
      {/* ── Desktop ── */}
      <div className="hidden lg:flex flex-col gap-10 mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
        {/* Header — 50/50 */}
        <div className="flex flex-col gap-2">
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A]">
            {tag}
          </span>
          <div className="flex">
            <div className="w-1/2 shrink-0 pr-8">
              <h2 className="h2 text-[#0A0A0A]">{title}</h2>
            </div>
            {subtitle && (
              <div className="w-1/2">
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A] max-w-[480px]">
                  {subtitle}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cards — single grid, 50/50 aligned with header */}
        {/* Cards grid — columns match header 50/50 split */}
        <div
          className="grid"
          style={{
            gridTemplateColumns:
              facts.length === 3
                ? wideColumn === "left"
                  ? "calc(50% - 16px) 1fr 1fr"
                  : "1fr 1fr calc(50% - 16px)"
                : facts.length === 2
                  ? "1fr 1fr"
                  : `repeat(${facts.length}, 1fr)`,
            gridTemplateRows: "1fr auto auto",
            columnGap: "32px",
          }}
        >
          {facts.map((f, i) => (
            <div
              key={`t${i}`}
              className="flex items-end pb-4"
              style={{ gridColumn: i + 1, gridRow: 1 }}
            >
              <h4 className="h4 text-[#0A0A0A]">{f.title}</h4>
            </div>
          ))}
          {facts.map((_, i) => (
            <div
              key={`d${i}`}
              className="border-t border-[#404040]"
              style={{ gridColumn: i + 1, gridRow: 2 }}
            />
          ))}
          {facts.map((f, i) => (
            <div
              key={`p${i}`}
              className="pt-4"
              style={{ gridColumn: i + 1, gridRow: 3 }}
            >
              <p className="text-[length:var(--text-16)] leading-[1.28] text-[#0A0A0A] max-w-[480px]">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile / Tablet ── */}
      <div className="flex lg:hidden flex-col gap-16 px-5 md:px-8">
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

        {/* Cards — stacked, each card is its own 3-row grid */}
        <div className="flex flex-col gap-7">
          {facts.map((f, i) => (
            <div key={i} className="grid" style={{ gridTemplateRows: "auto auto 1fr" }}>
              <FactCard {...f} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
