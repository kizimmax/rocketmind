"use client";

import { Plus, Users } from "lucide-react";
import { Button, Note } from "@rocketmind/ui";
import { useCaseAgents } from "@/lib/hooks";
import { getMockCase } from "@/lib/mock-data";
import { Chat } from "@/components/chat";
import { useRouter, useSearchParams } from "next/navigation";

export default function CaseClient({ id }: { id: string }) {
  const caseData = getMockCase(id);
  const { agents } = useCaseAgents(id);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Active agent from URL param, fallback to first agent
  const agentParam = searchParams?.get("agent");
  const activeAgent =
    agents.find((a) => a.id === agentParam) ?? agents[0] ?? null;

  if (!caseData) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-3">
          <Note variant="error">Кейс не найден</Note>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            На главную
          </Button>
        </div>
      </div>
    );
  }

  // No agents in case
  if (agents.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="max-w-sm text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-rm-gray-1">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-20)] font-bold uppercase">
            Добавьте агента
          </h2>
          <p className="text-[length:var(--text-14)] text-muted-foreground">
            Выберите AI-агента из каталога для начала работы
          </p>
          <Button onClick={() => router.push(`/agents?caseId=${id}`)}>
            <Plus className="mr-2 h-4 w-4" />
            Каталог агентов
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      {activeAgent ? (
        <Chat caseId={id} agent={activeAgent} />
      ) : (
        <div className="relative z-10 flex h-full items-center justify-center text-muted-foreground">
          Выберите агента
        </div>
      )}
    </div>
  );
}
