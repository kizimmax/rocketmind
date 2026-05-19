import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

function isLocalDb(url: string | undefined): boolean {
  return !!url && /@(localhost|127\.0\.0\.1)/.test(url);
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  // SSL only when подключаемся к remote БД (Amvera в .env.local на dev тоже).
  const useSsl = !isLocalDb(url);
  const pool = new Pool({
    connectionString: url,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
    // TCP keepalive + ограниченный idle, чтобы long-running dev не получал
    // ECONNRESET после того как Amvera-сторона разорвёт idle-соединение.
    keepAlive: true,
    idleTimeoutMillis: 30_000,
    max: 10,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
