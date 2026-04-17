"use client";

import type { CaseEntry } from "@/lib/cases";
import type { Testimonial } from "@/lib/testimonials";
import { TestimonialsColumn } from "./cases/TestimonialsColumn";
import { CaseCard } from "./cases/CaseCard";

/**
 * Sticky-cases section on /cases:
 *  - Desktop: left 320px column with testimonials, sticky at viewport top, h-screen.
 *    Right column flex-1 with all cases stacked vertically. While the right
 *    column scrolls, the testimonials stay locked. Once cases finish, the
 *    whole block releases and the page continues to the next section.
 *  - Mobile: cases stacked first, then testimonials below in a fixed-height
 *    box (380px) — same pattern as the cross-block CasesSection.
 */
export function CasesPageBlock({
  cases,
  testimonials,
}: {
  cases: CaseEntry[];
  testimonials: Testimonial[];
}) {
  if (cases.length === 0) return null;

  return (
    <section className="dark bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1512px] px-5 md:px-8 xl:px-14 pt-10 lg:pt-12 pb-10 lg:pb-12">
        <div className="flex flex-col lg:flex-row lg:gap-8 lg:items-start">
          {/* ── LEFT (desktop) / BOTTOM (mobile): Testimonials ── */}
          <div
            className="
              order-2 lg:order-1
              lg:w-[320px] lg:flex-none
              lg:sticky lg:top-0 lg:h-screen
              h-[380px] lg:h-screen
              w-full
              mt-10 lg:mt-0
            "
          >
            <TestimonialsColumn testimonials={testimonials} />
          </div>

          {/* ── RIGHT (desktop) / TOP (mobile): Cases stacked ── */}
          <div className="flex-1 flex flex-col order-1 lg:order-2 min-w-0">
            <span className="font-['Loos_Condensed',sans-serif] text-[16px] md:text-[18px] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[#FFCC00] mb-4">
              кейсы
            </span>

            <div className="flex flex-col gap-16 lg:gap-24">
              {cases.map((c) => (
                <CaseCard key={c.slug} entry={c} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
