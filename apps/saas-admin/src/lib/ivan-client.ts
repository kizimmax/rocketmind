/**
 * Типизированные прямые вызовы API Ивана из браузера (через lib/api.ts).
 * Раньше шло через BFF-роуты app/api/** — теперь напрямую.
 */
import { apiCall, uploadFile } from "./api";
import {
  agentBody,
  groupBody,
  mapAdminUser,
  mapAgent,
  mapGroupDetail,
  mapGroupList,
  mapRole,
  mapRoleDetail,
  mapStudent,
  userBody,
  type ClientAdminUser,
  type ClientAgent,
  type ClientGroupDetail,
  type ClientGroupListItem,
  type ClientRole,
  type ClientRoleDetail,
  type ClientStudent,
  type IvanCourseAgent,
  type IvanCourseGroup,
  type IvanRole,
  type IvanUser,
  type OpenAiAssistant,
  type PermissionGroup,
} from "./ivan-auth";
import type { CurrentUser } from "./auth-context";

export { uploadFile };

// ── Auth ──────────────────────────────────────────────────────────────────────

/**
 * Текущий пользователь. /profile Ивана → CurrentUser. Гейт: роль есть → админ;
 * нет роли / 401 / 403 → null. На MVP роль маппим в SUPER_ADMIN (permissions[]
 * пустой — клиент байпасит permission-слой для SUPER_ADMIN).
 */
export async function getMe(): Promise<CurrentUser | null> {
  try {
    const u = await apiCall<IvanUser>("/profile");
    if (!u?.role) return null; // нет роли → не админ
    return {
      id: u._id,
      login: u.email,
      firstName: u.firstName ?? "",
      lastName: "",
      role: "SUPER_ADMIN",
      email: u.email,
    };
  } catch {
    return null;
  }
}

export async function requestCode(email: string): Promise<void> {
  await apiCall("/auth/login", { method: "POST", body: { email } });
}

export async function verifyCode(email: string, code: string): Promise<void> {
  await apiCall("/auth/verify", { method: "POST", body: { email, code } });
}

export async function logout(): Promise<void> {
  await apiCall("/auth/logout", { method: "POST" }).catch(() => {});
}

// ── AI-агенты (CourseAgent) ─────────────────────────────────────────────────────

export function getAgents(): Promise<ClientAgent[]> {
  return apiCall<IvanCourseAgent[]>("/course/agents").then((a) =>
    (Array.isArray(a) ? a : []).map(mapAgent),
  );
}

export function getAgent(id: string): Promise<ClientAgent> {
  return apiCall<IvanCourseAgent>(`/course/agents/${id}`).then(mapAgent);
}

export function createAgent(body: Record<string, unknown>): Promise<ClientAgent> {
  return apiCall<IvanCourseAgent>("/course/agents", {
    method: "POST",
    body: agentBody(body),
  }).then(mapAgent);
}

export function updateAgent(id: string, body: Record<string, unknown>): Promise<ClientAgent> {
  return apiCall<IvanCourseAgent>(`/course/agents/${id}`, {
    method: "PUT",
    body: agentBody(body),
  }).then(mapAgent);
}

export async function deleteAgent(id: string): Promise<void> {
  await apiCall(`/course/agents/${id}`, { method: "DELETE" });
}

/** Ассистенты OpenAI для выпадающего списка в форме агента. */
export function getAssistants(): Promise<OpenAiAssistant[]> {
  return apiCall<OpenAiAssistant[]>("/course/agents/assistants").then((a) =>
    Array.isArray(a) ? a : [],
  );
}

// ── Программы (CourseGroup) ──────────────────────────────────────────────────────

export function getGroups(): Promise<ClientGroupListItem[]> {
  return apiCall<IvanCourseGroup[]>("/course/groups").then((g) =>
    (Array.isArray(g) ? g : []).map(mapGroupList),
  );
}

export function getGroup(id: string): Promise<ClientGroupDetail> {
  return apiCall<IvanCourseGroup>(`/course/groups/${id}`).then(mapGroupDetail);
}

