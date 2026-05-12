import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { signPreviewToken } from "@/lib/preview-token";
import { buildPagePreviewRow } from "@/lib/preview-page-content";

const FALLBACK_SITE_URL = "https://rocketmind-site-rocketmind.amvera.io";
const SITE_URL = (process.env.SITE_URL ?? FALLBACK_SITE_URL).replace(/\/$/, "");
const TTL_SEC = 60 * 60; // 60 минут

const VALID_TYPES = new Set(["page", "article", "glossary"]);

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  const id = typeof b.id === "string" ? b.id.trim() : "";
  const type = typeof b.type === "string" ? b.type : "";
  const slug = typeof b.slug === "string" ? b.slug.trim() : "";
  const publicUrl = typeof b.publicUrl === "string" ? b.publicUrl.trim() : "";
  const payload = b.payload;
  if (!id || !VALID_TYPES.has(type) || !slug || !publicUrl || payload === undefined) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + TTL_SEC * 1000);

  // Очистка протухших черновиков (best-effort).
  prisma.previewDraft
    .deleteMany({ where: { expiresAt: { lt: now } } })
    .catch(() => {});

  // Для страниц трансформируем SitePage из редактора в синтетический Page row
  // (как в БД), чтобы лоадеры на сайте могли отдать его в `pageToProductData`
  // без новой ветки кода. Для статей и терминов сохраняем admin-объект как есть —
  // там лоадеры конвертируют сами (`previewArticlePayloadToEntry` и т.п.).
  const storedPayload =
    type === "page"
      ? buildPagePreviewRow(payload as Parameters<typeof buildPagePreviewRow>[0])
      : (payload as object);

  await prisma.previewDraft.upsert({
    where: { id },
    create: {
      id,
      type,
      slug,
      publicUrl,
      payload: storedPayload as object,
      createdBy: auth.userId,
      expiresAt,
    },
    update: {
      type,
      slug,
      publicUrl,
      payload: storedPayload as object,
      expiresAt,
    },
  });

  const exp = Math.floor(expiresAt.getTime() / 1000);
  const accessToken = signPreviewToken({ id, exp });

  const url = `${SITE_URL}/api/preview?id=${encodeURIComponent(id)}&token=${encodeURIComponent(accessToken)}`;

  return NextResponse.json({ id, url, expiresAt: expiresAt.toISOString() });
}
