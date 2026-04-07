"use client";

import { useState } from "react";
import Image from "next/image";
import type { AccordionItem } from "@/lib/products";

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

function ProductAccordion({
  items,
  defaultOpen = 0,
}: {
  items: AccordionItem[];
  defaultOpen?: number;
}) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);

  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const isFirst = i === 0;

        return (
          <button
            key={i}
            type="button"
            className={`flex items-start gap-7 py-4 pr-4 text-left cursor-pointer border-[#404040] ${
              isFirst ? "border-t border-b" : "border-b"
            }`}
            onClick={() => setOpenIndex(isOpen ? -1 : i)}
          >
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]">
                {item.title}
              </span>
              <div
                className="grid transition-[grid-template-rows] duration-200 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  {item.description && (
                    <p className="pt-4 text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
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
  description: string;
  accordion: AccordionItem[];
  /** Image path (if present, uses image variant) */
  aboutImage?: string | null;
};

export function AboutProduct({
  caption,
  title,
  description,
  accordion,
  aboutImage,
}: AboutProductProps) {
  const hasImage = !!aboutImage;

  return (
    <section className="w-full border-t border-border py-14">
      {/* ── Desktop with image ── */}
      {hasImage && (
        <div className="hidden lg:flex mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
          {/* Left: text + accordion */}
          <div className="w-[560px] shrink-0 flex flex-col justify-between gap-28 py-14">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                  {caption}
                </span>
                <h2 className="h2 text-[#F0F0F0]">{title}</h2>
              </div>
              <p className="text-[length:var(--text-18)] leading-[1.2] text-[#939393]">
                {description}
              </p>
            </div>
            <ProductAccordion items={accordion} />
          </div>

          {/* Right: image */}
          <div className="flex-1 bg-[#121212] relative min-h-[684px]">
            <Image
              src={aboutImage}
              alt={title}
              fill
              className="object-cover"
            />
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
                <h2 className="h2 text-[#F0F0F0]">{title}</h2>
              </div>
              <p className="text-[length:var(--text-18)] leading-[1.2] text-[#939393]">
                {description}
              </p>
            </div>
          </div>

          {/* Right: accordion — 50% */}
          <div className="w-1/2">
            <ProductAccordion items={accordion} />
          </div>
        </div>
      )}

      {/* ── Tablet ── */}
      <div className="hidden md:flex lg:hidden flex-col mx-auto max-w-[768px] px-8 py-10">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
              {caption}
            </span>
            <h2 className="h2 text-[#F0F0F0]">{title}</h2>
          </div>
          <p className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]">
            {description}
          </p>
        </div>
        <ProductAccordion items={accordion} />
        {hasImage && (
          <div className="relative w-full h-[340px] bg-[#121212] mt-8">
            <Image src={aboutImage} alt={title} fill className="object-cover" />
          </div>
        )}
      </div>

      {/* ── Mobile ── */}
      <div className="flex md:hidden flex-col px-5 py-8">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
              {caption}
            </span>
            <h2 className="h3 text-[#F0F0F0]">{title}</h2>
          </div>
          <p className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]">
            {description}
          </p>
        </div>
        <ProductAccordion items={accordion} />
        {hasImage && (
          <div className="relative w-full h-[340px] bg-[#121212] mt-6">
            <Image src={aboutImage} alt={title} fill className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
