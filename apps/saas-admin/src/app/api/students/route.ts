import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";

export async function GET(request: Request) {
  const gate = await requirePermission(request, "programs.students", "VIEW");
  if (gate instanceof NextResponse) return gate;
  const url = new URL(request.url);
  const programId = url.searchParams.get("programId");

  const students = await prisma.student.findMany({
    where: programId ? { programId } : undefined,
    include: { program: true, _count: { select: { projects: true } } },
    orderBy: { joinedAt: "desc" },
  });
  return NextResponse.json(students);
}
