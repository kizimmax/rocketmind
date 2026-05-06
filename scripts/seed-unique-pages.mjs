import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Системные страницы: всегда существуют, редактируются в админке (раздел «Уникальные»),
// рендерятся сайтом по фиксированным маршрутам. Source of truth для url ↔ slug —
// apps/site-admin/src/lib/constants.ts → UNIQUE_PAGE_ROUTES.
const UNIQUE_PAGES = [
  { slug: "home",         url: "/",       name: "Главная",      menuTitle: "Главная" },
  { slug: "about",        url: "/about",  name: "О Rocketmind", menuTitle: "О Rocketmind" },
  { slug: "cases-index",  url: "/cases",  name: "Кейсы",        menuTitle: "Кейсы" },
];

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

for (const p of UNIQUE_PAGES) {
  const existing = await prisma.page.findUnique({ where: { url: p.url } });
  if (existing) {
    console.log(`✓ unique page "${p.slug}" already exists at ${p.url}`);
    continue;
  }
  await prisma.page.create({
    data: {
      slug: p.slug,
      url: p.url,
      category: "unique",
      name: p.name,
      menuTitle: p.menuTitle,
      status: "published",
      content: {},
    },
  });
  console.log(`✓ created unique page "${p.slug}" at ${p.url}`);
}

await prisma.$disconnect();
await pool.end();
