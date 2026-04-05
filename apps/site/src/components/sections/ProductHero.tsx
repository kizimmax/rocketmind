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

function FactoidCard({ number, label, text }: Factoid) {
  return (
    <div className="flex flex-col justify-between gap-7 border-b border-r border-[#404040] p-5 md:p-7 h-[126px] md:h-[189px]">
      <div className="flex items-center gap-5">
        <span className="h2 md:h2 !text-[length:var(--text-32)] md:!text-[length:var(--text-52)] !leading-[1.08] !font-bold font-[family-name:var(--font-heading-family)] uppercase tracking-[-0.02em] text-[#F0F0F0]">
          {number}
        </span>
        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]">
          {label}
        </span>
      </div>
      <p className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]">
        {text}
      </p>
    </div>
  );
}

// ── CTA Button ─────────────────────────────────────────────────────────────────

function HeroCTA({ text }: { text: string }) {
  return (
    <button
      type="button"
      className="flex items-center justify-between w-full bg-[#FFCC00] p-5 md:p-7 md:h-[189px] group cursor-pointer"
    >
      <span className="h4 md:h3 text-[#0A0A0A]">{text}</span>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className="shrink-0 self-end"
      >
        <path
          d="M8 8H24M24 8V24M24 8L8 24"
          stroke="#0A0A0A"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
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
    <section className="relative w-full bg-[#0A0A0A]">
      {/* ── Desktop layout ── */}
      <div className="hidden lg:flex mx-auto max-w-[1400px]">
        {/* Left: content area with dot grid background */}
        <div className="relative flex-1 min-h-[756px]">
          {/* Dot Grid Lens background */}
          <DotGridLens
            accentColor
            className="absolute inset-0 z-0 pointer-events-auto"
            style={{ width: "100%", height: "100%" }}
          />

          {/* Content overlay */}
          <div className="relative z-10 flex flex-col justify-end h-full pb-0">
            {/* Product illustration */}
            <div className="absolute top-9 left-0">
              <Image
                src={coverImage}
                alt=""
                width={156}
                height={156}
                className="w-[156px] h-[156px]"
              />
            </div>

            {/* Text content */}
            <div className="flex flex-col gap-11 pr-10 pb-0 mt-auto" style={{ paddingTop: "298px" }}>
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

        {/* Right: sidebar with factoids + CTA */}
        <div className="w-[344px] shrink-0 flex flex-col">
          {factoids.map((f) => (
            <FactoidCard key={f.number} {...f} />
          ))}
          <HeroCTA text={ctaText} />
        </div>
      </div>

      {/* ── Tablet layout (md) ── */}
      <div className="hidden md:flex lg:hidden flex-col mx-auto max-w-[768px]">
        {/* Top area with dot grid + illustration */}
        <div className="relative min-h-[400px]">
          <DotGridLens
            accentColor
            className="absolute inset-0 z-0 pointer-events-auto"
            style={{ width: "100%", height: "100%" }}
          />
          <div className="relative z-10 p-8 pt-16">
            <Image
              src={coverImage}
              alt=""
              width={120}
              height={120}
              className="w-[120px] h-[120px] mb-10"
            />
            <div className="flex flex-col gap-6 mb-6">
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                {caption}
              </span>
              <h1 className="h1 text-[#F0F0F0] whitespace-pre-line">{title}</h1>
            </div>
            <p className="text-[length:var(--text-16)] leading-[1.28] text-[#F0F0F0] max-w-[520px]">
              {description}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="px-8">
          <HeroCTA text={ctaText} />
        </div>

        {/* Factoids: 2-column grid */}
        <div className="grid grid-cols-2 px-8">
          {factoids.map((f) => (
            <FactoidCard key={f.number} {...f} />
          ))}
        </div>
      </div>

      {/* ── Mobile layout ── */}
      <div className="flex md:hidden flex-col">
        {/* Top area with dot grid + illustration */}
        <div className="relative min-h-[200px]">
          <DotGridLens
            accentColor
            className="absolute inset-0 z-0 pointer-events-auto"
            style={{ width: "100%", height: "100%" }}
          />
          <div className="relative z-10 px-5 pt-[70px]">
            <Image
              src={coverImage}
              alt=""
              width={90}
              height={90}
              className="w-[90px] h-[90px]"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 px-5 pt-5">
          <div className="flex flex-col gap-2">
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
              {caption}
            </span>
            <h1 className="h3 text-[#F0F0F0] whitespace-pre-line">{title}</h1>
          </div>
          <p className="text-[length:var(--text-16)] leading-[1.28] text-[#F0F0F0]">
            {description}
          </p>
        </div>

        {/* CTA */}
        <div className="px-5 pt-8">
          <HeroCTA text={ctaText} />
        </div>

        {/* Factoids stacked */}
        <div className="flex flex-col px-5">
          {factoids.map((f) => (
            <FactoidCard key={f.number} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
