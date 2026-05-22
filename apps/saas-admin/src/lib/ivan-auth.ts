import { ivanCall, type IvanResult } from "./ivan-api";

export type IvanRole = {
  _id: string;
  name: string;
  permissions: string[];
  isSystem: boolean;
};

/** User из спеки Ивана (components.schemas.User). */
export type IvanUser = {
  _id: string;
  email: string;
  firstName?: string;
  profession?: string;
  fieldOfActivity?: string;
  city?: string;
  /** Роль доступа. null/отсутствует → НЕ админ (только saas-teacher). */
  role?: IvanRole | null;
  lastLogin?: string;
  createdAt?: string;
};

/** GET /profile с relay-куки и авто-refresh на 401. */
export function fetchProfile(cookie: string | null): Promise<IvanResult<IvanUser>> {
  return ivanCall<IvanUser>({ path: "/profile", cookie, retryOn401: true });
}

// ── CourseAgent ──────────────────────────────────────────────────────────────

/** CourseAgent из спеки Ивана. Поля финальные (новых не добавляем). */
export type IvanCourseAgent = {
  _id: string;
  name: string;
  description?: string;
  avatar?: string | null;
  openAiAssistantId?: string;
  baseMessages?: string[];
  role?: string;
  docs?: string;
  serial?: number;
};

/** Форма агента для админ-UI (наш контракт). */
export type ClientAgent = {
  id: string;
  name: string;
  role: string;
  valueDescription: string;
  avatarUrl: string | null;
  serial: number;
  openAiAssistantId: string;
};

export function mapAgent(a: IvanCourseAgent): ClientAgent {
  return {
    id: a._id,
    name: a.name,
    role: a.role ?? "",
    valueDescription: a.description ?? "",
    avatarUrl: a.avatar ?? null,
    serial: a.serial ?? 0,
    openAiAssistantId: a.openAiAssistantId ?? "",
  };
}

/** Тело POST/PUT для /course/agents из payload админ-формы. */
export function agentBody(body: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (typeof body.name === "string") out.name = body.name.trim();
  if (typeof body.role === "string") out.role = body.role;
  if (typeof body.valueDescription === "string") out.description = body.valueDescription;
  if ("avatarUrl" in body) out.avatar = body.avatarUrl || null;
  if (typeof body.openAiAssistantId === "string") out.openAiAssistantId = body.openAiAssistantId;
  if (body.serial !== undefined) {
    const n = Number(body.serial);
    if (Number.isFinite(n)) out.serial = Math.trunc(n);
  }
  return out;
}
