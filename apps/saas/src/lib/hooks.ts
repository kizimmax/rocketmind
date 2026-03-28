"use client";

import { useCallback, useState } from "react";
import type { Agent, Case, Conversation, Message } from "./types";
import {
  getMockCases,
  getMockCaseAgents,
  getMockConversation,
  getMockConversations,
  getMockMessages,
  getMockAgents,
  getMockAgent,
  getMockAgentById,
  mockCases,
  mockConversations,
  mockMessages,
  mockCaseAgents,
} from "./mock-data";
import { useAuth } from "./auth-context";

// --- Cases ---

export function useCases() {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>(() =>
    user ? getMockCases(user.id) : []
  );

  const createCase = useCallback(
    (name: string): Case => {
      const newCase: Case = {
        id: `c_${Date.now()}`,
        user_id: user?.id ?? "u_1",
        name,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockCases.unshift(newCase);
      setCases((prev) => [newCase, ...prev]);
      return newCase;
    },
    [user]
  );

  const archiveCase = useCallback((caseId: string) => {
    const target = mockCases.find((c) => c.id === caseId);
    if (target) target.status = "archived";
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: "archived" } : c))
    );
  }, []);

  const restoreCase = useCallback((caseId: string) => {
    const target = mockCases.find((c) => c.id === caseId);
    if (target) target.status = "active";
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: "active" } : c))
    );
  }, []);

  const renameCase = useCallback((caseId: string, name: string) => {
    const target = mockCases.find((c) => c.id === caseId);
    if (target) target.name = name;
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, name } : c))
    );
  }, []);

  const deleteCase = useCallback((caseId: string) => {
    const idx = mockCases.findIndex((c) => c.id === caseId);
    if (idx !== -1) mockCases.splice(idx, 1);
    setCases((prev) => prev.filter((c) => c.id !== caseId));
  }, []);

  const activeCases = cases.filter((c) => c.status === "active");
  const archivedCases = cases.filter((c) => c.status === "archived");

  return {
    cases,
    activeCases,
    archivedCases,
    createCase,
    archiveCase,
    restoreCase,
    renameCase,
    deleteCase,
  };
}

// --- Agents ---

export function useAgents() {
  const agents = getMockAgents();

  const getAgent = useCallback((slug: string) => getMockAgent(slug), []);
  const getAgentById = useCallback((id: string) => getMockAgentById(id), []);

  return { agents, getAgent, getAgentById };
}

// --- Case Agents ---

export function useCaseAgents(caseId: string) {
  const [agents, setAgents] = useState<Agent[]>(() =>
    getMockCaseAgents(caseId)
  );

  const addAgentToCase = useCallback(
    (agentId: string) => {
      const exists = mockCaseAgents.some(
        (ca) => ca.case_id === caseId && ca.agent_id === agentId
      );
      if (exists) return;

      mockCaseAgents.push({ case_id: caseId, agent_id: agentId });
      const agent = getMockAgentById(agentId);
      if (agent) {
        setAgents((prev) => [...prev, agent]);

        // Auto-create conversation
        const conv: Conversation = {
          id: `conv_${Date.now()}`,
          case_id: caseId,
          agent_id: agentId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockConversations.push(conv);
        mockMessages[conv.id] = [
          {
            id: `m_${Date.now()}`,
            conversation_id: conv.id,
            role: "assistant",
            content: `Привет! Я ${agent.name}. Чем могу помочь?`,
            created_at: new Date().toISOString(),
            is_read: false,
          },
        ];
      }
    },
    [caseId]
  );

  return { agents, addAgentToCase };
}

// --- Messages ---

export function useMessages(caseId: string, agentId: string) {
  const conv = getMockConversation(caseId, agentId);
  const [messages, setMessages] = useState<Message[]>(() =>
    conv ? getMockMessages(conv.id) : []
  );
  const [isSending, setIsSending] = useState(false);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conv) return;
      setIsSending(true);

      // Add user message
      const userMsg: Message = {
        id: `m_${Date.now()}`,
        conversation_id: conv.id,
        role: "user",
        content,
        created_at: new Date().toISOString(),
        is_read: true,
      };

      const updatedWithUser = [...(mockMessages[conv.id] ?? []), userMsg];
      mockMessages[conv.id] = updatedWithUser;
      setMessages(updatedWithUser);

      // Simulate AI response delay
      await new Promise((r) => setTimeout(r, 1200));

      const assistantMsg: Message = {
        id: `m_${Date.now() + 1}`,
        conversation_id: conv.id,
        role: "assistant",
        content: generateMockResponse(content),
        created_at: new Date().toISOString(),
        is_read: false,
      };

      const updatedWithAssistant = [...updatedWithUser, assistantMsg];
      mockMessages[conv.id] = updatedWithAssistant;
      setMessages(updatedWithAssistant);
      setStreamingMsgId(assistantMsg.id);
      setIsSending(false);
    },
    [conv]
  );

  return { messages, sendMessage, isSending, streamingMsgId, conversationId: conv?.id };
}

// --- Conversations ---

export function useConversations(caseId: string) {
  return getMockConversations(caseId);
}

// Simple mock response generator
function generateMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("стратег") || lower.includes("план")) {
    return "Хороший вопрос! Давайте разработаем пошаговый план. Для начала, расскажите подробнее о текущей ситуации и ваших целях.";
  }
  if (lower.includes("текст") || lower.includes("копирайт")) {
    return "Могу подготовить несколько вариантов текста. Уточните, пожалуйста:\n\n1. **Tone of voice** — формальный или разговорный?\n2. **Объём** — сколько символов?\n3. **CTA** — какое действие от читателя?";
  }
  if (lower.includes("данные") || lower.includes("анализ")) {
    return "Для анализа мне потребуются исходные данные. Вы можете:\n\n- Вставить таблицу прямо в чат\n- Описать данные словами\n- Указать ключевые метрики, которые вас интересуют";
  }
  return "Понял вас. Давайте разберёмся подробнее — опишите задачу конкретнее, и я подготовлю решение.";
}
