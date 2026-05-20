import { prisma as p } from "../src/lib/prisma";

async function main() {
  const cases = await p.article.findMany({
    where: { type: "case" },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    select: { slug: true, title: true, description: true, tagIds: true, publishedAt: true, status: true, updatedAt: true },
  });
  console.log(`Total cases: ${cases.length}\n`);
  for (const c of cases) {
    console.log(`  ${c.slug}`);
    console.log(`    title: ${c.title.slice(0, 70)}`);
    console.log(`    desc(${c.description.length}): ${c.description.slice(0, 90)}`);
    console.log(`    tags: ${JSON.stringify(c.tagIds)} | pub: ${c.publishedAt} | status: ${c.status} | upd: ${c.updatedAt.toISOString().slice(0,16)}`);
  }
  await p.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
