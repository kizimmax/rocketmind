"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@rocketmind/ui";
import { ChevronLeft } from "lucide-react";
import { RoleEditor } from "../role-form";

export default function NewRolePage() {
  const router = useRouter();
  return (
    <div className="flex flex-1 flex-col p-6">
      <Link href="/roles">
        <Button size="xs" variant="ghost" className="mb-4 self-start">
          <ChevronLeft className="mr-1 h-4 w-4" />К списку
        </Button>
      </Link>
      <h1 className="mb-6 font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
        Новая роль
      </h1>
      <RoleEditor
        role={null}
        onSaved={(r) => router.replace(`/roles/${r.id}`)}
        onCancel={() => router.push("/roles")}
      />
    </div>
  );
}
