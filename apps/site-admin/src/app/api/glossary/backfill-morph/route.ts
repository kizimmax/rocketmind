import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAutoAliases, guessGender, type Gender } from "@/lib/glossary-morph";

export const dynamic = "force-dynamic";

const GENDERS = new Set<Gender>(["masculine", "feminine", "neuter"]);
function pickGender(raw: unknown, title: string): Gender {
  if (typeof raw === "string" && GENDERS.has(raw as Gender)) return raw as Gender;
  const tokens = (title || "").trim().split(/\s+/);
  return guessGender(tokens[tokens.length - 1] ?? "");
}

/**
 * Прогоняет все термины глоссария через generateAutoAliases. Идемпотентно —
 * перезаписывает поле content.autoAliases. Полезно после изменений в morph-
 * логике или когда термины созданы до фичи (backfill существующих рядов БД).
 *
 * URL: POST /api/glossary/backfill-morph (admin-only, гейтится middleware).
 * Ответ: { ok, processed, updated, skipped, samples: [{slug, count}] }.
 */
export async function POST() {
  const terms = await prisma.glossaryTerm.findMany({
    select: { id: true, slug: true, title: true, content: true },
  });

  let updated = 0;
  let skipped = 0;
  const samples: Array<{ slug: string; count: number }> = [];

  for (const t of terms) {
    const c = (t.content && typeof t.content === "object"
      ? t.content
      : {}) as Record<string, unknown>;
    if (!t.title || !t.title.trim()) {
      skipped++;
      continue;
    }
    const gender = pickGender(c.gender, t.title);
    const autoAliases = generateAutoAliases(t.title, gender);
    await prisma.glossaryTerm.update({
      where: { id: t.id },
      data: { content: { ...c, autoAliases, gender } },
    });
    updated++;
    if (samples.length < 5) {
      samples.push({ slug: t.slug, count: autoAliases.length });
    }
  }

  return NextResponse.json({
    ok: true,
    processed: terms.length,
    updated,
    skipped,
    samples,
  });
}
