"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useMemo } from "react";
import { Plus, LayoutGrid, List } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  Input,
} from "@rocketmind/ui";
import { toast } from "sonner";
import { LOCKED_SECTIONS, MAX_FEATURED_CASES } from "@/lib/constants";
import { useAdminStore } from "@/lib/store";
import { useItemDnd } from "@/lib/use-item-dnd";
import { PageCard } from "@/components/page-card";
import { ArticleAdminCard } from "@/components/media/article-admin-card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import type { AdminSection } from "@/lib/types";

type Props = {
  title: string;
  sections: AdminSection[];
  defaultSection?: string;
};

export function PagesView({ title, sections, defaultSection }: Props) {
  const searchParams = useSearchParams();
  const initialSection =
    searchParams.get("section") ||
    defaultSection ||
    sections[0]?.id ||
    "";

  const router = useRouter();
  const {
    getPagesBySection,
    createPage,
    setPageStatus,
    deletePage,
    reorderPages,
    setCaseFeatured,
    featuredCasesCount,
    articles,
    createArticle,
    saveArticle,
    setArticleStatus,
    deleteArticle,
    setArticleFeatured,
  } = useAdminStore();
  void saveArticle;

  const [activeSection, setActiveSection] = useState(initialSection);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  /**
   * Какой именно объект создаётся в секции «Кейсы»:
   *  - `mini` → создаётся `SitePage` через createPage,
   *  - `big`  → создаётся `Article{ type: "case" }` через createArticle.
   * Для остальных секций значение игнорируется.
   */
  const [pendingCaseKind, setPendingCaseKind] = useState<"big" | "mini">("big");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const pages = getPagesBySection(activeSection);
  const activePages = pages.filter((p) => p.status !== "archived");
  const archivedPages = pages.filter((p) => p.status === "archived");

  /** В секции «Кейсы» сюда же подмешиваем `Article` с `type === "case"`. */
  const articleCases = useMemo(
    () =>
      activeSection === "cases"
        ? articles.filter((a) => a.type === "case")
        : [],
    [activeSection, articles],
  );
  const activeArticleCases = articleCases.filter(
    (a) => a.status !== "archived",
  );
  const archivedArticleCases = articleCases.filter(
    (a) => a.status === "archived",
  );

  const handleReorder = useCallback(
    (reordered: typeof activePages) => {
      reorderPages(activeSection, reordered.map((p) => p.id));
      toast.success("Порядок сохранён");
    },
    [activeSection, reorderPages]
  );

  const dnd = useItemDnd(activePages, handleReorder);

  async function handleCreate() {
    if (!newTitle.trim()) return;
    const title = newTitle.trim();
    const isCases = activeSection === "cases";

    // «Большой кейс» в секции «Кейсы» — теперь это Article(type=case),
    // а не SitePage. Создаём через createArticle и переходим в редактор статьи.
    if (isCases && pendingCaseKind === "big") {
      const article = createArticle(title, "case");
      setNewTitle("");
      setIsCreating(false);
      toast.success(`Большой кейс «${article.title}» создан`);
      router.push(`/media/${article.slug}`);
      return;
    }

    const page = await createPage(
      activeSection,
      title,
      isCases ? { caseType: "mini" } : undefined,
    );
    setNewTitle("");
    setIsCreating(false);
    if (page) {
      const label = isCases ? "Мини-кейс" : "Страница";
      toast.success(`${label} «${page.menuTitle}» создан${isCases ? "" : "а"}`);
    } else {
      toast.error("Не удалось создать страницу");
    }
  }

  async function handleToggleFeatured(id: string) {
    // article-cases имеют id `media/<slug>`; SitePage cases — `cases/<slug>`.
    const isArticle = id.startsWith("media/");
    if (isArticle) {
      const target = articleCases.find((a) => a.id === id);
      if (!target) return;
      const next = !target.featured;
      const ok = await setArticleFeatured(id, next);
      if (!ok) {
        toast.error(
          `Максимум ${MAX_FEATURED_CASES} кейсов могут быть отмечены «на всех страницах». Сначала снимите галочку с одного из выбранных.`,
        );
        return;
      }
      toast.success(
        next
          ? "Кейс будет показываться на всех страницах"
          : "Кейс убран с общего показа",
      );
      return;
    }
    const target = activePages.find((p) => p.id === id);
    if (!target) return;
    const next = !target.featured;
    const ok = await setCaseFeatured(id, next);
    if (!ok) {
      toast.error(`Максимум ${MAX_FEATURED_CASES} кейсов могут быть отмечены «на всех страницах». Сначала снимите галочку с одного из выбранных.`);
      return;
    }
    toast.success(next ? "Кейс будет показываться на всех страницах" : "Кейс убран с общего показа");
  }

  function isArticleId(id: string) {
    return id.startsWith("media/");
  }

  function handleArchive(id: string) {
    if (isArticleId(id)) {
      setArticleStatus(id, "archived");
      toast("Кейс перемещён в архив", {
        action: {
          label: "Отменить",
          onClick: () => setArticleStatus(id, "hidden"),
        },
      });
      return;
    }
    setPageStatus(id, "archived");
    toast("Страница перемещена в архив", {
      action: {
        label: "Отменить",
        onClick: () => setPageStatus(id, "hidden"),
      },
    });
  }

  function handleRestore(id: string) {
    if (isArticleId(id)) {
      setArticleStatus(id, "hidden");
      toast.success("Кейс восстановлен");
      return;
    }
    setPageStatus(id, "hidden");
    toast.success("Страница восстановлена");
  }

  function handleTogglePublish(id: string) {
    if (isArticleId(id)) {
      const a = articleCases.find((x) => x.id === id);
      if (!a) return;
      const next = a.status === "published" ? "hidden" : "published";
      setArticleStatus(id, next);
      toast.success(
        next === "published" ? "Кейс опубликован" : "Кейс скрыт",
      );
      return;
    }
    const page = pages.find((p) => p.id === id);
    if (!page) return;
    const next = page.status === "published" ? "hidden" : "published";
    setPageStatus(id, next);
    toast.success(next === "published" ? "Страница опубликована" : "Страница скрыта");
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    if (isArticleId(deleteTarget)) {
      deleteArticle(deleteTarget);
      setDeleteTarget(null);
      toast.success("Кейс удалён");
      return;
    }
    await deletePage(deleteTarget);
    setDeleteTarget(null);
    toast.success("Страница удалена");
  }

  const showTabs = sections.length > 1;

  const renderSection = (section: AdminSection) => (
    <>
      {!LOCKED_SECTIONS.has(section.id) && (
        <div className="mb-4 flex items-center gap-3">
          {isCreating ? (
            <div className="flex items-center gap-2">
              {section.id === "cases" && (
                <span className="rounded-sm bg-foreground/10 px-2 py-1 text-[length:var(--text-11)] font-medium uppercase tracking-wider text-foreground">
                  {pendingCaseKind === "mini" ? "Мини-кейс" : "Большой кейс"}
                </span>
              )}
              <Input
                size="sm"
                placeholder={section.id === "cases" ? "Название кейса" : "Название страницы"}
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
          ) : section.id === "cases" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPendingCaseKind("big");
                  setIsCreating(true);
                }}
              >
                <Plus className="mr-1 h-4 w-4" />
                Большой кейс
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPendingCaseKind("mini");
                  setIsCreating(true);
                }}
              >
                <Plus className="mr-1 h-4 w-4" />
                Мини-кейс
              </Button>
              <span className="ml-auto text-[length:var(--text-12)] text-muted-foreground">
                На всех страницах: {featuredCasesCount()} / {MAX_FEATURED_CASES}
              </span>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="mr-1 h-4 w-4" />
              Добавить страницу
            </Button>
          )}
        </div>
      )}

      {section.id === "cases" && activeArticleCases.length > 0 && (
        <div className="mb-8">
          <p className="mb-3 text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
            Большие кейсы (статьи · {activeArticleCases.length})
          </p>
          {viewMode === "grid" ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {activeArticleCases.map((article) => (
                <ArticleAdminCard
                  key={article.id}
                  article={article}
                  viewMode="grid"
                  onArchive={handleArchive}
                  onRestore={handleRestore}
                  onDelete={setDeleteTarget}
                  onTogglePublish={handleTogglePublish}
                  onToggleFeatured={handleToggleFeatured}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-sm border border-border">
              <table className="w-full text-left">
                <tbody>
                  {activeArticleCases.map((article) => (
                    <ArticleAdminCard
                      key={article.id}
                      article={article}
                      viewMode="list"
                      onArchive={handleArchive}
                      onRestore={handleRestore}
                      onDelete={setDeleteTarget}
                      onTogglePublish={handleTogglePublish}
                      onToggleFeatured={handleToggleFeatured}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {section.id === "cases" && (
        <p className="mb-3 text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
          Мини-кейсы ({activePages.length})
        </p>
      )}

      {viewMode === "grid" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activePages.map((page, index) => {
            // Секция «Уникальные» — все карточки системные, без DnD/move/grip.
            if (section.id === "unique") {
              return (
                <div key={page.id} className="h-full">
                  <PageCard
                    page={page}
                    viewMode="grid"
                    onArchive={handleArchive}
                    onRestore={handleRestore}
                    onDelete={setDeleteTarget}
                    onTogglePublish={handleTogglePublish}
                  />
                </div>
              );
            }
            const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
              dnd.itemProps(index);
            return (
              <div
                key={page.id}
                draggable={draggable}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
                className={`h-full transition-opacity ${isDragging ? "opacity-50" : ""}`}
              >
                <PageCard
                  page={page}
                  viewMode="grid"
                  onArchive={handleArchive}
                  onRestore={handleRestore}
                  onDelete={setDeleteTarget}
                  onTogglePublish={handleTogglePublish}
                  onToggleFeatured={section.id === "cases" ? handleToggleFeatured : undefined}
                  onGripDown={() => dnd.onGripDown(index)}
                  onGripUp={dnd.onGripUp}
                  index={index}
                  count={activePages.length}
                  onMove={dnd.move}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-sm border border-border">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-[length:var(--text-11)] font-medium uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pl-3 pr-1 w-8">#</th>
                <th className="py-2 px-1 w-10"></th>
                <th className="py-2 px-2">Название</th>
                <th className="hidden md:table-cell py-2 px-2">Описание</th>
                <th className="hidden lg:table-cell py-2 px-2">Обложка</th>
                <th className="py-2 px-2">Статус</th>
                <th className="hidden sm:table-cell py-2 px-2">Путь</th>
                <th className="py-2 pr-3 pl-1 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {activePages.map((page, index) => {
                if (section.id === "unique") {
                  return (
                    <PageCard
                      key={page.id}
                      page={page}
                      viewMode="list"
                      onArchive={handleArchive}
                      onRestore={handleRestore}
                      onDelete={setDeleteTarget}
                      onTogglePublish={handleTogglePublish}
                    />
                  );
                }
                const props = dnd.itemProps(index);
                return (
                  <PageCard
                    key={page.id}
                    page={page}
                    viewMode="list"
                    onArchive={handleArchive}
                    onRestore={handleRestore}
                    onDelete={setDeleteTarget}
                    onTogglePublish={handleTogglePublish}
                    onToggleFeatured={section.id === "cases" ? handleToggleFeatured : undefined}
                    onGripDown={() => dnd.onGripDown(index)}
                    onGripUp={dnd.onGripUp}
                    index={index}
                    count={activePages.length}
                    onMove={dnd.move}
                    dragProps={props}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activePages.length === 0 &&
        (section.id !== "cases" || activeArticleCases.length === 0) && (
          <p className="py-12 text-center text-[length:var(--text-14)] text-muted-foreground">
            В этом разделе пока нет страниц
          </p>
        )}

      {section.id === "cases" && archivedArticleCases.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
            Архив больших кейсов ({archivedArticleCases.length})
          </p>
          {viewMode === "grid" ? (
            <div className="grid gap-3 opacity-60 sm:grid-cols-2 lg:grid-cols-3">
              {archivedArticleCases.map((article) => (
                <ArticleAdminCard
                  key={article.id}
                  article={article}
                  viewMode="grid"
                  onArchive={handleArchive}
                  onRestore={handleRestore}
                  onDelete={setDeleteTarget}
                  onTogglePublish={handleTogglePublish}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-sm border border-border opacity-60">
              <table className="w-full text-left">
                <tbody>
                  {archivedArticleCases.map((article) => (
                    <ArticleAdminCard
                      key={article.id}
                      article={article}
                      viewMode="list"
                      onArchive={handleArchive}
                      onRestore={handleRestore}
                      onDelete={setDeleteTarget}
                      onTogglePublish={handleTogglePublish}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {archivedPages.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
            Архив ({archivedPages.length})
          </p>
          {viewMode === "grid" ? (
            <div className="grid gap-3 opacity-60 sm:grid-cols-2 lg:grid-cols-3">
              {archivedPages.map((page) => (
                <PageCard
                  key={page.id}
                  page={page}
                  viewMode="grid"
                  onArchive={handleArchive}
                  onRestore={handleRestore}
                  onDelete={setDeleteTarget}
                  onTogglePublish={handleTogglePublish}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-sm border border-border opacity-60">
              <table className="w-full text-left">
                <tbody>
                  {archivedPages.map((page) => (
                    <PageCard
                      key={page.id}
                      page={page}
                      viewMode="list"
                      onArchive={handleArchive}
                      onRestore={handleRestore}
                      onDelete={setDeleteTarget}
                      onTogglePublish={handleTogglePublish}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
          {title}
        </h1>
        <div className="flex items-center gap-0.5 rounded-sm border border-border p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex h-7 w-7 items-center justify-center rounded-sm transition-colors ${
              viewMode === "grid"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
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

      {showTabs ? (
        <Tabs
          value={activeSection}
          onValueChange={setActiveSection}
          className="flex-1"
        >
          <TabsList className="mb-6">
            {sections.map((section) => (
              <TabsTrigger key={section.id} value={section.id}>
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              {renderSection(section)}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        sections[0] && renderSection(sections[0])
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить страницу?"
        description="Страница будет удалена навсегда. Это действие нельзя отменить."
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
