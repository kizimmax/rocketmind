"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button, Input, Textarea, Tag } from "@rocketmind/ui";
import { toast } from "sonner";
import { useAdminStore } from "@/lib/store";
import type { GlossaryTerm } from "@/lib/types";

interface Props {
  termId: string;
}

/**
 * GlossaryTermEditor — минимальная карточка термина: title, tags, SEO.
 *
 * Редактор контента термина пока не реализован (он появится на следующей
 * итерации — структура будет клоном ArticleEditor). Сейчас сохраняем только
 * метаданные термина, которых достаточно для виджета на /media и списка
 * на /media/glossary.
 */
export function GlossaryTermEditor({ termId }: Props) {
  const router = useRouter();
  const { getGlossaryTerm, mediaTags, saveGlossaryTerm } = useAdminStore();
  const fromStore = getGlossaryTerm(termId);

  if (!fromStore) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <p className="text-muted-foreground">Термин не найден.</p>
      </div>
    );
  }

  return <Inner initial={fromStore} onSave={saveGlossaryTerm} router={router} />;
}

function Inner({
  initial,
  onSave,
  router,
}: {
  initial: GlossaryTerm;
  onSave: (t: GlossaryTerm) => void;
  router: ReturnType<typeof useRouter>;
}) {
  const { mediaTags } = useAdminStore();
  const [term, setTerm] = useState<GlossaryTerm>(initial);

  // Sync if store has updated under us (e.g. after status toggle).
  useEffect(() => {
    setTerm(initial);
  }, [initial.id]);

  const isDirty =
    term.title !== initial.title ||
    term.metaTitle !== initial.metaTitle ||
    term.metaDescription !== initial.metaDescription ||
    JSON.stringify(term.tagIds) !== JSON.stringify(initial.tagIds);

  function update<K extends keyof GlossaryTerm>(key: K, value: GlossaryTerm[K]) {
    setTerm((t) => ({ ...t, [key]: value }));
  }

  function toggleTag(id: string) {
    setTerm((t) => ({
      ...t,
      tagIds: t.tagIds.includes(id)
        ? t.tagIds.filter((x) => x !== id)
        : [...t.tagIds, id],
    }));
  }

  function handleSave() {
    onSave(term);
    toast.success("Термин сохранён");
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.push("/media?tab=glossary")}
          className="inline-flex items-center gap-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] font-medium uppercase tracking-[0.02em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />К глоссарию
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/media?tab=glossary")}
          >
            Отмена
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!isDirty}>
            Сохранить
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 max-w-2xl">
        <div>
          <h1 className="mb-4 font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
            Термин глоссария
          </h1>
          <p className="text-[length:var(--text-14)] text-muted-foreground">
            Редактор содержимого термина появится в следующей итерации. Сейчас
            доступны только метаданные: название, теги и SEO.
          </p>
        </div>

        <Field label="Название">
          <Input
            value={term.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Название термина"
          />
        </Field>

        <Field label="Slug" hint="Меняется один раз при создании — не редактируется здесь.">
          <Input value={term.slug} disabled />
        </Field>

        <Field label="Теги">
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
                  state={term.tagIds.includes(t.id) ? "active" : "interactive"}
                  as="button"
                  onClick={() => toggleTag(t.id)}
                >
                  {t.label}
                </Tag>
              ))}
            </div>
          )}
        </Field>

        <Field label="SEO Title">
          <Input
            value={term.metaTitle}
            onChange={(e) => update("metaTitle", e.target.value)}
            placeholder={`${term.title} | Глоссарий Rocketmind`}
          />
        </Field>

        <Field label="SEO Description">
          <Textarea
            value={term.metaDescription}
            onChange={(e) => update("metaDescription", e.target.value)}
            placeholder="Краткое описание для поисковиков"
            rows={3}
          />
        </Field>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] font-medium uppercase tracking-[0.02em] text-muted-foreground">
        {label}
      </span>
      {children}
      {hint && (
        <span className="text-[length:var(--text-12)] text-muted-foreground">
          {hint}
        </span>
      )}
    </label>
  );
}
