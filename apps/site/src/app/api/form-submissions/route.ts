import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendToBitrix24, type SendResult } from "@/lib/integrations/bitrix24";
import { sendEmail } from "@/lib/integrations/email";
import { sendToTelegram } from "@/lib/integrations/telegram";

export const dynamic = "force-dynamic";

interface SubmitBody {
  formId: string;
  fields: Record<string, unknown>;
  pageUrl?: string;
}

interface FormIntegrations {
  bitrix24?: { enabled?: boolean; webhookUrl?: string; assignedById?: number | null };
  email?: { enabled?: boolean; recipients?: string[]; subject?: string };
  telegram?: { enabled?: boolean; chatId?: string; topicId?: string };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as SubmitBody | null;
    if (!body?.formId || !body.fields || typeof body.fields !== "object") {
      return NextResponse.json({ error: "formId and fields required" }, { status: 400 });
    }

    // FormEntity лукапится по slug (content.id) или по UUID — в зависимости от того, как
    // FormModalProvider передал id (на сайте — slug; в админке — иногда UUID).
    const form =
      (await prisma.formEntity.findFirst({ where: { content: { path: ["id"], equals: body.formId } } })) ??
      (await prisma.formEntity.findUnique({ where: { id: body.formId } }).catch(() => null));
    if (!form) return NextResponse.json({ error: "form not found" }, { status: 404 });

    const content = (form.content ?? {}) as Record<string, unknown>;
    const rawIntegrations = (content.integrations ?? {}) as FormIntegrations;
    const successGift = (content.successGift ?? null) as unknown;

    // Legacy-формы без поля integrations: Bitrix24 включён по умолчанию,
    // если задан глобальный URL. Email/Telegram — только при явном enabled
    // (потому что у них требуется per-form настройка адресатов/chatId).
    const hasAnyIntegration =
      !!(rawIntegrations as Record<string, unknown>).bitrix24
      || !!(rawIntegrations as Record<string, unknown>).email
      || !!(rawIntegrations as Record<string, unknown>).telegram;
    const integrations: FormIntegrations = {
      ...rawIntegrations,
      bitrix24: hasAnyIntegration
        ? (rawIntegrations.bitrix24 ?? { enabled: false })
        : { enabled: !!process.env.BITRIX24_DEFAULT_WEBHOOK_URL, webhookUrl: "" },
    };

    // Trim & normalize.
    const fields: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(body.fields)) {
      fields[k] = typeof v === "string" ? v.trim() : v;
    }

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;
    const userAgent = req.headers.get("user-agent") ?? null;
    const submittedAt = new Date();

    // Запускаем доставку по всем включённым каналам параллельно.
    const tasks: Array<Promise<{ channel: "bitrix24" | "email" | "telegram"; result: SendResult }>> = [];

    if (integrations.bitrix24?.enabled) {
      tasks.push(
        sendToBitrix24(integrations.bitrix24.webhookUrl ?? "", {
          formName: form.name,
          pageUrl: body.pageUrl ?? null,
          fields,
          assignedById: integrations.bitrix24.assignedById ?? null,
        }).then((r) => ({ channel: "bitrix24" as const, result: r })),
      );
    }
    if (integrations.email?.enabled) {
      tasks.push(
        sendEmail(
          { recipients: integrations.email.recipients ?? [], subject: integrations.email.subject },
          { formName: form.name, formId: form.id, pageUrl: body.pageUrl ?? null, fields, ipAddress, submittedAt },
        ).then((r) => ({ channel: "email" as const, result: r })),
      );
    }
    if (integrations.telegram?.enabled) {
      tasks.push(
        sendToTelegram(
          { chatId: integrations.telegram.chatId ?? "", topicId: integrations.telegram.topicId },
          { formName: form.name, pageUrl: body.pageUrl ?? null, fields, submittedAt },
        ).then((r) => ({ channel: "telegram" as const, result: r })),
      );
    }

    const settled = await Promise.allSettled(tasks);
    const channelResults: Record<string, SendResult> = {};
    for (const s of settled) {
      if (s.status === "fulfilled") channelResults[s.value.channel] = s.value.result;
    }

    // Сохраняем в БД ВСЕГДА — даже если все каналы провалились.
    const submission = await prisma.formSubmission.create({
      data: {
        formId: form.id,
        formName: form.name,
        pageUrl: body.pageUrl ?? null,
        data: fields as Prisma.InputJsonValue,
        ipAddress,
        userAgent,
        bitrix24Status: channelResults.bitrix24?.status ?? null,
        bitrix24Error: channelResults.bitrix24?.status === "error" ? channelResults.bitrix24.error : null,
        emailStatus: channelResults.email?.status ?? null,
        emailError: channelResults.email?.status === "error" ? channelResults.email.error : null,
        telegramStatus: channelResults.telegram?.status ?? null,
        telegramError: channelResults.telegram?.status === "error" ? channelResults.telegram.error : null,
      },
    });

    return NextResponse.json({
      ok: true,
      submissionId: submission.id,
      gift: successGift,
      delivery: channelResults,
    });
  } catch (e) {
    const err = e as Error;
    // eslint-disable-next-line no-console
    console.error("[/api/form-submissions] error:", err);
    return NextResponse.json(
      { error: "internal error", message: process.env.NODE_ENV === "production" ? undefined : err.message },
      { status: 500 },
    );
  }
}
