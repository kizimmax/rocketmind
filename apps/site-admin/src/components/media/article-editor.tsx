"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Switch,
} from "@rocketmind/ui";
import { Pin, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { useAdminStore } from "@/lib/store";
import { useArticleEditor, getArticleChanges } from "@/lib/use-article-editor";
import { useNavigationGuard } from "@/lib/navigation-guard";
import { EditorToolbar } from "@/components/page-editor/editor-toolbar";
import { UnsavedChangesDialog } from "@/components/page-editor/unsaved-changes-dialog";
import { ArticleHeroEditor } from "./article-hero-editor";
import { ArticlePreviewCard } from "./article-preview-card";
import { ArticleSectionsEditor } from "./article-sections-editor";
import { CaseCardEditor } from "@/components/page-editor/block-editors/case-card-editor";
import type { ArticleType, CaseCardBlockData } from "@/lib/types";

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

              <Section title="Тип статьи">
                <ArticleTypeSelector
                  value={article.type}
                  onChange={(next) => {
                    update("type", next);
                    if (next === "case" && !article.caseCard) {
                      update("caseCard", emptyCaseCard());
                    }
                    if (next !== "case" && article.featured) {
                      update("featured", false);
                    }
                  }}
                />
                {article.type === "case" && (
                  <div className="mt-4">
                    <ToggleRow
                      icon={<Pin className="h-4 w-4" strokeWidth={1.5} />}
                      label="На всех страницах"
                      description="Показывать кейс в сквозном блоке «Кейсы» на всём сайте (макс. 5 включая мини-кейсы)."
                      checked={article.featured === true}
                      onCheckedChange={(v) => update("featured", v)}
                    />
                  </div>
                )}
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

              {/* Toggles ниже preview — то же расположение, что у продуктовых
                  страниц (см. editor-shell: «Экспертный продукт» и пр.). */}
              <ToggleRow
                icon={<Pin className="h-4 w-4" strokeWidth={1.5} />}
                label="Закрепить"
                description="Закреплённые статьи показываются в начале списка на /media."
                checked={article.pinned}
                onCheckedChange={(v) => {
                  // Новая закреплённая получает max+1 для начального порядка.
                  // Точный расчёт на уровне store не доступен здесь — задаём
                  // достаточно большое значение и позволяем UI списка/DnD
                  // перенормировать при необходимости.
                  update("pinned", v);
                  if (v && article.pinnedOrder === 0) {
                    update("pinnedOrder", Math.floor(Date.now() / 1000));
                  }
                }}
              />
              <ToggleRow
                icon={<LayoutGrid className="h-4 w-4" strokeWidth={1.5} />}
                label="2 колонки (широкая карточка)"
                description="Карточка занимает 2 колонки из 3 и меняет layout: обложка слева, текст ниже."
                checked={article.cardVariant === "wide"}
                onCheckedChange={(v) =>
                  update("cardVariant", v ? "wide" : "default")
                }
              />
            </aside>
          </div>

          {/* 2. Hero — главный экран */}
          <ArticleHeroEditor draft={article} onChange={update} />

          {/* 2.5 Карточка кейса — только при type=case. Используется в ленте /cases
                 (как у mini-кейсов) и не выводится в теле статьи. */}
          {article.type === "case" && (
            <section>
              <h2 className="mb-4 font-[family-name:var(--font-mono-family)] font-medium text-[length:var(--text-14)] uppercase tracking-[0.02em] text-foreground">
                Карточка кейса (для ленты /cases)
              </h2>
              <CaseCardEditor
                data={(article.caseCard ?? emptyCaseCard()) as unknown as Record<string, unknown>}
                onUpdate={(patch) => {
                  const current = (article.caseCard ?? emptyCaseCard());
                  update("caseCard", { ...current, ...(patch as Partial<CaseCardBlockData>) });
                }}
              />
            </section>
          )}

          {/* 3. Body editor — без внешней рамки/фона: редактор живёт «в ленте» страницы */}
          <section>
            <h2 className="mb-4 font-[family-name:var(--font-mono-family)] font-medium text-[length:var(--text-14)] uppercase tracking-[0.02em] text-foreground">
              Тело статьи
            </h2>
            <ArticleSectionsEditor
              articleSlug={article.slug}
              sections={article.body}
              onChange={(next) => update("body", next)}
            />
          </section>
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
      <UnsavedChangesDialog
        open={unsavedOpen}
        changes={changes}
        onCancel={handleCancelDialog}
        onDiscard={handleDiscardAndLeave}
        onSave={handleSaveAndLeave}
      />
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

function ToggleRow({
  icon,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-sm border border-border p-3">
      <div className="flex items-start gap-2.5 min-w-0">
        <span className="mt-0.5 text-muted-foreground">{icon}</span>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[length:var(--text-14)] font-medium text-foreground">
            {label}
          </span>
          <span className="text-[length:var(--text-12)] text-muted-foreground">
            {description}
          </span>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="shrink-0"
      />
    </label>
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

function emptyCaseCard(): CaseCardBlockData {
  return {
    title: "",
    description: "",
    stats: [
      { value: "", label: "", description: "" },
      { value: "", label: "", description: "" },
      { value: "", label: "", description: "" },
    ],
    result: "",
  };
}

const ARTICLE_TYPE_OPTIONS: ReadonlyArray<{
  id: ArticleType;
  label: string;
  description: string;
}> = [
  {
    id: "default",
    label: "Обычная",
    description: "Стандартная статья без бейджа.",
  },
  {
    id: "lesson",
    label: "Урок",
    description: "Бирюзовый бейдж «Урок» на карточке. Попадает в фильтр /media/tag/lesson.",
  },
  {
    id: "case",
    label: "Кейс",
    description:
      "Терракотовый бейдж «Кейс». Появляется в ленте /cases и в админке в разделе «Кейсы». Появляется блок «Карточка кейса» ниже.",
  },
];

function ArticleTypeSelector({
  value,
  onChange,
}: {
  value: ArticleType;
  onChange: (next: ArticleType) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {ARTICLE_TYPE_OPTIONS.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={[
              "flex items-start gap-3 rounded-sm border p-3 text-left transition-colors",
              active
                ? "border-foreground bg-[color:var(--rm-gray-1)]"
                : "border-border hover:bg-[color:var(--rm-gray-1)]/50",
            ].join(" ")}
            aria-pressed={active}
          >
            <span
              className={[
                "mt-1 h-3.5 w-3.5 shrink-0 rounded-full border",
                active
                  ? "border-foreground bg-foreground"
                  : "border-border bg-transparent",
              ].join(" ")}
            />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[length:var(--text-14)] font-medium text-foreground">
                {opt.label}
              </span>
              <span className="text-[length:var(--text-12)] text-muted-foreground">
                {opt.description}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
