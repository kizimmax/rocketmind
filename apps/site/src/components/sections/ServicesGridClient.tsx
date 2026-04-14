"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { ProductCard } from "@rocketmind/ui";

export type ServiceCard = {
  title: string;
  description: string;
  /** Link for card */
  href?: string;
  /** Info bubble: purple bg, dark text, partner logos at bottom */
  variant?: "info";
  /** Partner logos for info cards */
  partnerLogos?: Array<{ src: string; width?: number; height?: number }>;
  /** Cover image URL for 120×120 icon display */
  coverImage?: string;
  /** Expert avatars */
  experts?: Array<{ name: string; image: string }>;
};

export type ServiceSection = {
  trackName: string;
  headerHighlight: string;
  /** Mobile title with line break (e.g. "Стратегия\nи бизнес-модели") */
  mobileTitle?: string;
  description: string;
  /** Link for "Все" button */
  catalogHref?: string;
  /** Label for mobile "Все" button (e.g. "Все продукты", "Все курсы") */
  catalogLabel?: string;
  /** Show 120×120 icon in cards (consulting section only) */
  showIcons?: boolean;
  cards: ServiceCard[];
};

type ServicesGridClientProps = {
  sections: ServiceSection[];
};

export function ServicesGridClient({ sections }: ServicesGridClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [carouselIndices, setCarouselIndices] = useState<Record<number, number>>(
    sections.reduce((acc, _, i) => ({ ...acc, [i]: 0 }), {})
  );

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Responsive
  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCardsPerView(1);
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
      <div className="mx-auto w-full max-w-[1512px] md:px-8 xl:px-14">
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
                  {/* Header row */}
                  <div className="flex items-end justify-between gap-6 lg:gap-10 mb-6 md:mb-8 lg:mb-10 px-5 md:px-0">
                    <div className="flex flex-col gap-4 lg:gap-5 flex-1 min-w-0">
                      {/* Yellow track label + "Все" — mobile/tablet only */}
                      <div className="flex items-center justify-between lg:hidden">
                        <p className="font-['Loos_Condensed',sans-serif] font-medium text-[16px] md:text-[18px] uppercase leading-[1.16] tracking-[0.02em] text-[var(--rm-yellow-100)]">
                          {section.trackName}
                        </p>
                        {section.catalogHref && (
                          <Link
                            href={section.catalogHref}
                            className="inline-flex items-center gap-2 font-['Loos_Condensed',sans-serif] text-[16px] font-medium uppercase leading-[1.12] tracking-[0.02em] text-foreground"
                          >
                            {section.catalogLabel ?? "Все"}
                            <ArrowUpRight size={13} strokeWidth={2} />
                          </Link>
                        )}
                      </div>
                      {/* Title: mobile uses mobileTitle with line breaks */}
                      <h2 className="font-heading text-[28px] md:text-[42px] lg:text-[52px] font-bold uppercase leading-[1.16] md:leading-[1.08] tracking-[-0.01em] md:tracking-[-0.02em] text-foreground whitespace-pre-line">
                        {isMobile && section.mobileTitle ? section.mobileTitle : section.headerHighlight}
                      </h2>
                      <p className="text-[14px] md:text-[15px] lg:text-[18px] leading-[1.32] md:leading-[1.2] text-muted-foreground max-w-[766px]">
                        {section.description}
                      </p>
                    </div>

                    {/* Arrows + Все — desktop/tablet */}
                    <div className="hidden md:flex items-center gap-2 shrink-0">
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
                  {isMobile ? (
                    /* ── Mobile: native horizontal scroll ── */
                    <div
                      ref={(el) => { scrollRefs.current[sIdx] = el; }}
                      className="flex overflow-x-auto snap-x snap-mandatory pl-5 [&::-webkit-scrollbar]:hidden"
                      style={{ scrollbarWidth: "none", scrollPaddingLeft: 20 }}
                    >
                      {section.cards.map((card) =>
                        card.variant === "info" ? (
                          <MobileInfoCard key={card.title} card={card} />
                        ) : (
                          <div key={card.title} className="flex-none w-[335px] snap-start -ml-px first:ml-0">
                            <ProductCard
                              title={card.title}
                              description={card.description}
                              href={card.href}
                              icon={
                                section.showIcons && card.coverImage
                                  ? <img src={card.coverImage} alt="" className="w-full h-full object-contain" />
                                  : undefined
                              }
                              experts={section.showIcons ? card.experts : undefined}
                              tag={section.showIcons && card.experts?.length ? "Экспертный продукт" : undefined}
                              className="h-full"
                            />
                          </div>
                        )
                      )}
                      {/* Right spacer so last card doesn't stick to edge */}
                      <div className="flex-none w-5" aria-hidden="true" />
                    </div>
                  ) : (
                    /* ── Desktop/tablet: grid carousel ── */
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
                                <div className="flex items-end justify-between gap-[clamp(16px,4vw,40px)] py-2 mt-auto">
                                  {card.partnerLogos ? (
                                    card.partnerLogos.map((logo, i) => (
                                      <Image key={i} src={logo.src} alt="" width={logo.width ?? 139} height={logo.height ?? 32} className="h-[clamp(36px,7vw,40px)] w-auto max-w-[45%] object-contain" unoptimized />
                                    ))
                                  ) : (
                                    <>
                                      <div className="h-[clamp(36px,7vw,40px)] w-[139px] max-w-[45%] bg-muted-foreground/15 rounded-sm" />
                                      <div className="h-[clamp(36px,7vw,40px)] w-[108px] max-w-[45%] bg-muted-foreground/15 rounded-sm" />
                                    </>
                                  )}
                                </div>
                              </div>
                            </article>
                          ) : (
                            <ProductCard
                              key={card.title}
                              title={card.title}
                              description={card.description}
                              href={card.href}
                              icon={
                                section.showIcons && card.coverImage
                                  ? <img src={card.coverImage} alt="" className="w-full h-full object-contain" />
                                  : undefined
                              }
                              experts={section.showIcons ? card.experts : undefined}
                              tag={section.showIcons && card.experts?.length ? "Экспертный продукт" : undefined}
                              className="[&:not(:first-child)]:border-l-0 h-full"
                            />
                          )
                        )}
                      </div>
                    </div>
                  )}


                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

/* ── Mobile info card (purple): 335px, Figma specs ── */
function MobileInfoCard({ card }: { card: ServiceCard }) {
  return (
    <article
      className="flex-none w-[335px] snap-start border border-border -ml-px first:ml-0 p-5 bg-[#A172F8]"
    >
      <div className="flex flex-col gap-8 h-full">
        {/* Text area — fixed 140px */}
        <div className="flex flex-col gap-2 h-[140px]">
          <h3 className="font-heading text-[20px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#0A0A0A]">
            {card.title}
          </h3>
          <p className="text-[14px] leading-[1.32] tracking-[0.01em] text-[#0A0A0A]">
            {card.description}
          </p>
        </div>
        {/* Partner logos */}
        <div className="flex items-end justify-between gap-[39px] py-2 mt-auto max-w-[286px]">
          {card.partnerLogos ? (
            card.partnerLogos.map((logo, i) => (
              <Image key={i} src={logo.src} alt="" width={logo.width ?? 139} height={logo.height ?? 32} className="h-8 w-auto object-contain" unoptimized />
            ))
          ) : (
            <>
              <div className="h-8 w-[139px] bg-muted-foreground/15 rounded-sm" />
              <div className="h-8 w-[108px] bg-muted-foreground/15 rounded-sm" />
            </>
          )}
        </div>
      </div>
    </article>
  );
}
