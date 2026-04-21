"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  FileText,
  Users,
  MessageSquareQuote,
  Newspaper,
  Briefcase,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@rocketmind/ui";
import { useAuth } from "@/lib/auth-context";
import { useNavigationGuard } from "@/lib/navigation-guard";
import { useAdminStore } from "@/lib/store";
import { ADMIN_SECTIONS } from "@/lib/constants";

/** Sections that have their own top-level route instead of living under /pages. */
const STANDALONE_SECTION_ROUTES: Record<string, string> = {
  cases: "/cases",
  media: "/media",
};

export function AdminHeader() {
  const { logout } = useAuth();
  const pathname = usePathname();
  const { tryNavigate } = useNavigationGuard();
  const { getPage } = useAdminStore();

  // Detect page editor: /pages/{encodedPageId}
  const pageMatch = pathname.match(/^\/pages\/(.+)$/);
  const editingPage = pageMatch
    ? getPage(decodeURIComponent(pageMatch[1]))
    : null;
  const editingSection = editingPage
    ? ADMIN_SECTIONS.find((s) => s.id === editingPage.sectionId)
    : null;
  const standaloneRoute = editingSection
    ? STANDALONE_SECTION_ROUTES[editingSection.id]
    : undefined;

  const isOnPages = pathname.startsWith("/pages");
  const isOnMedia = pathname.startsWith("/media");
  const isOnExperts = pathname.startsWith("/experts");
  const isOnCases = pathname.startsWith("/cases");
  const isOnTestimonials = pathname.startsWith("/testimonials");

  function guardedClick(e: React.MouseEvent, href: string) {
    if (!tryNavigate(href)) e.preventDefault();
  }

  const linkBase =
    "rounded-sm px-2.5 py-1 text-[length:var(--text-12)] font-medium transition-colors";
  const linkIdle = "text-muted-foreground hover:text-foreground";
  const linkActive = "bg-foreground/10 text-foreground";

  const tabs = [
    { href: "/pages", label: "Страницы", Icon: FileText, isActive: isOnPages },
    { href: "/media", label: "Медиа", Icon: Newspaper, isActive: isOnMedia },
    { href: "/experts", label: "Эксперты", Icon: Users, isActive: isOnExperts },
    { href: "/cases", label: "Кейсы", Icon: Briefcase, isActive: isOnCases },
    { href: "/testimonials", label: "Отзывы", Icon: MessageSquareQuote, isActive: isOnTestimonials },
  ];

  const separator = (
    <span className="px-0.5 text-[length:var(--text-12)] text-muted-foreground/40 select-none">
      /
    </span>
  );

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-foreground">
            <FileText className="h-3 w-3 text-background" />
          </div>
          <span className="text-[length:var(--text-14)] font-semibold text-foreground">
            CMS
          </span>
        </div>

        <nav className="flex items-center gap-1">
          {tabs.map((tab) => {
            const showBreadcrumb = editingPage && tab.isActive;
            if (showBreadcrumb) {
              return (
                <div key={tab.href} className="mr-2 flex items-center">
                  <Link
                    href={tab.href}
                    onClick={(e) => guardedClick(e, tab.href)}
                    className={`flex items-center gap-1.5 ${linkBase} ${linkIdle}`}
                  >
                    <tab.Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </Link>
                  {editingSection && !standaloneRoute && (
                    <>
                      {separator}
                      <Link
                        href={`/pages?section=${editingSection.id}`}
                        onClick={(e) =>
                          guardedClick(e, `/pages?section=${editingSection.id}`)
                        }
                        className={`${linkBase} ${linkIdle}`}
                      >
                        {editingSection.label}
                      </Link>
                    </>
                  )}
                  {separator}
                  <span className={`${linkBase} ${linkActive}`}>
                    {editingPage.menuTitle}
                  </span>
                </div>
              );
            }
            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={(e) => guardedClick(e, tab.href)}
                className={`flex items-center gap-1.5 ${linkBase} ${tab.isActive ? linkActive : linkIdle}`}
              >
                <tab.Icon className="h-3.5 w-3.5" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <ThemeSwitch />
        <Button
          variant="ghost"
          size="xs"
          className="gap-1.5 text-muted-foreground"
          onClick={logout}
        >
          <LogOut className="h-3.5 w-3.5" />
          Выйти
        </Button>
      </div>
    </header>
  );
}

/* ── Theme toggle ────────────────────────────────────────────────────────────── */

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-6 w-11 shrink-0 items-center rounded-full border border-border bg-rm-gray-1 transition-colors cursor-pointer"
      aria-label={isDark ? "Светлая тема" : "Тёмная тема"}
    >
      <span
        className="absolute flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-200"
        style={{ transform: isDark ? "translateX(22px)" : "translateX(4px)" }}
      >
        {isDark ? <Moon className="h-2.5 w-2.5" /> : <Sun className="h-2.5 w-2.5" />}
      </span>
    </button>
  );
}
