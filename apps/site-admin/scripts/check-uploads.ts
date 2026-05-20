import { prisma as p } from "../src/lib/prisma";
async function main() {
  const recent = await p.asset.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { article: { select: { slug: true } } },
  });
  console.log(`Last ${recent.length} assets (any):\n`);
  for (const a of recent) {
    const articleSlug = a.article?.slug ?? "—";
    console.log(`  ${a.createdAt.toISOString()}  role=${a.role.padEnd(12)} article=${articleSlug.padEnd(40)} ${a.filePath}`);
  }
  const drafts = await p.previewDraft.findMany({
    where: { slug: "4-shaga-po-vyhodu-iz-krizisa-dlya-platform" },
    orderBy: { updatedAt: "desc" },
  });
  console.log(`\nPreview drafts for slug: ${drafts.length}`);
  for (const d of drafts) {
    console.log(`  ${d.updatedAt.toISOString()}  id=${d.id}  payload size: ${JSON.stringify(d.payload).length}`);
  }
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => p.$disconnect());
