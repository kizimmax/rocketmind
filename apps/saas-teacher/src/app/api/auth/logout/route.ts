import { NextResponse } from "next/server";
import { clearStudentTokenCookie } from "@/lib/student-auth";

export async function POST() {
  await clearStudentTokenCookie();
  return NextResponse.json({ ok: true });
}
