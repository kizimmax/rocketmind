"use client";

import { cn } from "../../lib/utils";
import { GlowingEffect } from "./glowing-effect";
import {
  StyledParagraphs,
  resolveStyledParagraphs,
  type StyledParagraph,
} from "./styled-paragraphs";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ServiceCardData {
  /** Card heading (uppercase) */
  title: string;
  /** Paragraph array — each entry renders as a separate <p> */
  paragraphs: string[];
  /** Show the arrow icon in the top-right corner */
  showArrow?: boolean;
  /** Optional link target — makes the whole card clickable */
  href?: string;
  /** Bento grid sizing (1–2 cols / 1–2 rows). Defaults to 1/1. */
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
  /** Highlight card with yellow background (featured variant) */
  featured?: boolean;
  /** For wide cards (colSpan=2): render paragraphs in two columns */
  paragraphsTwoCol?: boolean;
}

export interface ServicesSectionProps {
  tag?: string;
  title: string;
  titleSecondary?: string;
  /** Legacy single-string description (plain secondary text). */
  description?: string;
  /** Structured paragraphs with per-paragraph caps + color. Supersedes `description` when provided. */
  paragraphs?: StyledParagraph[];
  cards: ServiceCardData[];
  className?: string;
}

// ── Arrow ─────────────────────────────────────────────────────────────────────

function Arrow({ featured }: { featured?: boolean }) {
  return (
    <div
      className={cn(
        "absolute top-[2px] right-[2px] z-10 flex items-center justify-center w-10 h-10 rounded-[4px] transition-all duration-200",
        featured
          ? "text-[#0A0A0A] group-hover/card:text-[#F0F0F0]"
          : "text-[#404040] group-hover/card:text-[#0A0A0A]",
        "group-hover/card:-top-[2px] group-hover/card:-right-[2px]",
      )}
    >
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path d="M1 10L10 1M10 1H3M10 1V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

function ServiceCard({ card }: { card: ServiceCardData }) {
  const colSpan = card.colSpan ?? 1;
  const rowSpan = card.rowSpan ?? 1;
  const featured = card.featured === true;

  const rootCn = cn(
    "group/card relative flex flex-col gap-5 p-6 md:p-8 h-full -ml-px -mt-px",
    "transition-colors duration-150",
    featured
      ? "z-10 bg-[var(--rm-yellow-100)] border border-[var(--rm-yellow-100)] hover:bg-[#0A0A0A] hover:border-[#404040]"
      : "bg-[#0A0A0A] border border-[#404040] hover:z-10 hover:bg-[var(--rm-yellow-100)] hover:border-[var(--rm-yellow-100)]",
    colSpan === 2 && "md:col-span-2",
    rowSpan === 2 && "lg:row-span-2",
  );

  const content = (
    <>
      {!featured && (
        <GlowingEffect spread={40} glow={false} disabled={false} proximity={40} inactiveZone={0.01} borderWidth={1} variant="yellow" />
      )}

      {card.showArrow !== false && <Arrow featured={featured} />}

      <h3
        className={cn(
          "font-[family-name:var(--font-heading-family)] text-[24px] md:text-[28px] font-bold uppercase leading-[1.16] tracking-[-0.01em] transition-colors duration-150 pr-8",
          featured
            ? "text-[#0A0A0A] group-hover/card:text-[#F0F0F0]"
            : "text-[#F0F0F0] group-hover/card:text-[#0A0A0A]",
        )}
      >
        {card.title || "Название услуги"}
      </h3>

      <div
        className={cn(
          "gap-3 md:gap-x-10",
          card.paragraphsTwoCol && colSpan === 2
            ? "grid grid-cols-1 md:grid-cols-2"
            : "flex flex-col",
        )}
      >
        {(card.paragraphs.length > 0 ? card.paragraphs : [""]).map((p, i) => (
          <p
            key={i}
            className={cn(
              "text-[14px] md:text-[15px] leading-[1.4] transition-colors duration-150",
              featured
                ? "text-[#0A0A0A] group-hover/card:text-[#939393]"
                : "text-[#939393] group-hover/card:text-[#0A0A0A]",
            )}
          >
            {p || "Описание услуги"}
          </p>
        ))}
      </div>
    </>
  );

  if (card.href) {
    return (
      <a href={card.href} className={rootCn}>
        {content}
      </a>
    );
  }
  return <div className={rootCn}>{content}</div>;
}

// ── Section ───────────────────────────────────────────────────────────────────

export function ServicesSection({
  tag,
  title,
  titleSecondary,
  description,
  paragraphs,
  cards,
  className,
}: ServicesSectionProps) {
  if (!cards || cards.length === 0) return null;
  const resolvedParagraphs = resolveStyledParagraphs(paragraphs, description, {
    uppercase: false,
    color: "secondary",
  });
  const hasParagraphs = resolvedParagraphs.length > 0;

  return (
    <section className={cn("w-full border-t border-[#404040] bg-[#0A0A0A] py-10 md:py-16 lg:py-20", className)}>
      <div className="mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
        {/* Header */}
        <div className="mb-8 md:mb-12 flex flex-col gap-4 lg:flex-row lg:gap-10">
          <div className="flex flex-col gap-4 lg:w-1/2">
            {tag && (
              <span className="font-[family-name:var(--font-mono-family)] text-[18px] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[var(--rm-yellow-100)]">
                {tag}
              </span>
            )}
            <h2 className="font-[family-name:var(--font-heading-family)] text-[28px] md:text-[36px] lg:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em]">
              <span className="text-[#F0F0F0]">{title}</span>
              {titleSecondary ? <><span className="text-[#F0F0F0]"> </span><span className="text-[#939393]">{titleSecondary}</span></> : null}
            </h2>
          </div>
          {hasParagraphs && (
            <div className="lg:w-1/2 lg:flex lg:items-end">
              <StyledParagraphs paragraphs={resolvedParagraphs} theme="dark" size="16" />
            </div>
          )}
        </div>

        {/* Bento grid — cards share borders (no gap) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 auto-rows-[minmax(260px,auto)]">
          {cards.map((card, i) => (
            <ServiceCard key={i} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Auto-bento helper (exported for re-use in admin) ─────────────────────────

/**
 * Assign bento-style sizing to cards based on content volume, then sort so
 * larger cards tend to come first for dense packing on a 4-column grid.
 */
export function repackBento(cards: ServiceCardData[]): ServiceCardData[] {
  const scored = cards.map((c) => {
    const textLen = c.paragraphs.reduce((n, p) => n + (p?.length || 0), 0) + (c.title?.length || 0);
    let size: { colSpan: 1 | 2; rowSpan: 1 | 2 };
    if (textLen > 260) size = { colSpan: 2, rowSpan: 2 };
    else if (textLen > 140) size = { colSpan: 2, rowSpan: 1 };
    else if (textLen > 60) size = { colSpan: 1, rowSpan: 2 };
    else size = { colSpan: 1, rowSpan: 1 };
    return { ...c, ...size, _score: textLen } as ServiceCardData & { _score: number };
  });
  scored.sort((a, b) => b._score - a._score);
  return scored.map(({ _score: _s, ...c }) => c);
}
