import { NextRequest, NextResponse } from "next/server";
import { AccessLevel } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { invalidateSessions, requireAdmin } from "@/lib/auth";
import { canManageUser } from "@/lib/user-policy";
import { filterGrantable, loadPermissions } from "@/lib/permissions";
import { findStaticSection, splitDynamic } from "@/lib/permissions/sections";
import { itemExists } from "@/lib/permissions/children-loader";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

interface PutBody {
  permissions: { path: string; accessLevel: AccessLevel }[];
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;

  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, createdById: true },
  });
  if (!target) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (target.id !== auth.id && !canManageUser(auth, target) && auth.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const permissions = await prisma.userPermission.findMany({
    where: { userId: id },
    select: { path: true, accessLevel: true },
    orderBy: { path: "asc" },
  });
  return NextResponse.json({ permissions });
}

/**
 * Full replace: client sends the desired complete set, we diff and apply.
 * Each path is validated against the static tree; dynamic suffixes (per-item
 * grants) are validated against the backing entity.
 */
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;

  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, createdById: true },
  });
  if (!target) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!canManageUser(auth, target)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as PutBody | null;
  if (!body || !Array.isArray(body.permissions)) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Validate each requested path.
  const requested: { path: string; accessLevel: AccessLevel }[] = [];
  const invalid: string[] = [];

  for (const p of body.permissions) {
    if (!p?.path || (p.accessLevel !== "VIEW" && p.accessLevel !== "EDIT")) {
      invalid.push(String(p?.path));
      continue;
    }
    const { staticPath, itemId } = splitDynamic(p.path);
    const section = staticPath ? findStaticSection(staticPath) : null;
    if (!section) {
      invalid.push(p.path);
      continue;
    }
    if (itemId) {
      if (!section.refinable || !section.kind) {
        invalid.push(p.path);
        continue;
      }
      const ok = await itemExists(section.kind, itemId);
      if (!ok) {
        invalid.push(p.path);
        continue;
      }
    }
    requested.push({ path: p.path, accessLevel: p.accessLevel });
  }

  if (invalid.length > 0) {
    return NextResponse.json({ error: "invalid_paths", invalid }, { status: 400 });
  }

  // Apply delegation cap for non-super admins.
  const actorPerms = auth.role === "SUPER_ADMIN" ? [] : await loadPermissions(auth.id);
  const allowed = filterGrantable(auth.role, actorPerms, requested);
  const dropped = requested.length - allowed.length;

  await prisma.$transaction([
    prisma.userPermission.deleteMany({ where: { userId: id } }),
    prisma.userPermission.createMany({
      data: allowed.map((p) => ({ userId: id, path: p.path, accessLevel: p.accessLevel })),
    }),
  ]);

  await invalidateSessions(id);

  await logAudit({
    actorId: auth.id,
    action: "permissions.updated",
    targetType: "user",
    targetId: id,
    metadata: { count: allowed.length, dropped },
    req,
  });

  return NextResponse.json({ ok: true, count: allowed.length, droppedPermissionCount: dropped });
}
