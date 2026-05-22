"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAgents, createAgent } from "@/lib/ivan-client";
import { Button, Input, Tabs, TabsList, TabsTrigger } from "@rocketmind/ui";
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
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

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

  async function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    try {
      const created = await createAgent({ name });
      setNewName("");
      setIsCreating(false);
      toast.success(`AI-эксперт «${name}» создан`);
      router.push(`/ai-agents/${created.id}`);
    } catch {
      toast.error("Ошибка создания");
    } finally {
      setCreating(false);
    }
  }

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
            {isCreating ? (
              <div className="flex items-center gap-2">
                <Input
                  size="sm"
                  placeholder="Имя AI-эксперта"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreate();
                    if (e.key === "Escape") {
                      setIsCreating(false);
                      setNewName("");
                    }
                  }}
                  autoFocus
                  className="max-w-xs"
                />
                <Button size="sm" onClick={handleCreate} disabled={!newName.trim() || creating}>
                  Создать
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsCreating(false);
                    setNewName("");
                  }}
                >
                  Отмена
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsCreating(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Добавить
              </Button>
            )}
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
