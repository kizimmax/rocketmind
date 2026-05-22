/**
 * Типизированные прямые вызовы API Ивана из браузера (через lib/api.ts).
 * Раньше эти вызовы шли через BFF-роуты app/api/** — теперь напрямую.
 */
import { apiCall, apiStream } from "./api";
import {
  mapAgent,
  mapMessage,
  mapUserToStudent,
  type ChatMessage,
  type IvanCourseAgent,
  type IvanCourseMessage,
  type IvanUser,
  type TeacherAgent,
} from "./ivan-auth";
import type { Student } from "./auth-context";

// ── Auth ──────────────────────────────────────────────────────────────────────

/** GET /profile → наш Student. Бросает ApiError(401), если не авторизован. */
export function getProfile(): Promise<Student> {
  return apiCall<IvanUser>("/profile").then(mapUserToStudent);
}

/** POST /auth/login — отправка OTP-кода на email. */
export async function requestCode(email: string): Promise<void> {
  await apiCall("/auth/login", { method: "POST", body: { email } });
}

/** POST /auth/verify — проверка кода; бэк ставит http-only куки. */
export async function verifyCode(email: string, code: string): Promise<void> {
  await apiCall("/auth/verify", { method: "POST", body: { email, code } });
}

/** POST /auth/logout — бэк чистит куки. Ошибку глотаем (всё равно разлогиниваемся). */
export async function logout(): Promise<void> {
  await apiCall("/auth/logout", { method: "POST" }).catch(() => {});
}

// ── Программа / агенты ──────────────────────────────────────────────────────────

/** GET /course/agents/accessible → агенты сайдбара (доступность фильтрует бэк). */
export function getAccessibleAgents(): Promise<TeacherAgent[]> {
  return apiCall<IvanCourseAgent[]>("/course/agents/accessible").then((a) =>
    (Array.isArray(a) ? a : []).map(mapAgent),
  );
}

/** POST /course/groups/join — привязка к группе по QR-коду. */
export async function joinGroup(qrCode: string): Promise<void> {
  await apiCall("/course/groups/join", { method: "POST", body: { qrCode } });
}

// ── Профиль (анкета) ────────────────────────────────────────────────────────────

export type ProfileFields = {
  firstName?: string;
  lastName?: string;
  role?: string; // → profession
  industry?: string; // → fieldOfActivity
  region?: string; // → city
};

/** PUT /profile → обновлённый Student. Маппинг анкеты в поля Ивана. */
export function updateProfile(fields: ProfileFields): Promise<Student> {
  const payload: Record<string, string> = {};
  if (typeof fields.firstName === "string") payload.firstName = fields.firstName.trim();
  if (typeof fields.lastName === "string") payload.lastName = fields.lastName.trim();
  if (typeof fields.role === "string") payload.profession = fields.role.trim();
  if (typeof fields.industry === "string") payload.fieldOfActivity = fields.industry.trim();
  if (typeof fields.region === "string") payload.city = fields.region.trim();
  return apiCall<IvanUser>("/profile", { method: "PUT", body: payload }).then(mapUserToStudent);
}

// ── Чат ──────────────────────────────────────────────────────────────────────

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

export type HistoryPage = {
  /** Сообщения страницы по возрастанию даты (oldest→newest). */
  messages: ChatMessage[];
  pagination: Pagination;
};

/** Размер страницы истории. Лимит у Ивана ≤ 50; берём по 20 (мельче — отзывчивее скролл). */
export const HISTORY_PAGE_SIZE = 20;

const EMPTY_PAGINATION: Pagination = {
  page: 1,
  limit: HISTORY_PAGE_SIZE,
  total: 0,
  totalPages: 1,
  hasMore: false,
};

/**
 * Страница истории диалога с агентом (per-agent чат). Сортировка у Ивана —
 * по возрастанию даты; page 1 = самые старые, новые — на последней странице.
 */
export function getAgentHistory(
  agentId: string,
  page = 1,
  limit = HISTORY_PAGE_SIZE,
): Promise<HistoryPage> {
  const safeLimit = Math.min(Math.max(1, limit), HISTORY_PAGE_SIZE);
  return apiCall<{ messages: IvanCourseMessage[]; pagination?: Pagination }>(
    `/course/messages?agentId=${encodeURIComponent(agentId)}&page=${page}&limit=${safeLimit}`,
  )
    .then((d) => ({
      messages: (d?.messages ?? []).map(mapMessage),
      pagination: d?.pagination ?? { ...EMPTY_PAGINATION, page, limit: safeLimit },
    }))
    .catch(() => ({ messages: [], pagination: { ...EMPTY_PAGINATION, page, limit: safeLimit } }));
}

/**
 * POST /course/messages (SSE). Возвращает Response со стрим-телом —
 * вызывающий код читает события delta/done/error.
 */
export function streamMessage(
  agentId: string,
  content: string,
  signal?: AbortSignal,
): Promise<Response> {
  return apiStream("/course/messages", { agentId, messageText: content }, signal);
}
