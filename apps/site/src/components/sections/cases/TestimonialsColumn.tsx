"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/lib/testimonials";

const SCROLL_SPEED = 0.5;
const FRICTION = 0.95;

/** Replace spaces after ≤2-letter words with non-breaking spaces. */
function nb(text: string): string {
  const apply = (t: string) =>
    t.replace(/(^|[ \t\u00A0])([а-яёА-ЯЁa-zA-Z]{1,2}) (?=\S)/gm, "$1$2\u00A0");
  return apply(apply(apply(text)));
}

/**
 * Auto-scrolling testimonials list. Fills 100% height of its parent —
 * parent is responsible for setting the height (e.g. `h-screen`, `380px`,
 * or a ResizeObserver-matched height).
 *
 * Includes:
 *  - Continuous slow auto-scroll (top → bottom)
 *  - Press-and-drag with momentum/inertia
 *  - Seamless infinite vertical loop (list duplicated)
 *  - Mask-fade at top/bottom edges
 */
export function TestimonialsColumn({
  testimonials,
  showLabel = true,
  className = "",
}: {
  testimonials: Testimonial[];
  showLabel?: boolean;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const scrollY = useRef(0);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragScrollStart = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);
  const lastPointerY = useRef(0);
  const lastPointerTime = useRef(0);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const tick = (time: number) => {
      const dt = lastTime.current ? (time - lastTime.current) / 16.67 : 1;
      if (!isDragging.current) {
        if (Math.abs(velocity.current) > 0.1) {
          scrollY.current += velocity.current * dt;
          velocity.current *= FRICTION;
        } else {
          velocity.current = 0;
          scrollY.current += SCROLL_SPEED * dt;
        }
        const halfHeight = track.scrollHeight / 2;
        if (halfHeight > 0) {
          scrollY.current = ((scrollY.current % halfHeight) + halfHeight) % halfHeight;
        }
      }
      lastTime.current = time;
      track.style.transform = `translateY(${-scrollY.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    velocity.current = 0;
    dragStartY.current = e.clientY;
    dragScrollStart.current = scrollY.current;
    lastPointerY.current = e.clientY;
    lastPointerTime.current = performance.now();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const now = performance.now();
    const dtMs = now - lastPointerTime.current;
    if (dtMs > 0) {
      velocity.current = ((lastPointerY.current - e.clientY) / dtMs) * 16.67;
    }
    lastPointerY.current = e.clientY;
    lastPointerTime.current = now;
    const delta = dragStartY.current - e.clientY;
    const track = trackRef.current;
    let next = dragScrollStart.current + delta;
    if (track) {
      const halfHeight = track.scrollHeight / 2;
      if (halfHeight > 0) next = ((next % halfHeight) + halfHeight) % halfHeight;
    }
    scrollY.current = next;
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div className={`flex flex-col gap-4 w-full h-full ${className}`}>
      {showLabel && (
        <span className="flex-none font-['Loos_Condensed',sans-serif] text-[16px] md:text-[18px] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[#FFCC00]">
          Отзывы
        </span>
      )}
      <div
        className={`relative flex-1 min-h-0 overflow-hidden ${
          !isMobile ? "cursor-grab active:cursor-grabbing select-none touch-none" : ""
        }`}
        style={{
          maskImage:
            "linear-gradient(180deg, transparent 0px, #000 64px, #000 calc(100% - 64px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0px, #000 64px, #000 calc(100% - 64px), transparent 100%)",
        }}
        onPointerDown={isMobile ? undefined : handlePointerDown}
        onPointerMove={isMobile ? undefined : handlePointerMove}
        onPointerUp={isMobile ? undefined : handlePointerUp}
        onPointerCancel={isMobile ? undefined : handlePointerUp}
      >
        <div ref={trackRef} className="will-change-transform">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={`${t.id}-${i}`}>
              <div className="flex flex-col mb-3">
                <span className="text-[13px] font-medium text-[#F0F0F0] leading-[1.2]">
                  {t.name}
                </span>
                <span className="text-[12px] text-[#6B6B6B] leading-[1.2]">
                  {t.position}
                </span>
              </div>
              <div className="text-[14px] leading-[1.4] tracking-[0.01em] text-[#939393]">
                {t.paragraphs.map((para, pi) => (
                  <p key={pi} className={pi > 0 ? "mt-2" : ""}>
                    {nb(para)}
                  </p>
                ))}
              </div>
              {i < testimonials.length * 2 - 1 && (
                <div className="h-px bg-[#404040] my-5" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
