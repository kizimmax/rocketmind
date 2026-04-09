"use client";

import { cn } from "../../lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ToolCard = {
  number: string;
  title: string;
  text: string;
  icon?: string | null;
};

export type ToolsSectionProps = {
  tag: string;
  title: string;
  description?: string;
  tools: ToolCard[];
  /** Show icons instead of numbers */
  useIcons?: boolean;
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
      <p className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]">
        {tool.text}
      </p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function ToolsSection({
  tag,
  title,
  description,
  tools,
  useIcons,
  className,
}: ToolsSectionProps) {
  return (
    <section
      className={cn(
        "w-full bg-[#0A0A0A] border-t border-border py-10 md:py-16 lg:py-20",
        className,
      )}
    >
      {/* ── Desktop ── */}
      <div className="hidden lg:flex flex-col gap-[88px] mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
        {/* Header — tag + title left, description right */}
        <div className="flex">
          <div className="w-1/2 shrink-0 pr-8 flex flex-col gap-2">
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
              {tag}
            </span>
            <h2 className="h2 text-[#F0F0F0]">{title}</h2>
          </div>
          {description && (
            <div className="w-1/2 flex items-end">
              <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393] max-w-[668px]">
                {description}
              </p>
            </div>
          )}
        </div>

        {/* Cards — flat grid */}
        <div
          className="grid gap-x-0"
          style={{
            gridTemplateColumns: `repeat(${tools.length}, 1fr)`,
          }}
        >
          {tools.map((tool, i) => (
            <div key={i} className="border border-[#404040] p-8 h-[300px]">
              <ToolCardItem tool={tool} useIcons={useIcons} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Tablet ── */}
      <div className="hidden md:flex lg:hidden flex-col gap-10 px-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
            {tag}
          </span>
          <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-28)] font-bold uppercase leading-[1.16] tracking-[-0.01em] text-[#F0F0F0]">
            {title}
          </h2>
          {description && (
            <p className="text-[length:var(--text-16)] leading-[1.28] text-[#939393] mt-2">
              {description}
            </p>
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
          <h2 className="h3 text-[#F0F0F0]">{title}</h2>
          {description && (
            <p className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]">
              {description}
            </p>
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
