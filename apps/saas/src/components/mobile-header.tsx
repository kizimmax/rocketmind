"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useParams, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import { Plus, Search, X } from "lucide-react";
import { useTheme } from "next-themes";
import { getMockCase, getMockCaseAgents } from "@/lib/mock-data";
import { Sidebar } from "./sidebar";
import { cn } from "@rocketmind/ui";
import { useRouter } from "next/navigation";

/** 2-bar animated burger — matches site header style */
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

/** Case name / Agent name breadcrumb */
function Breadcrumb({
  caseId,
  agentId,
}: {
  caseId?: string;
  agentId?: string;
}) {
  if (!caseId) return null;

  const caseItem = getMockCase(caseId);
  const agents = getMockCaseAgents(caseId);
  const agent = agentId ? agents.find((a) => a.id === agentId) : null;

  return (
    <div className="flex min-w-0 items-baseline gap-1.5">
      {/* Case name — truncates */}
      <span className="min-w-0 shrink truncate text-[length:var(--text-14)] text-muted-foreground">
        {caseItem?.name ?? "Кейс"}
      </span>
      {agent && (
        <>
          <span className="shrink-0 text-[length:var(--text-14)] text-muted-foreground/40">
            /
          </span>
          {/* Agent name — never truncates */}
          <span className="shrink-0 text-[length:var(--text-14)] font-medium text-foreground">
            {agent.name}
          </span>
        </>
      )}
    </div>
  );
}

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  const caseId = params?.id as string | undefined;
  const agentId = searchParams?.get("agent") ?? undefined;
  const isAgentsPage = pathname === "/agents";

  useEffect(() => setMounted(true), []);

  // Reset search when navigating away from agents page
  useEffect(() => {
    if (!isAgentsPage) setAgentSearch("");
  }, [isAgentsPage]);

  // Emit search value to agents page via custom event
  useEffect(() => {
    if (isAgentsPage) {
      window.dispatchEvent(new CustomEvent("agents-search", { detail: agentSearch }));
    }
  }, [agentSearch, isAgentsPage]);

  const close = useCallback(() => setIsOpen(false), []);

  // Clear residual inline styles when drawer opens so CSS classes take over cleanly
  useEffect(() => {
    if (isOpen) {
      if (panelRef.current) panelRef.current.style.transform = "";
      if (backdropRef.current) backdropRef.current.style.opacity = "";
    }
  }, [isOpen]);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* Escape key */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  /* Swipe-to-close */
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef({ startX: 0, startY: 0, dx: 0, swiping: false });

  const PANEL_W = 312;
  const SWIPE_THRESHOLD = 80;

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchRef.current = { startX: t.clientX, startY: t.clientY, dx: 0, swiping: false };
    // Disable CSS transition during drag
    if (panelRef.current) panelRef.current.style.transition = "none";
    if (backdropRef.current) backdropRef.current.style.transition = "none";
  }

  function onTouchMove(e: React.TouchEvent) {
    const t = e.touches[0];
    const ref = touchRef.current;
    const dx = t.clientX - ref.startX;
    const dy = t.clientY - ref.startY;

    // Lock direction on first significant movement
    if (!ref.swiping && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      ref.swiping = true;
    }
    if (!ref.swiping) return;

    ref.dx = Math.min(0, dx); // only allow left swipe
    if (panelRef.current) {
      panelRef.current.style.transform = `translateX(${ref.dx}px)`;
    }
    if (backdropRef.current) {
      backdropRef.current.style.opacity = `${Math.max(0, 1 + ref.dx / PANEL_W)}`;
    }
  }

  function onTouchEnd() {
    const ref = touchRef.current;
    // Restore CSS transitions
    if (panelRef.current) panelRef.current.style.transition = "";
    if (backdropRef.current) backdropRef.current.style.transition = "";

    if (ref.swiping && ref.dx < -SWIPE_THRESHOLD) {
      // Animate fully off-screen, then close and clear inline styles
      if (panelRef.current) panelRef.current.style.transform = `translateX(-${PANEL_W}px)`;
      if (backdropRef.current) backdropRef.current.style.opacity = "0";
      setTimeout(() => {
        close();
        // backdrop opacity cleared in useEffect(isOpen) to avoid flash
        if (panelRef.current) panelRef.current.style.transform = "";
      }, 300);
    } else {
      // Snap back
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
            "fixed inset-0 z-[60] transition-opacity duration-300",
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

          {/* Sidebar panel */}
          <div
            ref={panelRef}
            className={cn(
              "absolute left-0 top-0 h-full w-[312px] bg-background shadow-xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              isOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <Sidebar onNavigate={close} />
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      {/* h-14 = 56px, only on mobile */}
      <header className="flex lg:hidden h-14 shrink-0 items-center border-b border-border bg-background px-4">

        {/* Icon logo — 32×32px */}
        <Image
          src={iconSrc}
          alt="Rocketmind"
          width={32}
          height={32}
          className="h-8 w-8 shrink-0"
          priority
        />

        {/* Burger — 2 bars, 40px tap area */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="relative ml-3 flex h-7 w-10 shrink-0 items-center justify-center"
          aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isOpen}
        >
          <BurgerIcon open={isOpen} />
        </button>

        {isAgentsPage ? (
          /* Search input — agents catalog page */
          <div className="ml-3 flex flex-1 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Поиск по агентам..."
                value={agentSearch}
                onChange={(e) => setAgentSearch(e.target.value)}
                className="h-8 w-full rounded-sm border border-border bg-rm-gray-1 pl-8 pr-8 text-[length:var(--text-14)] text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-ring transition-colors"
              />
              {agentSearch && (
                <button
                  type="button"
                  onClick={() => setAgentSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label="Очистить поиск"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Breadcrumb — flex-1, min-w-0 for truncation */}
            <div className="ml-3 flex flex-1 items-center overflow-hidden">
              <Breadcrumb caseId={caseId} agentId={agentId} />
            </div>

            {/* + new agent — only when on case page WITHOUT agent selected */}
            {caseId && !agentId && (
              <button
                type="button"
                onClick={() => router.push(`/agents?caseId=${caseId}`)}
                className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground transition-colors"
                aria-label="Добавить агента"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </>
        )}
      </header>

      {drawer}
    </>
  );
}
