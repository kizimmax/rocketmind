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
import type {
  SitePage,
  PageStatus,
  CaseType,
  Article,
  MediaTag,
  GlossaryTerm,
} from "./types";
import { createSeedPages } from "./seed-data";
import {
  createSeedArticles,
  createSeedGlossaryTerms,
  createSeedMediaTags,
} from "./seed-media";
import { MAX_FEATURED_CASES } from "./constants";
import { apiFetch, IS_STATIC } from "./api-client";

const LS_KEY = "cms:demo:v1:pages";
const LS_ARTICLES_KEY = "cms:demo:v1:articles";
const LS_TAGS_KEY = "cms:demo:v1:mediaTags";
const LS_GLOSSARY_KEY = "cms:demo:v1:glossaryTerms";
/** One-shot migration: prior demo builds used this key; drop it if present. */
const LEGACY_LS_KEY = "rm_site_admin_pages";
const isStaticExport = IS_STATIC;

// ── slug util ───────────────────────────────────────────────────────────────
const RU_MAP: Record<string, string> = {
  а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"i",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"c",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya",
};
export function slugify(input: string): string {
  const lower = input.toLowerCase().trim();
  let out = "";
  for (const ch of lower) out += RU_MAP[ch] ?? ch;
  return out
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60);
}

// ── localStorage helpers ────────────────────────────────────────────────────

function readLS(): SitePage[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as SitePage[];
    // Legacy migration: if old key exists, clear it (its data is stale).
    if (localStorage.getItem(LEGACY_LS_KEY)) localStorage.removeItem(LEGACY_LS_KEY);
  } catch { /* ignore */ }
  return null;
}

function saveToLS(pages: SitePage[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(pages)); } catch { /* ignore */ }
}

function readLSArticles(): Article[] | null {
  try {
    const raw = localStorage.getItem(LS_ARTICLES_KEY);
    if (raw) return JSON.parse(raw) as Article[];
  } catch { /* ignore */ }
  return null;
}
function saveArticlesToLS(articles: Article[]) {
  try { localStorage.setItem(LS_ARTICLES_KEY, JSON.stringify(articles)); } catch { /* ignore */ }
}

function readLSGlossary(): GlossaryTerm[] | null {
  try {
    const raw = localStorage.getItem(LS_GLOSSARY_KEY);
    if (raw) return JSON.parse(raw) as GlossaryTerm[];
  } catch { /* ignore */ }
  return null;
}
function saveGlossaryToLS(terms: GlossaryTerm[]) {
  try { localStorage.setItem(LS_GLOSSARY_KEY, JSON.stringify(terms)); } catch { /* ignore */ }
}

function readLSTags(): MediaTag[] | null {
  try {
    const raw = localStorage.getItem(LS_TAGS_KEY);
    if (raw) return JSON.parse(raw) as MediaTag[];
  } catch { /* ignore */ }
  return null;
}
function saveTagsToLS(tags: MediaTag[]) {
  try { localStorage.setItem(LS_TAGS_KEY, JSON.stringify(tags)); } catch { /* ignore */ }
}

// ── Context ─────────────────────────────────────────────────────────────────

interface StoreContext {
  pages: SitePage[];
  articles: Article[];
  mediaTags: MediaTag[];
  glossaryTerms: GlossaryTerm[];
  loading: boolean;
  getPagesBySection(sectionId: string): SitePage[];
  getPage(pageId: string): SitePage | undefined;
  createPage(sectionId: string, title: string, options?: { caseType?: CaseType }): Promise<SitePage | null>;
  setPageStatus(pageId: string, status: PageStatus): void;
  deletePage(pageId: string): Promise<void>;
  savePage(page: SitePage): Promise<void>;
  reorderPages(sectionId: string, orderedIds: string[]): void;
  /** Toggle featured flag on a case. Returns false if attempted to exceed the cap. */
  setCaseFeatured(pageId: string, value: boolean): Promise<boolean>;
  /** Count of cases currently marked featured (across all sections). */
  featuredCasesCount(): number;

