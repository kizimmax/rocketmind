"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Tag as TagIcon,
  FileText,
  BookOpen,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  List,
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  Input,
  Tag,
} from "@rocketmind/ui";
import { toast } from "sonner";
import { useAdminStore } from "@/lib/store";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ArticleAdminCard } from "./article-admin-card";
import { TagManager } from "./tag-manager";
import { GlossaryAdminPanel } from "./glossary-admin-panel";

/**
 * MediaView — корень раздела МЕДИА в админке.
 * Вкладки: «Статьи» (список + фильтр по тегам + создание) | «Теги» (справочник).
 */
export function MediaView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab =
    (searchParams.get("tab") as "articles" | "glossary" | "tags" | null) ??
    "articles";

  const {
    articles,
    mediaTags,
    glossaryTerms,
    createArticle,
    setArticleStatus,
    deleteArticle,
    reorderPinnedArticles,
  } = useAdminStore();

  const [tab, setTab] = useState<"articles" | "glossary" | "tags">(initialTab);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [filterTagId, setFilterTagId] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const sortedArticles = useMemo(
    () => [...articles].sort((a, b) => a.order - b.order),
    [articles]
  );

  const activeArticles = sortedArticles.filter((a) => a.status !== "archived");
  const archivedArticles = sortedArticles.filter((a) => a.status === "archived");

  const filteredActive = useMemo(() => {
    if (filterTagId === "all") return activeArticles;
    return activeArticles.filter((a) => a.tagIds.includes(filterTagId));
  }, [activeArticles, filterTagId]);

  // Закреплённые — выводятся отдельной лентой сверху с кнопками up/down.
  // Сортировка: по `pinnedOrder` asc. Перестановка через reorderPinnedArticles.
  const pinnedArticles = useMemo(
    () =>
      filteredActive
        .filter((a) => a.pinned)
        .sort((a, b) => a.pinnedOrder - b.pinnedOrder),
    [filteredActive],
  );
  const unpinnedArticles = useMemo(
    () => filteredActive.filter((a) => !a.pinned),
    [filteredActive],
  );

  function movePinned(id: string, delta: 1 | -1) {
    const ids = pinnedArticles.map((a) => a.id);
    const idx = ids.indexOf(id);
    const target = idx + delta;
    if (idx < 0 || target < 0 || target >= ids.length) return;
    [ids[idx], ids[target]] = [ids[target], ids[idx]];
    reorderPinnedArticles(ids);
  }

  function handleCreate() {
    const title = newTitle.trim();
    if (!title) return;
    const article = createArticle(title);
    setNewTitle("");
    setIsCreating(false);
    toast.success(`Статья «${article.title}» создана`);
    router.push(`/media/${article.slug}`);
  }

  function handleArchive(id: string) {
    setArticleStatus(id, "archived");
    toast("Статья перемещена в архив", {
      action: {
        label: "Отменить",
        onClick: () => setArticleStatus(id, "hidden"),
      },
    });
  }

  function handleRestore(id: string) {
    setArticleStatus(id, "hidden");
    toast.success("Статья восстановлена");
  }

  function handleTogglePublish(id: string) {
    const a = articles.find((x) => x.id === id);
    if (!a) return;
    const next = a.status === "published" ? "hidden" : "published";
    setArticleStatus(id, next);
    toast.success(next === "published" ? "Статья опубликована" : "Статья скрыта");
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    deleteArticle(deleteTarget);
    setDeleteTarget(null);
    toast.success("Статья удалена");
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
          Медиа
        </h1>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as "articles" | "glossary" | "tags");
          const url = new URL(window.location.href);
          url.searchParams.set("tab", v);
          window.history.replaceState({}, "", url.toString());
        }}
        className="flex-1"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="articles">
            <FileText className="mr-1.5 h-4 w-4" />
            Статьи
            <span className="ml-2 text-muted-foreground">
              {activeArticles.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="glossary">
            <BookOpen className="mr-1.5 h-4 w-4" />
            Глоссарий
            <span className="ml-2 text-muted-foreground">
              {glossaryTerms.filter((t) => t.status !== "archived").length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="tags">
            <TagIcon className="mr-1.5 h-4 w-4" />
            Теги
            <span className="ml-2 text-muted-foreground">
              {mediaTags.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          {/* Create + view toggle */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <Input
                    size="sm"
                    placeholder="Название статьи"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreate();
                      if (e.key === "Escape") {
                        setIsCreating(false);
                        setNewTitle("");
                      }
                    }}
                    autoFocus
                    className="max-w-xs"
                  />
                  <Button
                    size="sm"
                    onClick={handleCreate}
                    disabled={!newTitle.trim()}
                  >
                    Создать
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsCreating(false);
                      setNewTitle("");
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreating(true)}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Добавить статью
                </Button>
              )}
            </div>

            {/* View toggle — grid | list */}
            <div className="flex items-center gap-0.5 rounded-sm border border-border p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Карточки"
                title="Карточки"
                className={`flex h-7 w-7 items-center justify-center rounded-sm transition-colors ${
                  viewMode === "grid"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="Список"
                title="Список"
                className={`flex h-7 w-7 items-center justify-center rounded-sm transition-colors ${
                  viewMode === "list"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Tag filter */}
          {mediaTags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              <Tag
                size="m"
                state={filterTagId === "all" ? "active" : "interactive"}
                as="button"
                onClick={() => setFilterTagId("all")}
              >
                Все статьи
              </Tag>
              {mediaTags.map((t) => (
                <Tag
                  key={t.id}
                  size="m"
                  state={filterTagId === t.id ? "active" : "interactive"}
                  as="button"
                  onClick={() => setFilterTagId(t.id)}
                >
                  {t.label}
                </Tag>
              ))}
            </div>
          )}

          {/* List */}
          {filteredActive.length === 0 ? (
            <p className="py-12 text-center text-[length:var(--text-14)] text-muted-foreground">
              {filterTagId === "all"
                ? "Пока нет статей. Создайте первую."
                : "По выбранному тегу статей нет."}
            </p>
          ) : (
            <>
              {pinnedArticles.length > 0 && (
                <div className="mb-8">
                  <p className="mb-3 text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
                    Закреплённые ({pinnedArticles.length})
                  </p>
                  {viewMode === "grid" ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {pinnedArticles.map((a, i) => (
                        <div key={a.id} className="relative">
                          <ArticleAdminCard
                            article={a}
                            viewMode="grid"
                            onArchive={handleArchive}
                            onRestore={handleRestore}
                            onDelete={setDeleteTarget}
                            onTogglePublish={handleTogglePublish}
                          />
                          <div className="absolute right-2 top-2 flex gap-1 rounded-sm border border-border bg-background/90 p-0.5 backdrop-blur-sm">
                            <button
                              type="button"
                              onClick={() => movePinned(a.id, -1)}
                              disabled={i === 0}
                              aria-label="Выше"
                              className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <ArrowUp
                                className="h-3.5 w-3.5"
                                strokeWidth={1.5}
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => movePinned(a.id, 1)}
                              disabled={i === pinnedArticles.length - 1}
                              aria-label="Ниже"
                              className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <ArrowDown
                                className="h-3.5 w-3.5"
                                strokeWidth={1.5}
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ArticlesTable hasPinCol>
                      {pinnedArticles.map((a, i) => (
                        <ArticleAdminCard
                          key={a.id}
                          article={a}
                          viewMode="list"
                          onArchive={handleArchive}
                          onRestore={handleRestore}
                          onDelete={setDeleteTarget}
                          onTogglePublish={handleTogglePublish}
                          pinMove={{
                            onUp: () => movePinned(a.id, -1),
                            onDown: () => movePinned(a.id, 1),
                            canUp: i > 0,
                            canDown: i < pinnedArticles.length - 1,
                          }}
                        />
                      ))}
                    </ArticlesTable>
                  )}
                </div>
              )}

              {unpinnedArticles.length > 0 &&
                (viewMode === "grid" ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {unpinnedArticles.map((a) => (
                      <ArticleAdminCard
                        key={a.id}
                        article={a}
                        viewMode="grid"
                        onArchive={handleArchive}
                        onRestore={handleRestore}
                        onDelete={setDeleteTarget}
                        onTogglePublish={handleTogglePublish}
                      />
                    ))}
                  </div>
                ) : (
                  <ArticlesTable>
                    {unpinnedArticles.map((a) => (
                      <ArticleAdminCard
                        key={a.id}
                        article={a}
                        viewMode="list"
                        onArchive={handleArchive}
                        onRestore={handleRestore}
                        onDelete={setDeleteTarget}
                        onTogglePublish={handleTogglePublish}
                      />
                    ))}
                  </ArticlesTable>
                ))}
            </>
          )}

          {archivedArticles.length > 0 && (
            <div className="mt-10">
              <p className="mb-3 text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
                Архив ({archivedArticles.length})
              </p>
              {viewMode === "grid" ? (
                <div className="grid gap-3 opacity-60 sm:grid-cols-2 lg:grid-cols-3">
                  {archivedArticles.map((a) => (
                    <ArticleAdminCard
                      key={a.id}
                      article={a}
                      viewMode="grid"
                      onArchive={handleArchive}
                      onRestore={handleRestore}
                      onDelete={setDeleteTarget}
                      onTogglePublish={handleTogglePublish}
                    />
                  ))}
                </div>
              ) : (
                <div className="opacity-60">
                  <ArticlesTable>
                    {archivedArticles.map((a) => (
                      <ArticleAdminCard
                        key={a.id}
                        article={a}
                        viewMode="list"
                        onArchive={handleArchive}
                        onRestore={handleRestore}
                        onDelete={setDeleteTarget}
                        onTogglePublish={handleTogglePublish}
                      />
                    ))}
                  </ArticlesTable>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="glossary">
          <GlossaryAdminPanel />
        </TabsContent>

        <TabsContent value="tags">
          <TagManager />
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить статью?"
        description="Статья будет удалена навсегда. Это действие нельзя отменить."
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}

// ── Таблица для list-режима ────────────────────────────────────────────────

function ArticlesTable({
  children,
  hasPinCol = false,
}: {
  children: React.ReactNode;
  /** Показать ведущую колонку для ↑/↓ (только для закреплённых). */
  hasPinCol?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-sm border border-border">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-[length:var(--text-11)] font-medium uppercase tracking-wider text-muted-foreground">
            {hasPinCol && <th className="w-12 py-2 pl-3 pr-1"></th>}
            <th className="w-12 py-2 pl-3 pr-1"></th>
            <th className="py-2 px-2">Название</th>
            <th className="hidden md:table-cell py-2 px-2">Описание</th>
            <th className="hidden lg:table-cell py-2 px-2">Теги</th>
            <th className="hidden sm:table-cell py-2 px-2">Дата</th>
            <th className="py-2 px-2">Статус</th>
            <th className="hidden xl:table-cell py-2 px-2">Путь</th>
            <th className="w-8 py-2 pr-3 pl-1"></th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
