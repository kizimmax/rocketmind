"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { getAdminUsers } from "@/lib/ivan-client";

interface UserRow {
  id: string;
  firstName: string;
  email: string;
  role: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminUsers()
      .then((rows) => setUsers(rows))
      .catch(() => toast.error("Не удалось загрузить пользователей"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-border">
        <h1 className="text-[length:var(--text-20)] font-semibold text-foreground">Пользователи</h1>
        <p className="text-[length:var(--text-12)] text-muted-foreground">
          Регистрация по коду на стороне ученика. Здесь — выдача роли и правка данных.
        </p>
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
                <th className="text-left px-6 py-3 font-normal">Имя</th>
                <th className="text-left px-3 py-3 font-normal">Email</th>
                <th className="text-left px-3 py-3 font-normal">Роль (доступ в админку)</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border hover:bg-rm-gray-2/30 transition-colors">
                  <td className="px-6 py-3">
                    <Link href={`/users/${u.id}`} className="text-foreground hover:underline">
                      {u.firstName || "—"}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-3 py-3">
                    {u.role ? (
                      <span className="text-foreground">{u.role}</span>
                    ) : (
                      <span className="text-muted-foreground">— (ученик)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