  // ── Articles ──
  getArticle(id: string): Article | undefined;
  createArticle(title: string): Article;
  saveArticle(article: Article): void;
  deleteArticle(id: string): void;
  setArticleStatus(id: string, status: PageStatus): void;
  reorderArticles(orderedIds: string[]): void;
  /** Toggle pinned flag on an article. Returns ordered list of pinned after change. */
  setArticlePinned(id: string, value: boolean): void;
  /** Reorder pinned articles (orderedIds == pinned article IDs, desired order asc). */
  reorderPinnedArticles(orderedIds: string[]): void;

  // ── Glossary ──
  getGlossaryTerm(id: string): GlossaryTerm | undefined;
  createGlossaryTerm(title: string): GlossaryTerm;
  saveGlossaryTerm(term: GlossaryTerm): void;
  deleteGlossaryTerm(id: string): void;
  setGlossaryTermStatus(id: string, status: PageStatus): void;

  // ── Media tags ──
  /** Create or return existing tag (by label). */
  upsertMediaTag(label: string): MediaTag;
  renameMediaTag(id: string, label: string): void;
  deleteMediaTag(id: string): void;

  reload(): Promise<void>;
}

const AdminStoreContext = createContext<StoreContext | null>(null);

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [mediaTags, setMediaTags] = useState<MediaTag[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);

  // Load articles + tags
  //  - static mode: localStorage + seed (no API available)
  //  - dev / Amvera: fetch from /api/articles (файлы в apps/site/content/media/*.md)
  //                  — localStorage игнорируем, он только для static-демо.
  useEffect(() => {
    // Static mode: LS — источник истины, сервера нет.
    if (isStaticExport) {
      const tags = readLSTags() ?? createSeedMediaTags();
      setMediaTags(tags);
      if (!readLSTags()) saveTagsToLS(tags);
      const arts = readLSArticles() ?? createSeedArticles(tags);
      setArticles(arts);
      if (!readLSArticles()) saveArticlesToLS(arts);
      const terms = readLSGlossary() ?? createSeedGlossaryTerms();
      setGlossaryTerms(terms);
      if (!readLSGlossary()) saveGlossaryToLS(terms);
      return;
    }

    // Dev/Amvera: теги грузим с /api/media-tags (apps/site/content/media/_tags.json),
    // LS остаётся как оптимистичный pre-paint (чтобы UI не мигал пустыми тегами
    // до того, как придёт ответ от API).
    const cached = readLSTags();
    if (cached) setMediaTags(cached);

    (async () => {
      try {
        const res = await apiFetch("/api/media-tags");
        if (res.ok) {
          const data = (await res.json()) as { tags?: MediaTag[] };
          const serverTags = Array.isArray(data.tags) ? data.tags : [];
          setMediaTags(serverTags);
          saveTagsToLS(serverTags);
        }
      } catch {
        // fail-safe: остаёмся с LS-кэшем; если его не было — пустой массив.
        if (!cached) setMediaTags([]);
      }

      try {
        const res = await apiFetch("/api/articles");
        if (!res.ok) throw new Error();
        const data = (await res.json()) as Article[];
        setArticles(Array.isArray(data) ? data : []);
      } catch {
        setArticles([]);
      }

      try {
        const res = await apiFetch("/api/glossary");
        if (!res.ok) throw new Error();
        const data = (await res.json()) as GlossaryTerm[];
        setGlossaryTerms(Array.isArray(data) ? data : []);
      } catch {
        setGlossaryTerms([]);
      }
    })();
  }, []);

  // Helper: персистим массив тегов на сервер (+ в LS как кэш). Вызывается
  // из upsert/rename/delete после локального обновления state.
  const persistTags = useCallback((next: MediaTag[]) => {
    saveTagsToLS(next);
    if (isStaticExport) return;
    apiFetch("/api/media-tags", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags: next }),
    }).catch(() => {
      // В admin работает один пользователь — при транзиент-ошибке сети
      // следующий mutate попытается заново. Кэш в LS уже актуален.
    });
  }, []);

  const fetchPages = useCallback(async () => {
    // In static mode, prefer user's local edits (if any) over the snapshot.
    if (isStaticExport) {
      const ls = readLS();
      if (ls) {
        setPages(ls);
        setLoading(false);
        return;
      }
    }
    try {
      const res = await apiFetch("/api/pages");
      if (!res.ok) throw new Error();
      const data = await res.json();
      const pages = Array.isArray(data) && data.length ? (data as SitePage[]) : createSeedPages();
      setPages(pages);
    } catch {
      setPages(createSeedPages());
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
    async (
      sectionId: string,
      title: string,
      options?: { caseType?: CaseType },
    ): Promise<SitePage | null> => {
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
          caseType: sectionId === "cases" ? options?.caseType ?? "big" : undefined,
          featured: sectionId === "cases" ? false : undefined,
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
        const res = await apiFetch("/api/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sectionId,
            slug,
            menuTitle: title,
            ...(sectionId === "cases" ? { caseType: options?.caseType ?? "big" } : {}),
          }),
        });
        if (!res.ok) return null;
        const page = (await res.json()) as SitePage;
        // Refresh from disk so the editor sees the full block list (caseCard etc.)
        try {
          const listRes = await apiFetch("/api/pages");
          if (listRes.ok) {
            const fresh = (await listRes.json()) as SitePage[];
            setPages(fresh);
            return fresh.find((p) => p.id === page.id) ?? page;
          }
        } catch { /* fall through */ }
        setPages((prev) => [...prev, page]);
        return page;
      } catch {
        return null;
      }
    },
    []
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
      const res = await apiFetch(`/api/pages/${encodeURIComponent(pageId)}`, {
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
      await apiFetch(`/api/pages/${encodeURIComponent(page.id)}`, {
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
        if (isStaticExport) {
          saveToLS(next);
          return next;
        }
        // Non-static: пишем новое значение order каждой перемещённой страницы
        // в frontmatter через PUT /api/pages/[slug]. API ожидает полный объект
        // SitePage. State уже обновлён оптимистично; сетевые ошибки глотаем —
        // следующий reload или savePage перезапишет. Single-admin юзкейс.
        for (const page of next) {
          const orig = prev.find((p) => p.id === page.id);
          if (!orig || orig.order === page.order) continue;
          apiFetch(`/api/pages/${encodeURIComponent(page.id)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(page),
          }).catch(() => {
            /* ignore */
          });
        }
        return next;
      });
    },
    []
  );

  const featuredCasesCount = useCallback(
    () => pages.filter((p) => p.sectionId === "cases" && p.featured === true).length,
    [pages],
  );

  const setCaseFeatured = useCallback(
    async (pageId: string, value: boolean): Promise<boolean> => {
      const target = pages.find((p) => p.id === pageId);
      if (!target || target.sectionId !== "cases") return false;
      if (value === true && target.featured !== true) {
        const cur = pages.filter((p) => p.sectionId === "cases" && p.featured === true).length;
        if (cur >= MAX_FEATURED_CASES) return false;
      }
      const updated: SitePage = { ...target, featured: value };
      setPages((prev) => prev.map((p) => (p.id === pageId ? updated : p)));
      if (isStaticExport) {
        saveToLS(pages.map((p) => (p.id === pageId ? updated : p)));
      } else {
        try {
          await apiFetch(`/api/pages/${encodeURIComponent(pageId)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
          });
        } catch { /* ignore */ }
      }
      return true;
    },
    [pages],
  );

  // ── Articles ────────────────────────────────────────────────────────────
  const getArticle = useCallback(
    (id: string) => articles.find((a) => a.id === id),
    [articles],
  );

  const createArticle = useCallback((title: string): Article => {
    const base = slugify(title) || `article-${Date.now()}`;
    const taken = new Set(articles.map((a) => a.slug));
    let slug = base;
    let n = 2;
    while (taken.has(slug)) slug = `${base}-${n++}`;
    const now = new Date().toISOString();
    const article: Article = {
      id: `media/${slug}`,
      slug,
      status: "hidden",
      order: articles.length,
      title,
      description: "",
      publishedAt: now.slice(0, 10),
      expertSlug: undefined,
      tagIds: [],
      keyThoughts: [],
      body: [],
      cardVariant: "default",
      pinned: false,
      pinnedOrder: 0,
      metaTitle: `${title} — Rocketmind`,
      metaDescription: "",
      createdAt: now,
      updatedAt: now,
    };

    // Optimistic local insert
    const next = [...articles, article];
    setArticles(next);
    if (isStaticExport) {
      saveArticlesToLS(next);
      return article;
    }

    // Dev/prod: create .md via API (fire-and-forget — на случай гонки пойдём без await)
    void apiFetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title }),
    }).catch(() => {});

    return article;
  }, [articles]);

  const saveArticle = useCallback((article: Article) => {
    const updated = { ...article, updatedAt: new Date().toISOString() };

    setArticles((prev) => {
      const next = prev.map((a) => (a.id === article.id ? updated : a));
      if (isStaticExport) saveArticlesToLS(next);
      return next;
    });

    if (isStaticExport) return;

    void apiFetch(`/api/articles/${encodeURIComponent(article.slug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).catch(() => {});
  }, []);

  const deleteArticle = useCallback((id: string) => {
    const target = articles.find((a) => a.id === id);
    setArticles((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (isStaticExport) saveArticlesToLS(next);
      return next;
    });
    if (!isStaticExport && target) {
      void apiFetch(`/api/articles/${encodeURIComponent(target.slug)}`, {
        method: "DELETE",
      }).catch(() => {});
    }
  }, [articles]);

  const setArticleStatus = useCallback((id: string, status: PageStatus) => {
    let target: Article | undefined;
    setArticles((prev) => {
      const next = prev.map((a) => {
        if (a.id !== id) return a;
        target = { ...a, status, updatedAt: new Date().toISOString() };
        return target;
      });
      if (isStaticExport) saveArticlesToLS(next);
      return next;
    });
    if (!isStaticExport && target) {
      void apiFetch(`/api/articles/${encodeURIComponent(target.slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(target),
      }).catch(() => {});
    }
  }, []);

  const setArticlePinned = useCallback((id: string, value: boolean) => {
    let target: Article | undefined;
    setArticles((prev) => {
      const maxOrder = prev
        .filter((a) => a.pinned && a.id !== id)
        .reduce((acc, a) => Math.max(acc, a.pinnedOrder), -1);
      const next = prev.map((a) => {
        if (a.id !== id) return a;
        target = {
          ...a,
          pinned: value,
          pinnedOrder: value ? maxOrder + 1 : 0,
          updatedAt: new Date().toISOString(),
        };
        return target;
      });
      if (isStaticExport) saveArticlesToLS(next);
      return next;
    });
    if (!isStaticExport && target) {
      void apiFetch(`/api/articles/${encodeURIComponent(target.slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(target),
      }).catch(() => {});
    }
  }, []);

  const reorderPinnedArticles = useCallback((orderedIds: string[]) => {
    let changed: Article[] = [];
    setArticles((prev) => {
      const next = prev.map((a) => {
        if (!a.pinned) return a;
        const idx = orderedIds.indexOf(a.id);
        if (idx < 0 || idx === a.pinnedOrder) return a;
        const updated = {
          ...a,
          pinnedOrder: idx,
          updatedAt: new Date().toISOString(),
        };
        changed.push(updated);
        return updated;
      });
      if (isStaticExport) saveArticlesToLS(next);
      return next;
    });
    if (!isStaticExport && changed.length) {
      for (const a of changed) {
        void apiFetch(`/api/articles/${encodeURIComponent(a.slug)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(a),
        }).catch(() => {});
      }
    }
  }, []);

  // ── Glossary ─────────────────────────────────────────────────────────────
  const getGlossaryTerm = useCallback(
    (id: string) => glossaryTerms.find((t) => t.id === id),
    [glossaryTerms],
  );

  const createGlossaryTerm = useCallback((title: string): GlossaryTerm => {
    const base = slugify(title) || `term-${Date.now()}`;
    const taken = new Set(glossaryTerms.map((t) => t.slug));
    let slug = base;
    let n = 2;
    while (taken.has(slug)) slug = `${base}-${n++}`;
    const now = new Date().toISOString();
    const term: GlossaryTerm = {
      id: `glossary/${slug}`,
      slug,
      status: "hidden",
      order: glossaryTerms.length,
      title,
      tagIds: [],
      metaTitle: `${title} | Глоссарий Rocketmind`,
      metaDescription: "",
      createdAt: now,
      updatedAt: now,
    };
    const next = [...glossaryTerms, term];
    setGlossaryTerms(next);
    if (isStaticExport) {
      saveGlossaryToLS(next);
      return term;
    }
    void apiFetch("/api/glossary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title }),
    }).catch(() => {});
    return term;
  }, [glossaryTerms]);

  const saveGlossaryTerm = useCallback((term: GlossaryTerm) => {
    const updated = { ...term, updatedAt: new Date().toISOString() };
    setGlossaryTerms((prev) => {
      const next = prev.map((t) => (t.id === term.id ? updated : t));
      if (isStaticExport) saveGlossaryToLS(next);
      return next;
    });
    if (isStaticExport) return;
    void apiFetch(`/api/glossary/${encodeURIComponent(term.slug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).catch(() => {});
  }, []);

  const deleteGlossaryTerm = useCallback((id: string) => {
    const target = glossaryTerms.find((t) => t.id === id);
    setGlossaryTerms((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (isStaticExport) saveGlossaryToLS(next);
      return next;
    });
    if (!isStaticExport && target) {
      void apiFetch(`/api/glossary/${encodeURIComponent(target.slug)}`, {
        method: "DELETE",
      }).catch(() => {});
    }
  }, [glossaryTerms]);

  const setGlossaryTermStatus = useCallback((id: string, status: PageStatus) => {
    let target: GlossaryTerm | undefined;
    setGlossaryTerms((prev) => {
      const next = prev.map((t) => {
        if (t.id !== id) return t;
        target = { ...t, status, updatedAt: new Date().toISOString() };
        return target;
      });
      if (isStaticExport) saveGlossaryToLS(next);
      return next;
    });
    if (!isStaticExport && target) {
      void apiFetch(`/api/glossary/${encodeURIComponent(target.slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(target),
      }).catch(() => {});
    }
  }, []);

  const reorderArticles = useCallback((orderedIds: string[]) => {
    let changed: Article[] = [];
    setArticles((prev) => {
      const next = prev.map((a) => {
        const idx = orderedIds.indexOf(a.id);
        if (idx >= 0 && idx !== a.order) {
          const updated = { ...a, order: idx };
          changed.push(updated);
          return updated;
        }
        return a;
      });
      if (isStaticExport) saveArticlesToLS(next);
      return next;
    });
    if (!isStaticExport && changed.length) {
      for (const a of changed) {
        void apiFetch(`/api/articles/${encodeURIComponent(a.slug)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(a),
        }).catch(() => {});
      }
    }
  }, []);

  // ── Media tags ───────────────────────────────────────────────────────────
  const upsertMediaTag = useCallback((label: string): MediaTag => {
    const trimmed = label.trim();
    const match = mediaTags.find(
      (t) => t.label.toLowerCase() === trimmed.toLowerCase()
    );
    if (match) return match;
    const base = slugify(trimmed) || `tag-${Date.now()}`;
    const taken = new Set(mediaTags.map((t) => t.id));
    let id = base;
    let n = 2;
    while (taken.has(id)) id = `${base}-${n++}`;
    const tag: MediaTag = {
      id,
      label: trimmed,
      createdAt: new Date().toISOString(),
    };
    const next = [...mediaTags, tag];
    setMediaTags(next);
    persistTags(next);
    return tag;
  }, [mediaTags, persistTags]);

  const renameMediaTag = useCallback((id: string, label: string) => {
    setMediaTags((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, label } : t));
      persistTags(next);
      return next;
    });
  }, [persistTags]);

  const deleteMediaTag = useCallback((id: string) => {
    setMediaTags((prev) => {
      const next = prev.filter((t) => t.id !== id);
      persistTags(next);
      return next;
    });
    // also strip the tag from all articles
    setArticles((prev) => {
      const next = prev.map((a) => ({
        ...a,
        tagIds: a.tagIds.filter((x) => x !== id),
      }));
      saveArticlesToLS(next);
      return next;
    });
  }, [persistTags]);

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
        articles,
        mediaTags,
        glossaryTerms,
        loading,
        getPagesBySection,
        getPage,
        createPage,
        setPageStatus,
        deletePage,
        savePage,
        reorderPages,
        setCaseFeatured,
        featuredCasesCount,
        getArticle,
        createArticle,
        saveArticle,
        deleteArticle,
        setArticleStatus,
        reorderArticles,
        setArticlePinned,
        reorderPinnedArticles,
        getGlossaryTerm,
        createGlossaryTerm,
        saveGlossaryTerm,
        deleteGlossaryTerm,
        setGlossaryTermStatus,
        upsertMediaTag,
        renameMediaTag,
        deleteMediaTag,
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
