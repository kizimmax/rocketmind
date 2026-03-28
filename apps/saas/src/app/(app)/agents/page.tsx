"use client";

import { useState, useEffect } from "react";
import { Input } from "@rocketmind/ui";
import { Search } from "lucide-react";
import { useAgents, useCaseAgents } from "@/lib/hooks";
import { AgentCard } from "@/components/agent-card";
import { MobileBackButton } from "@/components/mobile-back-button";
import { useSearchParams, useRouter } from "next/navigation";

export default function AgentsCatalogPage() {
  const { agents } = useAgents();
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const caseId = searchParams?.get("caseId") ?? "";

  // Listen for search from mobile header
  useEffect(() => {
    function onHeaderSearch(e: Event) {
      setSearch((e as CustomEvent).detail);
    }
    window.addEventListener("agents-search", onHeaderSearch);
    return () => window.removeEventListener("agents-search", onHeaderSearch);
  }, []);

  const { agents: caseAgents, addAgentToCase } = useCaseAgents(caseId);
  const caseAgentIds = new Set(caseAgents.map((a) => a.id));

  const filtered = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.slug.toLowerCase().includes(search.toLowerCase())
  );

  let heading = "Каталог агентов";
  let subheading = "Выберите AI-агента для добавления в кейс";
  if (caseId) {
    if (caseAgents.length === 0) {
      heading = "Добавьте первого агента";
      subheading = "Выберите AI-агента для начала работы над кейсом";
    } else {
      heading = "Добавить ещё агента";
      subheading = "В кейсе уже есть агенты. Расширьте команду, добавив ещё одного";
    }
  }

  function handleAdd(agentId: string) {
    addAgentToCase(agentId);
    router.push(`/cases/${caseId}?agent=${agentId}`);
  }

  const backHref = caseId ? `/cases/${caseId}` : undefined;

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold uppercase tracking-tight">
            {heading}
          </h1>
          <p className="text-[length:var(--text-14)] text-muted-foreground">
            {subheading}
          </p>
        </div>

        {/* Search — hidden on mobile, shown in mobile header instead */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по агентам..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[length:var(--text-14)] text-muted-foreground">
              Ничего не найдено по запросу &laquo;{search}&raquo;
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isAdded={caseId ? caseAgentIds.has(agent.id) : undefined}
                onAdd={caseId ? () => handleAdd(agent.id) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      <MobileBackButton href={backHref} />
    </div>
  );
}
