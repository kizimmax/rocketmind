import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";

function generateOtp(): string {
  // 6 digits
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "email_invalid" }, { status: 400 });
  }

  const code = generateOtp();
  const codeHash = await bcrypt.hash(code, 8);

  // Optional: read program intent cookie set by /join
  const programId = body.programId ? String(body.programId) : null;

  await prisma.otpCode.create({
    data: {
      email,
      codeHash,
      programId,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  await sendEmail({
    to: email,
    subject: "Код входа в Rocketmind Teacher",
    text: `Ваш код: ${code}\n\nКод действителен 10 минут.`,
  });

  return NextResponse.json({ ok: true });
}
