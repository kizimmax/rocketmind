"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button, Input, Textarea, Tag } from "@rocketmind/ui";
import { toast } from "sonner";
import { useAdminStore } from "@/lib/store";
import type { ArticleSection, GlossaryTerm } from "@/lib/types";
import {
  useGlossaryTermEditor,
  getGlossaryTermChanges,
} from "@/lib/use-glossary-term-editor";
import { useNavigationGuard } from "@/lib/navigation-guard";
import { EditorToolbar } from "@/components/page-editor/editor-toolbar";
import { UnsavedChangesDialog } from "@/components/page-editor/unsaved-changes-dialog";
import { ArticleSectionsEditor } from "./article-sections-editor";
import { GlossaryHeroEditor } from "./glossary-hero-editor";

interface Props {
  termId: string;
}

/**
 * GlossaryTermEditor — редактор термина глоссария.
 *
 * Совпадает по UX с редактором статей: плавающий тулбар внизу справа
 * (undo/redo + переключатель публикации + cancel + save), модалка
 * «Несохранённые изменения» при попытке уйти из редактора с грязным
 * состоянием, beforeunload-предупреждение браузера.
 */
export function GlossaryTermEditor({ termId }: Props) {
  const { getGlossaryTerm, saveGlossaryTerm } = useAdminStore();
  const fromStore = getGlossaryTerm(termId);

  if (!fromStore) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <p className="text-muted-foreground">Термин не найден.</p>
      </div>
    );
  }

  return <Inner initial={fromStore} onSave={saveGlossaryTerm} />;
}

function Inner({
  initial,
  onSave,
}: {
  initial: GlossaryTerm;
  onSave: (t: GlossaryTerm) => void;
}) {
  const router = useRouter();
  const { mediaTags } = useAdminStore();
  const {
    term,
    original,
    isDirty,
    canUndo,
    canRedo,
    update,
    undo,
    redo,
    markSaved,
    discard,
  } = useGlossaryTermEditor(initial);

  const { setDirty, pendingHref, clearPending } = useNavigationGuard();

  const [unsavedOpen, setUnsavedOpen] = useState(false);
  const [navigateTarget, setNavigateTarget] = useState<string | null>(null);

  // Sync dirty state to navigation guard so AdminHeader links trigger
  // tryNavigate → pendingHref → modal.
  useEffect(() => {
    setDirty(isDirty);
  }, [isDirty, setDirty]);

  // Cleanup on unmount — гард не должен «зависнуть» включённым.
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

  // Browser-level close/reload while dirty.
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const backHref = "/media?tab=glossary";

  function handleSave() {
    onSave(term);
    markSaved(term);
    toast.success("Термин сохранён");
  }

  function handleBack() {
    if (isDirty) {
      setNavigateTarget(backHref);
      setUnsavedOpen(true);
      return;
    }
    router.push(backHref);
  }

  function handleTogglePublish(next: boolean) {
    update("status", next ? "published" : "hidden");
  }

  function handleSaveAndLeave() {
    onSave(term);
    markSaved(term);
    setUnsavedOpen(false);
    router.push(navigateTarget || backHref);
  }

  function handleDiscardAndLeave() {
    discard();
    setUnsavedOpen(false);
    router.push(navigateTarget || backHref);
  }

  function handleCancelDialog() {
    setUnsavedOpen(false);
    setNavigateTarget(null);
  }

  function toggleTag(id: string) {
    const next = term.tagIds.includes(id)
      ? term.tagIds.filter((x) => x !== id)
      : [...term.tagIds, id];
    update("tagIds", next);
  }

  const changes = isDirty ? getGlossaryTermChanges(original, term) : [];

  return (
    <div className="flex flex-1 flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <Button variant="ghost" size="icon-sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="truncate text-[length:var(--text-18)] font-semibold text-foreground">
            {term.title || "Без названия"}
          </h1>
          <p className="truncate text-[length:var(--text-12)] text-muted-foreground">
            /media/glossary#{term.slug}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-[1400px] flex flex-col gap-8">
          {/* 1. Slug + теги (слева) + SEO (справа). Заголовок/описание ушли в hero ниже. */}
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex flex-1 flex-col gap-6 min-w-0">
              <Section title="Slug">
                <div className="flex flex-col gap-4">
                  <Field
                    label="Slug"
                    hint="Меняется один раз при создании — не редактируется здесь."
                  >
                    <Input value={term.slug} disabled />
                  </Field>
                  <p className="text-[length:var(--text-11)] text-muted-foreground">
                    Якорь термина: <code>/media/glossary#{term.slug}</code>
                  </p>
                </div>
              </Section>

              <Section title="Теги">
                {mediaTags.length === 0 ? (
                  <p className="text-[length:var(--text-14)] text-muted-foreground">
                    Теги не созданы. Создайте их во вкладке «Теги».
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {mediaTags.map((t) => (
                      <Tag
                        key={t.id}
                        size="m"
                        state={
                          term.tagIds.includes(t.id) ? "active" : "interactive"
                        }
                        as="button"
                        onClick={() => toggleTag(t.id)}
                      >
                        {t.label}
                      </Tag>
                    ))}
                  </div>
                )}
              </Section>
            </div>

            <aside className="flex flex-col gap-6 lg:w-[380px] lg:shrink-0">
              <Section title="SEO" grow>
                <div className="flex flex-1 flex-col gap-4 min-h-0">
                  <Field label="Meta title">
                    <Input
                      value={term.metaTitle}
                      onChange={(e) => update("metaTitle", e.target.value)}
                      placeholder={`${term.title} | Глоссарий Rocketmind`}
                    />
                  </Field>
                  <Field label="Meta description" grow>
                    <Textarea
                      value={term.metaDescription}
                      onChange={(e) =>
                        update("metaDescription", e.target.value)
                      }
                      placeholder="Краткое описание для поисковиков"
                      className="h-full min-h-[80px] resize-none"
                    />
                  </Field>
                </div>
              </Section>
            </aside>
          </div>

          {/* 2. Hero — заголовок + описание (тёмная плашка, как у статей). */}
          <GlossaryHeroEditor draft={term} onChange={update} />

          {/* 3. Body editor — те же секции, что у статей. */}
          <section>
            <h2 className="mb-4 font-[family-name:var(--font-mono-family)] font-medium text-[length:var(--text-14)] uppercase tracking-[0.02em] text-foreground">
              Тело термина
            </h2>
            <ArticleSectionsEditor
              articleSlug={term.slug}
              sections={term.sections ?? []}
              onChange={(next: ArticleSection[]) => update("sections", next)}
            />
          </section>
        </div>
      </div>

      {/* Floating toolbar — undo/redo, publish, cancel, save */}
      <EditorToolbar
        isDirty={isDirty}
        canUndo={canUndo}
        canRedo={canRedo}
        isPublished={term.status === "published"}
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

function Field({
  label,
  hint,
  children,
  grow,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  grow?: boolean;
}) {
  return (
    <label
      className={["flex flex-col gap-1.5", grow ? "flex-1 min-h-0" : ""].join(
        " ",
      )}
    >
      <span className="text-[length:var(--text-12)] text-muted-foreground">
        {label}
      </span>
      {children}
      {hint && (
        <span className="text-[length:var(--text-11)] text-muted-foreground">
          {hint}
        </span>
      )}
    </label>
  );
}
