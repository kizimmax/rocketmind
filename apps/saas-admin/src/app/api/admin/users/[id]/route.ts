import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invalidateSessions, requireAdmin } from "@/lib/auth";
import { canDelete, canManageUser } from "@/lib/user-policy";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

interface UpdateBody {
  firstName?: string;
  lastName?: string;
  login?: string;
  email?: string | null;
}

async function loadTarget(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      login: true,
      email: true,
      emailVerifiedAt: true,
      secondaryEmail: true,
      secondaryEmailVerifiedAt: true,
      role: true,
      status: true,
      createdById: true,
      lastLoginAt: true,
      lastLoginIp: true,
      lastLoginUserAgent: true,
      createdAt: true,
      updatedAt: true,
      permissions: {
        select: { path: true, accessLevel: true },
        orderBy: { path: "asc" },
      },
    },
  });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;

  const user = await loadTarget(id);
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Visibility: self or someone you can manage.
  const isSelf = user.id === auth.id;
  const visible = isSelf || canManageUser(auth, user) || auth.role === "SUPER_ADMIN";
  if (!visible) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;

  const target = await loadTarget(id);
  if (!target) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (!canManageUser(auth, target)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as UpdateBody | null;
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const data: Record<string, unknown> = {};
  const changedFields: string[] = [];
  let invalidate = false;

  if (typeof body.firstName === "string" && body.firstName.trim() !== target.firstName) {
    data.firstName = body.firstName.trim();
    changedFields.push("firstName");
  }
  if (typeof body.lastName === "string" && body.lastName.trim() !== target.lastName) {
    data.lastName = body.lastName.trim();
    changedFields.push("lastName");
  }
  if (typeof body.login === "string" && body.login.trim() !== target.login) {
    if (body.login.trim().length < 3) {
      return NextResponse.json({ error: "login_too_short" }, { status: 400 });
    }
    data.login = body.login.trim();
    changedFields.push("login");
    invalidate = true; // force re-login when login changes
  }
  if ("email" in body) {
    const next = body.email === null || body.email === "" ? null : body.email?.trim() ?? null;
    if (next !== target.email) {
      data.email = next;
      // Reset verification — new email is unverified.
      data.emailVerifiedAt = null;
      changedFields.push("email");
      invalidate = true;
    }
  }

  if (changedFields.length === 0) {
    return NextResponse.json({ user: target, changed: [] });
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        login: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
      },
    });

    if (invalidate) await invalidateSessions(id);

    const actions: Array<Parameters<typeof logAudit>[0]> = [];
    if (changedFields.includes("login")) {
      actions.push({
        actorId: auth.id,
        action: "user.login_changed",
        targetType: "user",
        targetId: id,
        metadata: { from: target.login, to: updated.login },
        req,
      });
    }
    if (changedFields.includes("email")) {
      actions.push({
        actorId: auth.id,
        action: "email.changed_by_admin",
        targetType: "user",
        targetId: id,
        metadata: { from: target.email, to: updated.email },
        req,
      });
    }
    await Promise.all(actions.map(logAudit));

    return NextResponse.json({ user: updated, changed: changedFields });
  } catch (err) {
    if ((err as { code?: string })?.code === "P2002") {
      return NextResponse.json({ error: "login_or_email_taken" }, { status: 409 });
    }
    console.error("[users.patch] failed", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;

  const target = await loadTarget(id);
  if (!target) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (!canDelete(auth, target)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await prisma.user.delete({ where: { id } });

  await logAudit({
    actorId: auth.id,
    action: "user.deleted",
    targetType: "user",
    targetId: id,
    metadata: { login: target.login, role: target.role },
    req,
  });

  return NextResponse.json({ ok: true });
}
