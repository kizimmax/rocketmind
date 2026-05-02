"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { Button, Input } from "@rocketmind/ui";
import { apiFetch } from "@/lib/api-client";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";

type Redirect = {
  id: string;
  fromUrl: string;
  toUrl: string;
  statusCode: number;
  kind: string;
  isActive: boolean;
};

interface Props {
  /** The canonical URL this entity currently lives at, e.g. "/media/my-article" */
  currentUrl: string;
}

/**
 * Shows existing redirects pointing to `currentUrl` and lets the user
 * add manual ones or delete any.
 */
export function SlugRedirects({ currentUrl }: Props) {
  const [items, setItems] = useState<Redirect[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [newFrom, setNewFrom] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const load = useCallback(() => {
    apiFetch("/api/redirects")
      .then((r) => r.json())
      .then((all: Redirect[]) => {
        setItems(all.filter((r) => r.toUrl === currentUrl && r.isActive));
        setLoaded(true);
      })
      .catch(() => {});
  }, [currentUrl]);

  useEffect(() => { load(); }, [load]);

  async function handleAdd() {
    const from = newFrom.trim();
    if (!from) return;
    const res = await apiFetch("/api/redirects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromUrl: from, toUrl: currentUrl }),
    });
    if (res.ok) {
      const created = (await res.json()) as Redirect;
      setItems((prev) => [...prev, created]);
      setNewFrom("");
      setOpen(false);
      toast.success("Редирект добавлен");
    } else {
      const err = await res.json().catch(() => ({})) as { error?: string };
      toast.error(err.error === "redirect_exists" ? "Такой источник уже занят" : "Ошибка");
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

  if (!loaded) return null;

  return (
    <div className="flex flex-col gap-2">
      {items.length > 0 && (
        <div className="flex flex-col gap-1">
          {items.map((r) => (
            <div key={r.id} className="group flex items-center gap-2 rounded bg-foreground/5 px-3 py-1.5">
              <code className="flex-1 truncate text-[length:var(--text-11)] font-mono text-muted-foreground">
                {r.fromUrl}
              </code>
              <ArrowRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
              <code className="text-[length:var(--text-11)] font-mono text-muted-foreground/60 shrink-0">
                сюда
              </code>
              {r.kind === "auto" && (
                <span className="text-[10px] text-muted-foreground/40 shrink-0">авто</span>
              )}
              <button
                type="button"
                onClick={() => setDeleteTarget(r.id)}
                className="ml-1 rounded-sm p-0.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-[var(--rm-red-500)] transition-opacity"
                aria-label="Удалить редирект"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {open ? (
        <div className="flex items-center gap-2">
          <Input
            size="sm"
            placeholder="/старый-адрес"
            value={newFrom}
            onChange={(e) => setNewFrom(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setOpen(false); }}
            autoFocus
            className="font-mono text-[length:var(--text-12)]"
          />
          <Button size="sm" onClick={handleAdd} disabled={!newFrom.trim()}>
            Добавить
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setOpen(false); setNewFrom(""); }}>
            Отмена
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="self-start text-muted-foreground text-[length:var(--text-12)]"
          onClick={() => setOpen(true)}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Добавить ручной редирект
        </Button>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Удалить редирект?"
        description="Старый URL перестанет перенаправлять на эту страницу."
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
