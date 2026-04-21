"use client";

import Image from "next/image";
import {
  DotGridLens,
  HeroExperts,
  StyledParagraphs,
  resolveStyledParagraphs,
  type HeroExpert,
  type StyledParagraph,
} from "@rocketmind/ui";
import type { Factoid, HeroTag } from "@/lib/products";

// ── Types ──────────────────────────────────────────────────────────────────────

type ProductHeroProps = {
  caption: string;
  title: string;
  titleSecondary?: string;
  /** Legacy single-string description. Prefer `paragraphs`. */
  description: string;
  /** Structured paragraphs with per-paragraph caps + color. */
  paragraphs?: StyledParagraph[];
  ctaText: string;
  factoids: Factoid[];
  coverImage: string;
  tags?: HeroTag[];
  /** When true: auto-injects expert tag, moves description up, renders experts block in bottom-left slot. */
  expertProduct?: boolean;
  /** Experts to render inside hero block (only when expertProduct is true). */
  experts?: HeroExpert[];
  /** Optional quote under the experts block. */
  quote?: string;
};

// ── Hero Tag Badge ────────────────────────────────────────────────────────────

function HeroTagBadge({ text }: HeroTag) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-[4px] border border-[#404040] bg-[#121212] px-2.5 py-1 h-7">
      <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] font-medium uppercase leading-[1.16] tracking-[0.02em] text-[#939393]">
        {text}
      </span>
    </span>
  );
}

// ── Expert Tag Badge (auto, dark-yellow theme) ────────────────────────────────

function ExpertTagBadge() {
  return (
    <span className="inline-flex items-center h-7 rounded-[4px] border border-[#4A3C00] bg-[#3D3300] px-2.5 py-1">
      <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] font-medium uppercase leading-[1.16] tracking-[0.02em] text-[#FFE466]">
        Экспертный продукт
      </span>
    </span>
  );
}

// ── Factoid Card ───────────────────────────────────────────────────────────────

function FactoidCard({ number, label, text, stretch, className }: Factoid & { stretch?: boolean; className?: string }) {
  return (
    <div className={`flex flex-col p-5 md:p-7 ${stretch ? "flex-1" : "md:h-[189px]"} ${className ?? ""}`}>
      <div className="flex flex-col justify-between gap-4 h-full">
        <div className="flex items-center gap-5">
          <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-52)] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0]">{number}</span>
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0] w-[127px]">
            {label}
          </span>
        </div>
        <p className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]">
          {text}
        </p>
      </div>
    </div>
  );
}

// ── CTA Button ─────────────────────────────────────────────────────────────────

function HeroCTA({ text, stretch }: { text: string; stretch?: boolean }) {
  return (
    <button
      type="button"
      className={`group flex flex-col justify-between w-full bg-[#FFCC00] p-5 md:p-7 cursor-pointer transition-colors duration-200 hover:bg-[#FFE040] ${stretch ? "flex-1" : "h-[126px] md:h-[189px]"}`}
    >
      <div className="flex justify-end w-full">
        <div className="transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M8 8H24M24 8V24M24 8L8 24"
              stroke="#0A0A0A"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <span className="h4 md:h3 text-[#0A0A0A] text-left">{text}</span>
    </button>
  );
}

// ── Stagger animation helper ──────────────────────────────────────────────────

function fadeIn(index: number): React.CSSProperties {
  const delay = index * 150;
  const duration = 600;
  return {
    opacity: 0,
    transform: "translateY(20px)",
    animation: `heroFadeIn ${duration}ms ease-out ${delay}ms forwards`,
  };
}

/** Pure opacity fade-in (no translate) — for background images. */
function bgFade(): React.CSSProperties {
  return {
    opacity: 0,
    animation: "heroBgFade 900ms ease-out 0ms forwards",
  };
}

// ── Caption + Tags row (shared, auto-injects expert tag) ──────────────────────

function CaptionTagsRow({
  caption,
  tags,
  expertProduct,
  gapClass,
  innerGapClass,
}: {
  caption: string;
  tags?: HeroTag[];
  expertProduct?: boolean;
  gapClass: string;
  innerGapClass: string;
}) {
  const hasTags = expertProduct || (tags && tags.length > 0);
  return (
    <div className={`flex items-center flex-wrap ${gapClass}`}>
      <span className="h4 text-[#FFCC00]">{caption}</span>
      {hasTags && (
        <div className={`flex items-center flex-wrap ${innerGapClass}`}>
          {expertProduct && <ExpertTagBadge />}
          {tags?.map((tag) => <HeroTagBadge key={tag.text} {...tag} />)}
        </div>
      )}
    </div>
  );
}

