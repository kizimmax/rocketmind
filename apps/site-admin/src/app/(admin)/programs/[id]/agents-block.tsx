"use client";

import { useEffect, useState } from "react";
import { Switch } from "@rocketmind/ui";
import { UserCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";

type Agent = {
  id: string;
  slug: string;
  name: string;
  role: string;
  valueDescription: string;
  avatarMascot: { imagePath: string } | null;
  avatarPath: string | null;
};

interface AgentsBlockProps {
  programId: string;
  initialEnabled: { agentId: string; isAvailable: boolean }[];
}

export function AgentsBlock({ programId, initialEnabled }: AgentsBlockProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [enabled, setEnabled] = useState<Map<string, boolean>>(
    () => new Map(initialEnabled.map((e) => [e.agentId, e.isAvailable])),
  );
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Set<string>>(new Set());

  useEffect(() => {
    apiFetch("/api/ai-agents?target=saas-teacher")
      .then((r) => r.json())
      .then(setAgents)
      .catch(() => toast.error("Не удалось загрузить AI-экспертов"))
      .finally(() => setLoading(false));
  }, []);

  async function toggle(agentId: string, value: boolean) {
    setPending((s) => new Set(s).add(agentId));
    // optimistic
    setEnabled((m) => new Map(m).set(agentId, value));
    try {
      const res = await apiFetch("/api/program-agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programId, agentId, isAvailable: value }),
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (err) {
      console.error(err);
      toast.error("Ошибка");
      // revert
      setEnabled((m) => new Map(m).set(agentId, !value));
    } finally {
      setPending((s) => {
        const next = new Set(s);
        next.delete(agentId);
        return next;
      });
    }
  }

  return (
    <div className="rounded border border-border bg-rm-gray-1/30 p-5">
      <h2 className="mb-4 text-[length:var(--text-14)] font-medium uppercase tracking-wide text-muted-foreground">
        AI-эксперты программы
      </h2>

      {loading ? (
        <div className="flex justify-center p-4 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : agents.length === 0 ? (
        <p className="text-[length:var(--text-12)] text-muted-foreground">
          Нет AI-экспертов с привязкой к saas-teacher. Добавьте их в разделе{" "}
          <a className="underline underline-offset-2" href="/ai-agents">
            AI-эксперты
          </a>
          .
        </p>
      ) : (
        <div className="divide-y divide-border">
          {agents.map((agent) => {
            const isOn = enabled.get(agent.id) ?? false;
            const isPending = pending.has(agent.id);
            const avatar = agent.avatarMascot?.imagePath ?? agent.avatarPath;
            return (
              <div key={agent.id} className="flex items-center gap-3 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-rm-gray-1/60">
                  {avatar ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={avatar}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserCircle className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[length:var(--text-14)] font-medium text-foreground">
                    {agent.name}
                  </span>
                  {agent.role && (
                    <span className="truncate text-[length:var(--text-12)] text-muted-foreground">
                      {agent.role}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[length:var(--text-12)] ${isOn ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {isOn ? "Доступен" : "Скрыт"}
                  </span>
                  <Switch
                    checked={isOn}
                    onCheckedChange={(v) => toggle(agent.id, v)}
                    disabled={isPending}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
