"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";

export type ServiceCard = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

export type ServiceSection = {
  trackName: string;
  headerHighlight: string;
  description: string;
  cards: ServiceCard[];
};

type ServicesGridClientProps = {
  sections: ServiceSection[];
};

export function ServicesGridClient({ sections }: ServicesGridClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track overall scroll progress for this whole component to determine which section is active
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);

  // We have 3 sections. scrollYProgress goes 0 -> 1.
  // We can map scrollYProgress to an active index.
  // E.g., 0 to 0.33 -> 0; 0.33 to 0.66 -> 1; 0.66 to 1 -> 2
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      // Calculate index based on scroll progress
      const numSections = sections.length;
      let newIndex = Math.floor(latest * numSections);
      // Ensure index stays within bounds (latest can sometimes be exactly 1)
      if (newIndex >= numSections) newIndex = numSections - 1;
      if (newIndex < 0) newIndex = 0;
      
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    });
  }, [scrollYProgress, activeIndex, sections.length]);

  const activeSection = sections[activeIndex];

  // For horizontal carousels
  const [carouselIndices, setCarouselIndices] = useState<Record<number, number>>(
    sections.reduce((acc, _, i) => ({ ...acc, [i]: 0 }), {})
  );

  const scrollCarousel = (sectionIndex: number, direction: 'left' | 'right') => {
    setCarouselIndices(prev => {
      const current = prev[sectionIndex];
      const maxIndex = sections[sectionIndex].cards.length - 1;
      let nextIndex = direction === 'left' ? current - 1 : current + 1;
      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex > maxIndex) nextIndex = maxIndex;
      return { ...prev, [sectionIndex]: nextIndex };
    });
  };

  const scrollToSection = (index: number) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight;
    const sectionHeight = containerHeight / sections.length;
    
    // We scroll to the beginning of the target section's portion of the sticky parent
    // Adding a small offset (10px) to ensure we hit the index detection logic
    window.scrollTo({
      top: containerTop + (index * sectionHeight) + 10,
      behavior: "smooth"
    });
  };

  return (
    <section
      ref={containerRef}
      className="bg-background text-foreground dark relative"
      style={{ height: `${sections.length * 100}vh` }} // Make it tall enough to scroll through
      id="focus"
    >
      {/* Sticky wrapper */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        <div className="mx-auto w-full max-w-[1512px] px-5 md:px-8 xl:px-14">
            <div className="grid gap-[8px] border-t border-border pt-14 xl:grid-cols-[344px_1048px] xl:items-start flex-nowrap">
            
            {/* Left Side: Tabs */}
            <div className="flex flex-col gap-4">
              {sections.map((section, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={section.trackName}
                    onClick={() => scrollToSection(index)}
                    className={[
                      "relative flex w-fit transition-colors duration-300 text-left cursor-pointer appearance-none border-none bg-transparent p-0",
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/70",
                    ].join(" ")}
                  >
                    <p className="font-heading text-[24px] font-bold uppercase leading-[1.1] tracking-[-0.01em]">
                      {section.trackName}
                    </p>
                    {isActive && (
                      <motion.span
                        layoutId="active-track-indicator"
                        className="absolute -bottom-[2px] left-0 h-[2px] w-full bg-[var(--rm-yellow-100)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Side: Header, Description & Cards */}
            <div className="flex flex-1 max-w-[1048px] flex-col gap-10 relative">
              <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex max-w-[896px] flex-col gap-5 relative">
                  <div className="font-heading text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em]">
                    <p className="text-foreground">Три фокуса Rocketmind</p>
                    <div className="relative">
                      <AnimatePresence mode="wait">
                        <motion.p 
                          key={activeIndex + "-header"}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="text-muted-foreground whitespace-nowrap"
                        >
                          {activeSection.headerHighlight}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  <div className="relative max-w-[896px]">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={activeIndex + "-desc"}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-[18px] leading-[1.2] text-muted-foreground"
                      >
                        {activeSection.description}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center gap-5 self-end text-muted-foreground z-20 relative bg-background/50 py-2">
                  <button 
                    onClick={() => scrollCarousel(activeIndex, 'left')}
                    className="hover:text-foreground transition-colors"
                  >
                    <ChevronLeft size={24} strokeWidth={1.8} />
                  </button>
                  <button 
                    onClick={() => scrollCarousel(activeIndex, 'right')}
                    className="hover:text-foreground transition-colors"
                  >
                    <ChevronRight size={24} strokeWidth={1.8} />
                  </button>
                </div>
              </div>

              {/* Cards Stage Container */}
              <div className="relative h-[512px] overflow-hidden px-[1px] py-[1px]">
                <AnimatePresence>
                  {sections.map((section, sIdx) => {
                    const isSectionActive = sIdx === activeIndex;
                    const isPast = sIdx < activeIndex;

                    // If we are scrolling downwards, past sections fade and slide up slightly
                    // Incoming sections slide up from bottom
                    if (!isSectionActive && !isPast) return null; // Future sections are hidden

                    return (
                      <motion.div
                        key={section.trackName}
                        initial={{ opacity: 0, y: 200 }}
                        animate={{ opacity: isSectionActive ? 1 : 0, y: isSectionActive ? 0 : -50 }}
                        exit={{ opacity: 0, y: isSectionActive ? -50 : 200 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 flex w-full h-[508px]"
                        style={{ pointerEvents: isSectionActive ? 'auto' : 'none', zIndex: isSectionActive ? 10 : 0 }}
                      >
                        <motion.div 
                          className="flex h-full w-full gap-0 transition-transform duration-500 ease-out"
                          style={{
                            transform: `translateX(-${carouselIndices[sIdx] * (100 / Math.min(section.cards.length, 3))}vw)`
                          }}
                        >
                          <div 
                            className="flex"
                              style={{
                                transform: `translateX(calc(-${carouselIndices[sIdx]} * 100% / 3))`,
                                transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
                              }}
                          >
                            {section.cards.map((card, cIdx) => (
                              <article
                                key={card.title}
                                className="flex w-[33.333%] shrink-0 h-[508px] flex-col border border-border px-8 py-8 [&:not(:first-child)]:ml-[-1px] bg-background"
                              >
                                <div className="flex h-full flex-col gap-14">
                                  <div className="relative h-[204px] w-full overflow-hidden bg-[#131313]">
                                    <Image
                                      src={card.image}
                                      alt={card.alt}
                                      fill
                                      className="object-cover opacity-80"
                                    />
                                  </div>

                                  <div className="flex flex-1 flex-col justify-between gap-6">
                                    <div className="flex flex-col gap-2">
                                      <h3 className="font-heading text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-foreground">
                                        {card.title}
                                      </h3>
                                      <p className="text-[14px] leading-[1.32] tracking-[0.01em] text-muted-foreground whitespace-pre-wrap">
                                        {card.description}
                                      </p>
                                    </div>

                                    <Link
                                      href="#contact"
                                      className="flex h-[40px] items-center justify-center rounded-[4px] border border-border bg-[var(--field,#1a1a1a)] px-[20px] py-[14px] font-['Loos_Condensed:Medium',sans-serif] text-[14px] uppercase tracking-[0.56px] text-foreground transition-[background-color,border-color,opacity] duration-150 hover:bg-[#2a2a2a]"
                                    >
                                      Подробнее
                                    </Link>
                                  </div>
                                </div>
                              </article>
                            ))}
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
