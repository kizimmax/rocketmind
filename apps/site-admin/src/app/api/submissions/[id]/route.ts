import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requirePermission(request, "submissions", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  await prisma.formSubmission.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
