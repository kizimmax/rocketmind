"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { Button } from "@rocketmind/ui";
import { ChevronLeft, Calendar, MapPin, Trash2, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PlaceCombobox } from "@/components/place-combobox";
import { QrBlock } from "./qr-block";
import { AgentsBlock } from "./agents-block";
import { StudentsBlock } from "./students-block";

type Place = { id: string; name: string };

type Student = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  industry: string | null;
  region: string | null;
  isActive: boolean;
  joinedAt: string;
};

type ProgramAgentRow = {
  agentId: string;
  isAvailable: boolean;
};

type Program = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  joinToken: string | null;
  place: Place | null;
  agents: ProgramAgentRow[];
  students: Student[];
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

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingPlace, setEditingPlace] = useState(false);
  const [placeDraft, setPlaceDraft] = useState("");
  const [savingPlace, setSavingPlace] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/api/programs/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((p: Program) => setProgram(p))
      .catch(() => toast.error("Не удалось загрузить программу"))
      .finally(() => setLoading(false));
  }, [id]);

  async function savePlace() {
    if (!program) return;
    setSavingPlace(true);
    try {
      const res = await apiFetch(`/api/programs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeName: placeDraft.trim() || null }),
      });
      if (!res.ok) {
        toast.error("Не удалось сохранить место");
        return;
      }
      const updated = await res.json();
      setProgram((p) => (p ? { ...p, place: updated.place ?? null } : p));
      setEditingPlace(false);
    } finally {
      setSavingPlace(false);
    }
  }

  async function handleDelete() {
    const res = await apiFetch(`/api/programs/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Программа удалена");
      router.push("/programs");
    } else {
      toast.error("Ошибка");
    }
  }

  if (loading) {
    return <p className="p-6 text-muted-foreground">Загрузка…</p>;
  }
  if (!program) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Программа не найдена.</p>
        <Link href="/programs">
          <Button size="sm" variant="ghost" className="mt-4">
            <ChevronLeft className="mr-1 h-4 w-4" />
            К списку
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Link href="/programs">
            <Button size="xs" variant="ghost" className="mb-2">
              <ChevronLeft className="mr-1 h-4 w-4" />
              К списку
            </Button>
          </Link>
          <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
            {program.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[length:var(--text-12)] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {fmtDate(program.startsAt)} – {fmtDate(program.endsAt)}
            </span>
            {editingPlace ? (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <div className="w-64">
                  <PlaceCombobox
                    value={placeDraft}
                    onChange={setPlaceDraft}
                    autoFocus
                  />
                </div>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={savePlace}
                  disabled={savingPlace}
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setEditingPlace(false)}
                  disabled={savingPlace}
                >
                  <X className="h-3 w-3" />
                </Button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setPlaceDraft(program.place?.name ?? "");
                  setEditingPlace(true);
                }}
                className="flex items-center gap-1 rounded-sm px-1 -mx-1 hover:bg-foreground/5"
              >
                <MapPin className="h-3 w-3" />
                {program.place ? program.place.name : "Указать место"}
                <Pencil className="h-3 w-3 opacity-50" />
              </button>
            )}
          </div>
        </div>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => setConfirmDelete(true)}
          className="text-destructive"
        >
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          Удалить программу
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <QrBlock
          programId={program.id}
          initialToken={program.joinToken}
          onTokenChange={(t) =>
            setProgram((p) => (p ? { ...p, joinToken: t } : p))
          }
        />
        <AgentsBlock
          programId={program.id}
          initialEnabled={program.agents.map((a) => ({
            agentId: a.agentId,
            isAvailable: a.isAvailable,
          }))}
        />
        <div className="lg:col-span-2">
          <StudentsBlock initialStudents={program.students} />
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Удалить программу?"
        description={`Программа «${program.title}» будет удалена со всеми связками. Студенты останутся, но потеряют привязку.`}
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={() => {
          setConfirmDelete(false);
          handleDelete();
        }}
      />
    </div>
  );
}
