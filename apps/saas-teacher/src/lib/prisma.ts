import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

function isLocalDb(url: string | undefined): boolean {
  return !!url && /@(localhost|127\.0\.0\.1)/.test(url);
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  const useSsl = !isLocalDb(url);
  const pool = new Pool({
    connectionString: url,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
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

const globalForPrisma = globalThis as unknown as { prismaTeacher: PrismaClient };

export const prisma =
  globalForPrisma.prismaTeacher ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaTeacher = prisma;
