import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 200;

interface ParticipantRef {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
}

export async function GET(req: NextRequest) {
  const auth = await requireSuperAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const actionsParam = url.searchParams.get("actions");
  const actorLogin = url.searchParams.get("actorLogin")?.trim();
  const targetLogin = url.searchParams.get("targetLogin")?.trim();
  const since = url.searchParams.get("since");
  const until = url.searchParams.get("until");
  const cursor = url.searchParams.get("cursor");
  const limitRaw = Number(url.searchParams.get("limit"));
  const limit = Number.isFinite(limitRaw)
    ? Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(limitRaw)))
    : PAGE_SIZE;

  const where: Prisma.AuditLogWhereInput = {};
  const conditions: Prisma.AuditLogWhereInput[] = [];

  if (actionsParam) {
    const list = actionsParam.split(",").map((s) => s.trim()).filter(Boolean);
    if (list.length > 0) conditions.push({ action: { in: list } });
  }

  if (actorLogin) {
    const actor = await prisma.user.findUnique({
      where: { login: actorLogin },
      select: { id: true },
    });
    // Unknown actor login => empty result without firing the full query.
    if (!actor) return NextResponse.json({ events: [], participants: {}, nextCursor: null });
    conditions.push({ actorId: actor.id });
  }

  if (targetLogin) {
    const target = await prisma.user.findUnique({
      where: { login: targetLogin },
      select: { id: true },
    });
    if (!target) return NextResponse.json({ events: [], participants: {}, nextCursor: null });
    conditions.push({ targetType: "user", targetId: target.id });
  }

  if (since) {
    const dt = new Date(since);
    if (!Number.isNaN(dt.getTime())) conditions.push({ createdAt: { gte: dt } });
  }
  if (until) {
    const dt = new Date(until);
    if (!Number.isNaN(dt.getTime())) conditions.push({ createdAt: { lte: dt } });
  }

  if (conditions.length > 0) where.AND = conditions;

  const events = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      actorId: true,
      action: true,
      targetType: true,
      targetId: true,
      metadata: true,
      ip: true,
      userAgent: true,
      createdAt: true,
    },
  });

  let nextCursor: string | null = null;
  if (events.length > limit) {
    nextCursor = events[limit - 1]?.id ?? null;
    events.length = limit;
  }

  // Batch-load every actor + user-target referenced on this page, so the UI
  // can render logins without N+1 queries.
  const userIds = new Set<string>();
  for (const e of events) {
    if (e.actorId) userIds.add(e.actorId);
    if (e.targetType === "user" && e.targetId) userIds.add(e.targetId);
  }
  const users = userIds.size > 0
    ? await prisma.user.findMany({
        where: { id: { in: Array.from(userIds) } },
        select: { id: true, login: true, firstName: true, lastName: true },
      })
    : [];
  const participants: Record<string, ParticipantRef> = {};
  for (const u of users) participants[u.id] = u;

  return NextResponse.json({ events, participants, nextCursor });
}
