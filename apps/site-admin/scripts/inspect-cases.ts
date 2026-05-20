import { prisma as p } from "../src/lib/prisma";

async function main() {
  const experts = await p.expert.findMany({ select: { slug: true, content: true } });
  console.log("=== EXPERTS ===");
  for (const e of experts) {
    const c = (e.content as Record<string, unknown>) || {};
    console.log(`  ${e.slug}: ${c.name ?? "(no name)"}`);
  }
  const tags = await p.mediaTag.findMany({ select: { id: true, label: true, system: true } });
  console.log("\n=== MEDIA TAGS ===");
  for (const t of tags) console.log(`  ${t.id}: "${t.label}" ${t.system ? "(system)" : ""}`);
  await p.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
