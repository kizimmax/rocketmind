"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { Button, Input } from "@rocketmind/ui";
import {
  Upload,
  FolderPlus,
  Loader2,
  Trash2,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import type { Mascot } from "../mascot-picker";

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function MascotsLibraryPage() {
  const [mascots, setMascots] = useState<Mascot[]>([]);
  const [loading, setLoading] = useState(true);
  const [packMode, setPackMode] = useState(false);
  const [packName, setPackName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Mascot | null>(null);
  const singleRef = useRef<HTMLInputElement>(null);
  const packRef = useRef<HTMLInputElement>(null);

  function load() {
    setLoading(true);
    apiFetch("/api/mascots")
      .then((r) => r.json())
      .then(setMascots)
      .catch(() => toast.error("Не удалось загрузить"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSingleUpload(file: File) {
    setUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await apiFetch("/api/mascots/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl, name: file.name.replace(/\.[^.]+$/, "") }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Маскот загружен");
      load();
    } catch (err) {
      console.error(err);
      toast.error("Ошибка загрузки");
    } finally {
      setUploading(false);
    }
  }

  async function handlePackUpload(files: File[]) {
    if (!packName.trim()) {
      toast.error("Введите имя пака");
      return;
    }
    setUploading(true);
    try {
      const payload = await Promise.all(
        files.map(async (f) => ({
          name: f.name.replace(/\.[^.]+$/, ""),
          dataUrl: await fileToDataUrl(f),
        })),
      );
      const res = await apiFetch("/api/mascots/upload-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packName, files: payload }),
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      const okCount = (result.created as unknown[] | undefined)?.length ?? 0;
      const errCount = (result.errors as unknown[] | undefined)?.length ?? 0;
      toast.success(
        `Пак «${packName}»: ${okCount} ок${errCount ? `, ${errCount} ошибок` : ""}`,
      );
      setPackMode(false);
      setPackName("");
      load();
    } catch (err) {
      console.error(err);
      toast.error("Ошибка загрузки пака");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(m: Mascot) {
    const res = await apiFetch(`/api/mascots/${m.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Удалено");
      load();
    } else {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error === "builtin_protected" ? "Builtin удалить нельзя" : "Ошибка");
    }
  }

  const packs = new Map<string, Mascot[]>();
  for (const m of mascots) {
    const key = m.pack ?? "—";
    if (!packs.has(key)) packs.set(key, []);
    packs.get(key)!.push(m);
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/ai-agents">
            <Button variant="ghost" size="xs">
              <ChevronLeft className="mr-1 h-4 w-4" />
              К AI-экспертам
            </Button>
          </Link>
          <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
            Маскоты
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => singleRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="mr-1 h-4 w-4" />
            Загрузить новый
          </Button>
          <input
            ref={singleRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleSingleUpload(file);
              e.target.value = "";
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPackMode((v) => !v)}
            disabled={uploading}
          >
            <FolderPlus className="mr-1 h-4 w-4" />
            Загрузить пак
          </Button>
        </div>
      </div>

      {packMode && (
        <div className="mb-4 rounded border border-border bg-rm-gray-1/40 p-3">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
                Имя пака
              </label>
              <Input
                size="sm"
                value={packName}
                onChange={(e) => setPackName(e.target.value)}
                placeholder="education-v1"
                autoFocus
              />
            </div>
            <Button
              size="sm"
              onClick={() => packRef.current?.click()}
              disabled={!packName.trim() || uploading}
            >
              {uploading ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-1 h-4 w-4" />
              )}
              Выбрать файлы
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPackMode(false)}>
              Отмена
            </Button>
            <input
              ref={packRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length) handlePackUpload(files);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <p className="py-12 text-center text-muted-foreground">Загрузка…</p>
      ) : packs.size === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          Пусто. Загрузите первый маскот.
        </p>
      ) : (
        <div className="space-y-6">
          {Array.from(packs.entries()).map(([pack, list]) => (
            <div key={pack}>
              <div className="mb-2 flex items-baseline gap-2 text-[length:var(--text-12)] uppercase tracking-wide text-muted-foreground">
                <span className="font-medium">{pack}</span>
                <span>· {list.length}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-8">
                {list.map((m) => (
                  <div
                    key={m.id}
                    className="group relative aspect-square overflow-hidden rounded border border-border bg-rm-gray-1/40"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.imagePath}
                      alt={m.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-1.5 py-1 text-[length:var(--text-10)] text-white">
                      {m.name}
                    </div>
                    {!m.isBuiltIn && (
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(m)}
                        className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded bg-black/60 text-white group-hover:flex"
                        title="Удалить"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Удалить маскот?"
        description={`«${deleteTarget?.name ?? ""}» будет удалён.`}
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={() => {
          const t = deleteTarget;
          setDeleteTarget(null);
          if (t) handleDelete(t);
        }}
      />
    </div>
  );
}