export function createGroup(body: Record<string, unknown>): Promise<ClientGroupDetail> {
  return apiCall<IvanCourseGroup>("/course/groups", {
    method: "POST",
    body: groupBody(body),
  }).then(mapGroupDetail);
}

export function updateGroup(id: string, body: Record<string, unknown>): Promise<ClientGroupDetail> {
  return apiCall<IvanCourseGroup>(`/course/groups/${id}`, {
    method: "PUT",
    body: groupBody(body),
  }).then(mapGroupDetail);
}

export async function deleteGroup(id: string): Promise<void> {
  await apiCall(`/course/groups/${id}`, { method: "DELETE" });
}

// ── Пользователи / роли ──────────────────────────────────────────────────────────

/** У Ивана /users пагинирован (limit ≤ 100). Собираем все страницы. */
async function fetchAllUsers(): Promise<IvanUser[]> {
  const all: IvanUser[] = [];
  for (let page = 1; page <= 100; page++) {
    const d = await apiCall<{ users?: IvanUser[]; pagination?: { hasMore?: boolean } } | IvanUser[]>(
      `/users?page=${page}&limit=100`,
    );
    const list = Array.isArray(d) ? d : (d?.users ?? []);
    all.push(...list);
    const hasMore = !Array.isArray(d) && d?.pagination?.hasMore === true;
    if (!hasMore || list.length === 0) break;
  }
  return all;
}

export function getAdminUsers(): Promise<ClientAdminUser[]> {
  return fetchAllUsers().then((u) => u.map(mapAdminUser));
}

export function getStudents(): Promise<ClientStudent[]> {
  return fetchAllUsers().then((u) => u.map(mapStudent));
}

export function getAdminUser(id: string): Promise<ClientAdminUser> {
  return apiCall<IvanUser>(`/users/${id}`).then(mapAdminUser);
}

export function getRoles(): Promise<ClientRole[]> {
  return apiCall<IvanRole[]>("/roles").then((r) => (Array.isArray(r) ? r : []).map(mapRole));
}

// ── Роли: создание/редактирование с правами ──────────────────────────────────────

/** Список доступных прав, сгруппированных (key → бэк, label → UI). */
export function getPermissionGroups(): Promise<PermissionGroup[]> {
  return apiCall<PermissionGroup[]>("/roles/permissions").then((g) => (Array.isArray(g) ? g : []));
}

export function getRoleDetail(id: string): Promise<ClientRoleDetail> {
  return apiCall<IvanRole>(`/roles/${id}`).then(mapRoleDetail);
}

export function createRole(name: string, permissions: string[]): Promise<ClientRoleDetail> {
  return apiCall<IvanRole>("/roles", {
    method: "POST",
    body: { name: name.trim(), permissions },
  }).then(mapRoleDetail);
}

export function updateRole(
  id: string,
  name: string,
  permissions: string[],
): Promise<ClientRoleDetail> {
  return apiCall<IvanRole>(`/roles/${id}`, {
    method: "PUT",
    body: { name: name.trim(), permissions },
  }).then(mapRoleDetail);
}

export async function deleteRole(id: string): Promise<void> {
  await apiCall(`/roles/${id}`, { method: "DELETE" });
}

/**
 * Обновление пользователя: роль (PUT /users/{id}/role) и/или поля (PUT /users/{id}).
 * Возвращает обновлённого пользователя.
 */
export async function updateAdminUser(
  id: string,
  body: Record<string, unknown>,
): Promise<ClientAdminUser> {
  if ("roleId" in body) {
    await apiCall(`/users/${id}/role`, {
      method: "PUT",
      body: { role: body.roleId || null },
    });
  }
  const data = userBody(body);
  let user: IvanUser;
  if (Object.keys(data).length) {
    user = await apiCall<IvanUser>(`/users/${id}`, { method: "PUT", body: data });
  } else {
    user = await apiCall<IvanUser>(`/users/${id}`);
  }
  return mapAdminUser(user);
}
