// Rocketmind SaaS — Data Model Types
// MVP 1.1 legacy (Case/Agent/Conversation) + R-Акселератор 1.2 (Project/Expert/ExpertSession/Artifact)

export interface User {
  id: string;
  email: string;
  created_at: string;
  last_login: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// R-Акселератор 1.2 — R-менеджер (Manager)
// ─────────────────────────────────────────────────────────────────────────────

/** R-менеджер — верхнеуровневая сущность над проектами. Один на пользователя. */
export interface Manager {
  id: string;
  name: string;
  role: string;
  avatar_url: string;
  greeting_no_projects: string;
  greeting_with_projects: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// R-Акселератор 1.2 — Experts
// ─────────────────────────────────────────────────────────────────────────────

/** Codename эксперта в pipeline R-Команды. */
export type ExpertCodename = "R1" | "R2" | "R+" | "R3" | "R4" | "R5";

/** Экспертная роль в pipeline. */
export interface Expert {
  id: string;
  codename: ExpertCodename;
  /** Имя эксперта, напр. «Роман», «Регина» */
  name: string;
  /** Короткая роль, напр. «Маркет-исследователь» */
  role: string;
  /** Описание для онбординга и empty-state чата */
  description: string;
  /** Ключевое «что на выходе» для пользователя */
  outcome: string;
  avatar_url: string | null;
  /** Аватар для «задумчивых» сообщений (при глубокой проработке). */
  thinking_avatar_url?: string;
  greeting?: string;
  suggestions?: string[];
  /** 3 сценария помощи — первый с is_primary=true. */
  scenarios?: ExpertScenario[];
}

// ─────────────────────────────────────────────────────────────────────────────
// R-Акселератор 1.2 — Project
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectStage = "idea" | "mvp" | "seed" | "early" | "growth";
export type ProjectRole =
  | "founder"
  | "sme-lead"
  | "mentor"
  | "team-lead"
  | "expert";
export type ProjectStatus = "in_progress" | "completed" | "archived";

/** Что у пользователя уже готово на момент создания — R-менеджер использует для skip этапов. */
export type ReadyArtifact =
  | "market"
  | "ua_segments"
  | "synth"
  | "biz_model"
  | "mvp_plan"
  | "pitch";

/** Основная единица работы. Контейнер над экспертными сессиями и артефактами. */
export interface Project {
  id: string;
  owner_id: string;
  name: string;
  role: ProjectRole;
  industry: string;
  stage: ProjectStage;
  status: ProjectStatus;
  /** 0..6 — сколько экспертов уже завершили работу */
  experts_completed: number;
  experts_total: number;
  /** current expert in pipeline (null если ещё не начали) */
  current_expert_codename: ExpertCodename | null;
  /** Скоринг 0–100; null пока не посчитан */
  score: number | null;
  /** Артефакты, которые у пользователя уже были при создании (для skip этапов) */
  readiness?: ReadyArtifact[];
  created_at: string;
  updated_at: string;
}

export type ProjectMemberRole = "owner" | "executor" | "observer" | "mentor";

export interface ProjectMember {
  project_id: string;
  user_id: string;
  role: ProjectMemberRole;
  joined_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// R-Акселератор 1.2 — ExpertSession (диалог эксперта в рамках проекта)
// ─────────────────────────────────────────────────────────────────────────────

export type ExpertSessionStatus =
  | "not_started"
  | "in_progress"
  | "awaiting_validation"
  | "completed";

export interface ExpertSession {
  id: string;
  project_id: string;
  expert_codename: ExpertCodename;
  status: ExpertSessionStatus;
  started_at: string | null;
  completed_at: string | null;
  /** Количество сообщений в сессии (для UI-индикаторов) */
  message_count: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// R-Акселератор 1.2 — Artifact
// ─────────────────────────────────────────────────────────────────────────────

export type ArtifactType =
  | "market_brief"
  | "ua_segments"
  | "synth_audience"
  | "value_prop"
  | "biz_model"
  | "mvp_plan"
  | "unit_economics"
  | "pitch_deck"
  | "investment_memo"
  | "one_pager";

export type ArtifactStatus = "draft" | "awaiting_validation" | "validated";

export interface Artifact {
  id: string;
  project_id: string;
  session_id: string;
  expert_codename: ExpertCodename;
  type: ArtifactType;
  title: string;
  /** Короткий превью-текст для панели справа */
  preview: string;
  status: ArtifactStatus;
  /**
   * Источник артефакта:
   * - "expert" — собран ИИ-экспертом
   * - "user-provided" — предоставлен пользователем при создании проекта (скип этапа)
   */
  source?: "expert" | "user-provided";
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// R-Акселератор 1.2 — Onboarding state
// ─────────────────────────────────────────────────────────────────────────────

export interface OnboardingAnswers {
  role: ProjectRole | null;
  industry: string | null;
  stage: ProjectStage | null;
  expected_result: string | null;
}

export type CaseStatus = "active" | "archived";

export interface Case {
  id: string;
  user_id: string;
  name: string;
  status: CaseStatus;
  created_at: string;
  updated_at: string;
}

/** Файл, прикреплённый к сообщению в чате. */
export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  /** 0..100 — прогресс загрузки. 100 = готов. */
  progress: number;
  /** Blob-URL для предпросмотра (изображения, PDF и пр.). */
  url?: string;
  /** MIME-тип. */
  type?: string;
}

/** Снэпшот файла, прикреплённого к сообщению (после отправки). */
export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  url?: string;
  type?: string;
}

export interface Agent {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Короткая роль (напр. «Маркет-исследователь») — показывается под именем в чате. */
  role?: string;
  avatar_url: string | null;
  greeting?: string;
  suggestions?: string[];
  config: Record<string, unknown>;
}

export interface CaseAgent {
  case_id: string;
  agent_id: string;
}

export interface Conversation {
  id: string;
  case_id: string;
  agent_id: string;
  created_at: string;
  updated_at: string;
}

export type MessageRole = "user" | "assistant" | "system";

export interface MessageCTA {
  label: string;
  url: string;
}

export interface MessageMetadata {
  cta?: MessageCTA;
  summary?: boolean;
  /** Эксперт «рассуждает глубже» — подменяет аватар на thinking-вариант. */
  thinking?: boolean;
  /** Message содержит scenario-picker (первое сообщение эксперта). */
  scenarios?: ExpertScenarioCodename[];
  /** Message содержит deep/fast picker (summary-узел перед генерацией артефакта). */
  mode_picker?: boolean;
  /** Message содержит HITL-controls (Принять / Дать правки) для artifact-valid. */
  hitl_for_artifact_id?: string;
  /** Assistant-сообщение «правильно ли я понял правки» — ждёт подтверждения пользователя. */
  revision_echo?: boolean;
  /** System-message-отметка завершения артефакта */
  artifact_completed?: string;
  /** System-message — плейсхолдер «артефакт от пользователя» для скипнутых этапов */
  user_provided_artifact?: string;
  /** Прикреплённые к сообщению файлы (user role). */
  attachments?: FileAttachment[];
}

/** Код сценария — заготовленного варианта помощи эксперта. */
export type ExpertScenarioCodename = string;

/** Один из 3 сценариев, которые эксперт предлагает в начале диалога. */
export interface ExpertScenario {
  codename: ExpertScenarioCodename;
  label: string;
  hint: string;
  /** Является ли этот сценарий рекомендованным/акцентированным. */
  is_primary: boolean;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  metadata?: MessageMetadata;
  created_at: string;
  is_read: boolean;
}
