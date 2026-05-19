"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ChevronRight,
  PanelLeftOpen,
  PanelLeftClose,
  FileText,
  Newspaper,
  Users,
  Briefcase,
  MessageSquareQuote,
  MousePointerClick,
  Inbox,
  Bot,
  CalendarDays,
  Settings,
  ShieldCheck,
  ScrollText,
  ArrowLeftRight,
  LogOut,
  Sun,
  Moon,
  UserCircle,
} from "lucide-react";
import { useNavigationGuard } from "@/lib/navigation-guard";
import { useAuth } from "@/lib/auth-context";
import { isPathVisible } from "@/lib/permissions-client";

/** Compact rail width (px) — icon-only column always visible */
const RAIL_W = 48;
/** Full sidebar width (px) — on hover-overlay or pinned */
const FULL_W = 220;

type SubSection = { id: string; label: string };
type NavSection = {
  id: string;
  href: string;
  label: string;
  subsections: SubSection[];
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  /** Role-only gate. Empty/undefined = no role restriction. */
  rolesAllowed?: Array<"SUPER_ADMIN" | "ADMIN" | "EDITOR">;
  /**
   * Permission-tree path that grants this section. SUPER_ADMIN always passes.
   * Sections without `permissionPath` are role-gated only (or visible to all).
   */
  permissionPath?: string;
};

