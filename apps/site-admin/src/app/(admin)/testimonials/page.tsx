"use client";

import { apiFetch } from "@/lib/api-client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Plus, Upload, Trash2, GripVertical, X, UserCircle, Sparkles, Loader2 } from "lucide-react";
import { Button, Input, Textarea } from "@rocketmind/ui";
import { toast } from "sonner";
import { useItemDnd } from "@/lib/use-item-dnd";
import { ConfirmDialog } from "@/components/confirm-dialog";

type Gender = "m" | "f";

type Testimonial = {
  id: string;
  order: number;
  paragraphs: string[];
  name: string;
  position: string;
  avatar: string | null;
  gender: Gender;
};

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const load = useCallback(() => {
    apiFetch("/api/testimonials")
      .then((r) => r.json())
      .then((data: Testimonial[]) =>
        setItems([...data].sort((a, b) => a.order - b.order)),
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate() {
    if (!newName.trim()) return;
    const res = await apiFetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), paragraphs: [""] }),
    });
    if (res.ok) {
      const created = (await res.json()) as Testimonial;
      setItems((prev) => [...prev, created]);
      setNewName("");
      setIsCreating(false);
      toast.success("Отзыв добавлен");
    } else {
      toast.error("Ошибка добавления");
    }
  }

  async function patch(id: string, patch: Partial<Testimonial>) {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    const res = await apiFetch(`/api/testimonials/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      toast.error("Ошибка сохранения");
      load();
    }
  }

  async function uploadAvatar(id: string, file: File) {
    const reader = new FileReader();
    reader.onload = async () => {
      await patch(id, { avatar: reader.result as string });
      toast.success("Аватар загружен");
    };
    reader.readAsDataURL(file);
  }

  async function removeAvatar(id: string) {
    await patch(id, { avatar: null });
    toast.success("Аватар удалён");
  }

  async function generateAvatar(id: string) {
    if (generatingId) return;
    setGeneratingId(id);
    try {
      const res = await apiFetch(`/api/testimonials/${encodeURIComponent(id)}/generate-avatar`, {
        method: "POST",
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "" }));
        toast.error(error ? `Ошибка генерации: ${error}` : "Ошибка генерации");
        return;
      }
      const updated = (await res.json()) as Testimonial;
      setItems((prev) => prev.map((t) => (t.id === id ? { ...t, avatar: updated.avatar } : t)));
      toast.success("Аватар сгенерирован");
    } finally {
      setGeneratingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await apiFetch(`/api/testimonials/${encodeURIComponent(deleteTarget)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setItems((prev) => prev.filter((t) => t.id !== deleteTarget));
      toast.success("Отзыв удалён");
    } else {
      toast.error("Ошибка удаления");
    }
    setDeleteTarget(null);
  }

  const handleReorder = useCallback(
    async (reordered: Testimonial[]) => {
      const next = reordered.map((t, i) => ({ ...t, order: i }));
      setItems(next);
      // Persist new order — fire-and-forget
      await Promise.all(
        next.map((t) =>
          apiFetch(`/api/testimonials/${encodeURIComponent(t.id)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: t.order }),
          }),
        ),
      );
      toast.success("Порядок сохранён");
    },
    [],
  );

  const dnd = useItemDnd(items, handleReorder);

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
          Отзывы
        </h1>
      </div>

      <div className="mb-6">
        {isCreating ? (
          <div className="flex items-center gap-2">
            <Input
              size="sm"
              placeholder="Имя Ф."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") {
                  setIsCreating(false);
                  setNewName("");
                }
              }}
              autoFocus
              className="max-w-xs"
            />
            <Button size="sm" onClick={handleCreate} disabled={!newName.trim()}>
              Создать
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsCreating(false);
                setNewName("");
              }}
            >
              Отмена
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setIsCreating(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Добавить отзыв
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {items.map((t, i) => {
          const props = dnd.itemProps(i);
          return (
            <div
              key={t.id}
              draggable={props.draggable}
              onDragStart={props.onDragStart}
              onDragOver={props.onDragOver}
              onDrop={props.onDrop}
              onDragEnd={props.onDragEnd}
              className={`group transition-opacity ${props.isDragging ? "opacity-50" : ""} ${props.isDragOver ? "ring-1 ring-foreground/30" : ""}`}
            >
              <TestimonialCard
                t={t}
                generating={generatingId === t.id}
                anyGenerating={!!generatingId}
                onPatch={(p) => patch(t.id, p)}
                onUploadAvatar={(f) => uploadAvatar(t.id, f)}
                onRemoveAvatar={() => removeAvatar(t.id)}
                onGenerateAvatar={() => generateAvatar(t.id)}
                onDelete={() => setDeleteTarget(t.id)}
                onGripDown={() => dnd.onGripDown(i)}
                onGripUp={dnd.onGripUp}
              />
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <p className="py-12 text-center text-[length:var(--text-14)] text-muted-foreground">
          Нет отзывов. Добавьте первый отзыв.
        </p>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить отзыв?"
        description="Отзыв будет удалён навсегда."
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}

// ── Testimonial Card ────────────────────────────────────────────────────────

function TestimonialCard({
  t,
  generating,
  anyGenerating,
  onPatch,
  onUploadAvatar,
  onRemoveAvatar,
  onGenerateAvatar,
  onDelete,
  onGripDown,
  onGripUp,
}: {
  t: Testimonial;
  generating: boolean;
  anyGenerating: boolean;
  onPatch: (p: Partial<Testimonial>) => void;
  onUploadAvatar: (f: File) => void;
  onRemoveAvatar: () => void;
  onGenerateAvatar: () => Promise<void>;
  onDelete: () => void;
  onGripDown: () => void;
  onGripUp: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(t.name);
  const [position, setPosition] = useState(t.position);
  const [paragraphs, setParagraphs] = useState<string[]>(
    t.paragraphs.length > 0 ? t.paragraphs : [""],
  );

  // Re-sync local state if upstream changes (e.g. after reorder reload)
  useEffect(() => setName(t.name), [t.name]);
  useEffect(() => setPosition(t.position), [t.position]);
  useEffect(() => {
    setParagraphs(t.paragraphs.length > 0 ? t.paragraphs : [""]);
  }, [t.paragraphs]);

  function commitParagraphs(next: string[]) {
    setParagraphs(next);
    onPatch({ paragraphs: next.filter((p) => p.trim().length > 0) });
  }

  return (
    <div className="relative flex gap-6 rounded bg-[#121212] p-6">
      {/* Drag handle */}
      <div
        className="absolute left-1.5 top-1.5 cursor-grab rounded-sm bg-background/50 p-0.5 text-muted-foreground opacity-0 transition-opacity select-none active:cursor-grabbing group-hover:opacity-100"
        onMouseDown={(e) => {
          e.stopPropagation();
          onGripDown();
        }}
        onMouseUp={(e) => {
          e.stopPropagation();
          onGripUp();
        }}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </div>

      {/* Delete button */}
      <button
        type="button"
        onClick={onDelete}
        className="absolute right-2 top-2 rounded-sm p-1 text-muted-foreground opacity-0 transition hover:bg-foreground/10 hover:text-[var(--rm-red-500)] group-hover:opacity-100"
        aria-label="Удалить"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      {/* Avatar column */}
      <div className="flex w-24 shrink-0 flex-col items-stretch gap-2">
        <div className="relative h-24 w-24 group/photo">
          {t.avatar ? (
            <div
              className="h-full w-full rounded-full bg-[#2a2a2a] bg-cover bg-center"
              style={{ backgroundImage: `url(${t.avatar})` }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#2a2a2a]">
              <UserCircle className="h-10 w-10 text-[#404040]" />
            </div>
          )}
          {generating && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover/photo:opacity-100 cursor-pointer"
            aria-label="Загрузить аватар"
          >
            <Upload className="h-5 w-5 text-white" />
          </button>
          {t.avatar && !generating && (
            <button
              type="button"
              onClick={onRemoveAvatar}
              className="absolute -right-1 -top-1 rounded-full bg-background p-0.5 text-muted-foreground opacity-0 transition hover:text-[var(--rm-red-500)] group-hover/photo:opacity-100"
              aria-label="Удалить аватар"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadAvatar(file);
              e.target.value = "";
            }}
          />
        </div>

        {/* Gender segmented control */}
        <div className="flex overflow-hidden rounded-sm border border-border">
          {(["m", "f"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => g !== t.gender && onPatch({ gender: g })}
              className={`flex-1 py-1 text-[length:var(--text-12)] transition ${
                t.gender === g
                  ? "bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)]"
                  : "text-muted-foreground hover:bg-foreground/5"
              }`}
            >
              {g === "m" ? "М" : "Ж"}
            </button>
          ))}
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={onGenerateAvatar}
          disabled={anyGenerating}
          className="w-full"
        >
          {generating ? (
            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="mr-1 h-3.5 w-3.5" />
          )}
          {generating ? "Генерация…" : "Сгенерировать"}
        </Button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 min-w-0">
        <div className="flex flex-col gap-1.5 sm:flex-row">
          <Input
            size="sm"
            placeholder="Имя Ф."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => name !== t.name && onPatch({ name })}
            className="sm:max-w-[240px]"
          />
          <Input
            size="sm"
            placeholder="Должность"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            onBlur={() => position !== t.position && onPatch({ position })}
          />
        </div>

        <div className="flex flex-col gap-2">
          {paragraphs.map((p, i) => (
            <div key={i} className="flex gap-2 items-start">
              <Textarea
                value={p}
                onChange={(e) => {
                  const next = [...paragraphs];
                  next[i] = e.target.value;
                  setParagraphs(next);
                }}
                onBlur={() => commitParagraphs(paragraphs)}
                placeholder={`Абзац ${i + 1}`}
                className="min-h-[60px] flex-1"
              />
              {paragraphs.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const next = paragraphs.filter((_, j) => j !== i);
                    commitParagraphs(next);
                  }}
                  className="mt-1 rounded-sm p-1 text-muted-foreground hover:bg-foreground/10 hover:text-[var(--rm-red-500)]"
                  aria-label="Удалить абзац"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="self-start text-muted-foreground"
            onClick={() => commitParagraphs([...paragraphs, ""])}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Добавить абзац
          </Button>
        </div>

        <div className="mt-1 text-[length:var(--text-12)] text-[#404040]">
          {t.id}
        </div>
      </div>
    </div>
  );
}
