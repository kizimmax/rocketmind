"use client";

import { useEffect, useState } from "react";
import { UserCircle, Loader2, ChevronUp, ChevronDown, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { getAgents, updateGroup } from "@/lib/ivan-client";

type Agent = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string | null;
};

interface AgentsBlockProps {
  programId: string;
  /** Упорядоченный массив agentId программы (group.agents). */
  initialAgentIds: string[];
}

/**
 * Состав и ПОРЯДОК AI-экспертов внутри программы. Порядок = позиция в массиве
 * group.agents[] (его и видит ученик в сайдбаре). Управление: ↑/↓ — переставить,
 * ×  — убрать из программы, + — добавить. Любое изменение сохраняет весь массив
 * через PATCH /api/programs/{id} (Иван заменяет agents[] целиком).
 */
export function AgentsBlock({ programId, initialAgentIds }: AgentsBlockProps) {
  const [all, setAll] = useState<Agent[]>([]);
  const [order, setOrder] = useState<string[]>(initialAgentIds);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAgents()
      .then((rows) => setAll(rows))
      .catch(() => toast.error("Не удалось загрузить AI-экспертов"))
      .finally(() => setLoading(false));
  }, []);

  async function persist(next: string[]) {
    const prev = order;
    setOrder(next); // optimistic
    setSaving(true);
    try {
      await updateGroup(programId, { agents: next });
    } catch {
      toast.error("Не удалось сохранить порядок");
      setOrder(prev); // revert
    } finally {
      setSaving(false);
    }
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...order];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    persist(next);
  }

  const byId = new Map(all.map((a) => [a.id, a]));
  const inProgram = order.map((id) => byId.get(id)).filter((a): a is Agent => !!a);
  const available = all.filter((a) => !order.includes(a.id));

  return (
    <div className="rounded border border-border bg-rm-gray-1/30 p-5">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-[length:var(--text-14)] font-medium uppercase tracking-wide text-muted-foreground">
          AI-эксперты программы
        </h2>
        {saving && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      </div>

      {loading ? (
        <div className="flex justify-center p-4 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : (
        <>
          {/* В программе — упорядоченный список со стрелками */}
          {inProgram.length === 0 ? (
            <p className="mb-4 text-[length:var(--text-12)] text-muted-foreground">
              В программе пока нет AI-экспертов. Добавьте из списка ниже.
            </p>
          ) : (
            <ol className="mb-4 divide-y divide-border">
              {inProgram.map((agent, idx) => (
                <li key={agent.id} className="flex items-center gap-3 py-2.5">
                  <span className="w-5 shrink-0 text-center text-[length:var(--text-12)] text-muted-foreground">
                    {idx + 1}
                  </span>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded bg-rm-gray-1/60">
                    {agent.avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={agent.avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <UserCircle className="h-5 w-5 text-muted-foreground" />
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
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0 || saving}
                      className="rounded-sm p-1 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                      title="Выше"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(idx, 1)}
                      disabled={idx === inProgram.length - 1 || saving}
                      className="rounded-sm p-1 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                      title="Ниже"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => persist(order.filter((id) => id !== agent.id))}
                      disabled={saving}
                      className="ml-1 rounded-sm p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                      title="Убрать из программы"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {/* Доступные — кнопка добавить */}
          {available.length > 0 && (
            <div className="border-t border-border pt-3">
              <p className="mb-2 text-[length:var(--text-10)] uppercase tracking-wide text-muted-foreground">
                Добавить в программу
              </p>
              <div className="flex flex-col gap-1">
                {available.map((agent) => (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => persist([...order, agent.id])}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-left transition-colors hover:bg-foreground/5 disabled:opacity-50"
                  >
                    <Plus className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate text-[length:var(--text-14)] text-foreground">
                      {agent.name}
                    </span>
                    {agent.role && (
                      <span className="truncate text-[length:var(--text-12)] text-muted-foreground">
                        · {agent.role}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