const allSections: NavSection[] = [
  { id: "pages", href: "/pages", label: "Страницы", Icon: FileText, subsections: [], permissionPath: "pages" },
  { id: "media", href: "/media", label: "Медиа", Icon: Newspaper, subsections: [], permissionPath: "media" },
  { id: "experts", href: "/experts", label: "Эксперты", Icon: Users, subsections: [], permissionPath: "experts" },
  { id: "cases", href: "/cases", label: "Кейсы", Icon: Briefcase, subsections: [], permissionPath: "cases" },
  { id: "testimonials", href: "/testimonials", label: "Отзывы", Icon: MessageSquareQuote, subsections: [], permissionPath: "testimonials" },
  { id: "cta-forms", href: "/cta-forms", label: "CTA и формы", Icon: MousePointerClick, subsections: [], permissionPath: "cta-forms" },
  { id: "submissions", href: "/submissions", label: "Заявки", Icon: Inbox, subsections: [], permissionPath: "submissions" },
  { id: "ai-agents", href: "/ai-agents", label: "AI-эксперты", Icon: Bot, subsections: [], permissionPath: "ai-agents" },
  { id: "programs", href: "/programs", label: "Программы", Icon: CalendarDays, subsections: [], permissionPath: "programs" },
  { id: "users", href: "/users", label: "Пользователи", Icon: ShieldCheck, subsections: [], rolesAllowed: ["SUPER_ADMIN", "ADMIN"] },
  { id: "audit-log", href: "/audit-log", label: "Аудит-лог", Icon: ScrollText, subsections: [], rolesAllowed: ["SUPER_ADMIN"] },
  { id: "system", href: "/system", label: "Системные", Icon: Settings, subsections: [], permissionPath: "system" },
  { id: "redirects", href: "/redirects", label: "Редиректы", Icon: ArrowLeftRight, subsections: [], permissionPath: "redirects" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { tryNavigate } = useNavigationGuard();
  const { logout, currentUser, permissions } = useAuth();
  const { theme, setTheme } = useTheme();
  const role = currentUser?.role;
  const sections = allSections.filter((s) => {
    if (s.rolesAllowed && !(role && s.rolesAllowed.includes(role))) return false;
    if (s.permissionPath && !isPathVisible(role, permissions, s.permissionPath)) return false;
    return true;
  });
  const isDark = theme === "dark";
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* ── Sidebar rail / overlay / pinned state ── */
  const [pinned, setPinned] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isExpanded = pinned || sidebarOpen;
  const sidebarW = isExpanded ? FULL_W : RAIL_W;

  useEffect(() => {
    if (localStorage.getItem("cms-sidebar-pinned") === "true") setPinned(true);
  }, []);

  const togglePinned = () => {
    const next = !pinned;
    setPinned(next);
    localStorage.setItem("cms-sidebar-pinned", String(next));
    if (next) setSidebarOpen(false);
  };

  const onSidebarEnter = () => {
    if (pinned) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setSidebarOpen(true);
  };
  const onSidebarLeave = () => {
    if (pinned) return;
    hoverTimer.current = setTimeout(() => setSidebarOpen(false), 150);
  };

  /* ── Active section from URL ── */
  const activeSection = sections.find((s) => pathname.startsWith(s.href));
  const activeId = activeSection?.id ?? "";

  useEffect(() => {
    if (activeId) setExpandedId(activeId);
  }, [activeId]);

  /* ── Yellow indicator — exact px coords relative to <nav> ── */
  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const subnavInnerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [indicator, setIndicator] = useState({ top: 0, height: 0, visible: false });

  useEffect(() => {
    const measure = () => {
      const trigger = triggerRefs.current.get(activeId);
      if (!trigger) {
        setIndicator((p) => ({ ...p, visible: false }));
        return;
      }
      const isOpen = expandedId === activeId;
      const inner = subnavInnerRefs.current.get(activeId);
      const subnavH = isOpen && inner ? inner.scrollHeight : 0;
      setIndicator({
        top: trigger.offsetTop,
        height: trigger.offsetHeight + subnavH,
        visible: true,
      });
    };
    measure();
    const t = setTimeout(measure, 310);
    return () => clearTimeout(t);
  }, [activeId, expandedId]);

  function guardedClick(e: React.MouseEvent, href: string) {
    if (!tryNavigate(href)) e.preventDefault();
  }

  return (
    <aside
      className="relative shrink-0 h-full bg-background border-r border-border overflow-hidden transition-[width] duration-200 ease-out"
      style={{ width: sidebarW }}
      onMouseEnter={onSidebarEnter}
      onMouseLeave={onSidebarLeave}
    >
      {/* Inner nav — always 220px wide; clips horizontally inside aside */}
      <div className="relative w-[220px] h-full flex flex-col">
        {/* ── Brand row: logo + CMS title + pin toggle ── */}
        <div className="shrink-0 flex items-center border-b border-border" style={{ height: 48 }}>
          {/* Icon zone: square logo */}
          <div
            className="shrink-0 flex items-center justify-center"
            style={{ width: RAIL_W }}
          >
            {/* Dark theme → background is dark → use light icon */}
            <img
              src="/icon_dark_background.svg"
              alt="Rocketmind"
              className="h-6 w-6 hidden dark:block"
            />
            <img
              src="/icon_light_background.svg"
              alt="Rocketmind"
              className="h-6 w-6 dark:hidden"
            />
          </div>
          {/* CMS label — visible only when expanded */}
          <span className="flex-1 min-w-0 text-[length:var(--text-14)] font-semibold text-foreground whitespace-nowrap">
            CMS
          </span>
          {/* Pin/unpin — visible only when expanded */}
          <button
            onClick={togglePinned}
            title={pinned ? "Открепить меню" : "Закрепить меню"}
            className={`shrink-0 flex items-center justify-center text-muted-foreground hover:text-foreground transition-opacity duration-150 cursor-pointer ${
              isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{ width: 40, height: 40 }}
            aria-label={pinned ? "Открепить меню" : "Закрепить меню"}
          >
            {pinned ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
          </button>
        </div>

        {/* Scrollable nav list */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
          <nav ref={navRef} className="relative">
            {/* Yellow position indicator — px coords inside nav */}
            <div
              className="absolute pointer-events-none z-10 transition-[left] duration-200 ease-out"
              style={{ left: sidebarW - 4, width: 4, top: 0, bottom: 0 }}
              aria-hidden
            >
              <div
                className="sidebar-indicator absolute inset-x-0 bg-[var(--rm-yellow-100)]"
                style={{
                  top: indicator.top,
                  height: indicator.height,
                  opacity: indicator.visible ? 1 : 0,
                }}
              />
            </div>

            {sections.map((s) => {
              const isActive = activeId === s.id;
              const isOpen = expandedId === s.id;
              const hasSubs = s.subsections.length > 0;
              const { Icon } = s;

              return (
                <div key={s.id}>
                  {/* ── Section trigger row ── */}
                  <div
                    className="flex items-center"
                    style={{ height: 34 }}
                    ref={(el) => {
                      if (el) triggerRefs.current.set(s.id, el);
                      else triggerRefs.current.delete(s.id);
                    }}
                  >
                    {/* Icon zone: w = RAIL_W */}
                    <div
                      className="shrink-0 flex items-center justify-center"
                      style={{ width: RAIL_W }}
                    >
                      <Icon
                        size={15}
                        className={
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }
                      />
                    </div>

                    {/* Label — revealed when sidebar expands */}
                    <Link
                      href={s.href}
                      onClick={(e) => guardedClick(e, s.href)}
                      className={`flex-1 min-w-0 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider whitespace-nowrap transition-colors ${
                        isActive
                          ? "text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s.label}
                    </Link>
                    {hasSubs && (
                      <button
                        onClick={() => setExpandedId(isOpen ? null : s.id)}
                        className="shrink-0 w-6 self-stretch flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        aria-label={isOpen ? "Скрыть подразделы" : "Показать подразделы"}
                      >
                        <ChevronRight
                          size={12}
                          className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  {/* ── Subsection rows (accordion) ── */}
                  {hasSubs && (
                    <div className={`sidebar-subnav${isOpen ? " is-open" : ""}`}>
                      <div
                        className="sidebar-subnav-inner"
                        ref={(el) => {
                          if (el) subnavInnerRefs.current.set(s.id, el);
                          else subnavInnerRefs.current.delete(s.id);
                        }}
                      >
                        {s.subsections.map((sub) => (
                          <a
                            key={sub.id}
                            href={`${s.href}#${sub.id}`}
                            className="flex items-center"
                            style={{ height: 26 }}
                          >
                            <div
                              className="shrink-0 flex items-center justify-center"
                              style={{ width: RAIL_W }}
                            >
                              <span className="text-[9px] font-[family-name:var(--font-mono-family)] text-muted-foreground/40 uppercase tracking-wider select-none">
                                {sub.label.slice(0, 2)}
                              </span>
                            </div>
                            <span className="flex-1 min-w-0 text-[length:var(--text-12)] text-muted-foreground hover:text-foreground transition-colors font-[family-name:var(--font-mono-family)] uppercase tracking-wider whitespace-nowrap opacity-80 pr-2">
                              {sub.label}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* ── Footer: profile + theme + logout ── */}
        <div className="shrink-0 border-t border-border">
          <Link
            href="/profile"
            onClick={(e) => guardedClick(e, "/profile")}
            className="w-full flex items-center hover:bg-rm-gray-2/50 transition-colors cursor-pointer"
            style={{ height: 40 }}
            aria-label="Мой профиль"
          >
            <div
              className="shrink-0 flex items-center justify-center text-muted-foreground"
              style={{ width: RAIL_W }}
            >
              <UserCircle size={15} />
            </div>
            <span className="flex-1 min-w-0 text-left text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider whitespace-nowrap text-muted-foreground truncate pr-2">
              {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Мой профиль"}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="w-full flex items-center hover:bg-rm-gray-2/50 transition-colors cursor-pointer"
            style={{ height: 40 }}
            aria-label={isDark ? "Светлая тема" : "Тёмная тема"}
          >
            <div
              className="shrink-0 flex items-center justify-center text-muted-foreground"
              style={{ width: RAIL_W }}
            >
              {isDark ? <Moon size={15} /> : <Sun size={15} />}
            </div>
            <span className="flex-1 min-w-0 text-left text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider whitespace-nowrap text-muted-foreground">
              {isDark ? "Тёмная тема" : "Светлая тема"}
            </span>
          </button>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center hover:bg-rm-gray-2/50 transition-colors cursor-pointer"
            style={{ height: 40 }}
            aria-label="Выйти"
          >
            <div
              className="shrink-0 flex items-center justify-center text-muted-foreground"
              style={{ width: RAIL_W }}
            >
              <LogOut size={15} />
            </div>
            <span className="flex-1 min-w-0 text-left text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider whitespace-nowrap text-muted-foreground">
              Выйти
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
