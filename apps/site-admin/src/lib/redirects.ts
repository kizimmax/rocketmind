import { prisma } from "@/lib/prisma";

export type EntityType = "article" | "glossary" | "page";

export async function createAutoRedirect(
  fromUrl: string,
  toUrl: string,
  entityType: EntityType,
  entityId: string,
): Promise<void> {
  if (fromUrl === toUrl) return;

  // If a redirect already points TO the old URL, update it to point to the new URL
  // (chain collapse: A→B + B→C = A→C)
  await prisma.redirect.updateMany({
    where: { toUrl: fromUrl, isActive: true },
    data: { toUrl },
  });

  // Upsert: if someone had a manual redirect FROM this URL, keep it but update destination
  await prisma.redirect.upsert({
    where: { fromUrl },
    create: { fromUrl, toUrl, statusCode: 301, kind: "auto", entityType, entityId },
    update: { toUrl, kind: "auto", entityType, entityId, isActive: true },
  });
}
