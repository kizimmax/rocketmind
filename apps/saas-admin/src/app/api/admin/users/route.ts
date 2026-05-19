import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { canCreateRole, assignableRoles } from "@/lib/user-policy";
import { logAudit } from "@/lib/audit";
import { generateStrongPassword } from "@/lib/password";
import { filterGrantable, loadPermissions } from "@/lib/permissions";

export const dynamic = "force-dynamic";

interface CreateUserBody {
  firstName?: string;
  lastName?: string;
  login?: string;
  email?: string;
  role?: Role;
  initialPermissions?: { path: string; accessLevel: "VIEW" | "EDIT" }[];
}

/**
 * List users visible to the current actor:
 * - SUPER_ADMIN sees everyone.
 * - ADMIN sees themselves + users they created.
 * - EDITOR cannot reach this route (requireAdmin blocks).
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const where =
    auth.role === "SUPER_ADMIN"
      ? {}
      : { OR: [{ id: auth.id }, { createdById: auth.id }] };

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      login: true,
      email: true,
      role: true,
      status: true,
      lastLoginAt: true,
      createdAt: true,
      createdById: true,
    },
    orderBy: [{ role: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ users, assignableRoles: assignableRoles(auth) });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const body = (await req.json().catch(() => null)) as CreateUserBody | null;
  if (!body?.firstName || !body?.lastName || !body?.login || !body?.role) {
    return NextResponse.json({ error: "required_fields_missing" }, { status: 400 });
  }

  const role = body.role;
  if (!canCreateRole(auth, role)) {
    return NextResponse.json({ error: "forbidden_role" }, { status: 403 });
  }

  const loginTrimmed = body.login.trim();
  const emailTrimmed = body.email?.trim() || null;

  if (loginTrimmed.length < 3) {
    return NextResponse.json({ error: "login_too_short" }, { status: 400 });
  }

  // Filter requested permissions down to what the actor is allowed to delegate.
  const actorPerms = auth.role === "SUPER_ADMIN" ? [] : await loadPermissions(auth.id);
  const requested = body.initialPermissions ?? [];
  const allowed = filterGrantable(auth.role, actorPerms, requested);

  const generated = generateStrongPassword(16);
  const hash = await bcrypt.hash(generated, 12);

  try {
    const created = await prisma.user.create({
      data: {
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        login: loginTrimmed,
        email: emailTrimmed,
        password: hash,
        role,
        createdById: auth.id,
        permissions: {
          create: allowed.map((p) => ({ path: p.path, accessLevel: p.accessLevel })),
        },
      },
      select: { id: true, login: true, email: true, role: true },
    });

    await logAudit({
      actorId: auth.id,
      action: "user.created",
      targetType: "user",
      targetId: created.id,
      metadata: { role, login: created.login, grantedPermissionCount: allowed.length },
      req,
    });

    return NextResponse.json({
      user: created,
      generatedPassword: generated,
      droppedPermissionCount: requested.length - allowed.length,
    });
  } catch (err) {
    const msg = (err as { code?: string })?.code;
    if (msg === "P2002") {
      return NextResponse.json({ error: "login_or_email_taken" }, { status: 409 });
    }
    console.error("[users.create] failed", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
