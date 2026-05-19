import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";

/**
 * POST /api/program-agents
 * Body: { programId: string, agentId: string, isAvailable: boolean }
 *
 * Апсёртит связку Program ↔ AiAgent с тоглом isAvailable.
 */
export async function POST(request: Request) {
  const gate = await requirePermission(request, "programs.program-agents", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const body = await request.json();
  const programId = String(body.programId ?? "");
  const agentId = String(body.agentId ?? "");
  const isAvailable = Boolean(body.isAvailable);

  if (!programId || !agentId) {
    return NextResponse.json({ error: "ids_required" }, { status: 400 });
  }

  const row = await prisma.programAgent.upsert({
    where: { programId_agentId: { programId, agentId } },
    update: {
      isAvailable,
      availableSince: isAvailable ? new Date() : null,
    },
    create: {
      programId,
      agentId,
      isAvailable,
      availableSince: isAvailable ? new Date() : null,
    },
  });

  return NextResponse.json(row);
}
