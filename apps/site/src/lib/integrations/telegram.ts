/**
 * Telegram-уведомление о заявке. Один из трёх каналов BUG-017.
 *
 * Глобальный токен бота → env TELEGRAM_BOT_TOKEN.
 * Per-form: chatId (число для группы — отрицательное; для лички — положительное).
 *
 * Без токена — sender возвращает skipped (баг не считается, юзер не привязал бота).
 */

import type { SendResult } from "./bitrix24";

export interface TelegramLead {
  formName: string;
  pageUrl?: string | null;
  fields: Record<string, unknown>;
  submittedAt: Date;
}

export interface TelegramOptions {
  chatId: string;
  topicId?: string;
}

export async function sendToTelegram(
  opts: TelegramOptions,
  lead: TelegramLead,
): Promise<SendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { status: "skipped", reason: "TELEGRAM_BOT_TOKEN not set" };
  if (!opts.chatId?.trim()) return { status: "skipped", reason: "no chatId" };

  const fieldLines = Object.entries(lead.fields)
    .map(([k, v]) => `*${escapeMd(humanizeKey(k))}:* ${escapeMd(stringifyVal(v))}`)
    .join("\n");

  const text =
    `🆕 *Новая заявка с Rocketmind*\n\n` +
    `📝 *Форма:* ${escapeMd(lead.formName)}\n` +
    (lead.pageUrl ? `📄 *Страница:* ${escapeMd(lead.pageUrl)}\n` : "") +
    `\n${fieldLines}\n\n` +
    `🕒 ${escapeMd(lead.submittedAt.toLocaleString("ru-RU", { timeZone: "Europe/Moscow" }))}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: opts.chatId,
        text,
        parse_mode: "MarkdownV2",
        ...(opts.topicId ? { message_thread_id: Number(opts.topicId) } : {}),
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      return { status: "error", error: `HTTP ${res.status}: ${t.slice(0, 300)}` };
    }
    const data = (await res.json().catch(() => null)) as { ok?: boolean; description?: string } | null;
    if (data && data.ok === false) return { status: "error", error: data.description ?? "telegram api error" };
    return { status: "ok" };
  } catch (e) {
    return { status: "error", error: e instanceof Error ? e.message : String(e) };
  }
}

const KEY_LABELS: Record<string, string> = {
  name: "Имя", fullName: "Имя", firstName: "Имя", lastName: "Фамилия",
  email: "Email", phone: "Телефон", tel: "Телефон",
  message: "Сообщение", comment: "Комментарий",
  company: "Компания", position: "Должность",
};
function humanizeKey(k: string): string {
  return KEY_LABELS[k] ?? k;
}

function stringifyVal(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

/** Markdown V2 требует экранировать целый набор символов. */
function escapeMd(s: string): string {
  return s.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}
