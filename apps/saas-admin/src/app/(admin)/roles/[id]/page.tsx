"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@rocketmind/ui";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { getRoleDetail } from "@/lib/ivan-client";
import { ApiError } from "@/lib/api";
import type { ClientRoleDetail } from "@/lib/ivan-auth";
import { RoleEditor } from "../role-form";

export default function RoleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [role, setRole] = useState<ClientRoleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    getRoleDetail(id)
      .then((r) => setRole(r))
      .catch((e) => {
        if (e instanceof ApiError && e.status === 404) setNotFound(true);
        else toast.error("Не удалось загрузить роль");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6 text-muted-foreground">Загрузка…</p>;
  if (notFound || !role) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Роль не найдена.</p>
        <Link href="/roles">
          <Button size="sm" variant="ghost" className="mt-4">
            <ChevronLeft className="mr-1 h-4 w-4" />К списку
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <Link href="/roles">
        <Button size="xs" variant="ghost" className="mb-4 self-start">
          <ChevronLeft className="mr-1 h-4 w-4" />К списку
        </Button>
      </Link>
      <h1 className="mb-6 font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
        {role.name}
      </h1>
      <RoleEditor
        role={role}
        onSaved={(r) => setRole(r)}
        onDeleted={() => router.replace("/roles")}
        onCancel={() => router.push("/roles")}
      />
    </div>
  );
}
