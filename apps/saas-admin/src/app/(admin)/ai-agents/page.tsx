"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { Button, Input } from "@rocketmind/ui";
import { Plus, UserCircle, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { Agent } from "./agent-form";

export default function AiAgentsPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  function load() {
    setLoading(true);
    apiFetch("/api/ai-agents")
      .then((r) => r.json())
      .then((rows: Agent[]) => setAgents(rows))
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
      const res = await apiFetch("/api/ai-agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, targets: ["saas-teacher"], n8nWebhookUrl: "" }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error === "slug_exists" ? "Такой slug уже есть" : "Ошибка создания");
        return;
      }
      const created = (await res.json()) as Agent;
      setNewName("");
      setIsCreating(false);
      toast.success(`AI-эксперт «${name}» создан`);
      // Сразу открываем страницу редактирования, чтобы заполнить остальное.
      router.push(`/ai-agents/${created.id}`);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
          AI-эксперты
        </h1>
        <Link href="/ai-agents/mascots">
          <Button variant="ghost" size="sm">
            <ImageIcon className="mr-1 h-4 w-4" />
            Маскоты
          </Button>
        </Link>
      </div>

      {/* Create — inline name-only flow */}
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
            Добавить AI-эксперта
          </Button>
        )}
      </div>

      {loading ? (
        <p className="py-12 text-center text-muted-foreground">Загрузка…</p>
      ) : agents.length === 0 ? (
        <p className="py-12 text-center text-[length:var(--text-14)] text-muted-foreground">
          Нет AI-экспертов. Добавьте первого.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Link key={agent.id} href={`/ai-agents/${agent.id}`} className="block">
              <AgentCard agent={agent} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  const avatar = agent.avatarMascot?.imagePath ?? agent.avatarPath ?? null;
  const webhookMissing = !agent.n8nWebhookUrl?.trim();
  return (
    <div className="flex gap-3 rounded border border-border bg-rm-gray-1/30 p-4 text-left transition-colors hover:border-foreground/30 cursor-pointer">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded bg-rm-gray-1/60">
        {avatar ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          <UserCircle className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[length:var(--text-14)] font-medium text-foreground">
            {agent.name}
          </span>
        </div>
        {agent.role && (
          <span className="truncate text-[length:var(--text-12)] text-muted-foreground">
            {agent.role}
          </span>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-1">
          {webhookMissing && (
            <span className="inline-flex items-center gap-1 rounded-sm bg-destructive/15 px-1.5 py-0.5 text-[length:var(--text-10)] font-medium uppercase tracking-wide text-destructive">
              <AlertTriangle className="h-3 w-3" />
              Не подключен
            </span>
          )}
          {agent.targets.map((t) => (
            <span
              key={t}
              className="rounded-sm bg-foreground/10 px-1.5 py-0.5 text-[length:var(--text-10)] font-medium text-foreground"
            >
              {t}
            </span>
          ))}
        </div>
        {agent.valueDescription && (
          <p className="mt-1 line-clamp-2 text-[length:var(--text-12)] text-muted-foreground">
            {agent.valueDescription}
          </p>
        )}
      </div>
    </div>
  );
}
