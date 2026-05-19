"use client";

import React, { useState, useRef, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  ChevronRight,
  PanelLeftOpen,
  PanelLeftClose,
  LogOut,
  Sun,
  Moon,
  UserCircle,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

/** Compact rail width (px) — icon-only column always visible */
const RAIL_W = 48;
/** Full sidebar width (px) — on hover-overlay or pinned */
const FULL_W = 220;

export interface AdminShellSubSection {
  id: string;
  label: string;
}

export interface AdminShellSection {
  id: string;
  href: string;
  label: string;
  Icon: LucideIcon;
  subsections?: AdminShellSubSection[];
  /** External link (renders with external icon, opens via href without client-side routing) */
  external?: boolean;
  /**
   * Заголовок группы, выводится ВЫШЕ этой секции — мелким моноширинным
   * capslock'ом + горизонтальная линия. Используется чтобы отделить
   * cross-link группу от локальных разделов («saas» / «site»).
   */
  groupHeader?: string;
}

export interface AdminShellUser {
  firstName: string;
  lastName: string;
}

export interface AdminSidebarProps {
  /** Brand label shown in top bar (e.g. "CMS") */
  brand: string;
  /**
   * Secondary tag next to brand — показывает в какой именно админке
   * пользователь сейчас находится (например "site" / "saas"). Рендерится
   * мелким muted-шрифтом.
   */
  brandTag?: string;
  /** Path to icon for dark-background (light icon) */
  iconDarkPath: string;
  /** Path to icon for light-background (dark icon) */
  iconLightPath: string;
  /** Navigation sections (already permission-filtered) */
  sections: AdminShellSection[];
  /** Current pathname (pass from `usePathname()`) */
  pathname: string;
  /** Authenticated user, or null while loading */
  user: AdminShellUser | null;
  /** Logout callback */
  onLogout: () => void;
  /** Guard navigation (return false to cancel). Optional. */
  tryNavigate?: (href: string) => boolean;
  /** Key used to persist pinned state in localStorage */
  pinKey?: string;
}

export function AdminSidebar({
  brand,
  brandTag,
  iconDarkPath,
  iconLightPath,
  sections,
  pathname,
  user,
  onLogout,
  tryNavigate,
  pinKey = "admin-sidebar-pinned",
}: AdminSidebarProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* ── Sidebar rail / overlay / pinned state ── */
  const [pinned, setPinned] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isExpanded = pinned || sidebarOpen;
  const sidebarW = isExpanded ? FULL_W : RAIL_W;

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(pinKey) === "true") {
      setPinned(true);
    }
  }, [pinKey]);

  const togglePinned = () => {
    const next = !pinned;
    setPinned(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(pinKey, String(next));
    }
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
  const activeSection = sections.find((s) => !s.external && pathname.startsWith(s.href));
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

  function guardedClick(e: React.MouseEvent, href: string, external?: boolean) {
    if (external) return; // let browser handle external link
    if (tryNavigate && !tryNavigate(href)) e.preventDefault();
  }

  return (
    <aside
      className="relative shrink-0 h-full bg-background border-r border-border overflow-hidden transition-[width] duration-200 ease-out"
      style={{ width: sidebarW }}
      onMouseEnter={onSidebarEnter}
      onMouseLeave={onSidebarLeave}
    >
      <div className="relative w-[220px] h-full flex flex-col">
        {/* ── Brand row: logo + label + pin toggle ── */}
        <div className="shrink-0 flex items-center border-b border-border" style={{ height: 48 }}>
          <div
            className="shrink-0 flex items-center justify-center"
            style={{ width: RAIL_W }}
          >
            <img
              src={iconDarkPath}
              alt={brand}
              className="h-6 w-6 hidden dark:block"
            />
            <img
              src={iconLightPath}
              alt={brand}
              className="h-6 w-6 dark:hidden"
            />
          </div>
          <span className="flex-1 min-w-0 flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="text-[length:var(--text-14)] font-semibold text-foreground">
              {brand}
            </span>
            {brandTag && (
              <span className="text-[length:var(--text-14)] font-semibold uppercase text-muted-foreground">
                {brandTag}
              </span>
            )}
          </span>
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
            {/* Yellow position indicator */}
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
              const hasSubs = !!s.subsections && s.subsections.length > 0;
              const { Icon } = s;
              const LinkComponent = s.external ? "a" : Link;

              return (
                <div key={s.id}>
                  {s.groupHeader && (
                    <div className="mt-3">
                      <div className="border-t border-border" aria-hidden />
                      <div className="pt-2 pb-1 pl-3">
                        <span className="text-[length:var(--text-10)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground/70 whitespace-nowrap">
                          {s.groupHeader}
                        </span>
                      </div>
                    </div>
                  )}
                  <div
                    className="flex items-center"
                    style={{ height: 34 }}
                    ref={(el) => {
                      if (el) triggerRefs.current.set(s.id, el);
                      else triggerRefs.current.delete(s.id);
                    }}
                  >
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

                    <LinkComponent
                      href={s.href}
                      onClick={(e: React.MouseEvent) => guardedClick(e, s.href, s.external)}
                      className={`flex-1 min-w-0 flex items-center gap-1 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider whitespace-nowrap transition-colors ${
                        isActive
                          ? "text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>{s.label}</span>
                      {s.external && (
                        <ExternalLink
                          size={10}
                          className="shrink-0 opacity-60"
                          aria-hidden
                        />
                      )}
                    </LinkComponent>
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

                  {hasSubs && (
                    <div className={`sidebar-subnav${isOpen ? " is-open" : ""}`}>
                      <div
                        className="sidebar-subnav-inner"
                        ref={(el) => {
                          if (el) subnavInnerRefs.current.set(s.id, el);
                          else subnavInnerRefs.current.delete(s.id);
                        }}
                      >
                        {s.subsections!.map((sub) => (
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
              {user ? `${user.firstName} ${user.lastName}` : "Мой профиль"}
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
            onClick={onLogout}
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

export interface AdminShellProps {
  brand: string;
  brandTag?: string;
  iconDarkPath: string;
  iconLightPath: string;
  sections: AdminShellSection[];
  pathname: string;
  user: AdminShellUser | null;
  onLogout: () => void;
  tryNavigate?: (href: string) => boolean;
  pinKey?: string;
  children: ReactNode;
}

export function AdminShell({ children, ...sidebarProps }: AdminShellProps) {
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar {...sidebarProps} />
        <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
