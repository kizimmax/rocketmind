import { NextResponse } from "next/server";
import { getCurrentStudent } from "@/lib/student-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const student = await getCurrentStudent();
  if (!student) return NextResponse.json({ student: null });

  const withProjects = await prisma.student.findUnique({
    where: { id: student.id },
    include: {
      program: { include: { place: true } },
      projects: { orderBy: { createdAt: "asc" }, take: 1 },
    },
  });

  return NextResponse.json({
    student: {
      id: student.id,
      email: student.email,
      firstName: student.firstName,
      lastName: student.lastName,
      role: student.role,
      isActive: student.isActive,
      program: withProjects?.program ?? null,
      project: withProjects?.projects?.[0] ?? null,
    },
  });
}
