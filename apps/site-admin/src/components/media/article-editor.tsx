"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@rocketmind/ui";
import { toast } from "sonner";
import { useAdminStore } from "@/lib/store";
import { useArticleEditor, getArticleChanges } from "@/lib/use-article-editor";
import { useNavigationGuard } from "@/lib/navigation-guard";
import { EditorToolbar } from "@/components/page-editor/editor-toolbar";
import { ArticleHeroEditor } from "./article-hero-editor";
import { ArticlePreviewCard } from "./article-preview-card";

interface Props {
  articleId: string;
}

/**
 * ArticleEditor — редактор статьи.
 * Шапка: назад + название + slug.
 * Контент: Slug/SEO + ArticleCard превью | Hero | Тело.
 * Плавающий нижний тулбар: undo/redo, publish, cancel, save (как в редакторе продукта).
 */
export function ArticleEditor({ articleId }: Props) {
  const router = useRouter();
  const { getArticle, saveArticle } = useAdminStore();
  const articleFromStore = getArticle(articleId);

  if (!articleFromStore) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <p className="text-muted-foreground">Статья не найдена.</p>
      </div>
    );
  }

  return <ArticleEditorInner initial={articleFromStore} onSave={saveArticle} />;
}

function ArticleEditorInner({
  initial,
  onSave,
}: {
  initial: import("@/lib/types").Article;
  onSave: (a: import("@/lib/types").Article) => void;
}) {
  const router = useRouter();
  const {
    article,
    original,
    isDirty,
    canUndo,
    canRedo,
    update,
    undo,
    redo,
    markSaved,
    discard,
  } = useArticleEditor(initial);

  const { setDirty, pendingHref, clearPending } = useNavigationGuard();

  const [unsavedOpen, setUnsavedOpen] = useState(false);
  const [navigateTarget, setNavigateTarget] = useState<string | null>(null);

  // Sync dirty to navigation guard (so AdminHeader links trigger tryNavigate)
  useEffect(() => {
    setDirty(isDirty);
  }, [isDirty, setDirty]);

  // Cleanup on unmount — otherwise the guard stays armed after leaving
  useEffect(() => {
    return () => setDirty(false);
  }, [setDirty]);

  // A header link was blocked → open the dialog with that target
  useEffect(() => {
    if (pendingHref) {
      setNavigateTarget(pendingHref);
      setUnsavedOpen(true);
      clearPending();
    }
  }, [pendingHref, clearPending]);

  // Warn on browser-level close/reload while dirty
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  function handleSave() {
    onSave(article);
    markSaved(article);
    toast.success("Статья сохранена");
  }

  function handleBack() {
    if (isDirty) {
      setNavigateTarget("/media");
      setUnsavedOpen(true);
      return;
    }
    router.push("/media");
  }

  function handleTogglePublish(next: boolean) {
    update("status", next ? "published" : "hidden");
  }

  function handleSaveAndLeave() {
    onSave(article);
    markSaved(article);
    setUnsavedOpen(false);
    router.push(navigateTarget || "/media");
  }

  function handleDiscardAndLeave() {
    discard();
    setUnsavedOpen(false);
    router.push(navigateTarget || "/media");
  }

  function handleCancelDialog() {
    setUnsavedOpen(false);
    setNavigateTarget(null);
  }

  const changes = isDirty ? getArticleChanges(original, article) : [];

  return (
    <div className="flex flex-1 flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <Button variant="ghost" size="icon-sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="truncate text-[length:var(--text-18)] font-semibold text-foreground">
            {article.title || "Без названия"}
          </h1>
          <p className="truncate text-[length:var(--text-12)] text-muted-foreground">
            /media/{article.slug}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-[1400px] flex flex-col gap-8">
          {/* 1. Top row: Slug+SEO (left) + ArticleCard preview (right). */}
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex flex-1 flex-col gap-6 min-w-0">
              <Section title="Slug и публикация">
                <div className="flex flex-col gap-4">
                  <Field label="Slug">
                    <Input
                      value={article.slug}
                      onChange={(e) => update("slug", e.target.value)}
                    />
                  </Field>
                  <p className="text-[length:var(--text-11)] text-muted-foreground">
                    Адрес статьи: <code>/media/{article.slug}</code>
                  </p>
                </div>
              </Section>

              <Section title="SEO" grow>
                <div className="flex flex-1 flex-col gap-4 min-h-0">
                  <Field label="Meta title">
                    <Input
                      value={article.metaTitle}
                      onChange={(e) => update("metaTitle", e.target.value)}
                      placeholder="Заголовок для поисковой выдачи"
                    />
                  </Field>
                  <Field label="Meta description" grow>
                    <Textarea
                      value={article.metaDescription}
                      onChange={(e) => update("metaDescription", e.target.value)}
                      placeholder="Описание для поисковой выдачи"
                      className="h-full min-h-[80px] resize-none"
                    />
                  </Field>
                </div>
              </Section>
            </div>

            <aside className="flex flex-col gap-3 lg:w-[380px] lg:shrink-0">
              <ArticlePreviewCard draft={article} />
            </aside>
          </div>

          {/* 2. Hero — главный экран */}
          <ArticleHeroEditor draft={article} onChange={update} />

          {/* 3. Body placeholder */}
          <Section title="Тело статьи">
            <div className="flex flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-border bg-[color:var(--rm-gray-1)] px-6 py-10 text-center">
              <p className="text-[length:var(--text-14)] font-medium text-foreground">
                Редактор тела статьи — следующий этап
              </p>
              <p className="max-w-md text-[length:var(--text-12)] text-muted-foreground">
                В следующей итерации здесь появятся inline-блоки (параграф, H2,
                цитата, картинка, список, callout). Левая ToC-навигация на странице
                будет автоматически собираться из H2 в этом теле.
              </p>
            </div>
          </Section>
        </div>
      </div>

      {/* Floating toolbar — undo/redo, publish, cancel, save */}
      <EditorToolbar
        isDirty={isDirty}
        canUndo={canUndo}
        canRedo={canRedo}
        isPublished={article.status === "published"}
        onUndo={undo}
        onRedo={redo}
        onTogglePublish={handleTogglePublish}
        onSave={handleSave}
        onCancel={handleBack}
      />

      {/* Unsaved changes dialog */}
      <Dialog
        open={unsavedOpen}
        onOpenChange={(open) => {
          if (!open) handleCancelDialog();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Несохранённые изменения</DialogTitle>
            <DialogDescription>
              {changes.length > 0 ? (
                <>
                  <span className="mb-2 block">Вы изменили:</span>
                  <ul className="mb-2 list-inside list-disc space-y-0.5">
                    {changes.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  <span>Что сделать с изменениями?</span>
                </>
              ) : (
                "Есть несохранённые изменения. Что сделать?"
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={handleDiscardAndLeave}>
              Отменить изменения
            </Button>
            <Button variant="outline" onClick={handleCancelDialog}>
              Продолжить редактирование
            </Button>
            <Button onClick={handleSaveAndLeave}>Сохранить и выйти</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({
  title,
  children,
  grow,
}: {
  title: string;
  children: React.ReactNode;
  grow?: boolean;
}) {
  return (
    <section
      className={[
        "rounded-sm border border-border bg-[color:var(--rm-gray-1)]/30 p-5",
        grow ? "flex flex-1 flex-col min-h-0" : "",
      ].join(" ")}
    >
      <h2 className="mb-4 font-[family-name:var(--font-mono-family)] font-medium text-[length:var(--text-14)] uppercase tracking-[0.02em] text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  grow,
}: {
  label: string;
  children: React.ReactNode;
  grow?: boolean;
}) {
  return (
    <label
      className={[
        "flex flex-col gap-1.5",
        grow ? "flex-1 min-h-0" : "",
      ].join(" ")}
    >
      <span className="text-[length:var(--text-12)] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
