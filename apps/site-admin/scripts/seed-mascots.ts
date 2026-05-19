/**
 * Сидим builtin-маскотов из apps/site-admin/public/ai-mascots.
 *
 * Структура каталога: <pack>/<file>.png, где
 *   pack — короткое имя персонажа («alex», «kate», ...),
 *   file — поза персонажа («alex_base.png», «alex_thinks.png», ...).
 *
 * На каждый PNG создаём строку Mascot с isBuiltIn=true. Повторный запуск
 * идемпотентен: уже импортированные строки определяются по уникальному
 * imagePath и пропускаются.
 *
 * Запуск (из apps/site-admin):
 *   set -a && source .env.local && set +a && npx tsx scripts/seed-mascots.ts
 */

import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const MASCOTS_ROOT = path.resolve(__dirname, "..", "public", "ai-mascots");

function prettyName(file: string): string {
  const base = file.replace(/\.png$/i, "");
  return base
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function main() {
  const packs = readdirSync(MASCOTS_ROOT).filter((entry) => {
    const full = path.join(MASCOTS_ROOT, entry);
    return statSync(full).isDirectory();
  });

  let created = 0;
  let skipped = 0;

  for (const pack of packs) {
    const dir = path.join(MASCOTS_ROOT, pack);
    const files = readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".png"));

    for (const file of files) {
      const imagePath = `/ai-mascots/${pack}/${file}`;
      const existing = await prisma.mascot.findFirst({ where: { imagePath } });
      if (existing) {
        skipped += 1;
        continue;
      }
      await prisma.mascot.create({
        data: {
          name: prettyName(file),
          pack,
          imagePath,
          isBuiltIn: true,
        },
      });
      created += 1;
    }
  }

  console.log(`Mascots seeded: created=${created}, skipped=${skipped}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
