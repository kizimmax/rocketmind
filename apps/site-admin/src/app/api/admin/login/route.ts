import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { checkLoginRateLimit, recordLoginAttempt } from "@/lib/rate-limit";
import { getClientMeta } from "@/lib/client-meta";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { ip, userAgent } = getClientMeta(req);
  const safeIp = ip ?? "unknown";

  if (!body?.login || !body?.password) {
    return NextResponse.json({ error: "login_and_password_required" }, { status: 400 });
  }

  const rl = await checkLoginRateLimit(safeIp, body.login);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "too_many_attempts", retryAfterSec: rl.retryAfterSec },
      { status: 429 },
    );
  }

  const user = await prisma.user.findUnique({ where: { login: body.login } });

  if (!user) {
    await recordLoginAttempt(safeIp, body.login, false);
    await logAudit({ actorId: null, action: "login.failed", metadata: { login: body.login, reason: "unknown_user" }, ip, userAgent });
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  if (user.status === "FROZEN") {
    await recordLoginAttempt(safeIp, body.login, false);
    await logAudit({ actorId: user.id, action: "login.failed", metadata: { reason: "frozen" }, ip, userAgent });
    return NextResponse.json({ error: "account_frozen" }, { status: 403 });
  }

  const ok = await bcrypt.compare(body.password, user.password);
  if (!ok) {
    await recordLoginAttempt(safeIp, body.login, false);
    await logAudit({ actorId: user.id, action: "login.failed", metadata: { reason: "bad_password" }, ip, userAgent });
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  await recordLoginAttempt(safeIp, body.login, true);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
      lastLoginIp: ip ?? null,
      lastLoginUserAgent: userAgent ?? null,
    },
  });

  await logAudit({ actorId: user.id, action: "login.success", ip, userAgent });

  const token = signToken({
    userId: user.id,
    login: user.login,
    role: user.role,
    tokenVersion: user.tokenVersion,
  });

  const res = NextResponse.json({
    token,
    user: {
      id: user.id,
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      email: user.email,
    },
  });
  res.cookies.set("rm_admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
