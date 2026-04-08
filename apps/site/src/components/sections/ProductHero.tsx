"use client";

import Image from "next/image";
import { DotGridLens } from "@rocketmind/ui";
import type { Factoid } from "@/lib/products";

// ── Types ──────────────────────────────────────────────────────────────────────

type ProductHeroProps = {
  caption: string;
  title: string;
  description: string;
  ctaText: string;
  factoids: Factoid[];
  coverImage: string;
};

// ── Factoid Card ───────────────────────────────────────────────────────────────

function FactoidCard({ number, label, text, stretch, className }: Factoid & { stretch?: boolean; className?: string }) {
  return (
    <div className={`flex flex-col p-5 md:p-7 ${stretch ? "flex-1" : "h-[126px] md:h-[189px]"} ${className ?? ""}`}>
      <div className="flex flex-col justify-between gap-7 h-full">
        <div className="flex items-center gap-5">
          <span className="h2 text-[#F0F0F0]">{number}</span>
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
      className={`flex flex-col justify-between w-full bg-[#FFCC00] p-5 md:p-7 cursor-pointer ${stretch ? "flex-1" : "h-[126px] md:h-[189px]"}`}
    >
      <div className="flex justify-end w-full">
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
      <span className="h4 md:h3 text-[#0A0A0A] text-left">{text}</span>
    </button>
  );
}

// ── Product Hero ───────────────────────────────────────────────────────────────

export function ProductHero({
  caption,
  title,
  description,
  ctaText,
  factoids,
  coverImage,
}: ProductHeroProps) {
  return (
    <section className="relative w-full bg-[#0A0A0A] pt-16">
      {/* ── Desktop layout ── */}
      <div className="hidden lg:flex mx-auto max-w-[1512px] pl-5 md:pl-8 xl:pl-14">
        {/* Left: content area with dot grid background */}
        <div className="relative flex-1 min-h-[756px]">
          <DotGridLens
            accentColor
            baseRadius={0.75}
            maxScale={4.2}
            className="absolute -left-14 top-0 bottom-0 right-0 z-0 opacity-50"
          />
          <div className="absolute -left-14 top-0 bottom-0 w-[180px] z-[1] pointer-events-none" style={{ background: "linear-gradient(90deg, #0A0A0A 0%, transparent 100%)" }} />
          <div className="relative z-10 flex flex-col justify-end h-full">
            <div className="absolute top-9 left-0">
              <Image src={coverImage} alt="" width={156} height={156} className="w-[156px] h-[156px]" />
            </div>
            <div className="flex flex-col gap-11 pr-10 pb-14 mt-auto" style={{ paddingTop: "298px" }}>
              <div className="flex flex-col gap-6">
                <span className="h4 text-[#FFCC00]">{caption}</span>
                <h1 className="h1 text-[#F0F0F0] whitespace-pre-line">{title}</h1>
              </div>
              <div className="max-w-[696px]">
                <p className="text-[length:var(--text-18)] leading-[1.2] text-[#F0F0F0]">{description}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[344px] shrink-0 flex flex-col">
          {factoids.map((f) => (
            <FactoidCard key={f.number} {...f} stretch className="border-b border-l border-r border-[#404040]" />
          ))}
          <HeroCTA text={ctaText} stretch />
        </div>
      </div>

      {/* ── Tablet layout (md → lg) ── */}
      <div className="hidden md:flex lg:hidden flex-col mx-auto">
        {/* Upper hero area — icon at top, text pushed to bottom */}
        <div className="relative min-h-[840px]">
          <DotGridLens
            accentColor
            baseRadius={0.75}
            maxScale={4.2}
            className="absolute inset-0 z-0 opacity-50"
          />

          <div className="relative z-10 flex flex-col justify-end min-h-[840px]">
            {/* Product icon — absolute top-left */}
            <div className="absolute top-10 left-10">
              <Image
                src={coverImage}
                alt=""
                width={120}
                height={120}
                className="w-[120px] h-[120px]"
              />
            </div>

            {/* Text content at bottom */}
            <div className="flex flex-col gap-11 px-10 pb-14">
              <div className="flex flex-col gap-6">
                <span className="h4 text-[#FFCC00]">{caption}</span>
                <h1 className="h1 text-[#F0F0F0] whitespace-pre-line">{title}</h1>
              </div>
              <div className="max-w-[696px]">
                <p className="text-[length:var(--text-18)] leading-[1.2] text-[#F0F0F0]">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cards: 2-col grid — [CTA, F1] / [F2, F3] */}
        <div className="grid grid-cols-2 px-10">
          {/* Row 1 */}
          <HeroCTA text={ctaText} />
          <FactoidCard {...factoids[0]} className="border border-[#404040]" />
          {/* Row 2 */}
          <FactoidCard {...factoids[1]} className="border border-[#404040]" />
          <FactoidCard {...factoids[2]} className="border-r border-b border-[#404040]" />
        </div>
      </div>

      {/* ── Mobile layout ── */}
      <div className="flex md:hidden flex-col">
        {/* Hero area — dot grid covers icon + content + CTA */}
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-[540px] z-0">
            <DotGridLens
              accentColor
              baseRadius={0.75}
              maxScale={4.2}
              className="absolute inset-0 opacity-50"
            />
          </div>

          <div className="relative z-10 px-5">
            {/* Product icon */}
            <div className="pt-5">
              <Image
                src={coverImage}
                alt=""
                width={92}
                height={92}
                className="w-[92px] h-[92px]"
              />
            </div>

            {/* Text content */}
            <div className="flex flex-col gap-6 pt-[68px]">
              <div className="flex flex-col gap-2">
                <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                  {caption}
                </span>
                <h1 className="h1 text-[#F0F0F0] whitespace-pre-line">{title}</h1>
              </div>
              <p className="text-[length:var(--text-16)] leading-[1.28] text-[#F0F0F0]">
                {description}
              </p>
            </div>

            {/* CTA — horizontal row layout */}
            <div className="pt-8">
              <button
                type="button"
                className="flex items-center justify-between w-full bg-[#FFCC00] p-5 cursor-pointer"
              >
                <span className="h4 text-[#0A0A0A]">{ctaText}</span>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M8 8H24M24 8V24M24 8L8 24"
                    stroke="#0A0A0A"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Factoids stacked */}
        <div className="flex flex-col px-5 border-t border-[#404040]">
          {factoids.map((f) => (
            <FactoidCard key={f.number} {...f} className="border-b border-l border-r border-[#404040]" />
          ))}
        </div>
      </div>
    </section>
  );
}
