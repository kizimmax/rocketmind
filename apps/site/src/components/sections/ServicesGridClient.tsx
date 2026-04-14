"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { ProductCard, ProductImageCard } from "@rocketmind/ui";

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
  /** Show cover image in cards (academy / ai-products) */
  showImages?: boolean;
  /** Yellow partner block below carousel */
  partnerBlock?: {
    title: string;
    description: string;
    logos: Array<{ src: string; width?: number; height?: number }>;
  };
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

  // Desktop drag-to-scroll
  const dragState = useRef<{ active: boolean; startX: number; sIdx: number; startIdx: number } | null>(null);

  const handleDragStart = useCallback((e: React.PointerEvent, sIdx: number) => {
    if (isMobile) return;
    dragState.current = { active: true, startX: e.clientX, sIdx, startIdx: carouselIndices[sIdx] };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [isMobile, carouselIndices]);

  const handleDragMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.current?.active) return;
    const dx = dragState.current.startX - e.clientX;
    if (Math.abs(dx) > 40) {
      const { sIdx, startIdx } = dragState.current;
      const section = sections[sIdx];
      const epv = section.showImages ? Math.max(1, cardsPerView / 2) : cardsPerView;
      const max = Math.max(0, section.cards.length - epv);
      const step = dx > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(max, startIdx + step));
      setCarouselIndices((prev) => ({ ...prev, [sIdx]: next }));
      dragState.current.active = false;
    }
  }, [sections, cardsPerView]);

  const handleDragEnd = useCallback(() => {
    dragState.current = null;
  }, []);

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
      const section = sections[sIdx];
      const epv = section.showImages ? Math.max(1, cardsPerView / 2) : cardsPerView;
      const max = Math.max(0, section.cards.length - epv);
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
              // Wide image cards take 2x width → show half as many per view
              const effectivePerView = section.showImages ? Math.max(1, cardsPerView / 2) : cardsPerView;
              const max = Math.max(0, section.cards.length - effectivePerView);
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
                      className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory pl-5 [&::-webkit-scrollbar]:hidden touch-pan-x"
                      style={{ scrollbarWidth: "none", scrollPaddingLeft: 20 }}
                    >
                      {section.cards.map((card) =>
                        section.showImages ? (
                          <div key={card.title} className="flex-none w-[335px] snap-start -ml-px first:ml-0">
                            <ProductImageCard
                              title={card.title}
                              description={card.description}
                              href={card.href}
                              image={card.coverImage}
                              variant="wide"
                              className="h-full"
                            />
                          </div>
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
                    <div
                      className="relative overflow-hidden md:-mr-8 xl:-mr-14 md:pr-8 xl:pr-14 cursor-grab active:cursor-grabbing select-none"
                      onPointerDown={(e) => handleDragStart(e, sIdx)}
                      onPointerMove={handleDragMove}
                      onPointerUp={handleDragEnd}
                      onPointerCancel={handleDragEnd}
                    >
                      {/* Left fade — visible when scrolled */}
                      <div
                        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 transition-opacity duration-300"
                        style={{
                          background: "linear-gradient(90deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0) 100%)",
                          opacity: canLeft ? 1 : 0,
                        }}
                      />
                      {/* Right fade — visible when more cards ahead */}
                      <div
                        className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 transition-opacity duration-300"
                        style={{
                          background: "linear-gradient(-90deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0) 100%)",
                          opacity: canRight ? 1 : 0,
                        }}
                      />
                      <div
                        className="grid transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                          gridTemplateColumns: `repeat(${section.cards.length}, 1fr)`,
                          width: `${(section.cards.length * 100) / effectivePerView}%`,
                          transform: `translateX(-${(carouselIndex * 100) / section.cards.length}%)`,
                        }}
                      >
                        {section.cards.map((card) =>
                          section.showImages ? (
                            <ProductImageCard
                              key={card.title}
                              title={card.title}
                              description={card.description}
                              href={card.href}
                              image={card.coverImage}
                              variant="wide"
                              className="[&:not(:first-child)]:border-l-0 h-full"
                            />
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

                  {/* ── Partner block (yellow, below carousel) ── */}
                  {section.partnerBlock && (
                    <div className="bg-[#FFCC00] mx-5 md:mx-0 p-5 md:p-8">
                      <div className="flex flex-col gap-8 md:flex-row md:justify-between">
                        <div className="flex flex-col gap-4 md:max-w-[665px]">
                          <h3 className="font-heading text-[28px] md:text-[32px] font-bold uppercase leading-[1.12] tracking-[-0.01em] text-[#0A0A0A]">
                            {section.partnerBlock.title}
                          </h3>
                          <p className="font-['Loos_Condensed',sans-serif] text-[14px] md:text-[18px] font-medium uppercase tracking-[0.02em] leading-[1.12] text-[#0A0A0A]">
                            {section.partnerBlock.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-start gap-6 md:relative md:w-[284px] md:h-[140px] md:shrink-0">
                          {section.partnerBlock.logos.map((logo, i) => (
                            <Image
                              key={i}
                              src={logo.src}
                              alt=""
                              width={logo.width ?? 180}
                              height={logo.height ?? 46}
                              className={i === 0
                                ? "h-[27px] md:h-[46px] w-auto object-contain md:absolute md:bottom-0 md:left-4"
                                : "h-[39px] md:h-[60px] w-auto object-contain md:absolute md:top-0 md:left-0"
                              }
                              unoptimized
                            />
                          ))}
                        </div>
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
