import { prisma as p } from "../src/lib/prisma";
async function main() {
  const pages = await p.page.findMany({
    where: { category: { in: ["consulting", "ai-products", "academy"] } },
    orderBy: [{ category: "asc" }, { status: "asc" }, { sortOrder: "asc" }],
    select: { slug: true, url: true, category: true, status: true, menuTitle: true, updatedAt: true },
  });
  console.log(`Total managed pages: ${pages.length}\n`);
  let lastCat = "";
  for (const pg of pages) {
    if (pg.category !== lastCat) {
      console.log(`\n=== ${pg.category} ===`);
      lastCat = pg.category;
    }
    const flag = pg.status === "published" ? "✅" : "⊘";
    console.log(`  ${flag} ${pg.status.padEnd(10)} ${pg.url.padEnd(50)} "${pg.menuTitle}" (upd: ${pg.updatedAt.toISOString().slice(0, 16)})`);
  }
  await p.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
