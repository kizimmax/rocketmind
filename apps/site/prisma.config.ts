import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma 7 CLI не подгружает .env.local автоматически (только .env). Грузим
// явно — в проде на Amvera DATABASE_URL передаётся как env var, файла нет,
// dotenv.config просто молча его пропустит.
dotenv.config({ path: path.join(__dirname, ".env.local") });
dotenv.config({ path: path.join(__dirname, ".env") });

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});
