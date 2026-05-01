import path from "node:path";
import { defineConfig } from "prisma/config";

// Общая schema живёт в apps/site/prisma — она источник истины.
// site-admin её не дублирует, а ссылается напрямую.
export default defineConfig({
  schema: path.join("..", "site", "prisma", "schema.prisma"),
});
