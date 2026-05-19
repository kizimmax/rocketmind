import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requirePermission(req, "programs.students", "VIEW");
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      program: true,
      projects: { include: { _count: { select: { sessions: true, artifacts: true } } } },
    },
  });
  if (!student) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(student);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requirePermission(request, "programs.students", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  const body = await request.json();
  const data: Record<string, unknown> = {};
  if ("isActive" in body) data.isActive = Boolean(body.isActive);
  if (typeof body.firstName === "string") data.firstName = body.firstName;
  if (typeof body.lastName === "string") data.lastName = body.lastName;
  if (typeof body.role === "string") data.role = body.role;

  try {
    const updated = await prisma.student.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requirePermission(req, "programs.students", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  try {
    await prisma.student.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
