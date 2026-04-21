"use client";

import { cn } from "../../lib/utils";
import { RichText } from "./rich-text";
import {
  StyledParagraphs,
  resolveStyledParagraphs,
  type StyledParagraph,
} from "./styled-paragraphs";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ToolCard = {
  number: string;
  title: string;
  text: string;
  icon?: string | null;
  wide?: boolean;
};

export type ToolsSectionProps = {
  tag: string;
  title: string;
  titleSecondary?: string;
  /** Legacy single-string description (uppercase mono secondary). */
  description?: string;
  /** Structured paragraphs with per-paragraph caps + color. Supersedes `description` when provided. */
  paragraphs?: StyledParagraph[];
  tools: ToolCard[];
  /** Show icons instead of numbers */
  useIcons?: boolean;
  /** Render description under the heading (full width) instead of to the right. Desktop only. */
  descriptionBelow?: boolean;
  className?: string;
};

// ── Card ─────────────────────────────────────────────────────────────────────

function ToolCardItem({
  tool,
  useIcons,
}: {
  tool: ToolCard;
  useIcons?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Number or icon */}
      <div className="flex items-end">
        {useIcons && tool.icon ? (
          <div
            className="h-[86px] w-[86px] bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${tool.icon})` }}
          />
        ) : (
          <span className="font-[family-name:var(--font-mono-family)] text-[80px] font-medium leading-[1.08] tracking-[0.02em] text-transparent [-webkit-text-stroke:1px_#404040]">
            {tool.number}
          </span>
        )}
      </div>

      {/* Title */}
      <h4 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0]">
        {tool.title}
      </h4>

      {/* Description */}
      <RichText
        text={tool.text}
        className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]"
      />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function ToolsSection({
  tag,
  title,
  titleSecondary,
  description,
  paragraphs,
  tools,
  useIcons,
  descriptionBelow,
  className,
}: ToolsSectionProps) {
  const resolvedParagraphs = resolveStyledParagraphs(paragraphs, description, {
    uppercase: true,
    color: "secondary",
  });
  const hasParagraphs = resolvedParagraphs.length > 0;
  return (
    <section
      className={cn(
        "w-full bg-[#0A0A0A] border-t border-border py-10 md:py-16 lg:py-20",
        className,
      )}
    >
      {/* ── Desktop ── */}
      <div className="hidden lg:flex flex-col gap-[88px] mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
        {/* Header — tag + title left, description right (default) or below (when descriptionBelow) */}
        {descriptionBelow ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                {tag}
              </span>
              <h2 className="h2"><span className="text-[#F0F0F0]">{title}</span>{titleSecondary ? <><span className="text-[#F0F0F0]"> </span><span className="text-[#939393]">{titleSecondary}</span></> : null}</h2>
            </div>
            {hasParagraphs && (
              <div className="max-w-[668px]">
                <StyledParagraphs paragraphs={resolvedParagraphs} theme="dark" size="18" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex">
            <div className="w-1/2 shrink-0 pr-8 flex flex-col gap-2">
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                {tag}
              </span>
              <h2 className="h2"><span className="text-[#F0F0F0]">{title}</span>{titleSecondary ? <><span className="text-[#F0F0F0]"> </span><span className="text-[#939393]">{titleSecondary}</span></> : null}</h2>
            </div>
            {hasParagraphs && (
              <div className="w-1/2 flex items-end">
                <div className="max-w-[668px]">
                  <StyledParagraphs paragraphs={resolvedParagraphs} theme="dark" size="18" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cards — grid with wide support */}
        {(() => {
          const totalUnits = tools.reduce((sum, t) => sum + (t.wide ? 2 : 1), 0);
          let col = 1;
          return (
            <div
              className="grid"
              style={{ gridTemplateColumns: `repeat(${totalUnits}, 1fr)` }}
            >
              {tools.map((tool, i) => {
                const span = tool.wide ? 2 : 1;
                const start = col;
                col += span;
                return (
                  <div
                    key={i}
                    className="border border-[#404040] p-8"
                    style={{ gridColumn: `${start} / span ${span}` }}
                  >
                    <ToolCardItem tool={tool} useIcons={useIcons} />
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* ── Tablet ── */}
      <div className="hidden md:flex lg:hidden flex-col gap-10 px-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
            {tag}
          </span>
          <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-28)] font-bold uppercase leading-[1.16] tracking-[-0.01em]">
            <span className="text-[#F0F0F0]">{title}</span>
            {titleSecondary ? <><span className="text-[#F0F0F0]"> </span><span className="text-[#939393]">{titleSecondary}</span></> : null}
          </h2>
          {hasParagraphs && (
            <div className="mt-2">
              <StyledParagraphs paragraphs={resolvedParagraphs} theme="dark" size="16" />
            </div>
          )}
        </div>

        {/* Cards — 2-col grid */}
        <div className="grid grid-cols-2 gap-px bg-[#404040]">
          {tools.map((tool, i) => (
            <div key={i} className="bg-[#0A0A0A] p-8">
              <ToolCardItem tool={tool} useIcons={useIcons} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="flex md:hidden flex-col gap-8 px-5">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
            {tag}
          </span>
          <h2 className="h3"><span className="text-[#F0F0F0]">{title}</span>{titleSecondary ? <><span className="text-[#F0F0F0]"> </span><span className="text-[#939393]">{titleSecondary}</span></> : null}</h2>
          {hasParagraphs && (
            <StyledParagraphs paragraphs={resolvedParagraphs} theme="dark" size="16" />
          )}
        </div>

        {/* Cards — stacked */}
        <div className="flex flex-col">
          {tools.map((tool, i) => (
            <div key={i} className="border border-[#404040] p-6">
              <ToolCardItem tool={tool} useIcons={useIcons} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
