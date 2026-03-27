"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Note } from "@rocketmind/ui";
import { useAuth } from "@/lib/auth-context";
import {
  getMockAgent,
  mockCases,
  mockCaseAgents,
  mockConversations,
  mockMessages,
} from "@/lib/mock-data";

export default function BootstrapClient({
  agentSlug,
}: {
  agentSlug: string;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;

    // Not authenticated → redirect to login with return URL
    if (!user) {
      const returnUrl = encodeURIComponent(`/a/${agentSlug}`);
      router.replace(`/login?return=${returnUrl}`);
      return;
    }

    // Find agent by slug
    const agent = getMockAgent(agentSlug);
    if (!agent) {
      setError(`Агент «${agentSlug}» не найден`);
      return;
    }

    // Auto-create case + link agent + redirect
    const now = new Date().toISOString();
    const newCase = {
      id: `c_${Date.now()}`,
      user_id: user.id,
      name: `${agent.name} — ${new Date().toLocaleDateString("ru-RU")}`,
      status: "active" as const,
      created_at: now,
      updated_at: now,
    };
    mockCases.push(newCase);
    mockCaseAgents.push({ case_id: newCase.id, agent_id: agent.id });

    const conv = {
      id: `conv_${Date.now()}`,
      case_id: newCase.id,
      agent_id: agent.id,
      created_at: now,
      updated_at: now,
    };
    mockConversations.push(conv);
    mockMessages[conv.id] = [
      {
        id: `m_${Date.now()}`,
        conversation_id: conv.id,
        role: "assistant",
        content: `Привет! Я ${agent.name}. ${agent.description}\n\nЧем могу помочь?`,
        created_at: now,
        is_read: false,
      },
    ];

    router.replace(`/cases/${newCase.id}`);
  }, [user, isLoading, agentSlug, router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="max-w-sm space-y-4 text-center">
          <Note variant="error">{error}</Note>
          <Button variant="outline" onClick={() => router.push("/agents")}>
            Перейти в каталог
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <div className="h-6 w-6 mx-auto animate-spin rounded-full border-2 border-rm-gray-3 border-t-foreground" />
        <p className="text-[length:var(--text-14)] text-muted-foreground">
          Создаём кейс...
        </p>
      </div>
    </div>
  );
}
