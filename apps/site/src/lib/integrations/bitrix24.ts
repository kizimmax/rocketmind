/**
 * Bitrix24 incoming-webhook sender.
 * Спецификация: docs/qa-fixes-plan.md → BUG-017.
 *
 * Юзер создаёт incoming webhook в своём портале Bitrix24:
 *   Левое меню → «Разработчикам» → «Прочее» → «Входящий вебхук»
 * Получает URL вида: https://<portal>.bitrix24.ru/rest/<USER_ID>/<TOKEN>/
 * В админ-форме вставляет полный URL до /crm.lead.add.json (или мы дописываем сами).
 */

export type SendResult =
  | { status: "ok"; details?: string }
  | { status: "skipped"; reason: string }
  | { status: "error"; error: string };

export interface Bitrix24Lead {
  formName: string;
  pageUrl?: string | null;
  fields: Record<string, unknown>;
  assignedById?: number | null;
}

export async function sendToBitrix24(
  webhookUrl: string,
  lead: Bitrix24Lead,
): Promise<SendResult> {
  if (!webhookUrl || !webhookUrl.trim()) {
    return { status: "skipped", reason: "no webhook url" };
  }

  // Нормализуем URL: добавляем /crm.lead.add.json если юзер вставил только корень.
  const url = webhookUrl.trim().replace(/\/$/, "");
  const endpoint = url.endsWith("/crm.lead.add.json")
    ? url
    : `${url}/crm.lead.add.json`;

  const f = lead.fields;
  const phone = pickStr(f, "phone", "tel", "telephone");
  const email = pickStr(f, "email", "mail");
  const name = pickStr(f, "name", "fullName", "firstName") ?? "Без имени";
  const message = pickStr(f, "message", "comment", "text");

  // Все поля + meta-инфо валим в COMMENTS как читаемый блок (custom fields в CRM пока не привязываем).
  const commentLines = [
    message ? `Сообщение: ${message}` : null,
    lead.pageUrl ? `Страница: ${lead.pageUrl}` : null,
    `Форма: ${lead.formName}`,
    "",
    "Все поля:",
    ...Object.entries(f).map(([k, v]) => `  ${k}: ${stringifyVal(v)}`),
  ].filter(Boolean).join("\n");

  const body = {
    fields: {
      TITLE: `Заявка с сайта Rocketmind — ${lead.formName}`,
      NAME: name,
      ...(phone ? { PHONE: [{ VALUE: phone, VALUE_TYPE: "MOBILE" }] } : {}),
      ...(email ? { EMAIL: [{ VALUE: email, VALUE_TYPE: "WORK" }] } : {}),
      COMMENTS: commentLines,
      SOURCE_ID: "WEB",
      ...(lead.assignedById ? { ASSIGNED_BY_ID: lead.assignedById } : {}),
    },
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { status: "error", error: `HTTP ${res.status}: ${text.slice(0, 300)}` };
    }
    const data = await res.json().catch(() => null) as { result?: number; error?: string } | null;
    if (data?.error) return { status: "error", error: data.error };
    return { status: "ok", details: data?.result ? `lead id ${data.result}` : undefined };
  } catch (e) {
    return { status: "error", error: e instanceof Error ? e.message : String(e) };
  }
}

function pickStr(o: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

function stringifyVal(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return JSON.stringify(v);
}
