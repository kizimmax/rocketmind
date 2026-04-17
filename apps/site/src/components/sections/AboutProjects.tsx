"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { RichText } from "@rocketmind/ui";
import { LogoGrid } from "@/components/ui/LogoGrid";
import type { ProjectsBlockData } from "@/lib/unique";

const RoundGlassLens = dynamic(
  () => import("@/components/ui/round-glass-lens").then((m) => m.RoundGlassLens),
  { ssr: false, loading: () => null },
);

// ── Accordion (mirrors AboutProduct accordion visual) ─────────────────────────

function AccordionIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5 text-[#F0F0F0]">
      <path d="M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M8 1V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="origin-center transition-transform duration-200 ease-out"
        style={{ transform: isOpen ? "scaleY(0)" : "scaleY(1)" }}
      />
    </svg>
  );
}

function ProjectsAccordion({
  items,
}: {
  items: ProjectsBlockData["accordion"];
}) {
  const [openIndex, setOpenIndex] = useState(-1);
  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const isFirst = i === 0;
        const base = `flex items-start gap-7 py-4 pr-4 text-left border-[#404040] ${
          isFirst ? "border-t border-b" : "border-b"
        }`;
        const hasParagraphs = item.paragraphs.length > 0;

        const content = (
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]">
              {item.title}
            </span>
            <div
              className="grid transition-[grid-template-rows] duration-200 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                {hasParagraphs && (
                  <div className="flex flex-col gap-3 pt-4">
                    {item.paragraphs.map((p, pi) => (
                      <RichText
                        key={pi}
                        text={p}
                        className="text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

        if (!hasParagraphs) {
          return <div key={i} className={base}>{content}</div>;
        }
        return (
          <button key={i} type="button" className={`${base} cursor-pointer`} onClick={() => setOpenIndex(isOpen ? -1 : i)}>
            {content}
            <AccordionIcon isOpen={isOpen} />
          </button>
        );
      })}
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export function AboutProjects({
  caption,
  title,
  titleSecondary,
  paragraphs,
  accordion,
  logoGrid,
}: ProjectsBlockData) {
  const logoGridRef = useRef<HTMLDivElement>(null);

  return (
    <section className="w-full border-t border-border py-10 md:py-16 lg:py-20">
      {/* Desktop */}
      <div className="hidden lg:flex mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
        <div className="w-1/2 shrink-0 flex flex-col justify-between gap-16 pr-[120px]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                {caption}
              </span>
              <h2 className="h2 whitespace-pre-line">
                <span className="text-[#F0F0F0]">{title}</span>
                {titleSecondary ? (
                  <>
                    <span className="text-[#F0F0F0]"> </span>
                    <span className="text-[#939393]">{titleSecondary}</span>
                  </>
                ) : null}
              </h2>
            </div>
            {paragraphs.length > 0 && (
              <div className="flex flex-col gap-3">
                {paragraphs.map((p, i) => (
                  <RichText
                    key={i}
                    text={p.text}
                    className="text-[length:var(--text-18)] leading-[1.2] text-[#939393]"
                  />
                ))}
              </div>
            )}
          </div>
          <ProjectsAccordion items={accordion} />
        </div>

        <div ref={logoGridRef} className="relative w-1/2 self-start">
          <LogoGrid cells={logoGrid} />
          <RoundGlassLens
            sceneRef={logoGridRef}
            size={280}
            motionStrengthX={0.2}
            motionStrengthY={0.2}
            motionParallax
            parallaxOnWindow
            refraction={0.056}
            depth={0.308}
            dispersion={1.04}
            distortionRadius={1.237}
            blur={0.6}
            gradientAngle={215}
          />
        </div>
      </div>

      {/* Mobile / Tablet */}
      <div className="flex lg:hidden flex-col px-5 md:px-8 gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
              {caption}
            </span>
            <h2 className="h3 whitespace-pre-line">
              <span className="text-[#F0F0F0]">{title}</span>
              {titleSecondary ? (
                <>
                  <span className="text-[#F0F0F0]"> </span>
                  <span className="text-[#939393]">{titleSecondary}</span>
                </>
              ) : null}
            </h2>
          </div>
          {paragraphs.length > 0 && (
            <div className="flex flex-col gap-3">
              {paragraphs.map((p, i) => (
                <RichText
                  key={i}
                  text={p.text}
                  className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]"
                />
              ))}
            </div>
          )}
        </div>
        <ProjectsAccordion items={accordion} />
        <LogoGrid cells={logoGrid} />
      </div>
    </section>
  );
}
