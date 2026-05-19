import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const COOKIE_NAME = "rm_student_token";
const TOKEN_TTL_SEC = 90 * 24 * 60 * 60; // 90 days

function getSecret(): string {
  const s = process.env.STUDENT_JWT_SECRET;
  if (!s) throw new Error("STUDENT_JWT_SECRET is not set");
  return s;
}

export type StudentTokenPayload = {
  sub: string; // student.id
  email: string;
};

export function signStudentToken(payload: StudentTokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: TOKEN_TTL_SEC });
}

export function verifyStudentToken(token: string): StudentTokenPayload | null {
  try {
    const decoded = jwt.verify(token, getSecret()) as StudentTokenPayload;
    if (!decoded?.sub) return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function setStudentTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_TTL_SEC,
  });
}

export async function clearStudentTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentStudent() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyStudentToken(token);
  if (!payload) return null;
  const student = await prisma.student.findUnique({
    where: { id: payload.sub },
  });
  if (!student || !student.isActive) return null;
  return student;
}

const PROGRAM_INTENT_COOKIE = "rm_program_intent";

export async function setProgramIntentCookie(programId: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: PROGRAM_INTENT_COOKIE,
    value: programId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 60, // 30 minutes
  });
}

export async function consumeProgramIntent(): Promise<string | null> {
  const cookieStore = await cookies();
  const v = cookieStore.get(PROGRAM_INTENT_COOKIE)?.value ?? null;
  if (v) cookieStore.delete(PROGRAM_INTENT_COOKIE);
  return v;
}
