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
  courseGroup?: { _id: string } | string | null;
  lastLogin?: string;
  createdAt?: string;
};

function refId(v: { _id: string } | string | null | undefined): string | null {
  if (!v) return null;
  return typeof v === "string" ? v : v._id;
}

/** GET /profile с relay-куки и авто-refresh на 401. */
export function fetchProfile(cookie: string | null): Promise<IvanResult<IvanUser>> {
  return ivanCall<IvanUser>({ path: "/profile", cookie, retryOn401: true });
}

// ── CourseAgent ──────────────────────────────────────────────────────────────

/** CourseAgent из спеки Ивана. (serial у Ивана нет — порядок в программе через group.agents[].) */
export type IvanCourseAgent = {
  _id: string;
  name: string;
  description?: string;
  avatar?: string | null;
  openAiAssistantId?: string;
  baseMessages?: string[];
  role?: string;
  docs?: string;
};

/** Форма агента для админ-UI (наш контракт). */
export type ClientAgent = {
  id: string;
  name: string;
  role: string;
  valueDescription: string;
  avatarUrl: string | null;
  openAiAssistantId: string;
};

export function mapAgent(a: IvanCourseAgent): ClientAgent {
  return {
    id: a._id,
    name: a.name,
    role: a.role ?? "",
    valueDescription: a.description ?? "",
    avatarUrl: a.avatar ?? null,
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
  return out;
}

// ── CourseGroup (программы) ───────────────────────────────────────────────────

export type IvanCourseGroup = {
  _id: string;
  name: string;
  agents?: ({ _id: string } | string)[];
  active?: boolean;
  qrCode?: string | null;
};

function normIds(arr: IvanCourseGroup["agents"]): string[] {
  return (Array.isArray(arr) ? arr : [])
    .map((a) => (typeof a === "string" ? a : a?._id))
    .filter((x): x is string => !!x);
}

export type ClientGroupListItem = {
  id: string;
  title: string;
  isActive: boolean;
  qrCode: string | null;
  agentCount: number;
};

export type ClientGroupDetail = {
  id: string;
  title: string;
  isActive: boolean;
  qrCode: string | null;
  /** Упорядоченный массив agentId — порядок = порядок агентов в программе. */
  agents: string[];
};

export function mapGroupList(g: IvanCourseGroup): ClientGroupListItem {
  return {
    id: g._id,
    title: g.name,
    isActive: g.active ?? true,
    qrCode: g.qrCode ?? null,
    agentCount: normIds(g.agents).length,
  };
}

export function mapGroupDetail(g: IvanCourseGroup): ClientGroupDetail {
  return {
    id: g._id,
    title: g.name,
    isActive: g.active ?? true,
    qrCode: g.qrCode ?? null,
    agents: normIds(g.agents),
  };
}

/** Тело PUT/POST для /course/groups. agents[] заменяет массив целиком. */
export function groupBody(body: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (typeof body.title === "string") out.name = body.title.trim();
  if (typeof body.isActive === "boolean") out.active = body.isActive;
  if (Array.isArray(body.agents)) {
    out.agents = body.agents.filter((x): x is string => typeof x === "string");
  }
  if (body.updateQRCode === true) out.updateQRCode = true;
  return out;
}

// ── Students (ученики = User с courseGroup) ──────────────────────────────────

export type ClientStudent = {
  id: string;
  email: string;
  firstName: string;
  role: string | null;
  courseGroupId: string | null;
};

export function mapStudent(u: IvanUser): ClientStudent {
  return {
    id: u._id,
    email: u.email,
    firstName: u.firstName ?? "",
    role: u.role?.name ?? null,
    courseGroupId: refId(u.courseGroup),
  };
}

// ── Users / Roles (управление в админке) ─────────────────────────────────────

export type ClientAdminUser = {
  id: string;
  firstName: string;
  email: string;
  /** Имя роли (null → обычный ученик, не админ). */
  role: string | null;
  roleId: string | null;
  profession: string;
  fieldOfActivity: string;
  city: string;
};

export function mapAdminUser(u: IvanUser): ClientAdminUser {
  return {
    id: u._id,
    firstName: u.firstName ?? "",
    email: u.email,
    role: u.role?.name ?? null,
    roleId: u.role?._id ?? null,
    profession: u.profession ?? "",
    fieldOfActivity: u.fieldOfActivity ?? "",
    city: u.city ?? "",
  };
}

export type ClientRole = { id: string; name: string; isSystem: boolean };

export function mapRole(r: IvanRole): ClientRole {
  return { id: r._id, name: r.name, isSystem: !!r.isSystem };
}

/** Тело PUT /users/{id} (edit данных). courseGroup — id группы (Иван добавил приём id). */
export function userBody(body: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of ["firstName", "profession", "fieldOfActivity", "city", "courseGroup"] as const) {
    if (typeof body[k] === "string") out[k] = body[k];
  }
  return out;
}
