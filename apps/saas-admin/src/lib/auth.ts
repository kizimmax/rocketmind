import { NextRequest, NextResponse } from "next/server";
import { fetchProfile, type IvanUser } from "./ivan-auth";

/**
 * Авторизация saas-admin против API Ивана (Mongo).
 *
 * Гейт доступа в админку (решение Ивана): у юзера есть роль (role != null) →
 * пускаем; нет роли → только saas-teacher. Гранулярное дерево прав на MVP не
 * используем: любой юзер с ролью трактуется как полный админ. Чтобы не трогать
 * 22 роута и весь permission-слой (server requirePermission и client
 * isPathVisible байпасят SUPER_ADMIN), маппим роль в "SUPER_ADMIN".
 * TODO: когда Иван даст имена ролей + словарь Role.permissions[], вернуть
 * настоящую иерархию (ADMIN/EDITOR + per-section гейтинг).
 */

export type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

export interface AuthedUser {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: "ACTIVE" | "FROZEN";
  email: string | null;
  tokenVersion: number;
}

function mapToAuthed(u: IvanUser): AuthedUser {
  return {
    id: u._id,
    login: u.email,
    firstName: u.firstName ?? "",
    lastName: "",
    role: "SUPER_ADMIN", // MVP: любой юзер с ролью = полный админ
    status: "ACTIVE",
    email: u.email,
    tokenVersion: 0,
  };
}

/** Валидирует сессию через /profile Ивана. Возвращает null, если не авторизован или у юзера нет роли. */
export async function authenticate(req: NextRequest): Promise<AuthedUser | null> {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const r = await fetchProfile(cookie);
  if (!r.ok || !r.data) return null;
  if (!r.data.role) return null; // нет роли → не админ
  return mapToAuthed(r.data);
}

export async function requireAuth(req: NextRequest): Promise<AuthedUser | NextResponse> {
  const user = await authenticate(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return user;
}

// На MVP роль есть → полный доступ. Иерархию вернём, когда Иван даст имена ролей.
export async function requireAdmin(req: NextRequest): Promise<AuthedUser | NextResponse> {
  return requireAuth(req);
}

export async function requireSuperAdmin(req: NextRequest): Promise<AuthedUser | NextResponse> {
  return requireAuth(req);
}

export async function requirePermission(
  req: Request | NextRequest,
  _path: string,
  _level: "VIEW" | "EDIT",
): Promise<AuthedUser | NextResponse> {
  return requireAuth(req as NextRequest);
}

export async function requireAnyPermission(
  req: Request | NextRequest,
  _paths: string[],
  _level: "VIEW" | "EDIT",
): Promise<AuthedUser | NextResponse> {
  return requireAuth(req as NextRequest);
}

/**
 * No-op: сессии теперь у Ивана, локально инвалидировать нечего. Оставлен ради
 * совместимости с роутами, которые звали его после смены пароля/прав/заморозки.
 */
export async function invalidateSessions(_userId: string): Promise<void> {
  /* no-op */
}
