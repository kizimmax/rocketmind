import { prisma } from "@/lib/prisma";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_PER_IP = 10;
const MAX_FAILED_PER_LOGIN = 5;

export interface RateLimitResult {
  allowed: boolean;
  reason?: "ip" | "login";
  retryAfterSec?: number;
}

export async function checkLoginRateLimit(ip: string, login: string | null): Promise<RateLimitResult> {
  const since = new Date(Date.now() - WINDOW_MS);

  const [ipFails, loginFails] = await Promise.all([
    prisma.loginAttempt.count({
      where: { ip, success: false, createdAt: { gte: since } },
    }),
    login
      ? prisma.loginAttempt.count({
          where: { login, success: false, createdAt: { gte: since } },
        })
      : Promise.resolve(0),
  ]);

  if (ipFails >= MAX_FAILED_PER_IP) {
    return { allowed: false, reason: "ip", retryAfterSec: Math.ceil(WINDOW_MS / 1000) };
  }
  if (login && loginFails >= MAX_FAILED_PER_LOGIN) {
    return { allowed: false, reason: "login", retryAfterSec: Math.ceil(WINDOW_MS / 1000) };
  }
  return { allowed: true };
}

export async function recordLoginAttempt(ip: string, login: string | null, success: boolean): Promise<void> {
  await prisma.loginAttempt.create({
    data: { ip, login, success },
  });
}
