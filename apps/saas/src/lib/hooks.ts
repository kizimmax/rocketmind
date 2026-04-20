"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  Agent,
  Artifact,
  Case,
  Conversation,
  Expert,
  ExpertCodename,
  ExpertSession,
  Manager,
  Message,
  OnboardingAnswers,
  Project,
  ProjectRole,
  ProjectStage,
  ReadyArtifact,
} from "./types";
import {
  computeStartingExpert,
  getMockArtifacts,
  getMockCases,
  getMockCaseAgents,
  getMockConversation,
  getMockConversations,
  getMockExpert,
  getMockExperts,
  getMockExpertSessions,
  getMockManager,
  getMockMessages,
  getMockProject,
  getMockProjects,
  getMockAgents,
  getMockAgent,
  getMockAgentById,
  mockArtifacts,
  mockCases,
  mockConversations,
  mockExpertSessions,
  mockExperts,
  mockMessages,
  mockCaseAgents,
  mockProjects,
} from "./mock-data";
import { getMockExpertMessages } from "./mock-expert-messages";
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

// ═══════════════════════════════════════════════════════════════════════════
// R-Акселератор 1.2 — hooks
// ═══════════════════════════════════════════════════════════════════════════

// --- Projects ---

// Шина событий для синхронизации инстансов useProjects в рамках одного таба.
function emitProjectsChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("rm:projects-change"));
  }
}

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>(() =>
    user ? getMockProjects(user.id) : []
  );

  // Синхронизация с мутациями mockProjects из других инстансов
  useEffect(() => {
    function refresh() {
      setProjects(user ? getMockProjects(user.id) : []);
    }
    window.addEventListener("rm:projects-change", refresh);
    return () => window.removeEventListener("rm:projects-change", refresh);
  }, [user]);

  const createProject = useCallback(
    (input: {
      name: string;
      role: ProjectRole;
      industry: string;
      stage: ProjectStage;
      readiness?: ReadyArtifact[];
    }): Project => {
      const now = new Date().toISOString();
      const startingExpert = computeStartingExpert(
        input.stage,
        input.readiness
      );
      const experts_completed = (input.readiness ?? []).length;

      const newProject: Project = {
        id: `p_${Date.now()}`,
        owner_id: user?.id ?? "u_1",
        name: input.name,
        role: input.role,
        industry: input.industry,
        stage: input.stage,
        status: "in_progress",
        experts_completed,
        experts_total: 6,
        current_expert_codename: startingExpert,
        score: null,
        readiness: input.readiness,
        created_at: now,
        updated_at: now,
      };
      mockProjects.unshift(newProject);

      // Сессии: помечаем completed для всех пройденных этапов + создаём not_started для стартового
      const ORDER: ExpertCodename[] = ["R1", "R2", "R+", "R3", "R4", "R5"];
      const startIdx = ORDER.indexOf(startingExpert);
      ORDER.forEach((codename, idx) => {
        const sessionId = `es_${Date.now()}_${codename}`;
        mockExpertSessions.push({
          id: sessionId,
          project_id: newProject.id,
          expert_codename: codename,
          status: idx < startIdx ? "completed" : "not_started",
          started_at: idx < startIdx ? now : null,
          completed_at: idx < startIdx ? now : null,
          message_count: 0,
        });

        // Для скипнутых этапов создаём placeholder-артефакты с source="user-provided"
        if (idx < startIdx) {
          const placeholder = makeUserProvidedArtifact(
            newProject.id,
            sessionId,
            codename,
            now
          );
          if (placeholder) mockArtifacts.push(placeholder);
        }
      });

      // Помечаем проект как «непрочитанный» для sidebar pulse-эффекта
      markProjectAsNew(newProject.id);

      setProjects((prev) => [newProject, ...prev]);
      emitProjectsChanged();
      return newProject;
    },
    [user]
  );

  const renameProject = useCallback((projectId: string, name: string) => {
    const target = mockProjects.find((p) => p.id === projectId);
    if (target) target.name = name;
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, name } : p))
    );
    emitProjectsChanged();
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    const idx = mockProjects.findIndex((p) => p.id === projectId);
    if (idx !== -1) mockProjects.splice(idx, 1);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    emitProjectsChanged();
  }, []);

  const archiveProject = useCallback((projectId: string) => {
    const target = mockProjects.find((p) => p.id === projectId);
    if (target) target.status = "archived";
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, status: "archived" as const } : p
      )
    );
    emitProjectsChanged();
  }, []);

  const restoreProject = useCallback((projectId: string) => {
    const target = mockProjects.find((p) => p.id === projectId);
    if (target) {
      target.status =
        target.experts_completed === target.experts_total
          ? "completed"
          : "in_progress";
    }
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              status:
                p.experts_completed === p.experts_total
                  ? ("completed" as const)
                  : ("in_progress" as const),
            }
          : p
      )
    );
    emitProjectsChanged();
  }, []);

  const activeProjects = projects.filter((p) => p.status !== "archived");
  const archivedProjects = projects.filter((p) => p.status === "archived");
  const inProgressProjects = projects.filter((p) => p.status === "in_progress");
  const completedProjects = projects.filter((p) => p.status === "completed");

  return {
    projects,
    activeProjects,
    archivedProjects,
    inProgressProjects,
    completedProjects,
    createProject,
    renameProject,
    deleteProject,
    archiveProject,
    restoreProject,
  };
}

// --- Manager ---

export function useManager(): Manager {
  return getMockManager();
}

// --- "New/unread" projects (для sidebar pulse-эффекта) ---
// Храним id-шники непрочитанных проектов в localStorage.

