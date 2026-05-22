"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { Button, Switch } from "@rocketmind/ui";
import { ChevronLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { QrBlock } from "./qr-block";
import { AgentsBlock } from "./agents-block";
import { StudentsBlock } from "./students-block";

type Program = {
  id: string;
  title: string;
  isActive: boolean;
  qrCode: string | null;
  agents: string[];
};

export default function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  async function handleDelete() {
    const res = await apiFetch(`/api/programs/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Программа удалена");
      router.push("/programs");
    } else {
      toast.error("Ошибка");
    }
  }

  async function toggleProgramActive(next: boolean) {
    if (!program) return;
    const prev = program.isActive;
    setProgram((p) => (p ? { ...p, isActive: next } : p));
    try {
      const res = await apiFetch(`/api/programs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: next }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(next ? "Программа активна" : "Программа закрыта");
    } catch {
      setProgram((p) => (p ? { ...p, isActive: prev } : p));
      toast.error("Не удалось обновить статус");
    }
  }

  if (loading) return <p className="p-6 text-muted-foreground">Загрузка…</p>;
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

      {/* Свитч «программа активна» — закрывает доступ участникам. */}
      <div className="mb-5 flex items-center justify-between rounded border border-border bg-rm-gray-1/30 p-4">
        <div className="min-w-0">
          <p className="text-[length:var(--text-14)] font-medium text-foreground">
            {program.isActive ? "Программа активна" : "Программа закрыта"}
          </p>
          <p className="mt-0.5 text-[length:var(--text-12)] text-muted-foreground">
            {program.isActive
              ? "Участники имеют доступ к AI-экспертам."
              : "Участники видят сообщение о завершении и плашку с подпиской."}
          </p>
        </div>
        <Switch checked={program.isActive} onCheckedChange={(v) => toggleProgramActive(Boolean(v))} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <QrBlock
          programId={program.id}
          initialQrCode={program.qrCode}
          onQrChange={(code) => setProgram((p) => (p ? { ...p, qrCode: code } : p))}
        />
        <AgentsBlock programId={program.id} initialAgentIds={program.agents} />
        <div className="lg:col-span-2">
          <StudentsBlock programId={program.id} />
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Удалить программу?"
        description={`Программа «${program.title}» будет удалена.`}
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
