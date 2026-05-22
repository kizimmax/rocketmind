/**
 * BFF-клиент к API Ивана (Mongo-бэк на Amvera). Идентичен teacher-версии.
 *
 * Авторизация у Ивана — http-only cookies (access+refresh), их ставит его API.
 * Фронт ходит server-to-server (этот модуль — только из route-handlers), CORS
 * не нужен. Куки relay'им: входящие куки браузера → в запрос к Ивану, его
 * Set-Cookie → браузеру под нашим доменом; на 401 пробуем /auth/refresh.
 */
import { NextResponse } from "next/server";

const BACK_API = process.env.BACK_API ?? "";

function baseUrl(): string {
  if (!BACK_API) throw new Error("BACK_API is not set");
  return BACK_API.replace(/\/$/, "");
}

/** Set-Cookie от домена Ивана → host-only под наш домен, Path=/, SameSite=Lax, Secure только в проде. */
function rewriteSetCookie(raw: string): string {
  const isProd = process.env.NODE_ENV === "production";
  const [nameValue, ...attrs] = raw.split(/;\s*/);
  const kept = [nameValue];
  for (const attr of attrs) {
    const lower = attr.toLowerCase();
    if (lower.startsWith("domain=")) continue;
    if (lower.startsWith("path=")) continue;
    if (lower.startsWith("samesite=")) continue;
    if (lower === "secure") continue;
    kept.push(attr);
  }
  kept.push("Path=/");
  kept.push("SameSite=Lax");
  if (isProd) kept.push("Secure");
  return kept.join("; ");
}

function mergeCookies(base: string | null, setCookies: string[]): string {
  const jar = new Map<string, string>();
  if (base) {
    for (const kv of base.split(/;\s*/)) {
      const i = kv.indexOf("=");
      if (i > 0) jar.set(kv.slice(0, i), kv.slice(i + 1));
    }
  }
  for (const sc of setCookies) {
    const first = sc.split(";")[0];
    const i = first.indexOf("=");
    if (i > 0) jar.set(first.slice(0, i).trim(), first.slice(i + 1).trim());
  }
  return [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
}

export type IvanCall = {
  method?: string;
  path: string;
  body?: unknown;
  cookie?: string | null;
  retryOn401?: boolean;
};

export type IvanResult<T = unknown> = {
  status: number;
  ok: boolean;
  data: T | null;
  setCookies: string[];
};

function getSetCookies(res: Response): string[] {
  return (res.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.() ?? [];
}

async function rawCall(c: IvanCall): Promise<Response> {
  const headers: Record<string, string> = {};
  if (c.body !== undefined) headers["content-type"] = "application/json";
  if (c.cookie) headers["cookie"] = c.cookie;
  const init: RequestInit = {
    method: c.method ?? "GET",
    headers,
    body: c.body !== undefined ? JSON.stringify(c.body) : undefined,
    cache: "no-store",
    redirect: "manual",
  };
  const url = `${baseUrl()}${c.path}`;
  // Amvera временами рвёт TLS (ECONNRESET) — ретраим сетевые сбои (не статусы).
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await fetch(url, init);
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
    }
  }
  throw lastErr;
}

export async function ivanCall<T = unknown>(c: IvanCall): Promise<IvanResult<T>> {
  let res = await rawCall(c);
  let relay = getSetCookies(res);

  if (res.status === 401 && c.retryOn401) {
    const refresh = await rawCall({ method: "POST", path: "/auth/refresh", cookie: c.cookie });
    const refreshSet = getSetCookies(refresh);
    if (refresh.ok && refreshSet.length) {
      const newCookie = mergeCookies(c.cookie ?? null, refreshSet);
      res = await rawCall({ ...c, cookie: newCookie });
      relay = [...refreshSet, ...getSetCookies(res)];
    } else {
      relay = refreshSet;
    }
  }

  let parsed = (await res.json().catch(() => null)) as unknown;
  // Иван оборачивает ответы в конверт { success, message, data }. Разворачиваем
  // payload, чтобы мапперы читали реальные поля (на ошибке конверта нет 'data' —
  // оставляем как есть, роуты смотрят на r.ok).
  if (parsed && typeof parsed === "object" && "success" in parsed && "data" in parsed) {
    parsed = (parsed as { data: unknown }).data;
  }
  return { status: res.status, ok: res.ok, data: parsed as T | null, setCookies: relay.map(rewriteSetCookie) };
}

export function applySetCookies(res: NextResponse, setCookies: string[]): NextResponse {
  for (const sc of setCookies) res.headers.append("set-cookie", sc);
  return res;
}
