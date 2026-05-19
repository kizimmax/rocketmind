"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigationGuard } from "@/lib/navigation-guard";
import { useAdminStore } from "@/lib/store";
import { ADMIN_SECTIONS } from "@/lib/constants";

/** Sections that have their own top-level route instead of living under /pages. */
const STANDALONE_SECTION_ROUTES: Record<string, string> = {
  cases: "/cases",
  media: "/media",
};

export function AdminHeader() {
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

  // No header when not editing a page — nav lives in the sidebar.
  if (!editingPage) return null;

  function guardedClick(e: React.MouseEvent, href: string) {
    if (!tryNavigate(href)) e.preventDefault();
  }

  const linkBase =
    "rounded-sm px-2.5 py-1 text-[length:var(--text-12)] font-medium transition-colors";
  const linkIdle = "text-muted-foreground hover:text-foreground";
  const linkActive = "bg-foreground/10 text-foreground";

  const truncateLabel = (s: string, max = 24) =>
    s.length > max ? `${s.slice(0, max - 1)}…` : s;

  const separator = (
    <span className="px-0.5 text-[length:var(--text-12)] text-muted-foreground/40 select-none">
      /
    </span>
  );

  return (
    <header className="flex h-12 shrink-0 items-center border-b border-border bg-background px-6">
      <div className="flex items-center">
        <Link
          href="/pages"
          onClick={(e) => guardedClick(e, "/pages")}
          className={`${linkBase} ${linkIdle}`}
        >
          Страницы
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
              title={editingSection.label}
            >
              {truncateLabel(editingSection.label)}
            </Link>
          </>
        )}
        {separator}
        <span
          className={`${linkBase} ${linkActive}`}
          title={editingPage.menuTitle}
        >
          {truncateLabel(editingPage.menuTitle)}
        </span>
      </div>
    </header>
  );
}
