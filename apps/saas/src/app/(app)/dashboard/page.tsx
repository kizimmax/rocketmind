"use client";

import { Button, Note } from "@rocketmind/ui";
import { Plus, Bot } from "lucide-react";
import { useCases } from "@/lib/hooks";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { activeCases, createCase } = useCases();
  const router = useRouter();

  function handleCreateFirst() {
    const newCase = createCase("Новый кейс");
    router.push(`/cases/${newCase.id}`);
  }

  if (activeCases.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="max-w-sm space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-rm-gray-1">
            <Bot className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase">
            Добро пожаловать
          </h2>
          <p className="text-[length:var(--text-14)] text-muted-foreground">
            Создайте первый кейс, чтобы начать работу с AI-агентами
          </p>
          <Button onClick={handleCreateFirst}>
            <Plus className="mr-2 h-4 w-4" />
            Создать кейс
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-w-sm space-y-4 text-center">
        <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase">
          Выберите кейс
        </h2>
        <p className="text-[length:var(--text-14)] text-muted-foreground">
          Выберите кейс в боковой панели или создайте новый
        </p>
      </div>
    </div>
  );
}
