import { NextResponse } from "next/server";
import { getCurrentStudent } from "@/lib/student-auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/programs/active
 *
 * Возвращает программу студента и список её агентов с признаком доступности.
 * В сайдбаре saas-teacher показываем только агентов с isAvailable=true.
 */
export async function GET() {
  const student = await getCurrentStudent();
  if (!student) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!student.programId) return NextResponse.json({ program: null, agents: [] });

  const program = await prisma.program.findUnique({
    where: { id: student.programId },
    include: {
      place: true,
      agents: {
        include: { agent: { include: { avatarMascot: true } } },
      },
    },
  });
  if (!program) return NextResponse.json({ program: null, agents: [] });

  const agents = program.agents
    .filter((row) => row.agent.targets.includes("saas-teacher"))
    .map((row) => ({
      id: row.agent.id,
      slug: row.agent.slug,
      name: row.agent.name,
      role: row.agent.role,
      valueDescription: row.agent.valueDescription,
      avatarUrl:
        row.agent.avatarMascot?.imagePath ?? row.agent.avatarPath ?? null,
      isAvailable: row.isAvailable,
    }));

  return NextResponse.json({
    program: {
      id: program.id,
      title: program.title,
      startsAt: program.startsAt,
      endsAt: program.endsAt,
      place: program.place,
    },
    agents,
  });
}
