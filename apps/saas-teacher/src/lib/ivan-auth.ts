import type { Student, StudentProgramSummary } from "./auth-context";
import { ivanCall, type IvanResult } from "./ivan-api";

export type IvanRole = {
  _id: string;
  name: string;
  permissions: string[];
  isSystem: boolean;
};

export type IvanCourseGroupRef = {
  _id: string;
  name?: string;
  active?: boolean;
  qrCode?: string;
};

/** Форма User из спеки Ивана (components.schemas.User). */
export type IvanUser = {
  _id: string;
  email: string;
  firstName?: string;
  profession?: string; // → Student.role («Роль в бизнесе»)
  fieldOfActivity?: string; // → Student.industry («Сфера деятельности»)
  city?: string; // → Student.region («Регион»)
  role?: IvanRole; // access-роль (не бизнес-роль)
  courseGroup?: IvanCourseGroupRef | null;
  lastLogin?: string;
  createdAt?: string;
};

/** Форма CourseAgent из спеки Ивана (+ role, который он добавляет). */
export type IvanCourseAgent = {
  _id: string;
  name: string;
  description?: string;
  avatar?: string;
  role?: string;
  openAiAssistantId?: string;
  baseMessages?: unknown[];
};

/** Агент в формате сайдбара saas-teacher (как ждёт /api/programs/active). */
export type TeacherAgent = {
  id: string;
  slug: string;
  name: string;
  role: string | null;
  valueDescription: string | null;
  avatarUrl: string | null;
  isAvailable: boolean;
};

/** Сообщение из спеки Ивана (CourseMessage). */
export type IvanCourseMessage = {
  _id: string;
  messageText: string;
  user: string;
  agent: string;
  author: "user" | "agent";
  createdAt: string;
};

/** Сообщение в формате клиентского чата. */
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  agentId: string | null;
  createdAt: string;
};

export function mapMessage(m: IvanCourseMessage): ChatMessage {
  return {
    id: m._id,
    role: m.author === "user" ? "user" : "assistant",
    content: m.messageText,
    agentId: m.agent ?? null,
    createdAt: m.createdAt,
  };
}

/** GET /profile с relay-куки и авто-refresh на 401. */
export function fetchProfile(cookie: string | null): Promise<IvanResult<IvanUser>> {
  return ivanCall<IvanUser>({ path: "/profile", cookie, retryOn401: true });
}

/**
 * История диалога с КОНКРЕТНЫМ агентом (per-agent чат — у каждого эксперта
 * своя переписка; то, что у юзера один OpenAI thread, на UX не влияет).
 * GET /course/messages?agentId — у Ивана пагинация (берём первую страницу).
 */
export function fetchAgentHistory(
  cookie: string | null,
  agentId: string,
): Promise<IvanResult<{ messages: IvanCourseMessage[] }>> {
  return ivanCall<{ messages: IvanCourseMessage[] }>({
    path: `/course/messages?agentId=${encodeURIComponent(agentId)}&limit=200`,
    cookie,
    retryOn401: true,
  });
}

/**
 * CourseGroup (Ивана) → StudentProgramSummary.
 * Дат у Ивана нет (регулируем вручную через active), place нет (группа = контроль
 * доступа, не мероприятие). isActive=false → «программа закрыта» (read-only).
 */
export function mapGroupToProgram(group: IvanCourseGroupRef): StudentProgramSummary {
  return {
    id: group._id,
    title: group.name ?? "",
    startsAt: "",
    endsAt: "",
    isActive: group.active ?? true,
    place: null,
  };
}

/** CourseAgent (Ивана) → агент сайдбара. slug=ObjectId (slug у Ивана нет). */
export function mapAgent(a: IvanCourseAgent): TeacherAgent {
  return {
    id: a._id,
    slug: a._id,
    name: a.name,
    role: a.role ?? null,
    valueDescription: a.description ?? null,
    avatarUrl: a.avatar ?? null,
    isAvailable: true, // доступность регулируется через group.active
  };
}

/**
 * User (Ивана) → Student (наш UI-контракт из auth-context).
 * program ← courseGroup. project пока null (у Ивана нет модели проектов — Phase 3,
 * требует продуктового решения). Account-level isActive=true (у Ивана нет per-user
 * disable); «программа закрыта» живёт в program.isActive.
 */
export function mapUserToStudent(u: IvanUser): Student {
  const group = u.courseGroup ?? null;
  return {
    id: u._id,
    email: u.email,
    firstName: u.firstName ?? null,
    lastName: null, // у Ивана только firstName
    role: u.profession ?? null, // «Роль в бизнесе» ← profession
    industry: u.fieldOfActivity ?? null, // «Сфера деятельности»
    region: u.city ?? null, // «Регион» = city
    isActive: true,
    program: group ? mapGroupToProgram(group) : null,
    project: null,
  };
}
