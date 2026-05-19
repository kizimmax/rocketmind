"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@rocketmind/ui";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import { AgentEditor, type Agent } from "../agent-form";

export default function AgentEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/api/ai-agents/${id}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((a: Agent | null) => {
        if (a) setAgent(a);
      })
      .catch(() => toast.error("Не удалось загрузить AI-эксперта"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="p-6 text-muted-foreground">Загрузка…</p>;
  }
  if (notFound || !agent) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">AI-эксперт не найден.</p>
        <Link href="/ai-agents">
          <Button size="sm" variant="ghost" className="mt-4">
            <ChevronLeft className="mr-1 h-4 w-4" />К списку
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col p-6">
      <Link href="/ai-agents">
        <Button size="xs" variant="ghost" className="mb-4 self-start">
          <ChevronLeft className="mr-1 h-4 w-4" />К списку
        </Button>
      </Link>

      <AgentEditor
        agent={agent}
        onSaved={(saved) => setAgent(saved)}
        onDeleted={() => router.replace("/ai-agents")}
        onCancel={() => router.push("/ai-agents")}
      />
    </div>
  );
}
