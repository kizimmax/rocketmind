"use client";

import { DotGridLens, HeroExperts, RichText, type HeroExpert } from "@rocketmind/ui";
import type { AboutParagraph, Factoid } from "@/lib/products";

// ── Types ──────────────────────────────────────────────────────────────────────

type AboutHeroProps = {
  /** Kept for frontmatter compatibility; not rendered in about-variant hero. */
  caption?: string;
  title?: string;
  ctaText?: string;
  /** Legacy single-string description. Prefer `paragraphs`. */
  description?: string;
  /** Structured paragraphs — supersede `description` when non-empty. */
  paragraphs?: AboutParagraph[];
  factoids: Factoid[];
  experts: HeroExpert[];
  /** Large uppercase h1 in the top-left slot (white). */
  heading?: string;
  /** Optional secondary gray subtitle rendered below the heading. */
  headingSecondary?: string;
  /** When true, description renders full-width below the heading instead of to its right. */
  descriptionBelow?: boolean;
  /** Toggle for the experts strip. Default true. */
  showExperts?: boolean;
  /** Limit experts strip to N items. Absent/null = show all. */
  maxExperts?: number | null;
};

// ── Factoid cell (single row of 4) ────────────────────────────────────────────

function FactoidCell({
  number,
  label,
  className,
}: {
  number: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-5 p-5 md:p-7 bg-black/90 backdrop-blur-md ${className ?? ""}`}>
      <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-52)] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0] shrink-0">
        {number}
      </span>
      <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0] min-w-0 break-words">
        {label}
      </span>
    </div>
  );
}

function fadeIn(index: number): React.CSSProperties {
  return {
    opacity: 0,
    transform: "translateY(20px)",
    animation: `heroFadeIn 600ms ease-out ${index * 120}ms forwards`,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AboutHero({ description = "", paragraphs, factoids, experts, heading, headingSecondary, descriptionBelow, showExperts = true, maxExperts }: AboutHeroProps) {
  const fourFactoids = factoids.slice(0, 4);
  const limit = typeof maxExperts === "number" && maxExperts > 0 ? maxExperts : experts.length;
  const visibleExperts = showExperts ? experts.slice(0, limit) : [];

  const descriptionNode = paragraphs && paragraphs.length > 0 ? (
    <div className="flex flex-col gap-4">
      {paragraphs.map((p, i) => (
        <RichText
          key={i}
          text={p.text}
          className={
            p.uppercase
              ? "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] " +
                (p.color === "primary" ? "text-[#F0F0F0]" : "text-[#939393]")
              : "text-[length:var(--text-18)] leading-[1.3] " +
                (p.color === "primary" ? "text-[#F0F0F0]" : "text-[#939393]")
          }
        />
      ))}
    </div>
  ) : (
    <RichText
      text={description}
      className="text-[length:var(--text-18)] leading-[1.3] text-[#F0F0F0] [&_p+p]:mt-4"
    />
  );

  return (
    <section className="relative w-full bg-[#0A0A0A] overflow-hidden">
      <div className="relative mx-auto max-w-[1512px]">
        {/* Dot-grid background — inset from left 56px like Figma */}
        <DotGridLens
          accentColor
          gridGap={13}
          baseRadius={0.75}
          maxScale={4.2}
          className="absolute left-14 right-14 top-0 bottom-0 z-0 opacity-75 pointer-events-none"
        />

        {/* Golden-ratio illustration — respects header, container padding, factoids */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-5 md:right-8 xl:right-14 top-16 bottom-[384px] md:bottom-[224px] xl:bottom-[112px] z-0"
        >
          <img
            src="/about/golden-ratio.svg"
            alt=""
            className="block h-full w-auto max-w-none select-none"
          />
        </div>

        {/* Content frame */}
        <div className="relative z-10 px-5 md:px-8 xl:px-14 pt-[102px] lg:pt-[184px]">
          {/* ── Top row: heading (+ optional secondary) and description ── */}
          <div
            className={`flex flex-col gap-8 lg:mt-12 ${
              descriptionBelow ? "lg:gap-10" : "lg:flex-row lg:gap-0"
            }`}
            style={fadeIn(0)}
          >
            <div className={descriptionBelow ? "w-full" : "lg:w-1/2 lg:pr-11"}>
              <h1 className="font-[family-name:var(--font-heading-family)] text-[52px] md:text-[64px] lg:text-[80px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0]">
                {heading}
              </h1>
              {headingSecondary ? (
                <p className="mt-4 font-[family-name:var(--font-heading-family)] text-[28px] md:text-[36px] lg:text-[44px] font-bold uppercase leading-[1.12] tracking-[-0.01em] text-[#939393]">
                  {headingSecondary}
                </p>
              ) : null}
            </div>
            <div className={descriptionBelow ? "w-full lg:w-3/4" : "lg:w-1/2 flex items-start"}>
              {descriptionNode}
            </div>
          </div>

          {/* ── Experts strip ── */}
          {visibleExperts.length > 0 && (
            <div className="relative mt-16 md:mt-24 lg:mt-28" style={fadeIn(2)}>
              <div className="flex flex-col gap-4">
                <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393]">
                  Команда экспертов
                </span>
                <HeroExperts experts={visibleExperts} />
              </div>
            </div>
          )}

          {/* ── Factoids: 4 in a single row ── */}
          {fourFactoids.length > 0 && (
            <div
              className={[
                "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 border-t border-l border-[#404040]",
                // When the experts strip is rendered above, it provides its own gap; otherwise add a large gap to match Figma (319px @ xl)
                visibleExperts.length > 0
                  ? "mt-10 md:mt-14"
                  : "mt-20 md:mt-32 lg:mt-[200px] xl:mt-[319px]",
              ].join(" ")}
              style={fadeIn(3)}
            >
              {fourFactoids.map((f) => (
                <FactoidCell
                  key={f.number + f.label}
                  number={f.number}
                  label={f.label}
                  className="border-b border-r border-[#404040] min-w-0"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