const NEW_PROJECTS_KEY = "rm:new-projects";

function readNewProjectsSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(NEW_PROJECTS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function writeNewProjectsSet(set: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(NEW_PROJECTS_KEY, JSON.stringify(Array.from(set)));
  // Кастомный event для уведомления других инстансов хука в том же табе
  window.dispatchEvent(new Event("rm:new-projects-change"));
}

export function markProjectAsNew(projectId: string) {
  const set = readNewProjectsSet();
  set.add(projectId);
  writeNewProjectsSet(set);
}

export function markProjectAsSeen(projectId: string) {
  const set = readNewProjectsSet();
  if (set.delete(projectId)) writeNewProjectsSet(set);
}

/** Хук: возвращает Set id-шников непрочитанных проектов, реактивно. */
export function useNewProjects() {
  const [ids, setIds] = useState<Set<string>>(() => readNewProjectsSet());

  useEffect(() => {
    function refresh() {
      setIds(readNewProjectsSet());
    }
    window.addEventListener("rm:new-projects-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("rm:new-projects-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return ids;
}

export function useProject(projectId: string) {
  const project = useMemo(() => getMockProject(projectId), [projectId]);
  return project;
}

// --- Experts ---

export function useExperts() {
  const experts = getMockExperts();
  const getExpert = useCallback(
    (codename: ExpertCodename) => getMockExpert(codename),
    []
  );
  return { experts, getExpert };
}

// --- Expert Sessions ---

export function useExpertSessions(projectId: string) {
  const [sessions, setSessions] = useState<ExpertSession[]>(() =>
    getMockExpertSessions(projectId)
  );

  const startSession = useCallback(
    (codename: ExpertCodename) => {
      const existing = mockExpertSessions.find(
        (s) => s.project_id === projectId && s.expert_codename === codename
      );
      if (existing) {
        if (existing.status === "not_started") {
          existing.status = "in_progress";
          existing.started_at = new Date().toISOString();
          setSessions([...getMockExpertSessions(projectId)]);
        }
        return existing;
      }
      const newSession: ExpertSession = {
        id: `es_${Date.now()}`,
        project_id: projectId,
        expert_codename: codename,
        status: "in_progress",
        started_at: new Date().toISOString(),
        completed_at: null,
        message_count: 0,
      };
      mockExpertSessions.push(newSession);
      setSessions((prev) => [...prev, newSession]);
      return newSession;
    },
    [projectId]
  );

  return { sessions, startSession };
}

// --- Artifacts ---

export function useArtifacts(projectId: string) {
  const [artifacts, setArtifacts] = useState<Artifact[]>(() =>
    getMockArtifacts(projectId)
  );

  useEffect(() => {
    function refresh() {
      setArtifacts(getMockArtifacts(projectId));
    }
    window.addEventListener("rm:projects-change", refresh);
    return () => window.removeEventListener("rm:projects-change", refresh);
  }, [projectId]);

  return { artifacts, setArtifacts };
}

// --- Expert Messages ---

/**
 * История диалога с конкретным экспертом в рамках сессии.
 * Возвращает массив сообщений (может быть пустым для not_started).
 */
export function useExpertMessages(sessionId: string | undefined): Message[] {
  return useMemo(
    () => (sessionId ? getMockExpertMessages(sessionId) : []),
    [sessionId]
  );
}

// --- Вспомогательные функции создания плейсхолдеров ---

const ARTIFACT_TYPE_BY_CODENAME: Record<ExpertCodename, string> = {
  R1: "market_brief",
  R2: "ua_segments",
  "R+": "synth_audience",
  R3: "biz_model",
  R4: "mvp_plan",
  R5: "pitch_deck",
};

const ARTIFACT_TITLE_BY_CODENAME: Record<ExpertCodename, string> = {
  R1: "Маркет-анализ",
  R2: "Сегментация ЦА / ICP",
  "R+": "Проверенные гипотезы",
  R3: "Бизнес-модель",
  R4: "MVP-план",
  R5: "Питч-дек",
};

function makeUserProvidedArtifact(
  projectId: string,
  sessionId: string,
  codename: ExpertCodename,
  now: string
): Artifact {
  const title = ARTIFACT_TITLE_BY_CODENAME[codename];
  return {
    id: `a_${Date.now()}_${codename}`,
    project_id: projectId,
    session_id: sessionId,
    expert_codename: codename,
    type: ARTIFACT_TYPE_BY_CODENAME[codename] as Artifact["type"],
    title: `${title} (от пользователя)`,
    preview:
      "Предоставлен при создании проекта. Принят R-менеджером как готовый. Можно перезапустить работу с экспертом, если хотите обновить.",
    status: "validated",
    source: "user-provided",
    created_at: now,
    updated_at: now,
  };
}

// --- Onboarding (4-вопросный flow) ---

export type OnboardingStep = "role" | "industry" | "stage" | "result" | "done";

const STEP_ORDER: OnboardingStep[] = ["role", "industry", "stage", "result", "done"];

export function useOnboarding() {
  const [step, setStep] = useState<OnboardingStep>("role");
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    role: null,
    industry: null,
    stage: null,
    expected_result: null,
  });

  const next = useCallback(() => {
    setStep((prev) => {
      const idx = STEP_ORDER.indexOf(prev);
      return STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)];
    });
  }, []);

  const answer = useCallback(
    (field: keyof OnboardingAnswers, value: string) => {
      setAnswers((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const progress = useMemo(() => {
    const idx = STEP_ORDER.indexOf(step);
    return idx / (STEP_ORDER.length - 1);
  }, [step]);

  return { step, answers, next, answer, progress };
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
