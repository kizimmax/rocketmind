"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

const GREETING = "Я Алекс, могу быстро направить для решение вашей ситуации";
const TYPING_SPEED = 30;
const GREETING_DELAY = 30_000;

interface FloatingMascotProps {
  onScrollToChat: () => void;
  hidden?: boolean;
}

export function FloatingMascot({ onScrollToChat, hidden }: FloatingMascotProps) {
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [greetingDone, setGreetingDone] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  // Reset bubble on page navigation, restart 30s timer
  useEffect(() => {
    setBubbleVisible(false);
    setDisplayedText("");
    setIsTyping(false);
    setGreetingDone(false);
    setDismissed(false);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setBubbleVisible(true);
      setIsTyping(true);
    }, GREETING_DELAY);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  // Typewriter effect
  useEffect(() => {
    if (!isTyping) return;
    indexRef.current = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current >= GREETING.length) {
        setDisplayedText(GREETING);
        setIsTyping(false);
        setGreetingDone(true);
        clearInterval(interval);
      } else {
        setDisplayedText(GREETING.slice(0, indexRef.current));
      }
    }, TYPING_SPEED);

    return () => clearInterval(interval);
  }, [isTyping]);

  const handleClick = useCallback(() => {
    onScrollToChat();
  }, [onScrollToChat]);

  const handleDismiss = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setBubbleVisible(false);
    setDismissed(true);
  }, []);

  const showBubble = !dismissed && (bubbleVisible || isHovered);

  // Figma layout: 311×102
  // Mascot: 56×56 at (255, 46) — bottom-right
  // Bubble: 265×56 at (0, 0) — top-left
  // From right edge of frame: mascot flush right (311-255-56=0)
  // Bubble right edge at x:265, mascot left at x:255 → 10px overlap
  // Bubble bottom at y:56, mascot top at y:46 → no vertical gap (10px overlap)

  return (
    <div
      data-floating-mascot
      className="fixed bottom-0 right-0 z-50 h-[102px] w-[311px] transition-opacity duration-500"
      style={{
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setDismissed(false); }}
    >
      {/* Chat bubble — 265×56, top-left of frame, border-radius 4px */}
      <div
        className="absolute left-0 top-0 flex h-14 w-[265px] cursor-pointer items-center rounded-sm border border-border px-3 pr-7 text-left text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-muted-foreground transition-opacity duration-300"
        style={{
          background: "#121212",
          opacity: showBubble ? 1 : 0,
          pointerEvents: showBubble ? "auto" : "none",
        }}
        onClick={handleDismiss}
      >
        <button
          type="button"
          className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-sm text-muted-foreground/40 transition-colors hover:text-muted-foreground"
          onClick={handleDismiss}
        >
          <X className="h-3 w-3" />
        </button>
        <span>
          {isHovered && !bubbleVisible ? GREETING : displayedText}
          {isTyping && (
            <span className="ml-0.5 inline-block h-[1em] w-[2px] bg-muted-foreground align-text-bottom animate-blink" />
          )}
        </span>
      </div>

      {/* Mascot — 56×56 at bottom-right of frame */}
      <button
        type="button"
        onClick={handleClick}
        className="absolute bottom-0 right-0 flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden"
        aria-label="Открыть чат с консультантом"
      >
        {/* White radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 71%)",
          }}
        />
        <Image
          src={`${BASE_PATH}/ai-mascots/alex/alex_base.png`}
          alt="Алекс"
          width={56}
          height={56}
          className="relative h-[57px] w-[57px] object-contain"
        />
      </button>
    </div>
  );
}
