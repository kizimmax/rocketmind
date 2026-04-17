"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

export type HeroExpert = {
  name: string;
  tag?: string;
  image: string | null;
};

export type HeroExpertsProps = {
  experts: HeroExpert[];
  /** Optional quote shown below the expert block */
  quote?: string;
  /** Max avatars before collapsing the rest into a "+N" counter. Default: 20 */
  maxVisible?: number;
  className?: string;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const AVATAR_SIZE = 80;
const AVATAR_OVERLAP = 16; // -ml-4 = 16px
const EFFECTIVE_WIDTH = AVATAR_SIZE - AVATAR_OVERLAP; // 64px per avatar after first

/** Duration (ms) of tooltip collapse before the next one appears */
const COLLAPSE_MS = 180;

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({
  expert,
  overlap = false,
  lifted = false,
  zIndex,
  onHover,
  onLeave,
}: {
  expert: HeroExpert;
  overlap?: boolean;
  lifted?: boolean;
  zIndex?: number;
  onHover?: () => void;
  onLeave?: () => void;
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onHover}
      className={`relative shrink-0 rounded-full border border-[#0A0A0A] bg-[#2a2a2a] bg-cover bg-center cursor-pointer transition-transform duration-200 ease-out ${
        overlap ? "-ml-4 first:ml-0" : ""
      } ${lifted ? "-translate-y-2.5" : ""}`}
      style={{
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        zIndex,
        backgroundImage: expert.image ? `url(${expert.image})` : undefined,
      }}
      aria-label={expert.name}
    >
      {!expert.image && (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] font-bold text-[#F0F0F0]">
            {expert.name.slice(0, 1)}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Counter circle ("+N") ─────────────────────────────────────────────────────


// ── Single-expert variant ─────────────────────────────────────────────────────

function SingleExpert({ expert, quote }: { expert: HeroExpert; quote?: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div
          className="relative shrink-0 rounded-full border border-[#0A0A0A] bg-[#2a2a2a] bg-cover bg-center"
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            backgroundImage: expert.image ? `url(${expert.image})` : undefined,
          }}
        >
          {!expert.image && (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] font-bold text-[#F0F0F0]">
                {expert.name.slice(0, 1)}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-1">
          <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase leading-[1.16] tracking-[-0.01em] text-[#F0F0F0]">
            {expert.name}
          </span>
          {expert.tag && (
            <span className="text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]">
              {expert.tag}
            </span>
          )}
        </div>
      </div>
      {quote && (
        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393]">
          {quote}
        </span>
      )}
    </div>
  );
}

// ── Multi-expert variant ───────────────────────────────────────────────────────
//
// Tooltip animation is sequenced:
//   1. First hover  → fade-in at avatar position
//   2. Switch avatar → fade-out (COLLAPSE_MS) → jump to new position → fade-in
//   3. Leave all    → fade-out
//
// React 18 batches mouseleave+mouseenter into one commit, so we can't rely on
// two separate renders for the collapse. A setTimeout separates the phases.

function MultiExperts({
  experts,
  quote,
  maxVisible,
}: {
  experts: HeroExpert[];
  quote?: string;
  maxVisible: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidthRef = useRef(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [dynamicMax, setDynamicMax] = useState(maxVisible);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // ── Tooltip state ──
  const [tipVisible, setTipVisible] = useState(false);
  const [tipLeft, setTipLeft] = useState(0);
  const [tipFlipped, setTipFlipped] = useState(false);
  const [tipContent, setTipContent] = useState<HeroExpert | null>(null);

  // pendingRef: next tooltip to show once collapse finishes
  const pendingRef = useRef<{ left: number; flipped: boolean; content: HeroExpert } | null>(null);
  // timerRef: the collapse delay timer (null when idle)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── ResizeObserver: recalculate visible count on width change ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      containerWidthRef.current = w;
      setContainerWidth(w);
      // N avatars total = AVATAR_SIZE + (N-1)*EFFECTIVE_WIDTH ≤ w
      const n = Math.max(1, Math.floor((w - AVATAR_OVERLAP) / EFFECTIVE_WIDTH));
      setDynamicMax(n);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Cleanup timer on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  // ── Derived avatar list ──
  const effectiveMax = Math.min(dynamicMax, maxVisible);
  const visible = experts.slice(0, effectiveMax);

  const computeLeft = useCallback(
    (i: number) => i * EFFECTIVE_WIDTH + AVATAR_SIZE / 2,
    [],
  );

  // Flip tooltip to the left when avatar is in the right half of the container
  const computeFlipped = useCallback(
    (left: number) => left > containerWidthRef.current / 2,
    [],
  );

  const showTip = (left: number, flipped: boolean, content: HeroExpert) => {
    setTipLeft(left);
    setTipFlipped(flipped);
    setTipContent(content);
    setTipVisible(true);
  };

  // ── Event handlers ──

  const handleHover = (index: number, expert: HeroExpert) => {
    setActiveIndex(index);
    const left = computeLeft(index);
    const flipped = computeFlipped(left);

    if (timerRef.current) {
      // Collapse already running — just update where we land
      pendingRef.current = { left, flipped, content: expert };
      return;
    }

    if (tipVisible) {
      // Tooltip is showing → collapse first, then show the new one
      pendingRef.current = { left, flipped, content: expert };
      setTipVisible(false);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        if (pendingRef.current) {
          const p = pendingRef.current;
          pendingRef.current = null;
          showTip(p.left, p.flipped, p.content);
        }
      }, COLLAPSE_MS);
    } else {
      // Nothing showing → appear directly
      showTip(left, flipped, expert);
    }
  };

  const handleLeave = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : prev));
    // Cancel any queued transition and hide immediately
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    pendingRef.current = null;
    setTipVisible(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full" ref={containerRef}>
        {/* ── Shared floating tooltip ──
            Two layers: outer snaps X-position (no transition),
            inner animates only Y + opacity so there's no horizontal slide. */}
        <div
          className="pointer-events-none absolute z-50 bottom-full mb-3"
          style={{
            left: tipLeft,
            transform: tipFlipped ? "translateX(-100%)" : "translateX(0)",
          }}
        >
          <div
            className={`w-max bg-[#121212] px-5 py-4 will-change-[opacity,transform] ${tipFlipped ? "border-r" : "border-l"} border-[#F0F0F0]`}
            style={{
              // Clamp to available space so tooltip never overflows the container edge
              maxWidth: containerWidth > 0
                ? Math.min(600, tipFlipped ? tipLeft : containerWidth - tipLeft)
                : 600,
              opacity: tipVisible ? 1 : 0,
              transform: tipVisible ? "translateY(0)" : "translateY(10px)",
              transition: `opacity ${COLLAPSE_MS}ms ease-out, transform ${COLLAPSE_MS}ms ease-out`,
            }}
          >
            {tipContent && (
              <div className="flex flex-col gap-1">
                <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase leading-[1.16] tracking-[-0.01em] text-[#F0F0F0]">
                  {tipContent.name}
                </span>
                {tipContent.tag && (
                  <span className="text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]">
                    {tipContent.tag}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Avatars ── */}
        <div className="flex items-center">
          {visible.map((expert, i) => (
            <Avatar
              key={`${expert.name}-${i}`}
              expert={expert}
              overlap={i > 0}
              lifted={activeIndex === i}
              zIndex={activeIndex === i ? visible.length + 10 : visible.length - i}
              onHover={() => handleHover(i, expert)}
              onLeave={() => handleLeave(i)}
            />
          ))}

        </div>
      </div>

      {quote && (
        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393]">
          {quote}
        </span>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function HeroExperts({
  experts,
  quote,
  maxVisible = 20,
  className,
}: HeroExpertsProps) {
  if (experts.length === 0) return null;

  return (
    <div className={className}>
      {experts.length === 1 ? (
        <SingleExpert expert={experts[0]} quote={quote} />
      ) : (
        <MultiExperts experts={experts} quote={quote} maxVisible={maxVisible} />
      )}
    </div>
  );
}
