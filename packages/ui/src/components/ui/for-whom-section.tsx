"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { RichText } from "./rich-text";
import {
  StyledParagraphs,
  resolveStyledParagraphs,
  type StyledParagraph,
} from "./styled-paragraphs";

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
  /** Secondary (gray) part of heading — rendered in same h2 for SEO */
  titleSecondary?: string;
  /** Subtitle / lead text (optional) — legacy single string (uppercase primary). */
  subtitle?: string;
  /** Structured paragraphs with per-paragraph caps + color. Supersedes `subtitle` when provided. */
  paragraphs?: StyledParagraph[];
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
        <RichText
          text={text}
          className="text-[length:var(--text-16)] leading-[1.28] text-[#0A0A0A] max-w-[480px]"
        />
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ForWhomSection({
  tag,
  title,
  titleSecondary,
  subtitle,
  paragraphs,
  facts,
  wideColumn = "right",
  className,
}: ForWhomSectionProps) {
  const resolvedParagraphsDesktop = resolveStyledParagraphs(paragraphs, subtitle, {
    uppercase: true,
    color: "primary",
  });
  const hasParagraphs = resolvedParagraphsDesktop.length > 0;
  return (
    <section className={cn("w-full bg-[#F0F0F0] py-10 md:py-16 lg:py-20", className)}>
      {/* ── Desktop ── */}
      <div className="hidden lg:flex flex-col gap-[104px] mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
        {/* Header — Figma: gap 8px, title row 50/50 */}
        <div className="flex flex-col gap-2">
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A]">
            {tag}
          </span>
          <div className="flex">
            <div className="w-1/2 shrink-0 pr-8">
              <h2 className="h2"><span className="text-[#0A0A0A]">{title}</span>{titleSecondary ? <><span className="text-[#0A0A0A]"> </span><span className="text-[#666666]">{titleSecondary}</span></> : null}</h2>
            </div>
            {hasParagraphs && (
              <div className="w-1/2">
                <div className="max-w-[480px]">
                  <StyledParagraphs paragraphs={resolvedParagraphsDesktop} theme="light" size="18" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cards — Figma: two columns, left pr-4, right no padding, gap-4 within each */}
        {(() => {
          // Split facts into left/right columns based on wideColumn
          let leftFacts: ForWhomFact[];
          let rightFacts: ForWhomFact[];

          if (facts.length === 2) {
            leftFacts = [facts[0]];
            rightFacts = [facts[1]];
          } else if (facts.length === 3) {
            if (wideColumn === "left") {
              leftFacts = [facts[0]];
              rightFacts = [facts[1], facts[2]];
            } else {
              leftFacts = [facts[0], facts[1]];
              rightFacts = [facts[2]];
            }
          } else {
            // 4 facts: 2 per column
            leftFacts = [facts[0], facts[1]];
            rightFacts = [facts[2], facts[3]];
          }

          const renderCard = (f: ForWhomFact, i: number) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="flex items-end">
                <h4 className="h4 text-[#0A0A0A]">{f.title}</h4>
              </div>
              <div className="h-0 w-full border-t border-[#404040]" />
              <RichText
                text={f.text}
                className="text-[length:var(--text-16)] leading-[1.28] text-[#0A0A0A]"
              />
            </div>
          );

          return (
            <div className="flex">
              {/* Left column — pr-4 */}
              <div className="w-1/2 flex gap-4 pr-4">
                {leftFacts.map((f, i) => (
                  <div key={i} className="flex-1">{renderCard(f, i)}</div>
                ))}
              </div>
              {/* Right column — no padding */}
              <div className="w-1/2 flex gap-4">
                {rightFacts.map((f, i) => (
                  <div key={i} className="flex-1">{renderCard(f, i)}</div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── Mobile / Tablet ── */}
      <div className="flex lg:hidden flex-col gap-16 px-5 md:px-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A]">
            {tag}
          </span>
          <h2 className="h3"><span className="text-[#0A0A0A]">{title}</span>{titleSecondary ? <><span className="text-[#0A0A0A]"> </span><span className="text-[#666666]">{titleSecondary}</span></> : null}</h2>
          {hasParagraphs && (
            <div className="mt-1">
              <StyledParagraphs paragraphs={resolvedParagraphsDesktop} theme="light" size="16" />
            </div>
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
