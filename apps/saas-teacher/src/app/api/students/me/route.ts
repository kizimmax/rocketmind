import { NextResponse } from "next/server";
import { getCurrentStudent } from "@/lib/student-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const student = await getCurrentStudent();
  if (!student) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (typeof body.firstName === "string") data.firstName = body.firstName.trim();
  if (typeof body.lastName === "string") data.lastName = body.lastName.trim();
  if (typeof body.role === "string") data.role = body.role.trim();
  if (typeof body.industry === "string") data.industry = body.industry.trim();
  if (typeof body.region === "string") data.region = body.region.trim();

  const updated = await prisma.student.update({
    where: { id: student.id },
    data,
  });

  return NextResponse.json({
    student: {
      id: updated.id,
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      role: updated.role,
      industry: updated.industry,
      region: updated.region,
    },
  });
}
