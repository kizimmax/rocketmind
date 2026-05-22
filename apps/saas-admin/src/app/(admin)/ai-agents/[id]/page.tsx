"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@rocketmind/ui";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { getAgent } from "@/lib/ivan-client";
import { ApiError } from "@/lib/api";
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
    getAgent(id)
      .then((a) => setAgent(a))
      .catch((e) => {
        if (e instanceof ApiError && e.status === 404) setNotFound(true);
        else toast.error("Не удалось загрузить AI-эксперта");
      })
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
