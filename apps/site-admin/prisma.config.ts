import path from "node:path";
import { defineConfig } from "prisma/config";

// Общая schema живёт в apps/site/prisma — она источник истины.
export default defineConfig({
  schema: path.join("..", "site", "prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});
