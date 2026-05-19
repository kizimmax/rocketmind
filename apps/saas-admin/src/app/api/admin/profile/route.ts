import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface PatchBody {
  firstName?: string;
  lastName?: string;
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const user = await prisma.user.findUnique({
    where: { id: auth.id },
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
      lastLoginAt: true,
      lastLoginIp: true,
      lastLoginUserAgent: true,
      createdAt: true,
    },
  });
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ user });
}

/**
 * Self-service profile edit. Restricted to name fields — login/email require
 * stronger flows (admin action / verification token) and live on dedicated
 * endpoints.
 */
export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const body = (await req.json().catch(() => null)) as PatchBody | null;
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (typeof body.firstName === "string" && body.firstName.trim()) {
    data.firstName = body.firstName.trim();
  }
  if (typeof body.lastName === "string" && body.lastName.trim()) {
    data.lastName = body.lastName.trim();
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ ok: true, changed: [] });
  }

  const updated = await prisma.user.update({
    where: { id: auth.id },
    data,
    select: { id: true, firstName: true, lastName: true },
  });
  return NextResponse.json({ user: updated });
}
