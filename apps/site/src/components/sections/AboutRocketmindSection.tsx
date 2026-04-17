"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { RichText } from "@rocketmind/ui";

const MascotCarousel = dynamic(
  () => import("@/components/blocks/MascotCarousel").then((m) => m.MascotCarousel),
  { ssr: false, loading: () => null },
);
import {
  ABOUT_RM_DEFAULTS,
  type AboutRocketmindSectionProps,
  type AboutRocketmindVariant,
  type AboutRocketmindLeftVariant,
  type AboutRmFeature,
} from "./about-rocketmind-defaults";

export { ABOUT_RM_DEFAULTS };
export type { AboutRocketmindSectionProps, AboutRocketmindVariant, AboutRocketmindLeftVariant, AboutRmFeature };

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

// ── Left image helper ─────────────────────────────────────────────────────────

function LeftImage({ leftVariant, alt }: { leftVariant: AboutRocketmindLeftVariant; alt: string }) {
  const src = leftVariant === "canvas"
    ? `${BASE_PATH}/images/about/canvas-image.png`
    : `${BASE_PATH}/images/about/alexey-eremin.png`;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover object-top"
      sizes="(min-width: 1512px) 302px, 25vw"
    />
  );
}

// ── Bottom text for left column ───────────────────────────────────────────────

function LeftBottomText({
  leftVariant,
  founderName,
  founderBio,
  founderRole,
  canvasTitle,
  canvasText,
  compact,
}: {
  leftVariant: AboutRocketmindLeftVariant;
  founderName: string;
  founderBio: string;
  founderRole: string;
  canvasTitle: string;
  canvasText: string;
  compact?: boolean;
}) {
  if (leftVariant === "canvas") {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className={`font-[family-name:var(--font-heading-family)] ${compact ? "h4" : "text-[24px]"} font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0] whitespace-pre-line`}>
            {canvasTitle}
          </span>
          <RichText
            text={canvasText}
            className={`${compact ? "text-[length:var(--text-14)]" : "text-[14px]"} leading-[1.28] text-[#F0F0F0]`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <span className={`font-[family-name:var(--font-heading-family)] ${compact ? "h4" : "text-[24px]"} font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0]`}>
          {founderName}
        </span>
        <RichText
          text={founderBio}
          className={`${compact ? "text-[length:var(--text-14)]" : "text-[14px]"} leading-[1.28] text-[#F0F0F0]`}
        />
      </div>
      <RichText
        text={founderRole}
        className={`${compact ? "text-[length:var(--text-14)]" : "text-[14px]"} leading-[1.28] text-[#939393]`}
      />
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export function AboutRocketmindSection({
  heading = ABOUT_RM_DEFAULTS.heading,
  founderName = ABOUT_RM_DEFAULTS.founderName,
  founderBio = ABOUT_RM_DEFAULTS.founderBio,
  founderRole = ABOUT_RM_DEFAULTS.founderRole,
  canvasTitle = ABOUT_RM_DEFAULTS.canvasTitle,
  canvasText = ABOUT_RM_DEFAULTS.canvasText,
  features = ABOUT_RM_DEFAULTS.features,
  variant = "dark",
  leftVariant = "alex",
}: AboutRocketmindSectionProps) {
  const imageAlt = leftVariant === "canvas" ? canvasTitle : founderName;

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
                <LeftImage leftVariant={leftVariant} alt={imageAlt} />
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
                <LeftBottomText
                  leftVariant={leftVariant}
                  founderName={founderName}
                  founderBio={founderBio}
                  founderRole={founderRole}
                  canvasTitle={canvasTitle}
                  canvasText={canvasText}
                />
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
                <RichText
                  text={features[0].text}
                  className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]"
                />
              </div>
              <div className="relative z-10">
                <MascotCarousel />
              </div>
            </div>
            {/* Bottom row */}
            <div className="flex">
              <div className="w-1/2 flex flex-col gap-2 border-r border-[#404040] p-8">
                <h3 className="h4 text-[#F0F0F0]">{features[1].title}</h3>
                <RichText
                  text={features[1].text}
                  className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]"
                />
              </div>
              <div className="w-1/2 flex flex-col gap-2 p-8">
                <h3 className="h4 text-[#F0F0F0]">{features[2].title}</h3>
                <RichText
                  text={features[2].text}
                  className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]"
                />
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
              <LeftImage leftVariant={leftVariant} alt={imageAlt} />
            </div>
            <div className="p-8">
              <LeftBottomText
                leftVariant={leftVariant}
                founderName={founderName}
                founderBio={founderBio}
                founderRole={founderRole}
                canvasTitle={canvasTitle}
                canvasText={canvasText}
                compact
              />
            </div>
          </div>
          {/* Right: features stacked — AI по контенту, остальные flex-1 */}
          <div className="w-1/2 flex flex-col">
            <div className="relative flex flex-col gap-4 border-b border-[#404040] p-8 overflow-hidden">
              <DotPattern />
              <div className="relative z-10 flex gap-2">
                <h3 className="w-1/2 shrink-0 h4 text-[#F0F0F0]">{features[0].title}</h3>
                <RichText text={features[0].text} className="w-1/2 text-[length:var(--text-14)] leading-[1.28] text-[#939393]" />
              </div>
              <div className="relative z-10"><MascotCarousel size="compact" /></div>
            </div>
            <div className="flex-1 flex flex-col gap-2 border-b border-[#404040] p-8">
              <h3 className="h4 text-[#F0F0F0]">{features[1].title}</h3>
              <RichText text={features[1].text} className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]" />
            </div>
            <div className="flex-1 flex flex-col gap-2 p-8">
              <h3 className="h4 text-[#F0F0F0]">{features[2].title}</h3>
              <RichText text={features[2].text} className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]" />
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
              src={leftVariant === "canvas" ? `${BASE_PATH}/images/about/canvas-image.png` : `${BASE_PATH}/images/about/alexey-eremin.png`}
              alt={imageAlt}
              width={leftVariant === "canvas" ? 850 : 604}
              height={leftVariant === "canvas" ? 1138 : 914}
              className="w-full h-auto block"
              sizes="(max-width: 768px) calc(100vw - 80px)"
            />
          </div>
          {/* Bottom text */}
          <div className="px-5 py-6">
            <LeftBottomText
              leftVariant={leftVariant}
              founderName={founderName}
              founderBio={founderBio}
              founderRole={founderRole}
              canvasTitle={canvasTitle}
              canvasText={canvasText}
              compact
            />
          </div>
          {/* Features */}
          <div className="flex flex-col gap-2 border-t border-[#404040] px-5 py-6">
            <h3 className="h4 text-[#F0F0F0]">{features[1].title}</h3>
            <RichText text={features[1].text} className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]" />
          </div>
          <div className="flex flex-col gap-2 border-t border-[#404040] px-5 py-6">
            <h3 className="h4 text-[#F0F0F0]">{features[2].title}</h3>
            <RichText text={features[2].text} className="text-[length:var(--text-14)] leading-[1.28] text-[#939393]" />
          </div>
          {/* AI Agents — dot pattern */}
          <div className="relative flex flex-col gap-4 border-t border-[#404040] px-5 py-6 overflow-hidden">
            <DotPattern />
            <div className="relative z-10 flex gap-2">
              <h3 className="w-1/2 shrink-0 h4 text-[#F0F0F0]">{features[0].title}</h3>
              <RichText text={features[0].text} className="w-1/2 text-[length:var(--text-14)] leading-[1.28] text-[#939393]" />
            </div>
            <div className="relative z-10"><MascotCarousel size="compact" /></div>
          </div>
        </div>
      </div>

    </section>
  );
}
