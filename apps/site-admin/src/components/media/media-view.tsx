"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Tag as TagIcon, FileText } from "lucide-react";
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

/**
 * MediaView — корень раздела МЕДИА в админке.
 * Вкладки: «Статьи» (список + фильтр по тегам + создание) | «Теги» (справочник).
 */
export function MediaView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "articles" | "tags" | null) ?? "articles";

  const {
    articles,
    mediaTags,
    createArticle,
    setArticleStatus,
    deleteArticle,
  } = useAdminStore();

  const [tab, setTab] = useState<"articles" | "tags">(initialTab);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [filterTagId, setFilterTagId] = useState<string>("all");

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
          setTab(v as "articles" | "tags");
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
          <TabsTrigger value="tags">
            <TagIcon className="mr-1.5 h-4 w-4" />
            Теги
            <span className="ml-2 text-muted-foreground">
              {mediaTags.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          {/* Create */}
          <div className="mb-4 flex items-center gap-3">
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
                <Button size="sm" onClick={handleCreate} disabled={!newTitle.trim()}>
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

          {/* Grid */}
          {filteredActive.length === 0 ? (
            <p className="py-12 text-center text-[length:var(--text-14)] text-muted-foreground">
              {filterTagId === "all"
                ? "Пока нет статей. Создайте первую."
                : "По выбранному тегу статей нет."}
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredActive.map((a) => (
                <ArticleAdminCard
                  key={a.id}
                  article={a}
                  onArchive={handleArchive}
                  onRestore={handleRestore}
                  onDelete={setDeleteTarget}
                  onTogglePublish={handleTogglePublish}
                />
              ))}
            </div>
          )}

          {archivedArticles.length > 0 && (
            <div className="mt-10">
              <p className="mb-3 text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
                Архив ({archivedArticles.length})
              </p>
              <div className="grid gap-3 opacity-60 sm:grid-cols-2 lg:grid-cols-3">
                {archivedArticles.map((a) => (
                  <ArticleAdminCard
                    key={a.id}
                    article={a}
                    onArchive={handleArchive}
                    onRestore={handleRestore}
                    onDelete={setDeleteTarget}
                    onTogglePublish={handleTogglePublish}
                  />
                ))}
              </div>
            </div>
          )}
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
