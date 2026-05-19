import { prisma } from "@/lib/prisma";

export async function resolvePlaceId(name: unknown): Promise<string | null> {
  if (typeof name !== "string") return null;
  const trimmed = name.trim();
  if (!trimmed) return null;
  const existing = await prisma.place.findFirst({
    where: { name: { equals: trimmed, mode: "insensitive" } },
  });
  if (existing) return existing.id;
  const created = await prisma.place.create({ data: { name: trimmed } });
  return created.id;
}
