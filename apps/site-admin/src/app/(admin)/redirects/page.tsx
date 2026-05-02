"use client";

import { apiFetch } from "@/lib/api-client";
import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Pencil, Check, X, ArrowRight } from "lucide-react";
import { Button, Input, Badge } from "@rocketmind/ui";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";

type Redirect = {
  id: string;
  fromUrl: string;
  toUrl: string;
  statusCode: number;
  kind: "auto" | "manual";
  isActive: boolean;
  entityType: string | null;
  createdAt: string;
};

export default function RedirectsPage() {
  const [items, setItems] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newFrom, setNewFrom] = useState("");
  const [newTo, setNewTo] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    apiFetch("/api/redirects")
      .then((r) => r.json())
      .then((data: Redirect[]) => setItems(data))
      .catch(() => toast.error("Ошибка загрузки редиректов"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate() {
    const from = newFrom.trim();
    const to = newTo.trim();
    if (!from || !to) return;
    const res = await apiFetch("/api/redirects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromUrl: from, toUrl: to }),
    });
    if (res.ok) {
      const created = (await res.json()) as Redirect;
      setItems((prev) => [created, ...prev]);
      setNewFrom("");
      setNewTo("");
      setIsCreating(false);
      toast.success("Редирект добавлен");
    } else {
      const err = await res.json().catch(() => ({})) as { error?: string };
      toast.error(err.error === "redirect_exists" ? "Редирект с таким источником уже существует" : "Ошибка добавления");
    }
  }

  async function handleToggle(item: Redirect) {
    const res = await apiFetch(`/api/redirects/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !item.isActive }),
    });
    if (res.ok) {
      setItems((prev) => prev.map((r) => r.id === item.id ? { ...r, isActive: !item.isActive } : r));
    } else {
      toast.error("Ошибка обновления");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await apiFetch(`/api/redirects/${encodeURIComponent(deleteTarget)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setItems((prev) => prev.filter((r) => r.id !== deleteTarget));
      toast.success("Редирект удалён");
    } else {
      toast.error("Ошибка удаления");
    }
    setDeleteTarget(null);
  }

  const activeCount = items.filter((r) => r.isActive).length;

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
            Редиректы
          </h1>
          {!loading && (
            <p className="mt-0.5 text-[length:var(--text-13)] text-muted-foreground">
              {activeCount} активных · {items.length} всего
            </p>
          )}
        </div>
        {!isCreating && (
          <Button variant="outline" size="sm" onClick={() => setIsCreating(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Добавить редирект
          </Button>
        )}
      </div>

      {isCreating && (
        <div className="mb-6 flex flex-wrap items-end gap-3 rounded border border-border bg-[#121212] p-4">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <label className="text-[length:var(--text-11)] text-muted-foreground">Откуда</label>
            <Input
              size="sm"
              placeholder="/старый-адрес"
              value={newFrom}
              onChange={(e) => setNewFrom(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setIsCreating(false); }}
              autoFocus
            />
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground mb-1.5 shrink-0" />
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <label className="text-[length:var(--text-11)] text-muted-foreground">Куда</label>
            <Input
              size="sm"
              placeholder="/новый-адрес"
              value={newTo}
              onChange={(e) => setNewTo(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setIsCreating(false); }}
            />
          </div>
          <div className="flex gap-2 mb-0.5">
            <Button size="sm" onClick={handleCreate} disabled={!newFrom.trim() || !newTo.trim()}>
              Добавить
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setIsCreating(false); setNewFrom(""); setNewTo(""); }}>
              Отмена
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="py-12 text-center text-[length:var(--text-14)] text-muted-foreground">Загрузка…</p>
      ) : items.length === 0 ? (
        <p className="py-12 text-center text-[length:var(--text-14)] text-muted-foreground">
          Редиректов пока нет. Они появятся автоматически при смене slug или вручную.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <RedirectRow
              key={item.id}
              item={item}
              isEditing={editingId === item.id}
              onEditStart={() => setEditingId(item.id)}
              onEditEnd={() => setEditingId(null)}
              onToggle={() => handleToggle(item)}
              onDelete={() => setDeleteTarget(item.id)}
              onSaved={(updated) => setItems((prev) => prev.map((r) => r.id === item.id ? updated : r))}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить редирект?"
        description="Старый URL перестанет перенаправлять на новый. Это действие нельзя отменить."
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}

// ── Redirect Row ─────────────────────────────────────────────────────────────

function RedirectRow({
  item,
  isEditing,
  onEditStart,
  onEditEnd,
  onToggle,
  onDelete,
  onSaved,
}: {
  item: Redirect;
  isEditing: boolean;
  onEditStart: () => void;
  onEditEnd: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onSaved: (updated: Redirect) => void;
}) {
  const [fromUrl, setFromUrl] = useState(item.fromUrl);
  const [toUrl, setToUrl] = useState(item.toUrl);

  useEffect(() => { setFromUrl(item.fromUrl); setToUrl(item.toUrl); }, [item.fromUrl, item.toUrl]);

  async function handleSave() {
    const res = await apiFetch(`/api/redirects/${encodeURIComponent(item.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromUrl: fromUrl.trim(), toUrl: toUrl.trim() }),
    });
    if (res.ok) {
      onSaved(await res.json() as Redirect);
      onEditEnd();
      toast.success("Редирект сохранён");
    } else {
      const err = await res.json().catch(() => ({})) as { error?: string };
      toast.error(err.error === "redirect_exists" ? "Такой источник уже занят" : "Ошибка сохранения");
    }
  }

  function handleCancel() {
    setFromUrl(item.fromUrl);
    setToUrl(item.toUrl);
    onEditEnd();
  }

  const entityLabel: Record<string, string> = { article: "Статья", glossary: "Термин", page: "Страница" };

  return (
    <div className={`group flex items-center gap-3 rounded border px-4 py-3 transition-colors ${item.isActive ? "border-border bg-[#121212]" : "border-border/40 bg-[#0d0d0d] opacity-60"}`}>
      {isEditing ? (
        <>
          <Input size="sm" value={fromUrl} onChange={(e) => setFromUrl(e.target.value)} className="font-mono text-[length:var(--text-12)] flex-1" />
          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input size="sm" value={toUrl} onChange={(e) => setToUrl(e.target.value)} className="font-mono text-[length:var(--text-12)] flex-1" />
          <button
            type="button"
            onClick={handleSave}
            className="rounded-sm p-1.5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
            aria-label="Сохранить"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-sm p-1.5 text-muted-foreground hover:bg-foreground/10"
            aria-label="Отмена"
          >
            <X className="h-4 w-4" />
          </button>
        </>
      ) : (
        <>
          <code className="flex-1 truncate text-[length:var(--text-12)] font-mono text-foreground/80">
            {item.fromUrl}
          </code>
          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          <code className="flex-1 truncate text-[length:var(--text-12)] font-mono text-foreground/80">
            {item.toUrl}
          </code>

          <div className="flex items-center gap-2 ml-2 shrink-0">
            <span className="text-[length:var(--text-11)] text-muted-foreground">{item.statusCode}</span>
            {item.entityType && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {entityLabel[item.entityType] ?? item.entityType}
              </Badge>
            )}
            {item.kind === "auto" && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">авто</Badge>
            )}
          </div>

          <div className="flex items-center gap-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              type="button"
              onClick={onToggle}
              title={item.isActive ? "Деактивировать" : "Активировать"}
              className="rounded-sm p-1.5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
            >
              {item.isActive ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={onEditStart}
              className="rounded-sm p-1.5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
              aria-label="Редактировать"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-sm p-1.5 text-muted-foreground hover:bg-foreground/10 hover:text-[var(--rm-red-500)]"
              aria-label="Удалить"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
