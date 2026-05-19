import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { Role, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "";
const TOKEN_TTL = "30d";

export interface JwtPayload {
  userId: string;
  login: string;
  role: Role;
  tokenVersion: number;
}

export type AuthedUser = Pick<
  User,
  "id" | "login" | "firstName" | "lastName" | "role" | "status" | "email" | "tokenVersion"
>;

export function signToken(payload: JwtPayload): string {
  if (!JWT_SECRET) throw new Error("JWT_SECRET не задан в ENV");
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export function verifyToken(token: string): JwtPayload | null {
  if (!JWT_SECRET) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function extractToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization") || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  return req.cookies.get("rm_admin_token")?.value || null;
}

/**
 * Full auth check: validates JWT signature, then loads the user and confirms
 * status === ACTIVE and tokenVersion matches. Use this in API routes that
 * need a live, non-frozen user.
 */
export async function authenticate(req: NextRequest): Promise<AuthedUser | null> {
  const token = extractToken(req);
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      login: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      email: true,
      tokenVersion: true,
    },
  });
  if (!user) return null;
  if (user.status === "FROZEN") return null;
  if (user.tokenVersion !== payload.tokenVersion) return null;
  return user;
}

export async function requireAuth(req: NextRequest): Promise<AuthedUser | NextResponse> {
  const user = await authenticate(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return user;
}

export async function requireAdmin(req: NextRequest): Promise<AuthedUser | NextResponse> {
  const result = await requireAuth(req);
  if (result instanceof NextResponse) return result;
  if (result.role !== "SUPER_ADMIN" && result.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return result;
}

export async function requireSuperAdmin(req: NextRequest): Promise<AuthedUser | NextResponse> {
  const result = await requireAuth(req);
  if (result instanceof NextResponse) return result;
  if (result.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return result;
}

/**
 * Guard for content endpoints: authenticates the user, then checks they have
 * `level` access on `path` in the permission tree. SUPER_ADMIN bypasses.
 *
 * Convention: use `VIEW` for GET handlers (or omit the call entirely for
 * universally-readable lists) and `EDIT` for POST/PUT/PATCH/DELETE.
 */
export async function requirePermission(
  req: Request | NextRequest,
  path: string,
  level: "VIEW" | "EDIT",
): Promise<AuthedUser | NextResponse> {
  // Route handlers sometimes type the arg as Request, but at runtime in the
  // App Router it's always NextRequest — safe to cast for cookie access.
  const result = await requireAuth(req as NextRequest);
  if (result instanceof NextResponse) return result;
  if (result.role === "SUPER_ADMIN") return result;

  const RANK = { VIEW: 1, EDIT: 2 } as const;
  const required = RANK[level];

  const perms = await prisma.userPermission.findMany({
    where: { userId: result.id },
    select: { path: true, accessLevel: true },
  });

  for (const p of perms) {
    const ancestorOrSelf = p.path === path || path.startsWith(p.path + ".");
    if (ancestorOrSelf && RANK[p.accessLevel] >= required) {
      return result;
    }
  }
  return NextResponse.json({ error: "forbidden", path, level }, { status: 403 });
}

/**
 * Like requirePermission, but passes if ANY of the supplied paths is granted.
 * Used by endpoints that serve multiple sidebar sections from one route —
 * e.g. /api/articles serves both `media.articles` and `cases` (cases are
 * articles with type="case").
 */
export async function requireAnyPermission(
  req: Request | NextRequest,
  paths: string[],
  level: "VIEW" | "EDIT",
): Promise<AuthedUser | NextResponse> {
  const result = await requireAuth(req as NextRequest);
  if (result instanceof NextResponse) return result;
  if (result.role === "SUPER_ADMIN") return result;

  const RANK = { VIEW: 1, EDIT: 2 } as const;
  const required = RANK[level];

  const perms = await prisma.userPermission.findMany({
    where: { userId: result.id },
    select: { path: true, accessLevel: true },
  });

  for (const want of paths) {
    for (const p of perms) {
      const ancestorOrSelf = p.path === want || want.startsWith(p.path + ".");
      if (ancestorOrSelf && RANK[p.accessLevel] >= required) {
        return result;
      }
    }
  }
  return NextResponse.json({ error: "forbidden", paths, level }, { status: 403 });
}

/**
 * Bumps tokenVersion, invalidating every JWT issued before this call.
 * Use after: password change, role change, permission change, freeze, email change.
 */
export async function invalidateSessions(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { tokenVersion: { increment: 1 } },
  });
}
