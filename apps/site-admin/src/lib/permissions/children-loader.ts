import { prisma } from "@/lib/prisma";
import { SectionKind } from "./sections";

export interface DynamicChild {
  id: string;
  label: string;
}

/**
 * Loads the actual entities for a dynamic (refinable) section.
 * Returns [] for kinds not backed by an indexable Prisma model
 * (e.g. testimonials with no title, products stored in SystemConfig).
 */
export async function loadChildren(kind: SectionKind): Promise<DynamicChild[]> {
  switch (kind) {
    case "page":
      return (
        await prisma.page.findMany({
          select: { id: true, name: true },
          orderBy: { sortOrder: "asc" },
        })
      ).map((r) => ({ id: r.id, label: r.name }));

    case "article":
      return (
        await prisma.article.findMany({
          where: { type: { not: "case" } },
          select: { id: true, title: true },
          orderBy: { createdAt: "desc" },
        })
      ).map((r) => ({ id: r.id, label: r.title }));

    case "case":
      return (
        await prisma.article.findMany({
          where: { type: "case" },
          select: { id: true, title: true },
          orderBy: { createdAt: "desc" },
        })
      ).map((r) => ({ id: r.id, label: r.title }));

    case "glossary-term":
      return (
        await prisma.glossaryTerm.findMany({
          select: { id: true, title: true },
          orderBy: { title: "asc" },
        })
      ).map((r) => ({ id: r.id, label: r.title }));

    case "media-tag":
      return (
        await prisma.mediaTag.findMany({
          select: { id: true, label: true },
          orderBy: { label: "asc" },
        })
      ).map((r) => ({ id: r.id, label: r.label }));

    case "expert":
      return (
        await prisma.expert.findMany({
          select: { id: true, slug: true },
          orderBy: { sortOrder: "asc" },
        })
      ).map((r) => ({ id: r.id, label: r.slug }));

    case "cta":
      return (
        await prisma.ctaEntity.findMany({
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        })
      ).map((r) => ({ id: r.id, label: r.name }));

    case "form":
      return (
        await prisma.formEntity.findMany({
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        })
      ).map((r) => ({ id: r.id, label: r.name }));

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

    case "product-category":
    case "product":
    case "testimonial":
    case "submission":
    case "redirect":
      return [];
  }
}

/**
 * Validates that a dynamic itemId actually exists for the given kind.
 * Used at write-time to reject permissions referring to deleted/fake items.
 */
export async function itemExists(kind: SectionKind, itemId: string): Promise<boolean> {
  const exists = async <T>(p: Promise<T | null>): Promise<boolean> => (await p) !== null;
  switch (kind) {
    case "page":
      return exists(prisma.page.findUnique({ where: { id: itemId }, select: { id: true } }));
    case "article":
    case "case":
      return exists(prisma.article.findUnique({ where: { id: itemId }, select: { id: true } }));
    case "glossary-term":
      return exists(prisma.glossaryTerm.findUnique({ where: { id: itemId }, select: { id: true } }));
    case "media-tag":
      return exists(prisma.mediaTag.findUnique({ where: { id: itemId }, select: { id: true } }));
    case "expert":
      return exists(prisma.expert.findUnique({ where: { id: itemId }, select: { id: true } }));
    case "cta":
      return exists(prisma.ctaEntity.findUnique({ where: { id: itemId }, select: { id: true } }));
    case "form":
      return exists(prisma.formEntity.findUnique({ where: { id: itemId }, select: { id: true } }));
    case "ai-agent":
      return exists(prisma.aiAgent.findUnique({ where: { id: itemId }, select: { id: true } }));
    case "program":
      return exists(prisma.program.findUnique({ where: { id: itemId }, select: { id: true } }));
    case "product-category":
    case "product":
    case "testimonial":
    case "submission":
    case "redirect":
      return false;
  }
}
