"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import React from "react";
import type { SitePage, PageStatus } from "./types";
import { createSeedPages } from "./seed-data";

const LS_KEY = "rm_site_admin_pages";
const isStaticExport = process.env.NEXT_PUBLIC_STATIC === "1";

// ── localStorage helpers ────────────────────────────────────────────────────

function loadFromLS(): SitePage[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as SitePage[];
  } catch { /* ignore */ }
  const seed = createSeedPages();
  localStorage.setItem(LS_KEY, JSON.stringify(seed));
  return seed;
}

function saveToLS(pages: SitePage[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(pages));
}

// ── Context ─────────────────────────────────────────────────────────────────

interface StoreContext {
  pages: SitePage[];
  loading: boolean;
  getPagesBySection(sectionId: string): SitePage[];
  getPage(pageId: string): SitePage | undefined;
  createPage(sectionId: string, title: string): Promise<SitePage | null>;
  setPageStatus(pageId: string, status: PageStatus): void;
  deletePage(pageId: string): Promise<void>;
  savePage(page: SitePage): Promise<void>;
  reorderPages(sectionId: string, orderedIds: string[]): void;
  reload(): Promise<void>;
}

const AdminStoreContext = createContext<StoreContext | null>(null);

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = useCallback(async () => {
    if (isStaticExport) {
      setPages(loadFromLS());
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/pages");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPages(data as SitePage[]);
    } catch {
      // API not available — fallback to localStorage
      setPages(loadFromLS());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const getPagesBySection = useCallback(
    (sectionId: string) =>
      pages
        .filter((p) => p.sectionId === sectionId)
        .sort((a, b) => a.order - b.order),
    [pages]
  );

  const getPage = useCallback(
    (pageId: string) => pages.find((p) => p.id === pageId),
    [pages]
  );

  const createPage = useCallback(
    async (sectionId: string, title: string): Promise<SitePage | null> => {
      const slug = title
        .toLowerCase()
        .replace(/[^a-zа-яё0-9\s-]/gi, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 50);

      if (isStaticExport) {
        const now = new Date().toISOString();
        const page: SitePage = {
          id: `${sectionId}/${slug}`,
          sectionId,
          slug,
          status: "hidden",
          order: pages.filter((p) => p.sectionId === sectionId).length,
          menuTitle: title,
          menuDescription: "",
          cardTitle: title,
          cardDescription: "",
          metaTitle: `${title} — Rocketmind`,
          metaDescription: "",
          blocks: [],
          createdAt: now,
          updatedAt: now,
        };
        const next = [...pages, page];
        setPages(next);
        saveToLS(next);
        return page;
      }

      try {
        const res = await fetch("/api/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sectionId, slug, menuTitle: title }),
        });
        if (!res.ok) return null;
        const page = (await res.json()) as SitePage;
        setPages((prev) => [...prev, page]);
        return page;
      } catch {
        return null;
      }
    },
    [pages]
  );

  const setPageStatus = useCallback(
    (pageId: string, status: PageStatus) => {
      setPages((prev) => {
        const next = prev.map((p) => (p.id === pageId ? { ...p, status } : p));
        if (isStaticExport) saveToLS(next);
        return next;
      });
    },
    []
  );

  const deletePage = useCallback(async (pageId: string) => {
    if (isStaticExport) {
      setPages((prev) => {
        const next = prev.filter((p) => p.id !== pageId);
        saveToLS(next);
        return next;
      });
      return;
    }
    try {
      const res = await fetch(`/api/pages/${encodeURIComponent(pageId)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPages((prev) => prev.filter((p) => p.id !== pageId));
      }
    } catch { /* ignore */ }
  }, []);

  const savePage = useCallback(async (page: SitePage) => {
    if (isStaticExport) {
      setPages((prev) => {
        const next = prev.map((p) =>
          p.id === page.id ? { ...page, updatedAt: new Date().toISOString() } : p
        );
        saveToLS(next);
        return next;
      });
      return;
    }
    try {
      await fetch(`/api/pages/${encodeURIComponent(page.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(page),
      });
      setPages((prev) =>
        prev.map((p) =>
          p.id === page.id ? { ...page, updatedAt: new Date().toISOString() } : p
        )
      );
    } catch { /* ignore */ }
  }, []);

  const reorderPages = useCallback(
    (sectionId: string, orderedIds: string[]) => {
      setPages((prev) => {
        const next = prev.map((p) => {
          if (p.sectionId !== sectionId) return p;
          const idx = orderedIds.indexOf(p.id);
          return idx >= 0 ? { ...p, order: idx } : p;
        });
        if (isStaticExport) saveToLS(next);
        return next;
      });
    },
    []
  );

  if (loading) {
    return React.createElement(
      "div",
      { className: "flex min-h-dvh items-center justify-center" },
      React.createElement("div", {
        className:
          "h-6 w-6 animate-spin rounded-full border-2 border-rm-gray-3 border-t-foreground",
      })
    );
  }

  return React.createElement(
    AdminStoreContext.Provider,
    {
      value: {
        pages,
        loading,
        getPagesBySection,
        getPage,
        createPage,
        setPageStatus,
        deletePage,
        savePage,
        reorderPages,
        reload: fetchPages,
      },
    },
    children
  );
}

export function useAdminStore() {
  const ctx = useContext(AdminStoreContext);
  if (!ctx)
    throw new Error("useAdminStore must be used within AdminStoreProvider");
  return ctx;
}
