"use client";

import { useState } from "react";
import { Button, Switch } from "@rocketmind/ui";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import { ConfirmDialog } from "@/components/confirm-dialog";

type Student = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  isActive: boolean;
  joinedAt: string;
};

function fmtDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function StudentsBlock({ initialStudents }: { initialStudents: Student[] }) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  async function toggleActive(s: Student) {
    setPending((p) => new Set(p).add(s.id));
    const next = !s.isActive;
    setStudents((prev) =>
      prev.map((x) => (x.id === s.id ? { ...x, isActive: next } : x)),
    );
    try {
      const res = await apiFetch(`/api/students/${s.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: next }),
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (err) {
      console.error(err);
      toast.error("Ошибка");
      setStudents((prev) =>
        prev.map((x) => (x.id === s.id ? { ...x, isActive: !next } : x)),
      );
    } finally {
      setPending((p) => {
        const n = new Set(p);
        n.delete(s.id);
        return n;
      });
    }
  }

  async function handleDelete(s: Student) {
    const res = await apiFetch(`/api/students/${s.id}`, { method: "DELETE" });
    if (res.ok) {
      setStudents((prev) => prev.filter((x) => x.id !== s.id));
      toast.success("Студент удалён");
    } else {
      toast.error("Ошибка");
    }
  }

  return (
    <div className="rounded border border-border bg-rm-gray-1/30 p-5">
      <h2 className="mb-4 text-[length:var(--text-14)] font-medium uppercase tracking-wide text-muted-foreground">
        Ученики · {students.length}
      </h2>

      {students.length === 0 ? (
        <p className="text-[length:var(--text-12)] text-muted-foreground">
          Пока никто не зарегистрировался.
        </p>
      ) : (
        <div className="divide-y divide-border">
          {students.map((s) => {
            const fullName = [s.firstName, s.lastName].filter(Boolean).join(" ") || "—";
            const isPending = pending.has(s.id);
            return (
              <div key={s.id} className="flex items-center gap-3 py-2.5">
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[length:var(--text-14)] text-foreground">
                    {fullName}
                  </span>
                  <span className="truncate text-[length:var(--text-12)] text-muted-foreground">
                    {s.email}
                    {s.role ? ` · ${s.role}` : ""} · {fmtDate(s.joinedAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[length:var(--text-12)] ${s.isActive ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {s.isActive ? "Активен" : "Отключён"}
                  </span>
                  <Switch
                    checked={s.isActive}
                    onCheckedChange={() => toggleActive(s)}
                    disabled={isPending}
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setDeleteTarget(s)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Удалить ученика?"
        description={`${deleteTarget?.email ?? ""} будет удалён вместе со всеми проектами и диалогами.`}
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
