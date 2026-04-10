"use client";

import Image from "next/image";
import { MascotCarousel } from "@/components/blocks/MascotCarousel";
import {
  ABOUT_RM_DEFAULTS,
  type AboutRocketmindSectionProps,
  type AboutRocketmindVariant,
  type AboutRmFeature,
} from "./about-rocketmind-defaults";

export { ABOUT_RM_DEFAULTS };
export type { AboutRocketmindSectionProps, AboutRocketmindVariant, AboutRmFeature };

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

// ── Dot pattern background ─────────────────────────────────────────────────────

function DotPattern() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-60"
      style={{
        backgroundImage: `url(${BASE_PATH}/images/about/dot-pattern.png)`,
        backgroundSize: "7px 7px",
        backgroundPosition: "left center",
        backgroundRepeat: "repeat",
      }}
    />
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export function AboutRocketmindSection({
  heading = ABOUT_RM_DEFAULTS.heading,
  founderName = ABOUT_RM_DEFAULTS.founderName,
  founderBio = ABOUT_RM_DEFAULTS.founderBio,
  founderRole = ABOUT_RM_DEFAULTS.founderRole,
  features = ABOUT_RM_DEFAULTS.features,
  variant = "dark",
}: AboutRocketmindSectionProps) {
  return (
    <section className="w-full bg-[#0A0A0A] border-t border-border py-10 lg:py-20">

      {/* ══ Desktop (lg+) ══ */}
      <div className="hidden lg:block mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
        <div className="flex border border-[#404040]">
          {/* Left half: photo + text side by side */}
          <div className="w-1/2 shrink-0 border-r border-[#404040] p-8">
            <div className="flex gap-8 h-full">
              {/* Photo — fixed width calc(50% - 16px) */}
              <div className="relative shrink-0" style={{ width: "calc(50% - 16px)" }}>
                <Image
                  src={`${BASE_PATH}/images/about/alexey-eremin.png`}
                  alt={founderName}
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 1512px) 302px, 25vw"
                />
              </div>
              {/* Text — Figma: 302×463, vertical, justify-between */}
              <div className="flex flex-col justify-between" style={{ width: "calc(50% - 16px)" }}>
                {/* Logo + heading block — Figma: 302×140, gap=16 */}
                <div className="flex flex-col gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${BASE_PATH}/images/about/rocketmind-logo-dark.svg`}
                    alt="Rocketmind"
                    className="h-[52px] w-auto self-start"
                  />
                  {/* Heading: Figma 32px, color #5C5C5C */}
                  <h2 className="font-[family-name:var(--font-heading-family)] text-[32px] font-bold uppercase leading-[1.12] tracking-[-0.01em] text-[#5C5C5C] whitespace-pre-line">
                    {heading}
                  </h2>
                </div>
                {/* Founder info — Figma: 302×135, gap=8 */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <span className="font-[family-name:var(--font-heading-family)] text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0]">
                      {founderName}
                    </span>
                    <p className="text-[14px] leading-[1.28] text-[#F0F0F0]">
                      {founderBio}
                    </p>
                  </div>
                  <p className="text-[14px] leading-[1.28] text-[#939393]">
                    {founderRole}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right half: feature cards */}
          <div className="w-1/2 flex flex-col">
            {/* AI Agents — dot pattern */}
            <div className="relative flex-1 flex flex-col gap-4 border-b border-[#404040] p-8 overflow-hidden">
              <DotPattern />
              <div className="relative z-10 flex gap-12">
                <h3 className="h4 text-[#F0F0F0] shrink-0">{features[0].title}</h3>
                <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">
                  {features[0].text}
                </p>
              </div>
              <div className="relative z-10">
                <MascotCarousel />
              </div>
            </div>
            {/* Bottom row */}
            <div className="flex">
              <div className="w-1/2 flex flex-col gap-2 border-r border-[#404040] p-8">
                <h3 className="h4 text-[#F0F0F0]">{features[1].title}</h3>
                <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">
                  {features[1].text}
                </p>
              </div>
              <div className="w-1/2 flex flex-col gap-2 p-8">
                <h3 className="h4 text-[#F0F0F0]">{features[2].title}</h3>
                <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">
                  {features[2].text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Tablet (md → lg) ══ */}
      <div className="hidden md:block lg:hidden mx-auto px-5 md:px-8">
        <div className="flex border border-[#404040]">
          {/* Left: logo + heading + photo + founder */}
          <div className="w-1/2 shrink-0 flex flex-col border-r border-[#404040]">
            <div className="flex flex-col gap-4 p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE_PATH}/images/about/rocketmind-logo-dark.svg`}
                alt="Rocketmind"
                className="h-12 w-auto self-start"
              />
              <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-28)] font-bold uppercase leading-[1.16] tracking-[-0.01em] text-[#F0F0F0] whitespace-pre-line">
                {heading}
              </h2>
            </div>
            <div className="relative flex-1 min-h-[300px] mx-8">
              <Image
                src={`${BASE_PATH}/images/about/alexey-eremin.png`}
                alt={founderName}
                fill
                className="object-cover object-top"
                sizes="50vw"
              />
            </div>
            <div className="flex flex-col gap-2 p-8">
              <span className="h4 text-[#F0F0F0]">{founderName}</span>
              <p className="text-[length:var(--text-14)] leading-[1.28] text-[#F0F0F0]">{founderBio}</p>
              <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">{founderRole}</p>
            </div>
          </div>
          {/* Right: features stacked — AI по контенту, остальные flex-1 */}
          <div className="w-1/2 flex flex-col">
            <div className="relative flex flex-col gap-4 border-b border-[#404040] p-8 overflow-hidden">
              <DotPattern />
              <h3 className="relative z-10 h4 text-[#F0F0F0]">{features[0].title}</h3>
              <p className="relative z-10 text-[length:var(--text-14)] leading-[1.28] text-[#939393]">{features[0].text}</p>
              <div className="relative z-10"><MascotCarousel size="compact" /></div>
            </div>
            <div className="flex-1 flex flex-col gap-2 border-b border-[#404040] p-8">
              <h3 className="h4 text-[#F0F0F0]">{features[1].title}</h3>
              <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">{features[1].text}</p>
            </div>
            <div className="flex-1 flex flex-col gap-2 p-8">
              <h3 className="h4 text-[#F0F0F0]">{features[2].title}</h3>
              <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">{features[2].text}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Mobile ══ */}
      <div className="md:hidden px-5">
        <div className="border border-[#404040]">
          {/* Logo + heading */}
          <div className="flex flex-col gap-3 px-5 pt-8 pb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE_PATH}/images/about/rocketmind-logo-dark.svg`}
              alt="Rocketmind"
              className="h-8 w-auto self-start"
            />
            <h2 className="h1 text-[#F0F0F0] whitespace-pre-line">{heading}</h2>
          </div>
          {/* Photo */}
          <div className="mx-5 overflow-hidden bg-[#0A0A0A]">
            <Image
              src={`${BASE_PATH}/images/about/alexey-eremin.png`}
              alt={founderName}
              width={604}
              height={914}
              className="w-full h-auto block"
              sizes="(max-width: 768px) calc(100vw - 80px)"
            />
          </div>
          {/* Founder info */}
          <div className="flex flex-col gap-2 px-5 py-6">
            <span className="h4 text-[#F0F0F0]">{founderName}</span>
            <p className="text-[length:var(--text-14)] leading-[1.28] text-[#F0F0F0]">{founderBio}</p>
            <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">{founderRole}</p>
          </div>
          {/* Features */}
          <div className="flex flex-col gap-2 border-t border-[#404040] px-5 py-6">
            <h3 className="h4 text-[#F0F0F0]">{features[1].title}</h3>
            <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">{features[1].text}</p>
          </div>
          <div className="flex flex-col gap-2 border-t border-[#404040] px-5 py-6">
            <h3 className="h4 text-[#F0F0F0]">{features[2].title}</h3>
            <p className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]">{features[2].text}</p>
          </div>
          {/* AI Agents — dot pattern */}
          <div className="relative flex flex-col gap-4 border-t border-[#404040] px-5 py-6 overflow-hidden">
            <DotPattern />
            <h3 className="relative z-10 h4 text-[#F0F0F0]">{features[0].title}</h3>
            <p className="relative z-10 text-[length:var(--text-14)] leading-[1.28] text-[#939393]">{features[0].text}</p>
            <div className="relative z-10"><MascotCarousel size="compact" /></div>
          </div>
        </div>
      </div>

    </section>
  );
}
