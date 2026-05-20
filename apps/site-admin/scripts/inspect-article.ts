import { prisma as p } from "../src/lib/prisma";
async function main() {
  const article = await p.article.findFirst({
    where: { title: { contains: "выходу из кризиса", mode: "insensitive" } },
  });
  if (!article) { console.log("not found"); return; }
  console.log(`Article: ${article.slug} | type=${article.type} | status=${article.status}`);
  console.log(`Cover: ${article.coverPath}`);
  // Find image blocks
  const c = article.content as Record<string, unknown>;
  const body = (c.body ?? []) as Array<Record<string, unknown>>;
  for (const section of body) {
    const blocks = (section.blocks ?? []) as Array<Record<string, unknown>>;
    for (const b of blocks) {
      if (b.type !== "paragraph" && b.type !== "h3") {
        console.log(`\n--- block id=${b.id} type=${b.type} ---`);
        console.log(JSON.stringify(b, null, 2));
      }
    }
  }
  // Also list assets
  const assets = await p.asset.findMany({ where: { articleId: article.id } });
  console.log(`\n=== assets for article (${assets.length}) ===`);
  for (const a of assets) {
    console.log(`  ${a.role.padEnd(15)} ${a.filePath}  →  ${a.publicUrl}`);
  }
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => p.$disconnect());
