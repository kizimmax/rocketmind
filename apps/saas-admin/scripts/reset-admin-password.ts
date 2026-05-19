// One-shot: reset the bootstrap `admin` user's password.
// Usage: NEW_PASSWORD=... npx tsx scripts/reset-admin-password.ts
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

async function main() {
  const newPwd = process.env.NEW_PASSWORD;
  if (!newPwd || newPwd.length < 8) {
    console.error("NEW_PASSWORD env required (min 8 chars)");
    process.exit(1);
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  const hash = await bcrypt.hash(newPwd, 12);
  const u = await prisma.user.update({
    where: { login: "admin" },
    data: { password: hash, status: "ACTIVE", tokenVersion: { increment: 1 } },
    select: { id: true, login: true, role: true },
  });
  console.log("Updated:", u);
  await prisma.$disconnect();
  await pool.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
