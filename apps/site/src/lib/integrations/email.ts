/**
 * Email-уведомление о заявке. Один из трёх каналов BUG-017.
 *
 * Прод: SMTP через переменные окружения SMTP_HOST/PORT/USER/PASS/FROM.
 * Локально (Docker dev-стенд): если SMTP_HOST не задан — пишем HTML-файл в
 *   /data/emails/ (= ./.docker-data/emails/ на хосте) для просмотра в браузере.
 *
 * Зависимость nodemailer добавлена опционально (require внутри try) — если
 * пакет не установлен, fallback на файловый mock без падения сборки.
 */

import fs from "node:fs";
import path from "node:path";
import type { SendResult } from "./bitrix24";

export interface EmailLead {
  formName: string;
  formId: string;
  pageUrl?: string | null;
  fields: Record<string, unknown>;
  ipAddress?: string | null;
  submittedAt: Date;
}

export interface EmailOptions {
  recipients: string[];
  subject?: string;
}

const EMAIL_LOG_DIR = process.env.EMAIL_LOG_DIR ?? "/data/emails";

export async function sendEmail(opts: EmailOptions, lead: EmailLead): Promise<SendResult> {
  const recipients = opts.recipients.filter((r) => r.trim());
  if (recipients.length === 0) {
    return { status: "skipped", reason: "no recipients" };
  }

  const subject = opts.subject?.trim() || `Новая заявка с ${lead.formName} — Rocketmind`;
  const html = renderEmailHtml(lead);
  const text = renderEmailText(lead);

  const hasSmtp = !!process.env.SMTP_HOST;
  if (!hasSmtp) {
    // Mock: пишем HTML-файл, который можно открыть в браузере.
    return writeMockEmail(recipients, subject, html);
  }

  try {
    const nodemailer = await import("nodemailer").catch(() => null);
    if (!nodemailer) {
      return { status: "error", error: "nodemailer not installed; run: npm i nodemailer" };
    }
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: (process.env.SMTP_SECURE ?? "true") === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@rocketmind.ru",
      to: recipients.join(", "),
      subject,
      text,
      html,
    });
    return { status: "ok", details: `messageId ${info.messageId}` };
  } catch (e) {
    return { status: "error", error: e instanceof Error ? e.message : String(e) };
  }
}

function writeMockEmail(recipients: string[], subject: string, html: string): SendResult {
  try {
    fs.mkdirSync(EMAIL_LOG_DIR, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const safeSubj = subject.replace(/[^\wЀ-ӿ .-]+/g, "_").slice(0, 60);
    const file = path.join(EMAIL_LOG_DIR, `${ts}_${safeSubj}.html`);
    const wrapped = `<!--\nTo: ${recipients.join(", ")}\nSubject: ${subject}\nMode: MOCK (no SMTP_HOST)\n-->\n${html}`;
    fs.writeFileSync(file, wrapped, "utf-8");
    return { status: "ok", details: `mock → ${file}` };
  } catch (e) {
    return { status: "error", error: `mock write failed: ${e instanceof Error ? e.message : String(e)}` };
  }
}

function renderEmailHtml(lead: EmailLead): string {
  const rows = Object.entries(lead.fields)
    .map(([k, v]) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;font-size:13px;width:30%;vertical-align:top">${escapeHtml(humanizeKey(k))}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px">${escapeHtml(stringifyVal(v))}</td>
      </tr>`).join("");

  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="utf-8"><title>Новая заявка — Rocketmind</title></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px">
    <div style="background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e0e0e0">
      <div style="background:linear-gradient(135deg,#FFE600 0%,#FFC700 100%);padding:24px 24px 20px">
        <div style="font-size:13px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#1a1a1a;opacity:0.7">Rocketmind</div>
        <div style="font-size:22px;font-weight:700;margin-top:4px;color:#0A0A0A">Новая заявка с сайта</div>
      </div>
      <div style="padding:24px">
        <div style="font-size:13px;color:#666;margin-bottom:16px">
          <strong style="color:#1a1a1a">${escapeHtml(lead.formName)}</strong><br/>
          ${lead.pageUrl ? `Страница: <a href="${escapeAttr(lead.pageUrl)}" style="color:#1a1a1a">${escapeHtml(lead.pageUrl)}</a><br/>` : ""}
          ${lead.submittedAt.toLocaleString("ru-RU", { timeZone: "Europe/Moscow", dateStyle: "medium", timeStyle: "short" })}${lead.ipAddress ? ` · IP ${escapeHtml(lead.ipAddress)}` : ""}
        </div>
        <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:6px;overflow:hidden">
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div style="padding:14px 24px;background:#fafafa;border-top:1px solid #eee;font-size:11px;color:#999">
        Это автоматическое уведомление. Заявка сохранена в админке Rocketmind, форма «${escapeHtml(lead.formName)}» (id: ${escapeHtml(lead.formId)}).
      </div>
    </div>
  </div>
</body>
</html>`;
}

function renderEmailText(lead: EmailLead): string {
  const lines = [
    `Новая заявка — Rocketmind`,
    `Форма: ${lead.formName}`,
    lead.pageUrl ? `Страница: ${lead.pageUrl}` : null,
    `Время: ${lead.submittedAt.toISOString()}`,
    "",
    ...Object.entries(lead.fields).map(([k, v]) => `${humanizeKey(k)}: ${stringifyVal(v)}`),
  ].filter(Boolean);
  return lines.join("\n");
}

const KEY_LABELS: Record<string, string> = {
  name: "Имя",
  fullName: "Имя",
  firstName: "Имя",
  lastName: "Фамилия",
  email: "Email",
  phone: "Телефон",
  tel: "Телефон",
  message: "Сообщение",
  comment: "Комментарий",
  company: "Компания",
  position: "Должность",
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

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
function escapeAttr(s: string): string {
  return escapeHtml(s);
}
