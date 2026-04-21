"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";

import { cn } from "../../lib/utils";
import { HEADER_NAV, type NavSection } from "../../content/site-nav";

type AccordionState = Record<string, boolean>;

type Origin = {
  cx: number;
  cy: number;
  top: number;
  right: number;
};

/** Animated 2-bar hamburger ↔ X. */
function BurgerIcon({
  open,
  barClass = "bg-foreground",
}: {
  open: boolean;
  barClass?: string;
}) {
  const bar = cn(
    "absolute left-0 block h-[2px] w-full rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
    barClass,
  );
  return (
    <div className="relative h-[10px] w-[40px]">
      <span className={cn(bar, open ? "top-[4px] rotate-45" : "top-0")} />
      <span className={cn(bar, open ? "top-[4px] -rotate-45" : "top-[8px]")} />
    </div>
  );
}

export function MobileNav({
  className,
  nav,
}: {
  className?: string;
  /** Navigation tree. Falls back to the hardcoded HEADER_NAV when omitted. */
  nav?: NavSection[];
}) {
  const navItems = nav ?? HEADER_NAV;
  const [isOpen, setIsOpen] = useState(false);
  const [accordions, setAccordions] = useState<AccordionState>({});
  const [mounted, setMounted] = useState(false);
  const [origin, setOrigin] = useState<Origin | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const open = useCallback(() => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setOrigin({
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
        top: r.top,
        right: window.innerWidth - r.right,
      });
    }
    setAccordions({});
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, []);

  const toggleAccordion = useCallback((label: string) => {
    setAccordions((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* Escape key */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  const cx = origin?.cx ?? (typeof window !== "undefined" ? window.innerWidth - 28 : 360);
  const cy = origin?.cy ?? 28;
  const clipOrigin = `${cx}px ${cy}px`;

  const overlay = mounted
    ? createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-nav-circle"
              initial={{ clipPath: `circle(0px at ${clipOrigin})` }}
              animate={{
                clipPath: `circle(2000px at ${clipOrigin})`,
                transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
              }}
              exit={{
                clipPath: `circle(0px at ${clipOrigin})`,
                transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
              }}
              className="fixed inset-0 z-[55] overflow-y-auto bg-white"
            >
              {origin && (
                <button
                  type="button"
                  onClick={close}
                  className="absolute flex h-7 w-10 items-center justify-center"
                  style={{ top: origin.top, right: origin.right }}
                  aria-label="Закрыть меню"
                >
                  <BurgerIcon open barClass="bg-black" />
                </button>
              )}

              <nav
                className="flex flex-col px-5 pb-16 pt-28 md:px-24"
                aria-label="Мобильная навигация"
              >
                <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.1em] text-black/30">
                  Navigation
                </p>

                {navItems.map((item, index) => {
                  const hasDropdown = item.items && item.items.length > 0;
                  const isExpanded = accordions[item.label] ?? false;

                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.25 + index * 0.07,
                        duration: 0.5,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                      className="border-b border-black/10"
                    >
                      {hasDropdown ? (
                        <>
                          <button
                            type="button"
                            onClick={() => toggleAccordion(item.label)}
                            className="flex w-full items-center justify-between gap-4 py-5 font-mono text-[22px] font-light uppercase leading-[1.16] tracking-[0.02em] text-black"
                            aria-expanded={isExpanded}
                          >
                            <span>{item.label}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="7"
                              viewBox="0 0 10 6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={cn(
                                "shrink-0 text-black/30 transition-transform duration-300",
                                isExpanded && "rotate-180",
                              )}
                            >
                              <path d="M1 1L5 5L9 1" />
                            </svg>
                          </button>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                                  opacity: { duration: 0.25 },
                                }}
                                className="overflow-hidden"
                              >
                                <div className="grid gap-0.5 pb-5">
                                  <Link
                                    href={item.href}
                                    onClick={close}
                                    className="rounded-sm px-3 py-3 transition-colors duration-150 hover:bg-black/5 border-b border-black/10 mb-1"
                                  >
                                    <span className="block font-mono text-[13px] uppercase tracking-[0.06em] text-black/50">
                                      Перейти к разделу
                                    </span>
                                  </Link>
                                  {item.items!.map((sub) => (
                                    <Link
                                      key={sub.href}
                                      href={sub.href}
                                      onClick={close}
                                      className="rounded-sm px-3 py-3 transition-colors duration-150 hover:bg-black/5"
                                    >
                                      <span className="block font-mono text-[13px] uppercase tracking-[0.06em] text-black">
                                        {sub.title}
                                      </span>
                                      <span className="mt-1 block text-[13px] leading-[1.45] text-black/50">
                                        {sub.description}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={close}
                          className="block py-5 font-mono text-[22px] font-light uppercase leading-[1.16] tracking-[0.02em] text-black"
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )
    : null;

  return (
    <div className={cn("hero-burger", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={isOpen ? close : open}
        className="relative z-[60] flex h-7 w-10 items-center justify-center"
        aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={isOpen}
      >
        <BurgerIcon open={isOpen} />
      </button>

      {overlay}
    </div>
  );
}
