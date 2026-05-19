import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma 7 CLI не подгружает .env.local автоматически. В проде на Amvera
// DATABASE_URL приходит env var, файла нет → dotenv молча пропустит.
dotenv.config({ path: path.join(__dirname, ".env.local") });
dotenv.config({ path: path.join(__dirname, ".env") });

// Общая schema живёт в apps/site/prisma — она источник истины.
export default defineConfig({
  schema: path.join("..", "site", "prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});
