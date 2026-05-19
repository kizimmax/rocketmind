"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
} from "@rocketmind/ui";
import { apiFetch } from "@/lib/api-client";
import { toast } from "sonner";
import { Upload, FolderPlus, Loader2, Trash2 } from "lucide-react";

export type Mascot = {
  id: string;
  name: string;
  pack: string | null;
  imagePath: string;
  isBuiltIn: boolean;
};

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

interface MascotPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId: string | null;
  onSelect: (mascot: Mascot | null) => void;
}

export function MascotPicker({
  open,
  onOpenChange,
  selectedId,
  onSelect,
}: MascotPickerProps) {
  const [mascots, setMascots] = useState<Mascot[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingPack, setUploadingPack] = useState(false);
  const [packName, setPackName] = useState("");
  const [packMode, setPackMode] = useState(false);
  const singleRef = useRef<HTMLInputElement>(null);
  const packRef = useRef<HTMLInputElement>(null);

  function load() {
    setLoading(true);
    apiFetch("/api/mascots")
      .then((r) => r.json())
      .then(setMascots)
      .catch(() => toast.error("Не удалось загрузить маскотов"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (open) load();
  }, [open]);

  async function handleSingleUpload(file: File) {
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
    }
  }

  async function handlePackUpload(files: File[]) {
    if (!packName.trim()) {
      toast.error("Введите имя пака");
      return;
    }
    setUploadingPack(true);
    try {
      const payloadFiles = await Promise.all(
        files.map(async (f) => ({
          name: f.name.replace(/\.[^.]+$/, ""),
          dataUrl: await fileToDataUrl(f),
        })),
      );
      const res = await apiFetch("/api/mascots/upload-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packName, files: payloadFiles }),
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      const errCount = (result.errors as unknown[] | undefined)?.length ?? 0;
      const okCount = (result.created as unknown[] | undefined)?.length ?? 0;
      toast.success(`Пак «${packName}»: ${okCount} ок${errCount ? `, ${errCount} ошибок` : ""}`);
      setPackMode(false);
      setPackName("");
      load();
    } catch (err) {
      console.error(err);
      toast.error("Ошибка загрузки пака");
    } finally {
      setUploadingPack(false);
    }
  }

  async function handleDelete(mascot: Mascot) {
    if (mascot.isBuiltIn) {
      toast.error("Builtin-маскот нельзя удалить");
      return;
    }
    const res = await apiFetch(`/api/mascots/${mascot.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Удалено");
      load();
    } else {
      toast.error("Ошибка удаления");
    }
  }

  // Group by pack
  const packs = new Map<string, Mascot[]>();
  for (const m of mascots) {
    const key = m.pack ?? "—";
    if (!packs.has(key)) packs.set(key, []);
    packs.get(key)!.push(m);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Выбрать маскот</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => singleRef.current?.click()}
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
            size="sm"
            variant="outline"
            onClick={() => setPackMode((v) => !v)}
          >
            <FolderPlus className="mr-1 h-4 w-4" />
            Загрузить пак
          </Button>

          {selectedId && (
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto"
              onClick={() => onSelect(null)}
            >
              Снять выбор
            </Button>
          )}
        </div>

        {packMode && (
          <div className="rounded border border-border bg-rm-gray-1/40 p-3">
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
                disabled={!packName.trim() || uploadingPack}
              >
                {uploadingPack ? (
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

        <div className="max-h-[60vh] overflow-y-auto pr-1">
          {loading ? (
            <div className="flex justify-center p-6 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : packs.size === 0 ? (
            <p className="p-6 text-center text-muted-foreground">
              Нет маскотов. Загрузите первый.
            </p>
          ) : (
            Array.from(packs.entries()).map(([pack, list]) => (
              <div key={pack} className="mb-4">
                <div className="mb-2 text-[length:var(--text-12)] font-medium uppercase tracking-wide text-muted-foreground">
                  {pack}
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {list.map((m) => {
                    const isSelected = m.id === selectedId;
                    return (
                      <div
                        key={m.id}
                        className={`group relative aspect-square cursor-pointer overflow-hidden rounded border-2 transition-colors ${
                          isSelected
                            ? "border-foreground"
                            : "border-transparent hover:border-foreground/40"
                        }`}
                        onClick={() => onSelect(m)}
                        title={m.name}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.imagePath}
                          alt={m.name}
                          className="h-full w-full object-cover"
                        />
                        {!m.isBuiltIn && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(m);
                            }}
                            className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded bg-black/60 text-white group-hover:flex"
                            title="Удалить"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
