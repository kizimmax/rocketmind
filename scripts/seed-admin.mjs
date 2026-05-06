import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const login = process.env.SEED_ADMIN_LOGIN ?? "admin";
const password = process.env.SEED_ADMIN_PASSWORD ?? "admin123";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const existing = await prisma.user.findUnique({ where: { login } });
if (existing) {
  console.log(`✓ admin user "${login}" already exists, skipping seed`);
} else {
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { firstName: "Dev", lastName: "Admin", login, password: hashed, role: "ADMIN" },
  });
  console.log(`✓ created admin user — login: "${login}"  password: "${password}"`);
}

await prisma.$disconnect();
await pool.end();
