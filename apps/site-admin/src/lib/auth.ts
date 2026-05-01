import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "";
const TOKEN_TTL = "30d";

export interface JwtPayload {
  userId: string;
  login: string;
  role: "ADMIN" | "EDITOR";
}

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

function extractToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization") || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  return req.cookies.get("rm_admin_token")?.value || null;
}

export function requireAuth(req: NextRequest): JwtPayload | NextResponse {
  const token = extractToken(req);
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  return payload;
}

export function requireAdmin(req: NextRequest): JwtPayload | NextResponse {
  const result = requireAuth(req);
  if (result instanceof NextResponse) return result;
  if (result.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return result;
}
