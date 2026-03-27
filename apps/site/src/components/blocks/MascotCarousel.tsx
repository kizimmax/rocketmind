"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import Image from "next/image";

/* ─── Agent data ─────────────────────────────────────────────
   All 8 agents with front-facing (base) images.
   Task texts generated from design system role descriptions.
   ──────────────────────────────────────────────────────────── */
const AGENTS = [
  {
    name: "Ник",
    image: "/ai-mascots/nick/nick-base.png",
    task: "Найду прорывную идею для твоего бизнеса",
  },
  {
    name: "Алекс",
    image: "/ai-mascots/alex/alex_base.png",
    task: "Расскажи о продукте — я помогу начать",
  },
  {
    name: "Марк",
    image: "/ai-mascots/mark/mark_base.png",
    task: "Спроектирую архитектуру твоей платформы",
  },
  {
    name: "Лида",
    image: "/ai-mascots/lida/lida_base.png",
    task: "Проверю твою гипотезу на жизнеспособность",
  },
  {
    name: "Макс",
    image: "/ai-mascots/max/max_base.png",
    task: "Найду слабые места в твоей бизнес-модели",
  },
  {
    name: "Софи",
    image: "/ai-mascots/sophie/sophie_base.png",
    task: "Подготовлю программу обучения для команды",
  },
  {
    name: "Сергей",
    image: "/ai-mascots/sergey/sergey_base.png",
    task: "Проанализирую рынок и покажу тренды",
  },
  {
    name: "Катя",
    image: "/ai-mascots/kate/kate_base.png",
    task: "Покажу связи в твоей экосистеме",
  },
];

const N = AGENTS.length;
const CYCLE_MS = 6000;
const TYPING_MS = 2500;
const SLIDE_MS = 500;
const VISIBLE_MS = CYCLE_MS - TYPING_MS - SLIDE_MS; // 3000

type Phase = "typing" | "visible" | "sliding";
type Slot = "exit" | "prev" | "current" | "next" | "enter";

interface SlotStyle {
  top: number;
  left: number;
  size: number;
  opacity: number;
}

/* ─── Slot positions from Figma ───────────────────────────────
   Desktop (297:1288): card 535×140, mascot column 108×136
     Ник (current):  y=14,   108×108, x=0
     Марк (prev):    y=-44,  80×80,   x=14
     Алекс (next):   y=102,  80×80,   x=14
     Fade:           24px at top/bottom

   Mobile (297:1195): card 393×108, mascot column 80×104
     Ник (current):  y=12,   80×80,   x=0
     Марк (prev):    y=-37,  64×64,   x=8
     Алекс (next):   y=77,   64×64,   x=8
     Fade:           15px at top/bottom
   ────────────────────────────────────────────────────────────── */

const DESKTOP_SLOTS: Record<Slot, SlotStyle> = {
  exit: { top: -120, left: 14, size: 80, opacity: 0 },
  prev: { top: -44, left: 14, size: 80, opacity: 0.6 },
  current: { top: 14, left: 0, size: 108, opacity: 1 },
  next: { top: 102, left: 14, size: 80, opacity: 0.6 },
  enter: { top: 180, left: 14, size: 80, opacity: 0 },
};

const COMPACT_SLOTS: Record<Slot, SlotStyle> = {
  exit: { top: -90, left: 8, size: 64, opacity: 0 },
  prev: { top: -37, left: 8, size: 64, opacity: 0.6 },
  current: { top: 12, left: 0, size: 80, opacity: 1 },
  next: { top: 77, left: 8, size: 64, opacity: 0.6 },
  enter: { top: 130, left: 8, size: 64, opacity: 0 },
};

/**
 * Animated mascot carousel for the PlatformOverview section.
 *
 * Shows 3 mascots at once: prev (peeking top), current (center, large),
 * next (peeking bottom). Every 6s the strip slides up, text types in.
 *
 * `size`:
 *   - "default"  → desktop (h=140, mascot col 108, text 16px, button 56)
 *   - "compact"  → mobile/tablet (h=108, mascot col 80, text 12px, button 40)
 */
