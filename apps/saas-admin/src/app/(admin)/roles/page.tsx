"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@rocketmind/ui";
import { Plus, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";
import { getRoles } from "@/lib/ivan-client";
import type { ClientRole } from "@/lib/ivan-auth";

export default function RolesPage() {
  const [roles, setRoles] = useState<ClientRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRoles()
      .then(setRoles)
      .catch(() => toast.error("Не удалось загрузить роли"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
          Роли
        </h1>
        <Link href="/roles/new">
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Создать роль
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="py-12 text-center text-muted-foreground">Загрузка…</p>
      ) : roles.length === 0 ? (
        <p className="py-12 text-center text-[length:var(--text-14)] text-muted-foreground">
          Пока нет ролей. Создайте первую.
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => (
            <Link
              key={r.id}
              href={`/roles/${r.id}`}
              className="flex items-center gap-3 rounded border border-border bg-rm-gray-1/30 p-4 transition-colors hover:border-foreground/30"
            >
              <ShieldCheck className="h-5 w-5 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate text-[length:var(--text-14)] font-medium text-foreground">
                {r.name}
              </span>
              {r.isSystem && (
                <span className="flex shrink-0 items-center gap-1 text-[length:var(--text-10)] uppercase tracking-wide text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  системная
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
