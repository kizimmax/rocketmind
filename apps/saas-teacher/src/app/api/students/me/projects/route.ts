import { NextResponse } from "next/server";
import { getCurrentStudent } from "@/lib/student-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const student = await getCurrentStudent();
  if (!student) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "name_required" }, { status: 400 });

  const project = await prisma.studentProject.create({
    data: {
      studentId: student.id,
      name,
      profile: body.profile ?? null,
    },
  });
  return NextResponse.json({ project });
}

export async function GET() {
  const student = await getCurrentStudent();
  if (!student) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const projects = await prisma.studentProject.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ projects });
}
