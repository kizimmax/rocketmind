"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@rocketmind/ui";
import { ChevronLeft } from "lucide-react";
import { AgentEditor } from "../agent-form";

export default function NewAgentPage() {
  const router = useRouter();
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col p-6">
      <Link href="/ai-agents">
        <Button size="xs" variant="ghost" className="mb-4 self-start">
          <ChevronLeft className="mr-1 h-4 w-4" />К списку
        </Button>
      </Link>
      <h1 className="mb-6 font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
        Новый AI-эксперт
      </h1>
      <AgentEditor
        agent={null}
        onSaved={(saved) => router.replace(`/ai-agents/${saved.id}`)}
        onCancel={() => router.push("/ai-agents")}
      />
    </div>
  );
}
