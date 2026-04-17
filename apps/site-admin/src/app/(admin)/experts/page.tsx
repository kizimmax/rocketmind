"use client";

import { apiFetch } from "@/lib/api-client";
import { useEffect, useState, useRef } from "react";
import { Plus, Upload, Trash2, UserCircle } from "lucide-react";
import { Button, Input } from "@rocketmind/ui";
import { toast } from "sonner";
import { InlineEdit } from "@/components/inline-edit";
import { MdText } from "@/components/md-text";
import { ConfirmDialog } from "@/components/confirm-dialog";

type ExpertInfo = {
  slug: string;
  name: string;
  tag: string;
  shortBio: string;
  bio: string;
  image: string | null;
};

export default function ExpertsPage() {
  const [experts, setExperts] = useState<ExpertInfo[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  function load() {
    apiFetch("/api/experts")
      .then((r) => r.json())
      .then(setExperts)
      .catch(() => {});
  }

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    if (!newName.trim()) return;
    const slug = newName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-zа-яё0-9-]/gi, "");
    const res = await apiFetch("/api/experts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, name: newName.trim() }),
    });
    if (res.ok) {
      setNewName("");
      setIsCreating(false);
      load();
      toast.success(`Эксперт «${newName.trim()}» создан`);
    } else {
      const err = await res.json();
      toast.error(err.error === "exists" ? "Эксперт уже существует" : "Ошибка");
    }
  }

  async function updateExpert(slug: string, field: string, value: string) {
    await apiFetch(`/api/experts/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    setExperts((prev) =>
      prev.map((e) => (e.slug === slug ? { ...e, [field]: value } : e)),
    );
    toast.success("Сохранено");
  }

  async function uploadPhoto(slug: string, file: File) {
    const formData = new FormData();
    formData.append("photo", file);
    const res = await apiFetch(`/api/experts/${slug}`, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const { image } = await res.json();
      setExperts((prev) =>
        prev.map((e) => (e.slug === slug ? { ...e, image } : e)),
      );
      toast.success("Фото загружено");
    } else {
      toast.error("Ошибка загрузки");
    }
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
          Эксперты
        </h1>
      </div>

      {/* Create expert */}
      <div className="mb-6">
        {isCreating ? (
          <div className="flex items-center gap-2">
            <Input
              size="sm"
              placeholder="Имя Фамилия"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") { setIsCreating(false); setNewName(""); }
              }}
              autoFocus
              className="max-w-xs"
            />
            <Button size="sm" onClick={handleCreate} disabled={!newName.trim()}>
              Создать
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setIsCreating(false); setNewName(""); }}>
              Отмена
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setIsCreating(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Добавить эксперта
          </Button>
        )}
      </div>

      {/* Expert cards — desktop-like preview */}
      <div className="grid gap-4 sm:grid-cols-2">
        {experts.map((expert) => (
          <ExpertCard
            key={expert.slug}
            expert={expert}
            onUpdate={(field, value) => updateExpert(expert.slug, field, value)}
            onUploadPhoto={(file) => uploadPhoto(expert.slug, file)}
          />
        ))}
      </div>

      {experts.length === 0 && (
        <p className="py-12 text-center text-[length:var(--text-14)] text-muted-foreground">
          Нет экспертов. Добавьте первого эксперта.
        </p>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить эксперта?"
        description="Эксперт будет удалён. Это действие нельзя отменить."
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={() => { setDeleteTarget(null); }}
      />
    </div>
  );
}

// ── Expert Card ────────────────────────────────────────────────────────────────

function ExpertCard({
  expert,
  onUpdate,
  onUploadPhoto,
}: {
  expert: ExpertInfo;
  onUpdate: (field: string, value: string) => void;
  onUploadPhoto: (file: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex gap-8 rounded bg-[#121212] p-8 min-h-[349px]">
      {/* Photo */}
      <div className="relative w-[45%] shrink-0 self-stretch group/photo">
        {expert.image ? (
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${expert.image})` }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#2a2a2a]">
            <UserCircle className="h-16 w-16 text-[#404040]" />
          </div>
        )}
        {/* Upload overlay */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/photo:opacity-100 cursor-pointer"
        >
          <Upload className="h-6 w-6 text-white" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUploadPhoto(file);
            e.target.value = "";
          }}
        />
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <InlineEdit
          value={expert.tag}
          onSave={(v) => onUpdate("tag", v)}
          placeholder="Эксперт продукта"
        >
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
            {expert.tag || "Эксперт продукта"}
          </span>
        </InlineEdit>

        <div className="flex flex-1 flex-col gap-6">
          <InlineEdit
            value={expert.name}
            onSave={(v) => onUpdate("name", v)}
            placeholder="Имя Фамилия"
          >
            <h3 className="h3 text-[#F0F0F0]">{expert.name || "Имя Фамилия"}</h3>
          </InlineEdit>

          <div className="flex flex-1 flex-col gap-3 justify-end">
            <InlineEdit
              value={expert.shortBio}
              onSave={(v) => onUpdate("shortBio", v)}
              multiline
              copy
              placeholder="Короткое описание — опыт и должность"
            >
              <MdText
                value={expert.shortBio}
                placeholder="Короткое описание — опыт и должность"
                className="text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#F0F0F0]"
              />
            </InlineEdit>

            <InlineEdit
              value={expert.bio}
              onSave={(v) => onUpdate("bio", v)}
              multiline
              copy
              placeholder="Полная биография эксперта"
            >
              <MdText
                value={expert.bio}
                placeholder="Полная биография эксперта"
                className="text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]"
              />
            </InlineEdit>
          </div>
        </div>

        <div className="mt-auto pt-2">
          <span className="text-[length:var(--text-12)] text-[#404040]">
            {expert.slug}
          </span>
        </div>
      </div>
    </div>
  );
}
