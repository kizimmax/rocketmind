"use client";

import { useEffect, useState } from "react";
import { Button, Input, Checkbox } from "@rocketmind/ui";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getPermissionGroups,
  createRole,
  updateRole,
  deleteRole,
} from "@/lib/ivan-client";
import { ApiError } from "@/lib/api";
import type { ClientRoleDetail, PermissionGroup } from "@/lib/ivan-auth";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface RoleEditorProps {
  role: ClientRoleDetail | null; // null = создание
  onSaved: (role: ClientRoleDetail) => void;
  onDeleted?: () => void;
  onCancel?: () => void;
}

export function RoleEditor({ role, onSaved, onDeleted, onCancel }: RoleEditorProps) {
  const isEdit = !!role;
  const readOnly = !!role?.isSystem; // системные роли менять нельзя

  const [name, setName] = useState(role?.name ?? "");
  const [selected, setSelected] = useState<Set<string>>(new Set(role?.permissions ?? []));
  const [groups, setGroups] = useState<PermissionGroup[]>([]);
  const [loadingPerms, setLoadingPerms] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    getPermissionGroups()
      .then(setGroups)
      .catch(() => toast.error("Не удалось загрузить список прав"))
      .finally(() => setLoadingPerms(false));
  }, []);

  function toggle(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function save() {
    if (!name.trim()) {
      toast.error("Введите название роли");
      return;
    }
    setSaving(true);
    try {
      const perms = [...selected];
      const saved = isEdit
        ? await updateRole(role!.id, name, perms)
        : await createRole(name, perms);
      toast.success(isEdit ? "Роль сохранена" : "Роль создана");
      onSaved(saved);
    } catch (e) {
      toast.error(`Ошибка: ${e instanceof ApiError ? e.message : "не удалось сохранить"}`);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!role) return;
    try {
      await deleteRole(role.id);
      toast.success("Роль удалена");
      onDeleted?.();
    } catch (e) {
      toast.error(`Ошибка: ${e instanceof ApiError ? e.message : "не удалось удалить"}`);
    }
  }

  return (
    <>
      <div className="max-w-2xl space-y-6">
        {readOnly && (
          <p className="rounded border border-border bg-rm-gray-1/40 px-3 py-2 text-[length:var(--text-12)] text-muted-foreground">
            Это системная роль — её нельзя изменить или удалить.
          </p>
        )}

        <div>
          <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
            Название роли
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="напр. Контент-менеджер"
            disabled={readOnly}
            className="max-w-sm"
          />
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-[length:var(--text-12)] uppercase tracking-wide text-muted-foreground">
              Права роли
            </span>
            <span className="text-[length:var(--text-12)] text-muted-foreground">
              выбрано: {selected.size}
            </span>
          </div>

          {loadingPerms ? (
            <div className="flex justify-center p-6 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : groups.length === 0 ? (
            <p className="text-[length:var(--text-12)] text-muted-foreground">
              Список прав пуст.
            </p>
          ) : (
            <div className="space-y-5">
              {groups.map((g) => (
                <div key={g.group} className="rounded border border-border bg-rm-gray-1/30 p-4">
                  <h3 className="mb-3 text-[length:var(--text-14)] font-medium text-foreground">
                    {g.group}
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {g.actions.map((a) => (
                      <label
                        key={a.key}
                        className={`flex items-center gap-2 text-[length:var(--text-14)] ${
                          readOnly ? "cursor-default opacity-70" : "cursor-pointer"
                        }`}
                      >
                        <Checkbox
                          checked={selected.has(a.key)}
                          onChange={() => toggle(a.key)}
                          disabled={readOnly}
                        />
                        <span className="text-foreground">{a.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <div>
          {isEdit && !readOnly && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Удалить роль
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Отмена
            </Button>
          )}
          {!readOnly && (
            <Button size="sm" onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              {isEdit ? "Сохранить" : "Создать"}
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Удалить роль?"
        description={`Роль «${role?.name ?? ""}» будет удалена. Это действие нельзя отменить.`}
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={() => {
          setConfirmDelete(false);
          remove();
        }}
      />
    </>
  );
}
