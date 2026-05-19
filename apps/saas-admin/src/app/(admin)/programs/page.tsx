"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { Button, Input } from "@rocketmind/ui";
import { Plus, Calendar, MapPin, Users, Bot, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PlaceCombobox } from "@/components/place-combobox";

type Place = { id: string; name: string };

type Program = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  joinToken: string | null;
  place: Place | null;
  _count: { students: number; agents: number };
};

function fmtDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // create form
  const [title, setTitle] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    apiFetch("/api/programs")
      .then((r) => r.json())
      .then((p) => setPrograms(p))
      .catch(() => toast.error("Не удалось загрузить"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setTitle("");
    setPlaceName("");
    setStartsAt("");
    setEndsAt("");
  }

  async function handleCreate() {
    if (!title.trim()) {
      toast.error("Введите название программы");
      return;
    }
    if (!startsAt || !endsAt) {
      toast.error("Укажите даты программы");
      return;
    }
    setSaving(true);
    try {
      const res = await apiFetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          placeName: placeName.trim() || null,
          startsAt: new Date(startsAt).toISOString(),
          endsAt: new Date(endsAt).toISOString(),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(`Ошибка: ${err.error ?? res.status}`);
        return;
      }
      toast.success("Программа создана");
      resetForm();
      setCreating(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
          Офлайн программы
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
          <div className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
                Название
              </label>
              <Input
                size="sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="напр. Бизнес-моделирование, апрель 2026"
                autoFocus
              />
            </div>
            <div>
              <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
                Место
              </label>
              <PlaceCombobox value={placeName} onChange={setPlaceName} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
                  Старт
                </label>
                <Input
                  size="sm"
                  type="date"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
                  Финиш
                </label>
                <Input
                  size="sm"
                  type="date"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setCreating(false);
                resetForm();
              }}
            >
              Отмена
            </Button>
            <Button size="sm" onClick={handleCreate} disabled={saving}>
              {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              Создать
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
                {p.joinToken && (
                  <span className="shrink-0 rounded-sm bg-foreground/10 px-1.5 py-0.5 text-[length:var(--text-10)] uppercase text-foreground">
                    QR
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[length:var(--text-12)] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {fmtDate(p.startsAt)} – {fmtDate(p.endsAt)}
                </span>
                {p.place && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {p.place.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Bot className="h-3 w-3" />
                  {p._count.agents}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {p._count.students}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
