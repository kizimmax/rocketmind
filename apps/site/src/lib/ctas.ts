import { prisma } from "./prisma";

export type EntityScope = "product" | "article" | "both";

export type CtaEntity = {
  id: string;
  name: string;
  scope: EntityScope;
  heading: string;
  body: string;
  buttonText: string;
  formId?: string;
  createdAt: string;
  updatedAt: string;
};

function parseScope(value: unknown): EntityScope {
  return value === "product" || value === "article" || value === "both" ? value : "both";
}

function rowToCta(row: { id: string; name: string; content: unknown; createdAt: Date; updatedAt: Date }): CtaEntity {
  const c = (row.content && typeof row.content === "object" ? row.content : {}) as Record<string, unknown>;
  const slugId = typeof c.id === "string" && c.id ? c.id : row.id;
  return {
    id: slugId,
    name: row.name,
    scope: parseScope(c.scope),
    heading: typeof c.heading === "string" ? c.heading : "",
    body: typeof c.body === "string" ? c.body : "",
    buttonText: typeof c.buttonText === "string" ? c.buttonText : "",
    formId: typeof c.formId === "string" && c.formId ? c.formId : undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getAllCtas(): Promise<CtaEntity[]> {
  try {
    const rows = await prisma.ctaEntity.findMany({ orderBy: { createdAt: "asc" } });
    return rows.map(rowToCta);
  } catch {
    return [];
  }
}

export async function getCtaById(id: string): Promise<CtaEntity | null> {
  try {
    const byContentId = await prisma.ctaEntity.findFirst({
      where: { content: { path: ["id"], equals: id } },
    });
    if (byContentId) return rowToCta(byContentId);
    const byDbId = await prisma.ctaEntity.findUnique({ where: { id } }).catch(() => null);
    if (byDbId) return rowToCta(byDbId);
    return null;
  } catch {
    return null;
  }
}
