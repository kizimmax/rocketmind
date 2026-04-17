"use client";

import { useState } from "react";
import { RichText } from "@rocketmind/ui";
import type { AccordionItem, AboutParagraph } from "@/lib/products";

/** Preserves natural image proportions — scales width to container, height follows. */
function AboutImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={`block w-full h-auto ${className ?? ""}`} />;
}

// ── Accordion ──────────────────────────────────────────────────────────────────

function AccordionIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5 text-[#F0F0F0]">
      {/* Horizontal line (always visible) */}
      <path d="M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Vertical line (animated: visible when closed, hidden when open) */}
      <path
        d="M8 1V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="origin-center transition-transform duration-200 ease-out"
        style={{
          transform: isOpen ? "scaleY(0)" : "scaleY(1)",
        }}
      />
    </svg>
  );
}

function AccordionItemContent({
  item,
  isOpen,
}: {
  item: AccordionItem;
  isOpen: boolean;
}) {
  return (
    <>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]">
          {item.title}
        </span>
        <div
          className="grid transition-[grid-template-rows] duration-200 ease-out"
          style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            {item.paragraphs.length > 0 && (
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
    </>
  );
}

function ProductAccordion({
  items,
  defaultOpen = 0,
  collapsible = true,
}: {
  items: AccordionItem[];
  defaultOpen?: number;
  collapsible?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);

  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const isOpen = collapsible ? openIndex === i : true;
        const isFirst = i === 0;

        const baseClass = `flex items-start gap-7 py-4 pr-4 text-left border-[#404040] ${
          isFirst ? "border-t border-b" : "border-b"
        }`;

        const hasParagraphs = item.paragraphs.length > 0;

        if (!collapsible || !hasParagraphs) {
          return (
            <div key={i} className={baseClass}>
              <AccordionItemContent item={item} isOpen={isOpen} />
            </div>
          );
        }

        return (
          <button
            key={i}
            type="button"
            className={`${baseClass} cursor-pointer`}
            onClick={() => setOpenIndex(isOpen ? -1 : i)}
          >
            <AccordionItemContent item={item} isOpen={isOpen} />
            <AccordionIcon isOpen={isOpen} />
          </button>
        );
      })}
    </div>
  );
}

// ── About Product Section ──────────────────────────────────────────────────────

type AboutProductProps = {
  caption: string;
  title: string;
  titleSecondary?: string;
  paragraphs: AboutParagraph[];
  accordion: AccordionItem[];
  /** If false, accordion items are always expanded (no click-to-collapse). */
  accordionCollapsible?: boolean;
  /** If true, image is on the left. Default: false (right). */
  imageLeft?: boolean;
  /** If true, paragraphs render in right column above accordion (without-image variant). */
  paragraphsRight?: boolean;
  /** Image path (if present, uses image variant) */
  aboutImage?: string | null;
};

const DESKTOP_UPPERCASE =
  "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393]";
const DESKTOP_NORMAL = "text-[length:var(--text-18)] leading-[1.2] text-[#939393]";
const MOBILE_UPPERCASE =
  "font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393]";
const MOBILE_NORMAL = "text-[length:var(--text-16)] leading-[1.28] text-[#939393]";

export function AboutProduct({
  caption,
  title,
  titleSecondary,
  paragraphs,
  accordion,
  accordionCollapsible = true,
  imageLeft = false,
  paragraphsRight = false,
  aboutImage,
}: AboutProductProps) {
  const hasImage = !!aboutImage;
  const paragraphsBlock =
    paragraphs.length > 0 ? (
      <div className="flex flex-col gap-3">
        {paragraphs.map((p, i) => (
          <RichText
            key={i}
            text={p.text}
            className={p.uppercase ? DESKTOP_UPPERCASE : DESKTOP_NORMAL}
          />
        ))}
      </div>
    ) : null;

  return (
    <section className="w-full border-t border-border pt-10 pb-20 md:pt-16 md:pb-24 lg:pt-20 lg:pb-28">
      {/* ── Desktop with image ── */}
      {hasImage && (
        <div
          className={`hidden lg:flex mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14 ${
            imageLeft ? "flex-row-reverse" : ""
          }`}
        >
          {/* Text + accordion */}
          <div className="w-1/2 shrink-0 flex flex-col justify-between gap-28 pr-[120px]">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                  {caption}
                </span>
                <h2 className="h2 whitespace-pre-line"><span className="text-[#F0F0F0]">{title}</span>{titleSecondary ? <><span className="text-[#F0F0F0]"> </span><span className="text-[#939393]">{titleSecondary}</span></> : null}</h2>
              </div>
              {paragraphsBlock}
            </div>
            <ProductAccordion items={accordion} collapsible={accordionCollapsible} />
          </div>

          {/* Right: image — preserves natural proportions */}
          <div className="w-1/2 self-start bg-[#121212]">
            <AboutImage src={aboutImage} alt={title} />
          </div>
        </div>
      )}

      {/* ── Desktop without image ── */}
      {!hasImage && (
        <div className="hidden lg:flex mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
          {/* Left: text — 50%, content max 560px */}
          <div className="w-1/2 shrink-0 pr-8">
            <div className="flex flex-col gap-6 max-w-[560px]">
              <div className="flex flex-col gap-2">
                <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                  {caption}
                </span>
                <h2 className="h2 whitespace-pre-line"><span className="text-[#F0F0F0]">{title}</span>{titleSecondary ? <><span className="text-[#F0F0F0]"> </span><span className="text-[#939393]">{titleSecondary}</span></> : null}</h2>
              </div>
              {!paragraphsRight && paragraphsBlock}
            </div>
          </div>

          {/* Right: paragraphs (optional) + accordion — 50% */}
          <div className="w-1/2 flex flex-col gap-6">
            {paragraphsRight && paragraphsBlock}
            <ProductAccordion items={accordion} collapsible={accordionCollapsible} />
          </div>
        </div>
      )}

      {/* ── Mobile / Tablet ── */}
      <div className="flex lg:hidden flex-col px-5 md:px-8">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
              {caption}
            </span>
            <h2 className="h3 whitespace-pre-line"><span className="text-[#F0F0F0]">{title}</span>{titleSecondary ? <><span className="text-[#F0F0F0]"> </span><span className="text-[#939393]">{titleSecondary}</span></> : null}</h2>
          </div>
          {paragraphs.length > 0 && (
            <div className="flex flex-col gap-3">
              {paragraphs.map((p, i) => (
                <RichText
                  key={i}
                  text={p.text}
                  className={p.uppercase ? MOBILE_UPPERCASE : MOBILE_NORMAL}
                />
              ))}
            </div>
          )}
        </div>
        <ProductAccordion items={accordion} collapsible={accordionCollapsible} />
        {hasImage && (
          <div className="mt-6 bg-[#121212]">
            <AboutImage src={aboutImage} alt={title} />
          </div>
        )}
      </div>
    </section>
  );
}
