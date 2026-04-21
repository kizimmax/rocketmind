"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Button, Input } from "@rocketmind/ui";
import { toast } from "sonner";
import { useAdminStore } from "@/lib/store";
import { ConfirmDialog } from "@/components/confirm-dialog";

/**
 * Менеджер тегов медиа-раздела — справочник.
 * Создание, переименование, удаление (с удалением тега у всех статей).
 */
export function TagManager() {
  const {
    mediaTags,
    articles,
    upsertMediaTag,
    renameMediaTag,
    deleteMediaTag,
  } = useAdminStore();

  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const usage = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of articles) for (const t of a.tagIds) map[t] = (map[t] ?? 0) + 1;
    return map;
  }, [articles]);

  function handleCreate() {
    const t = newLabel.trim();
    if (!t) return;
    const tag = upsertMediaTag(t);
    toast.success(`Тег «${tag.label}» добавлен`);
    setNewLabel("");
  }

  function handleStartEdit(id: string, label: string) {
    setEditingId(id);
    setEditLabel(label);
  }

  function handleSaveEdit() {
    if (!editingId) return;
    const t = editLabel.trim();
    if (!t) return;
    renameMediaTag(editingId, t);
    toast.success("Тег переименован");
    setEditingId(null);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    const tag = mediaTags.find((x) => x.id === deleteTarget);
    deleteMediaTag(deleteTarget);
    setDeleteTarget(null);
    toast.success(`Тег «${tag?.label}» удалён`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Input
          size="sm"
          placeholder="Название тега"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreate();
          }}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleCreate}
          disabled={!newLabel.trim()}
        >
          <Plus className="mr-1 h-4 w-4" />
          Добавить тег
        </Button>
      </div>

      {mediaTags.length === 0 ? (
        <p className="py-8 text-center text-[length:var(--text-14)] text-muted-foreground">
          Справочник тегов пуст.
        </p>
      ) : (
        <div className="overflow-hidden rounded-sm border border-border">
          <table className="w-full text-left text-[length:var(--text-14)]">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-[length:var(--text-11)] font-medium uppercase tracking-wider text-muted-foreground">
                <th className="py-2 px-3">Название</th>
                <th className="py-2 px-3 w-[180px]">Slug</th>
                <th className="py-2 px-3 w-[120px]">Статьи</th>
                <th className="py-2 px-3 w-[120px]"></th>
              </tr>
            </thead>
            <tbody>
              {mediaTags.map((t) => {
                const isEditing = editingId === t.id;
                return (
                  <tr
                    key={t.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-3 py-2">
                      {isEditing ? (
                        <Input
                          size="sm"
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit();
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          autoFocus
                          className="max-w-xs"
                        />
                      ) : (
                        <span className="font-[family-name:var(--font-mono-family)] uppercase tracking-[0.02em] text-foreground">
                          {t.label}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground font-mono text-[length:var(--text-12)]">
                      {t.id}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {usage[t.id] ?? 0}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={handleSaveEdit}
                              className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                              aria-label="Сохранить"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                              aria-label="Отмена"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(t.id, t.label)}
                              className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                              aria-label="Переименовать"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(t.id)}
                              className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                              aria-label="Удалить"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить тег?"
        description={
          deleteTarget
            ? `Тег будет удалён у ${usage[deleteTarget] ?? 0} статей. Это действие нельзя отменить.`
            : ""
        }
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