export function MascotCarousel({
  size = "default",
}: {
  size?: "compact" | "default";
}) {
  const isCompact = size === "compact";
  const slots = isCompact ? COMPACT_SLOTS : DESKTOP_SLOTS;

  const [baseIndex, setBaseIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [typedCount, setTypedCount] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const typingRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const fadeRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const activeAgent = AGENTS[baseIndex];
  const taskText = activeAgent.task;

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (typingRef.current) clearInterval(typingRef.current);
  }, []);

  /* ── Text fade-in after mascot slide ──
     We keep textVisible=false during the slide, then flip it on
     one frame AFTER React has committed the new (empty) text.
     This ensures the CSS transition from opacity 0→1 fires.
     Separate ref so clearTimers() doesn't cancel this. */
  useLayoutEffect(() => {
    if (phase === "typing" && !textVisible) {
      fadeRef.current = setTimeout(() => setTextVisible(true), 30);
      return () => clearTimeout(fadeRef.current);
    }
  }, [phase, textVisible]);

  useEffect(() => {
    clearTimers();

    if (phase === "typing") {
      setTypedCount(0);
      const totalChars = taskText.length;
      const charInterval = TYPING_MS / totalChars;
      let count = 0;
      typingRef.current = setInterval(() => {
        count++;
        setTypedCount(count);
        if (count >= totalChars) {
          clearInterval(typingRef.current!);
          setPhase("visible");
        }
      }, charInterval);
    } else if (phase === "visible") {
      timerRef.current = setTimeout(() => {
        setTextVisible(false); // fade out text first
        timerRef.current = setTimeout(() => setPhase("sliding"), 250);
      }, VISIBLE_MS);
    } else if (phase === "sliding") {
      timerRef.current = setTimeout(() => {
        setTypedCount(0); // reset before index change to avoid flash
        setBaseIndex((i) => (i + 1) % N);
        setPhase("typing");
      }, SLIDE_MS);
    }

    return clearTimers;
  }, [phase, taskText, clearTimers]);

  /* ── Build 4 mascot elements (prev, current, next + exit/enter) ── */
  const agentIndices = [
    (baseIndex - 1 + N) % N,
    baseIndex,
    (baseIndex + 1) % N,
    (baseIndex + 2) % N,
  ];

  // During idle: positions map to [prev, current, next, enter]
  // During sliding: positions map to [exit, prev, current, next]
  const slotOrder: Slot[] =
    phase === "sliding"
      ? ["exit", "prev", "current", "next"]
      : ["prev", "current", "next", "enter"];

  return (
    <div
      className="flex w-full items-stretch overflow-hidden rounded-[8px] border-2 border-[#FFCC00] bg-[#121212]"
      style={{ height: isCompact ? 108 : 140, padding: 2, gap: 7 }}
    >
      {/* ── Mascot column ── */}
      <div
        className="relative shrink-0 overflow-hidden rounded-[4px]"
        style={{ width: isCompact ? 80 : 108 }}
      >
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,0,0.5)_0%,transparent_70%)] opacity-30" />

        {/* Mascot strip — 4 mascots with slot-based positioning */}
        {agentIndices.map((agentIdx, pos) => {
          const slot = slotOrder[pos];
          const s = slots[slot];
          return (
            <div
              key={agentIdx}
              className="absolute"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                opacity: s.opacity,
                transition: `all ${SLIDE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
              }}
            >
              <Image
                src={AGENTS[agentIdx].image}
                alt={AGENTS[agentIdx].name}
                fill
                className="object-contain"
                sizes={`${s.size}px`}
              />
            </div>
          );
        })}

        {/* Fade top */}
        <div
          className="absolute left-0 right-0 top-0 z-10 bg-gradient-to-b from-[#121212] to-transparent"
          style={{ height: isCompact ? 15 : 24 }}
        />
        {/* Fade bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-[#121212] to-transparent"
          style={{ height: isCompact ? 15 : 24 }}
        />
      </div>

      {/* ── Text + action button ── */}
      <div
        className="flex flex-1 items-center"
        style={{
          gap: isCompact ? 16 : 24,
          paddingRight: isCompact ? 32 : 40,
        }}
      >
        <p
          className={`flex-1 font-['Roboto',sans-serif] leading-[1.36] tracking-[0.02em] text-[#e0e0e0] ${
            isCompact ? "text-[12px]" : "text-[16px]"
          }`}
          style={{
            minHeight: isCompact ? 33 : 44, // lock 2-line height to prevent layout shift
            opacity: textVisible ? 1 : 0,
            transition: "opacity 300ms ease",
          }}
        >
          <span>{taskText.slice(0, typedCount)}</span>
          {phase === "typing" && (
            <span className="animate-blink ml-[1px] inline-block h-[14px] w-[1.5px] translate-y-[2px] bg-[#FFCC00]" />
          )}
        </p>

        {/* Arrow-up button (↑) */}
        <div
          className="flex shrink-0 items-center justify-center rounded-[4px] border border-[#404040] bg-[#1A1A1A]"
          style={{
            width: isCompact ? 40 : 56,
            height: isCompact ? 40 : 56,
          }}
        >
          <svg
            width={isCompact ? 14 : 24}
            height={isCompact ? 14 : 24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 19V5M5 12L12 5L19 12"
              stroke="#939393"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
