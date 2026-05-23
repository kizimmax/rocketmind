"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAgents } from "@/lib/ivan-client";
import { Button, Tabs, TabsList, TabsTrigger } from "@rocketmind/ui";
import { Plus, UserCircle } from "lucide-react";
import { toast } from "sonner";
import type { Agent } from "./agent-form";

type AgentSection = "teaching" | "akselerator";
const SECTION_LABEL: Record<AgentSection, string> = {
  teaching: "Обучающие",
  akselerator: "Акселератор",
};

export default function AiAgentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const section: AgentSection =
    searchParams?.get("section") === "akselerator" ? "akselerator" : "teaching";

  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getAgents()
      .then((rows) => setAgents(rows))
      .catch(() => toast.error("Не удалось загрузить AI-экспертов"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
          AI-эксперты
        </h1>
      </div>

      {/* Обучающие / Акселератор. Акселератор — отдельный namespace у Ивана (позже). */}
      <Tabs value={section} onValueChange={(v) => router.push(`/ai-agents?section=${v}`)} className="mb-6">
        <TabsList>
          {(["teaching", "akselerator"] as const).map((s) => (
            <TabsTrigger key={s} value={s}>
              {SECTION_LABEL[s]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {section === "akselerator" ? (
        <p className="py-12 text-center text-[length:var(--text-14)] text-muted-foreground">
          Раздел «Акселератор» появится позже — у него отдельный набор агентов на бэке.
        </p>
      ) : (
        <>
          <div className="mb-6">
            <Button variant="outline" size="sm" onClick={() => router.push("/ai-agents/new")}>
              <Plus className="mr-1 h-4 w-4" />
              Добавить
            </Button>
          </div>

          {loading ? (
            <p className="py-12 text-center text-muted-foreground">Загрузка…</p>
          ) : agents.length === 0 ? (
            <p className="py-12 text-center text-[length:var(--text-14)] text-muted-foreground">
              Пока нет AI-экспертов. Добавьте первого.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => router.push(`/ai-agents/${agent.id}`)}
                  className="block text-left"
                >
                  <AgentCard agent={agent} />
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="flex gap-3 rounded border border-border bg-rm-gray-1/30 p-4 text-left transition-colors hover:border-foreground/30 cursor-pointer">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded bg-rm-gray-1/60">
        {agent.avatarUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={agent.avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <UserCircle className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-[length:var(--text-14)] font-medium text-foreground">
          {agent.name}
        </span>
        {agent.role && (
          <span className="truncate text-[length:var(--text-12)] text-muted-foreground">
            {agent.role}
          </span>
        )}
        {agent.valueDescription && (
          <p className="mt-1 line-clamp-2 text-[length:var(--text-12)] text-muted-foreground">
            {agent.valueDescription}
          </p>
        )}
      </div>
    </div>
  );
}
