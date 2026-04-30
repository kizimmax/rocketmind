"use client";

import { apiFetch } from "@/lib/api-client";
import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button, Input } from "@rocketmind/ui";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import type { CtaEntity, FormEntity, EntityScope } from "@/lib/types";
import {
  ID_REGEX,
  SCOPE_LABEL,
  ScopeFilter,
  ScopeSelect,
  slugify,
  uniqueSlug,
} from "./scope-helpers";
import { InlineEdit } from "@/components/inline-edit";

export function CtaPanel({ forms }: { forms: FormEntity[] }) {
  const [items, setItems] = useState<CtaEntity[]>([]);
  const [scopeFilter, setScopeFilter] = useState<EntityScope | "all">("all");
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newId, setNewId] = useState("");
  const [idTouched, setIdTouched] = useState(false);
  const [newScope, setNewScope] = useState<EntityScope>("both");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const existingIds = new Set(items.map((c) => c.id));
  const idCollision = newId !== "" && existingIds.has(newId);

  const load = useCallback(() => {
    apiFetch("/api/ctas")
      .then((r) => r.json() as Promise<CtaEntity[]>)
      .then(setItems)
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate() {
    const name = newName.trim();
    const id = (newId.trim() || slugify(name)).trim();
    if (!name) return;
    if (!ID_REGEX.test(id)) {
      toast.error("ID может содержать только латиницу, цифры и дефис");
      return;
    }
    const res = await apiFetch("/api/ctas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, scope: newScope }),
    });
    if (res.ok) {
      const created = (await res.json()) as CtaEntity;
      setItems((prev) => [...prev, created]);
      setNewName("");
      setNewId("");
      setIdTouched(false);
      setNewScope("both");
      setIsCreating(false);
      toast.success("CTA создан");
    } else if (res.status === 409) {
      toast.error("CTA с таким ID уже существует");
    } else {
      toast.error("Ошибка создания");
    }
  }

  async function patch(id: string, patch: Partial<CtaEntity>) {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    const current = items.find((c) => c.id === id);
    if (!current) return;
    const next = { ...current, ...patch };
    const res = await apiFetch(`/api/ctas/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    if (!res.ok) {
      toast.error("Ошибка сохранения");
      load();
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await apiFetch(
      `/api/ctas/${encodeURIComponent(deleteTarget)}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      setItems((prev) => prev.filter((c) => c.id !== deleteTarget));
      toast.success("CTA удалён");
    } else {
      toast.error("Ошибка удаления");
    }
    setDeleteTarget(null);
  }

  // Порядок: header (кнопка в шапке) → default (основной CTA) → остальные.
  const sortKey = (id: string) =>
    id === "header" ? 0 : id === "default" ? 1 : 2;
  const visibleItems = items
    .filter((c) => scopeFilter === "all" || c.scope === scopeFilter)
    .slice()
    .sort((a, b) => sortKey(a.id) - sortKey(b.id));

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] font-bold uppercase tracking-tight text-foreground">
          CTA-блоки
        </h2>
        <ScopeFilter value={scopeFilter} onChange={setScopeFilter} />
      </div>

      <div className="mb-4">
        {isCreating ? (
          <div className="flex flex-wrap items-center gap-2">
            <Input
              size="sm"
              placeholder="Название (для админки)"
              value={newName}
              onChange={(e) => {
                const name = e.target.value;
                setNewName(name);
                if (!idTouched) {
                  setNewId(uniqueSlug(slugify(name), existingIds));
                }
              }}
              autoFocus
              className="max-w-xs"
            />
            <Input
              size="sm"
              placeholder="id (slug)"
              value={newId}
              onChange={(e) => {
                setIdTouched(true);
                setNewId(e.target.value);
              }}
              className={`max-w-[180px] font-mono ${
                idCollision ? "border-[var(--rm-red-500)]" : ""
              }`}
            />
            <ScopeSelect value={newScope} onChange={setNewScope} size="sm" />
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={!newName.trim() || !newId.trim() || idCollision}
            >
              Создать
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsCreating(false);
                setNewName("");
                setNewId("");
                setIdTouched(false);
                setNewScope("both");
              }}
            >
              Отмена
            </Button>
            {idCollision && (
              <p className="basis-full text-[length:var(--text-11)] text-[var(--rm-red-500)]">
                ID «{newId}» уже занят. Измени вручную или сотри — авто-ID
                подберёт свободный.
              </p>
            )}
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="mr-1 h-4 w-4" />
            Добавить CTA
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {visibleItems.map((c) => (
          <CtaCard
            key={c.id}
            cta={c}
            forms={forms}
            onPatch={(p) => patch(c.id, p)}
            onDelete={() => setDeleteTarget(c.id)}
          />
        ))}
      </div>

      {visibleItems.length === 0 && (
        <p className="py-12 text-center text-[length:var(--text-14)] text-muted-foreground">
          {items.length === 0
            ? "Нет CTA. Создайте первый."
            : `Нет CTA в скоупе «${SCOPE_LABEL[scopeFilter as EntityScope] ?? ""}»`}
        </p>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить CTA?"
        description="Если он используется на страницах или в статьях — кнопки перестанут открывать форму."
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}

// ── CTA Card ────────────────────────────────────────────────────────────────

function CtaCard({
  cta,
  forms,
  onPatch,
  onDelete,
}: {
  cta: CtaEntity;
  forms: FormEntity[];
  onPatch: (p: Partial<CtaEntity>) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(cta.name);

  useEffect(() => setName(cta.name), [cta.name]);

  return (
    <div className="group relative flex flex-col rounded-sm border border-[#404040] bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[#404040] px-3 py-2">
        <Input
          size="sm"
          placeholder="Название (для админки)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => name !== cta.name && onPatch({ name })}
          className="max-w-[200px] border-0 bg-transparent shadow-none focus-visible:ring-1"
        />
        {cta.id === "header" ? (
          <span className="rounded-sm bg-[var(--rm-yellow-100)]/15 px-2 py-0.5 text-[length:var(--text-11)] uppercase tracking-wide text-[var(--rm-yellow-100)]">
            В шапке сайта
          </span>
        ) : (
          <ScopeSelect
            value={cta.scope}
            onChange={(scope) => onPatch({ scope })}
            size="sm"
          />
        )}
        <span className="ml-auto font-mono text-[length:var(--text-11)] text-[#666]">
          id: {cta.id}
        </span>
        {cta.id !== "header" && (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-sm p-1 text-muted-foreground opacity-0 transition hover:bg-foreground/10 hover:text-[var(--rm-red-500)] group-hover:opacity-100"
            aria-label="Удалить"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {cta.id === "header" ? (
        /* Header CTA — компактный preview жёлтой кнопки в шапке + только text */
        <div className="flex flex-col gap-3 px-3 py-4">
          <p className="text-[length:var(--text-11)] text-muted-foreground">
            Кнопка справа от меню в шапке (на мобильном — слева от бургера).
            На главной появляется только при скролле ниже Hero.
          </p>
          <div className="flex items-center justify-center rounded-sm border border-dashed border-[#404040] bg-[#0A0A0A] p-4">
            <InlineEdit
              value={cta.buttonText}
              onSave={(v) => onPatch({ buttonText: v })}
              placeholder="оставить заявку"
            >
              <span className="inline-flex w-fit items-center rounded-sm bg-[var(--rm-yellow-100)] px-4 py-2 font-['Loos_Condensed',sans-serif] text-[14px] font-medium uppercase tracking-[0.04em] text-[#0A0A0A]">
                {cta.buttonText || "оставить заявку"}
              </span>
            </InlineEdit>
          </div>
        </div>
      ) : (
        /* Yellow CTA preview — фон и шрифты как у настоящего блока на сайте */
        <div className="relative bg-[#FFCC00] p-4">
          <div className="flex flex-col items-start gap-3">
            {/* Heading — крупный uppercase, как на сайте */}
            <InlineEdit
              value={cta.heading}
              onSave={(v) => onPatch({ heading: v })}
              multiline
              placeholder="Заголовок CTA"
            >
              <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-20)] font-bold uppercase leading-[1.12] tracking-[-0.01em] text-[#0A0A0A] whitespace-pre-line">
                {cta.heading || (
                  <span className="text-[#0A0A0A]/40">Заголовок CTA</span>
                )}
              </h2>
            </InlineEdit>
            {/* Body — copy-16 */}
            <InlineEdit
              value={cta.body}
              onSave={(v) => onPatch({ body: v })}
              multiline
              placeholder="Описание под заголовком"
            >
              <p className="text-[length:var(--text-13)] leading-[1.32] text-[#0A0A0A] whitespace-pre-line">
                {cta.body || (
                  <span className="text-[#0A0A0A]/40">
                    Описание под заголовком
                  </span>
                )}
              </p>
            </InlineEdit>
            {/* Button — чёрный квадрат, реальный размер по тексту */}
            <InlineEdit
              value={cta.buttonText}
              onSave={(v) => onPatch({ buttonText: v })}
              placeholder="оставить заявку"
            >
              <span className="inline-flex w-fit items-center rounded-sm bg-[#0A0A0A] px-3 py-2 font-['Loos_Condensed',sans-serif] text-[14px] font-medium uppercase tracking-[0.04em] text-[#F0F0F0]">
                {cta.buttonText || (
                  <span className="text-[#F0F0F0]/40">оставить заявку</span>
                )}
              </span>
            </InlineEdit>
          </div>
        </div>
      )}

      {/* Form selector — всегда виден, это главная настройка кнопки */}
      <div className="flex flex-col gap-1.5 border-t border-[#404040] px-3 py-3">
        <label className="text-[length:var(--text-11)] uppercase tracking-wide text-muted-foreground">
          Форма, открывается по клику
        </label>
        <select
          value={cta.formId ?? ""}
          onChange={(e) =>
            onPatch({ formId: e.target.value || undefined })
          }
          className={`h-8 rounded-sm border bg-background px-2 text-[length:var(--text-12)] text-foreground ${
            cta.formId
              ? "border-border"
              : "border-[var(--rm-red-500)]/60"
          }`}
        >
          <option value="">— не задано (кнопка не откроет модалку) —</option>
          {forms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name || f.id} [{SCOPE_LABEL[f.scope]}]
            </option>
          ))}
        </select>
        {!cta.formId && (
          <p className="text-[length:var(--text-11)] text-[var(--rm-red-500)]">
            Без формы кнопка ничего не делает на сайте.
          </p>
        )}
        {cta.scope === "product" && cta.formId && (
          <p className="text-[length:var(--text-11)] text-muted-foreground">
            На продуктовых страницах форма страницы перебивает это поле.
          </p>
        )}
      </div>
    </div>
  );
}
