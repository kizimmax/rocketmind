"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useTheme } from "next-themes";
import { UserCircle } from "lucide-react";
import { cn } from "@rocketmind/ui";
import { TeacherSidebar, type TeacherAgent } from "./teacher-sidebar";
import type { Student } from "@/lib/auth-context";

/** 2-bar animated burger — как в шапке сайта/акселератора. */
function BurgerIcon({ open }: { open: boolean }) {
  const bar =
    "absolute left-0 block h-[2px] w-full rounded-full bg-foreground transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]";
  return (
    <div className="relative h-[10px] w-[24px]">
      <span className={cn(bar, open ? "top-[4px] rotate-45" : "top-0")} />
      <span className={cn(bar, open ? "top-[4px] -rotate-45" : "top-[8px]")} />
    </div>
  );
}

interface TeacherMobileHeaderProps {
  student: Student;
  agents: TeacherAgent[];
  selectedAgentId: string | null;
  onSelectAgent: (id: string) => void;
  loading: boolean;
  /** Активный эксперт — показывается справа в шапке (breadcrumb). */
  selectedAgent: TeacherAgent | null;
}

/**
 * Мобильная шапка saas-teacher (lg:hidden). Бургер открывает TeacherSidebar
 * в drawer через портал — со свайпом-закрытием, как MobileHeader в apps/saas.
 */
export function TeacherMobileHeader({
  student,
  agents,
  selectedAgentId,
  onSelectAgent,
  loading,
  selectedAgent,
}: TeacherMobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setIsOpen(false), []);

  // Свайп-закрытие
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef({ startX: 0, startY: 0, dx: 0, swiping: false });

  const PANEL_W = 288; // w-72
  const SWIPE_THRESHOLD = 80;

  // Сброс inline-стилей при открытии, чтобы CSS-классы взяли управление чисто.
  useEffect(() => {
    if (isOpen) {
      if (panelRef.current) panelRef.current.style.transform = "";
      if (backdropRef.current) backdropRef.current.style.opacity = "";
    }
  }, [isOpen]);

  // Блокировка скролла body
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchRef.current = { startX: t.clientX, startY: t.clientY, dx: 0, swiping: false };
    if (panelRef.current) panelRef.current.style.transition = "none";
    if (backdropRef.current) backdropRef.current.style.transition = "none";
  }

  function onTouchMove(e: React.TouchEvent) {
    const t = e.touches[0];
    const ref = touchRef.current;
    const dx = t.clientX - ref.startX;
    const dy = t.clientY - ref.startY;

    if (!ref.swiping && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      ref.swiping = true;
    }
    if (!ref.swiping) return;

    ref.dx = Math.min(0, dx); // только свайп влево
    if (panelRef.current) panelRef.current.style.transform = `translateX(${ref.dx}px)`;
    if (backdropRef.current) {
      backdropRef.current.style.opacity = `${Math.max(0, 1 + ref.dx / PANEL_W)}`;
    }
  }

  function onTouchEnd() {
    const ref = touchRef.current;
    if (panelRef.current) panelRef.current.style.transition = "";
    if (backdropRef.current) backdropRef.current.style.transition = "";

    if (ref.swiping && ref.dx < -SWIPE_THRESHOLD) {
      if (panelRef.current) panelRef.current.style.transform = `translateX(-${PANEL_W}px)`;
      if (backdropRef.current) backdropRef.current.style.opacity = "0";
      setTimeout(() => {
        close();
        if (panelRef.current) panelRef.current.style.transform = "";
      }, 300);
    } else {
      if (panelRef.current) panelRef.current.style.transform = "";
      if (backdropRef.current) backdropRef.current.style.opacity = "";
    }
    touchRef.current = { startX: 0, startY: 0, dx: 0, swiping: false };
  }

  const bp = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const iconSrc =
    resolvedTheme === "dark"
      ? `${bp}/icon_dark_background.svg`
      : `${bp}/icon_light_background.svg`;

  const drawer = mounted
    ? createPortal(
        <div
          className={cn(
            "fixed inset-0 z-[60] transition-opacity duration-300 lg:hidden",
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
          )}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Backdrop */}
          <div
            ref={backdropRef}
            className="absolute inset-0 bg-black/50 transition-opacity duration-300"
            onClick={close}
          />

          {/* Панель сайдбара */}
          <div
            ref={panelRef}
            className={cn(
              "absolute left-0 top-0 h-full w-72 bg-background shadow-xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              isOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <TeacherSidebar
              student={student}
              agents={agents}
              selectedAgentId={selectedAgentId}
              onSelectAgent={onSelectAgent}
              loading={loading}
              onNavigate={close}
            />
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      {/* h-14 = 56px, только на мобиле */}
      <header className="flex lg:hidden h-14 shrink-0 items-center border-b border-border bg-background px-4">
        {/* Лого-иконка 32×32 */}
        <Image
          src={iconSrc}
          alt="Rocketmind"
          width={32}
          height={32}
          className="h-8 w-8 shrink-0"
          priority
        />

        {/* Бургер — 2 полоски, 40px тап-зона */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="relative ml-3 flex h-7 w-10 shrink-0 items-center justify-center"
          aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isOpen}
        >
          <BurgerIcon open={isOpen} />
        </button>

        {/* Активный эксперт — справа */}
        <div className="ml-3 flex min-w-0 flex-1 items-center justify-end gap-2">
          {selectedAgent ? (
            <>
              <div className="flex min-w-0 flex-col items-end">
                <span className="truncate text-[length:var(--text-12)] font-medium text-foreground">
                  {selectedAgent.name}
                </span>
                {selectedAgent.role && (
                  <span className="truncate text-[length:var(--text-10)] text-muted-foreground">
                    {selectedAgent.role}
                  </span>
                )}
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded bg-rm-gray-1/60">
                {selectedAgent.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={selectedAgent.avatarUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserCircle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </>
          ) : (
            <span className="truncate text-[length:var(--text-12)] text-muted-foreground">
              Выберите AI-эксперта
            </span>
          )}
        </div>
      </header>

      {drawer}
    </>
  );
}
