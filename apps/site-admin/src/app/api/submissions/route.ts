import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const gate = await requirePermission(request, "submissions", "VIEW");
  if (gate instanceof NextResponse) return gate;
  const url = new URL(request.url);
  const formId = url.searchParams.get("formId");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 100), 500);

  const items = await prisma.formSubmission.findMany({
    where: formId ? { formId } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json(
    items.map((s) => ({
      id: s.id,
      formId: s.formId,
      formName: s.formName,
      pageUrl: s.pageUrl,
      data: s.data,
      ipAddress: s.ipAddress,
      delivery: {
        bitrix24: { status: s.bitrix24Status, error: s.bitrix24Error },
        email: { status: s.emailStatus, error: s.emailError },
        telegram: { status: s.telegramStatus, error: s.telegramError },
      },
      createdAt: s.createdAt.toISOString(),
    })),
  );
}
