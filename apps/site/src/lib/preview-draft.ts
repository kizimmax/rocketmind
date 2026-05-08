import { cookies, draftMode } from "next/headers";
import { prisma } from "./prisma";

export type PreviewType = "article" | "glossary" | "page";

export interface PreviewDraftRecord {
  id: string;
  type: PreviewType;
  slug: string;
  publicUrl: string;
  payload: Record<string, unknown>;
  expiresAt: Date;
}

export async function isPreviewMode(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}

export async function readActivePreviewDraft(): Promise<PreviewDraftRecord | null> {
  if (!(await isPreviewMode())) return null;
  const id = (await cookies()).get("previewDraftId")?.value;
  if (!id) return null;
  try {
    const row = await prisma.previewDraft.findUnique({ where: { id } });
    if (!row) return null;
    if (row.expiresAt < new Date()) return null;
    return {
      id: row.id,
      type: row.type as PreviewType,
      slug: row.slug,
      publicUrl: row.publicUrl,
      payload: (row.payload ?? {}) as Record<string, unknown>,
      expiresAt: row.expiresAt,
    };
  } catch {
    return null;
  }
}

/**
 * Возвращает payload черновика, если он соответствует запрошенным критериям.
 * Используется лоадерами публичных страниц для подмены данных в режиме предпросмотра.
 */
export async function matchPreviewPayload<T = Record<string, unknown>>(
  type: PreviewType,
  match: { slug?: string; publicUrl?: string },
): Promise<T | null> {
  const draft = await readActivePreviewDraft();
  if (!draft || draft.type !== type) return null;
  if (match.slug !== undefined && draft.slug !== match.slug) return null;
  if (match.publicUrl !== undefined && draft.publicUrl !== match.publicUrl) return null;
  return draft.payload as T;
}
