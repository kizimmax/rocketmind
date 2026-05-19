"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Snowflake } from "lucide-react";
import { Button } from "@rocketmind/ui";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import { CreateUserDialog } from "@/components/users/create-user-dialog";

interface UserRow {
  id: string;
  firstName: string;
  lastName: string;
  login: string;
  email: string | null;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
  status: "ACTIVE" | "FROZEN";
  lastLoginAt: string | null;
  createdAt: string;
  createdById: string | null;
}

function roleLabel(r: UserRow["role"]): string {
  if (r === "SUPER_ADMIN") return "Главный админ";
  if (r === "ADMIN") return "Администратор";
  return "Редактор";
}

function fmt(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [assignableRoles, setAssignableRoles] = useState<Array<"ADMIN" | "EDITOR">>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  function load() {
    setLoading(true);
    apiFetch("/api/admin/users")
      .then((r) => r.json())
      .then((data: { users: UserRow[]; assignableRoles: Array<"ADMIN" | "EDITOR"> }) => {
        setUsers(data.users);
        setAssignableRoles(data.assignableRoles);
      })
      .catch(() => toast.error("Не удалось загрузить пользователей"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-border">
        <h1 className="text-[length:var(--text-20)] font-semibold text-foreground">
          Пользователи
        </h1>
        {assignableRoles.length > 0 && (
          <Button onClick={() => setCreating(true)}>
            <Plus size={14} className="mr-1" />
            Создать
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="p-6 text-muted-foreground">Загрузка…</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-muted-foreground">Нет пользователей</div>
        ) : (
          <table className="w-full text-[length:var(--text-13)]">
            <thead className="sticky top-0 bg-background border-b border-border text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-normal">Логин</th>
                <th className="text-left px-3 py-3 font-normal">Имя</th>
                <th className="text-left px-3 py-3 font-normal">Email</th>
                <th className="text-left px-3 py-3 font-normal">Роль</th>
                <th className="text-left px-3 py-3 font-normal">Статус</th>
                <th className="text-left px-3 py-3 font-normal">Последний вход</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-border hover:bg-rm-gray-2/30 transition-colors"
                >
                  <td className="px-6 py-3">
                    <Link href={`/users/${u.id}`} className="text-foreground hover:underline">
                      {u.login}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-foreground">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{u.email ?? "—"}</td>
                  <td className="px-3 py-3 text-muted-foreground">{roleLabel(u.role)}</td>
                  <td className="px-3 py-3">
                    {u.status === "FROZEN" ? (
                      <span className="inline-flex items-center gap-1 text-[length:var(--text-12)] text-muted-foreground">
                        <Snowflake size={12} /> Заморожен
                      </span>
                    ) : (
                      <span className="text-[length:var(--text-12)] text-emerald-600 dark:text-emerald-400">
                        Активен
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{fmt(u.lastLoginAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CreateUserDialog
        open={creating}
        onOpenChange={setCreating}
        assignableRoles={assignableRoles}
        onCreated={load}
      />
    </div>
  );
}
