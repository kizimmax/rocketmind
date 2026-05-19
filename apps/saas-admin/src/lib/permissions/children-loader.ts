import { prisma } from "@/lib/prisma";
import { SectionKind } from "./sections";

export interface DynamicChild {
  id: string;
  label: string;
}

/**
 * Loads the actual entities for a dynamic (refinable) section
 * within saas-admin scope (AI-агенты и программы).
 */
export async function loadChildren(kind: SectionKind): Promise<DynamicChild[]> {
  switch (kind) {
    case "ai-agent":
      return (
        await prisma.aiAgent.findMany({
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        })
      ).map((r) => ({ id: r.id, label: r.name }));

    case "program":
      return (
        await prisma.program.findMany({
          select: { id: true, title: true },
          orderBy: { startsAt: "desc" },
        })
      ).map((r) => ({ id: r.id, label: r.title }));
  }
}

/**
 * Validates that a dynamic itemId actually exists for the given kind.
 * Used at write-time to reject permissions referring to deleted/fake items.
 */
export async function itemExists(kind: SectionKind, itemId: string): Promise<boolean> {
  const exists = async <T>(p: Promise<T | null>): Promise<boolean> => (await p) !== null;
  switch (kind) {
    case "ai-agent":
      return exists(prisma.aiAgent.findUnique({ where: { id: itemId }, select: { id: true } }));
    case "program":
      return exists(prisma.program.findUnique({ where: { id: itemId }, select: { id: true } }));
  }
}
