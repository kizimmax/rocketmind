"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getGroups, createGroup } from "@/lib/ivan-client";
import { ApiError } from "@/lib/api";
import { Button, Input } from "@rocketmind/ui";
import { Plus, Users, Bot, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Program = {
  id: string;
  title: string;
  isActive: boolean;
  qrCode: string | null;
  agentCount: number;
};

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    getGroups()
      .then((p) => setPrograms(p))
      .catch(() => toast.error("Не удалось загрузить"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate() {
    if (!title.trim()) {
      toast.error("Введите название программы");
      return;
    }
    setSaving(true);
    try {
      await createGroup({ title });
      toast.success("Программа создана");
      setTitle("");
      setCreating(false);
      load();
    } catch (e) {
      toast.error(`Ошибка: ${e instanceof ApiError ? e.message : "не удалось создать"}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
          Программы
        </h1>
        {!creating && (
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Создать программу
          </Button>
        )}
      </div>

      {creating && (
        <div className="mb-6 rounded border border-border bg-rm-gray-1/30 p-4">
          <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">Название</label>
          <div className="flex items-center gap-2">
            <Input
              size="sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="напр. Бизнес-моделирование, апрель 2026"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") {
                  setCreating(false);
                  setTitle("");
                }
              }}
              className="max-w-md"
            />
            <Button size="sm" onClick={handleCreate} disabled={!title.trim() || saving}>
              {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              Создать
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setCreating(false);
                setTitle("");
              }}
            >
              Отмена
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="py-12 text-center text-muted-foreground">Загрузка…</p>
      ) : programs.length === 0 ? (
        <p className="py-12 text-center text-[length:var(--text-14)] text-muted-foreground">
          Пока пусто. Создайте первую программу.
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {programs.map((p) => (
            <Link
              key={p.id}
              href={`/programs/${p.id}`}
              className="flex flex-col gap-2 rounded border border-border bg-rm-gray-1/30 p-4 transition-colors hover:border-foreground/30"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="line-clamp-2 text-[length:var(--text-16)] font-medium text-foreground">
                  {p.title}
                </span>
                <span
                  className={`shrink-0 rounded-sm px-1.5 py-0.5 text-[length:var(--text-10)] uppercase ${
                    p.isActive ? "bg-foreground/10 text-foreground" : "bg-rm-gray-1/60 text-muted-foreground"
                  }`}
                >
                  {p.isActive ? "Активна" : "Закрыта"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[length:var(--text-12)] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Bot className="h-3 w-3" />
                  {p.agentCount}
                </span>
                {p.qrCode && (
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    QR готов
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
