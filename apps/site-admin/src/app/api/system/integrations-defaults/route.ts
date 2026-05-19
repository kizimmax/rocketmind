import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Возвращает глобальные дефолты для интеграций форм. Используется в админ-UI
 * чтобы показывать в placeholder реальный URL/токен — юзер видит куда уходят
 * заявки без необходимости заглядывать в env на сервере.
 *
 * Telegram-токен НЕ отдаём (security). Email SMTP не отдаём по той же причине —
 * нужно только знать «настроен или нет».
 */
export async function GET(request: Request) {
  const gate = await requirePermission(request, "system.settings", "VIEW");
  if (gate instanceof NextResponse) return gate;
  return NextResponse.json({
    bitrix24: {
      configured: !!process.env.BITRIX24_DEFAULT_WEBHOOK_URL,
      // URL — это user-supplied значение из его CRM, не «секрет» в общем смысле,
      // и видно админке для прозрачности «куда уходят лиды».
      defaultWebhookUrl: process.env.BITRIX24_DEFAULT_WEBHOOK_URL ?? "",
    },
    telegram: {
      configured: !!process.env.TELEGRAM_BOT_TOKEN,
    },
    email: {
      configured: !!process.env.SMTP_HOST,
    },
  });
}
