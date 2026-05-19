import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  signStudentToken,
  setStudentTokenCookie,
  consumeProgramIntent,
} from "@/lib/student-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const code = String(body.code ?? "").trim();

  if (!email || !code) {
    return NextResponse.json({ error: "email_and_code_required" }, { status: 400 });
  }

  const now = new Date();
  // Newest unconsumed code for this email
  const otp = await prisma.otpCode.findFirst({
    where: { email, consumedAt: null, expiresAt: { gt: now } },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    return NextResponse.json({ error: "code_invalid_or_expired" }, { status: 401 });
  }
  const ok = await bcrypt.compare(code, otp.codeHash);
  if (!ok) {
    return NextResponse.json({ error: "code_invalid_or_expired" }, { status: 401 });
  }

  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { consumedAt: now },
  });

  // Determine programId: either from /join intent or from OTP record
  const intentProgramId = await consumeProgramIntent();
  const programId = intentProgramId ?? otp.programId ?? null;

  // Resolve / verify program (we don't fail auth on missing program, but joinedVia is recorded)
  let joinedVia: string | null = null;
  if (programId) {
    const program = await prisma.program.findUnique({ where: { id: programId } });
    if (program) {
      joinedVia = program.joinToken ?? null;
    }
  }

  // Upsert student
  const student = await prisma.student.upsert({
    where: { email },
    update: {
      // Bind to program only if student isn't yet bound (don't overwrite existing bindings).
      ...(programId
        ? {
            programId,
            joinedVia: joinedVia ?? undefined,
          }
        : {}),
    },
    create: {
      email,
      programId,
      joinedVia,
      isActive: true,
    },
  });

  if (!student.isActive) {
    return NextResponse.json({ error: "account_disabled" }, { status: 403 });
  }

  const token = signStudentToken({ sub: student.id, email: student.email });
  await setStudentTokenCookie(token);

  return NextResponse.json({ ok: true, student: { id: student.id, email: student.email } });
}
