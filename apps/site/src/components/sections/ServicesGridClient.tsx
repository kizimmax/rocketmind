"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

export type ServiceCard = {
  title: string;
  description: string;
  /** Link for "Подробнее" button */
  href?: string;
  /** Info bubble: no "Подробнее" button, purple bg, dark text, partner logos at bottom */
  variant?: "info";
  /** Partner logos for info cards */
  partnerLogos?: Array<{ src: string; width?: number; height?: number }>;
};

export type ServiceSection = {
  trackName: string;
  headerHighlight: string;
  description: string;
  /** Link for "Все" button */
  catalogHref?: string;
  cards: ServiceCard[];
};

type ServicesGridClientProps = {
  sections: ServiceSection[];
};

export function ServicesGridClient({ sections }: ServicesGridClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [carouselIndices, setCarouselIndices] = useState<Record<number, number>>(
    sections.reduce((acc, _, i) => ({ ...acc, [i]: 0 }), {})
  );

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Responsive cardsPerView
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768) setCardsPerView(1);
      else if (window.innerWidth < 1280) setCardsPerView(2);
      else setCardsPerView(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Reset carousel on cardsPerView change
  useEffect(() => {
    setCarouselIndices(sections.reduce((acc, _, i) => ({ ...acc, [i]: 0 }), {}));
  }, [cardsPerView, sections]);

  // Active tab follows scroll via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveIndex(index);
          });
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      );
      observer.observe(ref);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollCarousel = (sIdx: number, direction: "left" | "right") => {
    setCarouselIndices((prev) => {
      const current = prev[sIdx];
      const max = Math.max(0, sections[sIdx].cards.length - cardsPerView);
      const next = direction === "left" ? current - 1 : current + 1;
      return { ...prev, [sIdx]: Math.max(0, Math.min(max, next)) };
    });
  };

  return (
    <section id="focus" className="dark bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1512px] px-5 md:px-8 xl:px-14">
        {/*
         * On mobile:  flex-col → tabs row first, then content sections stacked
         * On desktop: grid [344px | 1fr] → tabs col sticky left, content col scrolls normally
         */}
        <div className="border-t border-border flex flex-col lg:grid lg:grid-cols-[344px_1fr] lg:gap-2 lg:items-start">

          {/* ── Tabs column: desktop only (sticky vertical) ──────────── */}
          <div className="hidden lg:flex lg:flex-col lg:gap-[4px] lg:sticky lg:top-14 lg:self-start lg:pt-14 lg:pb-14">
            {sections.map((section, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={section.trackName}
                  onClick={() => scrollToSection(index)}
                  className={[
                    "py-2 text-left cursor-pointer appearance-none bg-transparent w-fit",
                    "border-0 border-b-[3px] border-solid transition-colors duration-300",
                    isActive
                      ? "text-foreground border-[var(--rm-yellow-100)]"
                      : "text-muted-foreground border-transparent hover:text-foreground/70",
                  ].join(" ")}
                >
                  <span className="font-heading text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em]">
                    {section.trackName}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Content column ────────────────────────────────────────── */}
          {/*   All 3 sections always in DOM, refs for IntersectionObserver */}
          <div className="flex flex-col min-w-0">
            {sections.map((section, sIdx) => {
              const carouselIndex = carouselIndices[sIdx];
              const max = Math.max(0, section.cards.length - cardsPerView);
              const canLeft = carouselIndex > 0;
              const canRight = carouselIndex < max;

              return (
                <div
                  key={section.trackName}
                  ref={(el) => { sectionRefs.current[sIdx] = el; }}
                  className="pt-8 lg:pt-14 pb-12 lg:pb-[108px] last:pb-8 lg:last:pb-14"
                >
                  {/* Header row: title + description on left, nav on right */}
                  <div className="flex items-end justify-between gap-6 lg:gap-10 mb-8 lg:mb-10">

                    {/* Title + description */}
                    <div className="flex flex-col gap-4 lg:gap-5 flex-1 min-w-0">
                      {/* Yellow track label — mobile/tablet only (replaces tabs) */}
                      <p className="lg:hidden font-['Loos_Condensed',sans-serif] font-medium text-[18px] uppercase leading-[1.16] tracking-[0.02em] text-[var(--rm-yellow-100)]">
                        {section.trackName}
                      </p>
                      <h2 className="font-heading text-[30px] md:text-[42px] lg:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-foreground">
                        {section.headerHighlight}
                      </h2>
                      <p className="text-[15px] lg:text-[18px] leading-[1.2] text-muted-foreground max-w-[766px]">
                        {section.description}
                      </p>
                    </div>

                    {/* Arrows + Все — all in one group */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => scrollCarousel(sIdx, "left")}
                        disabled={!canLeft}
                        className="flex items-center justify-center w-10 h-10 border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                      >
                        <ChevronLeft size={16} strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => scrollCarousel(sIdx, "right")}
                        disabled={!canRight}
                        className="flex items-center justify-center w-10 h-10 border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                      >
                        <ChevronRight size={16} strokeWidth={2} />
                      </button>
                      <Link
                        href={section.catalogHref ?? "#"}
                        className="hidden md:flex items-center gap-2 border border-border bg-[#1a1a1a] text-foreground h-10 px-5 font-['Loos_Condensed',sans-serif] text-[14px] font-medium uppercase tracking-[0.56px] transition-colors hover:bg-[#242424] rounded-[4px]"
                      >
                        Все
                        <ArrowUpRight size={13} strokeWidth={2} />
                      </Link>
                    </div>
                  </div>

                  {/* Cards carousel */}
                  <div className="overflow-hidden">
                    <div
                      className="grid transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{
                        gridTemplateColumns: `repeat(${section.cards.length}, 1fr)`,
                        width: `${(section.cards.length * 100) / cardsPerView}%`,
                        transform: `translateX(-${(carouselIndex * 100) / section.cards.length}%)`,
                      }}
                    >
                      {section.cards.map((card) =>
                        card.variant === "info" ? (
                          // ── Info bubble card: no button, purple title, logos ──
                          <article
                            key={card.title}
                            className="flex flex-col border border-border [&:not(:first-child)]:border-l-0 p-8 bg-[#A172F8]"
                          >
                            <div className="flex flex-col h-full gap-2">
                              <div className="flex flex-col gap-2 min-h-[156px]">
                                <h3 className="font-heading text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#0A0A0A]">
                                  {card.title}
                                </h3>
                                <p className="text-[14px] leading-[1.32] tracking-[0.01em] text-[#0A0A0A]">
                                  {card.description}
                                </p>
                              </div>
                              {/* Partner logos */}
                              <div className="flex items-end justify-between gap-[clamp(16px,4vw,40px)] py-2 mt-auto">
                                {card.partnerLogos ? (
                                  card.partnerLogos.map((logo, i) => (
                                    <Image key={i} src={logo.src} alt="" width={logo.width ?? 139} height={logo.height ?? 32} className="h-[clamp(20px,5vw,32px)] w-auto max-w-[45%] object-contain" unoptimized />
                                  ))
                                ) : (
                                  // Placeholder until real logos are added
                                  <>
                                    <div className="h-[clamp(20px,5vw,32px)] w-[139px] max-w-[45%] bg-muted-foreground/15 rounded-sm" />
                                    <div className="h-[clamp(20px,5vw,32px)] w-[108px] max-w-[45%] bg-muted-foreground/15 rounded-sm" />
                                  </>
                                )}
                              </div>
                            </div>
                          </article>
                        ) : (
                          // ── Regular card ──────────────────────────────────────
                          <article
                            key={card.title}
                            className="flex flex-col border border-border [&:not(:first-child)]:border-l-0 p-8 bg-background"
                          >
                            <div className="flex flex-col gap-6 flex-1">
                              <div className="flex flex-col gap-2">
                                <h3 className="font-heading text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-foreground">
                                  {card.title}
                                </h3>
                                <p className="text-[14px] leading-[1.32] tracking-[0.01em] text-muted-foreground">
                                  {card.description}
                                </p>
                              </div>
                              <Link
                                href={card.href ?? "#contact"}
                                className="mt-auto flex items-center justify-center border border-border bg-[#1a1a1a] px-5 py-[14px] font-['Loos_Condensed',sans-serif] text-[14px] font-medium uppercase tracking-[0.56px] text-foreground transition-colors hover:bg-[#242424] rounded-[4px]"
                              >
                                Подробнее
                              </Link>
                            </div>
                          </article>
                        )
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