// ── Product Hero ───────────────────────────────────────────────────────────────

export function ProductHero({
  caption,
  title,
  titleSecondary,
  description,
  paragraphs,
  ctaText,
  factoids,
  coverImage,
  tags,
  expertProduct,
  experts,
  quote,
}: ProductHeroProps) {
  const showExpertsBlock = !!expertProduct && !!experts && experts.length > 0;
  const resolvedParagraphs = resolveStyledParagraphs(paragraphs, description, {
    uppercase: false,
    color: "primary",
  });

  const titleBlock = (
    <h1 className="h1 whitespace-pre-line" style={fadeIn(1)}>
      <span className="text-[#F0F0F0]">{title}</span>
      {titleSecondary ? (
        <>
          <span className="text-[#F0F0F0]"> </span>
          <span className="text-[#939393]">{titleSecondary}</span>
        </>
      ) : null}
    </h1>
  );

  const descriptionEl =
    resolvedParagraphs.length > 0 ? (
      <StyledParagraphs paragraphs={resolvedParagraphs} theme="dark" size="18" />
    ) : null;

  return (
    <section className="relative w-full bg-[#0A0A0A] pt-16">
      {/* ── Desktop layout ── */}
      <div className="hidden lg:flex mx-auto max-w-[1512px] pl-5 md:pl-8 xl:pl-14">
        {/* Left: content area with dot grid background */}
        <div className="relative flex-1 min-h-[756px]">
          <DotGridLens
            accentColor
            gridGap={13}
            baseRadius={0.75}
            maxScale={4.2}
            className="absolute -left-14 top-0 bottom-0 right-0 z-0 opacity-75"
          />
          <div className="absolute -left-14 top-0 bottom-0 w-[180px] z-[1] pointer-events-none" style={{ background: "linear-gradient(90deg, #0A0A0A 0%, transparent 100%)" }} />

          <div
            className="relative z-10 grid h-full min-h-[756px] pr-10 pt-12 pb-8"
            style={{
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gridTemplateRows: "auto 1fr auto",
              columnGap: "24px",
            }}
          >
            {/* Top: caption + tags + title (+ description when expertProduct) */}
            <div className="col-span-3 row-start-1 flex flex-col gap-6">
              <div style={fadeIn(0)}>
                <CaptionTagsRow
                  caption={caption}
                  tags={tags}
                  expertProduct={expertProduct}
                  gapClass="gap-5"
                  innerGapClass="gap-5"
                />
              </div>
              {titleBlock}
              {showExpertsBlock && descriptionEl && (
                <div className="max-w-[696px]" style={fadeIn(2)}>
                  {descriptionEl}
                </div>
              )}
            </div>

            {/* Bottom-left (col 1-2): either description (default) or experts block */}
            <div
              className="col-span-2 col-start-1 row-start-3 self-end"
              style={fadeIn(showExpertsBlock ? 3 : 2)}
            >
              {showExpertsBlock ? (
                <HeroExperts experts={experts!} quote={quote} />
              ) : (
                descriptionEl
              )}
            </div>

            {/* Bottom-right (col 3): icon */}
            <div className="col-start-3 row-start-3 self-end translate-x-4" style={fadeIn(3)}>
              <Image
                src={coverImage}
                alt=""
                width={400}
                height={400}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right: factoids + CTA column */}
        <div className="w-[344px] shrink-0 flex flex-col">
          {factoids.map((f, i) => (
            <div key={f.number} className="flex-1 flex flex-col" style={fadeIn(1 + i)}>
              <FactoidCard {...f} stretch className="border-b border-l border-r border-[#404040]" />
            </div>
          ))}
          <div className="flex-1 flex flex-col" style={fadeIn(1)}>
            <HeroCTA text={ctaText} stretch />
          </div>
        </div>
      </div>

      {/* ── Tablet layout (md → lg) ── */}
      <div className="hidden md:flex lg:hidden flex-col mx-auto">
        <div className="relative min-h-[760px]">
          <DotGridLens
            accentColor
            gridGap={13}
            baseRadius={0.75}
            maxScale={4.2}
            className="absolute inset-0 z-0 opacity-75"
          />
          <div className="absolute left-0 right-0 bottom-0 h-[180px] z-[1] pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 0%, #0A0A0A 100%)" }} />

          <div
            className="relative z-10 grid min-h-[760px] px-10 pt-12 pb-[52px]"
            style={{
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gridTemplateRows: "auto 1fr auto",
              columnGap: "20px",
            }}
          >
            <div className="col-span-3 row-start-1 flex flex-col gap-6">
              <div style={fadeIn(0)}>
                <CaptionTagsRow
                  caption={caption}
                  tags={tags}
                  expertProduct={expertProduct}
                  gapClass="gap-4"
                  innerGapClass="gap-3"
                />
              </div>
              {titleBlock}
              {showExpertsBlock && descriptionEl && (
                <div className="max-w-[696px]" style={fadeIn(2)}>
                  {descriptionEl}
                </div>
              )}
            </div>

            <div
              className="col-span-2 col-start-1 row-start-3 self-end"
              style={fadeIn(showExpertsBlock ? 3 : 2)}
            >
              {showExpertsBlock ? (
                <HeroExperts experts={experts!} quote={quote} />
              ) : (
                descriptionEl
              )}
            </div>

            <div className="col-start-3 row-start-3 self-end translate-x-3" style={fadeIn(3)}>
              <Image
                src={coverImage}
                alt=""
                width={400}
                height={400}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Cards: 2-col grid — [CTA, F1] / [F2, F3] */}
        <div className="grid grid-cols-2 px-10">
          <div style={fadeIn(1)}><HeroCTA text={ctaText} /></div>
          <div style={fadeIn(1)}><FactoidCard {...factoids[0]} className="border border-[#404040]" /></div>
          <div style={fadeIn(2)}><FactoidCard {...factoids[1]} className="border border-[#404040]" /></div>
          <div style={fadeIn(3)}><FactoidCard {...factoids[2]} className="border-r border-b border-[#404040]" /></div>
        </div>
      </div>

      {/* ── Mobile layout — image hero ── */}
      <div className="flex md:hidden flex-col">
        <div className="relative min-h-[360px] overflow-hidden">
          {coverImage && (
            <div className="absolute inset-0" style={bgFade()}>
              <Image
                src={coverImage}
                alt=""
                fill
                priority
                className="object-cover object-right"
              />
            </div>
          )}

          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(0deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0.6) 40%, rgba(10,10,10,0.2) 100%)",
            }}
          />

          <div className="relative z-10 flex flex-col justify-end h-full min-h-[360px] px-5 pb-6 pt-[100px]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 flex-wrap" style={fadeIn(0)}>
                <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                  {caption}
                </span>
                {(expertProduct || (tags && tags.length > 0)) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {expertProduct && <ExpertTagBadge />}
                    {tags?.map((tag) => <HeroTagBadge key={tag.text} {...tag} />)}
                  </div>
                )}
              </div>
              <h1 className="h1" style={fadeIn(1)}>
                <span className="text-[#F0F0F0]">{title}</span>
                {titleSecondary ? (
                  <>
                    <span className="text-[#F0F0F0]"> </span>
                    <span className="text-[#939393]">{titleSecondary}</span>
                  </>
                ) : null}
              </h1>
            </div>
          </div>
        </div>

        {/* Text content below image */}
        <div className="flex flex-col gap-6 px-5 pt-4">
          {descriptionEl && (
            <div style={fadeIn(2)}>{descriptionEl}</div>
          )}

          {showExpertsBlock && (
            <div style={fadeIn(3)}>
              <HeroExperts experts={experts!} quote={quote} />
            </div>
          )}

          <button
            type="button"
            style={fadeIn(1)}
            className="group flex items-center justify-between w-full bg-[#FFCC00] p-5 cursor-pointer transition-colors duration-200 hover:bg-[#FFE040]"
          >
            <span className="h4 text-[#0A0A0A]">{ctaText}</span>
            <div className="transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  d="M8 8H24M24 8V24M24 8L8 24"
                  stroke="#0A0A0A"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
        </div>

        {/* Factoids stacked */}
        <div className="flex flex-col px-5">
          {factoids.map((f, i) => (
            <div key={f.number} style={fadeIn(1 + i)}>
              <FactoidCard {...f} className={i === 0 ? "border border-[#404040]" : "border-l border-r border-b border-[#404040]"} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
