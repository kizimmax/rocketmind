"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getStudents } from "@/lib/ivan-client";

type Student = {
  id: string;
  email: string;
  firstName: string;
  role: string | null;
  courseGroupId: string | null;
};

/**
 * Ученики программы — read-only. Членство = User.courseGroup (ставится только
 * self-join по QR). Фильтрации /users по группе у Ивана нет → фильтруем на
 * клиенте. Ручного add/remove и freeze у Ивана нет (управление ограничено).
 */
export function StudentsBlock({ programId }: { programId: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudents()
      .then((rows) => setStudents(rows.filter((s) => s.courseGroupId === programId)))
      .catch(() => toast.error("Не удалось загрузить учеников"))
      .finally(() => setLoading(false));
  }, [programId]);

  return (
    <div className="rounded border border-border bg-rm-gray-1/30 p-5">
      <h2 className="mb-4 text-[length:var(--text-14)] font-medium uppercase tracking-wide text-muted-foreground">
        Ученики · {students.length}
      </h2>

      {loading ? (
        <div className="flex justify-center p-4 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : students.length === 0 ? (
        <p className="text-[length:var(--text-12)] text-muted-foreground">
          Пока никто не вошёл по QR этой программы.
        </p>
      ) : (
        <div className="divide-y divide-border">
          {students.map((s) => (
            <div key={s.id} className="flex items-center gap-3 py-2.5">
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[length:var(--text-14)] text-foreground">
                  {s.firstName || "—"}
                </span>
                <span className="truncate text-[length:var(--text-12)] text-muted-foreground">
                  {s.email}
                  {s.role ? ` · ${s.role}` : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
