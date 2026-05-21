/**
 * BFF-клиент к API Ивана (Mongo-бэк на Amvera).
 *
 * Авторизация у Ивана — на http-only cookies (access + refresh), которые ставит
 * его API. Фронт ходит к нему server-to-server (этот модуль вызывается только из
 * route-handlers), поэтому CORS не нужен. Схема relay-куки:
 *   - входящие куки браузера форвардим в запрос к Ивану (заголовок Cookie);
 *   - его Set-Cookie переписываем под наш домен и отдаём браузеру (applySetCookies);
 *   - на 401 от защищённого endpoint зовём /auth/refresh и повторяем запрос.
 */
import { NextResponse } from "next/server";

const IVAN_API_URL = process.env.IVAN_API_URL ?? "";

function baseUrl(): string {
  if (!IVAN_API_URL) throw new Error("IVAN_API_URL is not set");
  return IVAN_API_URL.replace(/\/$/, "");
}

/**
 * Переписываем Set-Cookie от домена Ивана так, чтобы браузер сохранил куку для
 * НАШЕГО хоста и слал её на все наши роуты. Снимаем Domain (host-only), нормализуем
 * Path=/ и SameSite=Lax (для нас кука первопартийная), Secure — только в проде.
 */
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
    kept.push(attr); // HttpOnly, Max-Age, Expires — сохраняем
  }
  kept.push("Path=/");
  kept.push("SameSite=Lax");
  if (isProd) kept.push("Secure");
  return kept.join("; ");
}

/** Собираем заголовок Cookie из базового + значений name=value из Set-Cookie. */
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
  /** путь относительно базы, напр. "/auth/login" */
  path: string;
  /** JSON-тело запроса */
  body?: unknown;
  /** заголовок Cookie из браузерного запроса (request.headers.get("cookie")) */
  cookie?: string | null;
  /** на 401 попытаться /auth/refresh и повторить запрос */
  retryOn401?: boolean;
};

export type IvanResult<T = unknown> = {
  status: number;
  ok: boolean;
  data: T | null;
  /** уже переписанные под наш домен Set-Cookie — отдать браузеру через applySetCookies */
  setCookies: string[];
};

function getSetCookies(res: Response): string[] {
  // undici Headers.getSetCookie() (Node 18.14+/20)
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
  // Amvera временами рвёт TLS (ECONNRESET) — ретраим сетевые сбои (не HTTP-статусы).
  // Соединение падает до отправки запроса → повтор безопасен (без дублей).
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

/** Вызов API Ивана с relay-куки и опциональным auto-refresh на 401. */
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
      // refresh не удался — сессия мертва; пробрасываем 401 и любые cookie-clears
      relay = refreshSet;
    }
  }

  const data = (await res.json().catch(() => null)) as T | null;
  return { status: res.status, ok: res.ok, data, setCookies: relay.map(rewriteSetCookie) };
}

/** Навесить relay-куки на ответ браузеру. */
export function applySetCookies(res: NextResponse, setCookies: string[]): NextResponse {
  for (const sc of setCookies) res.headers.append("set-cookie", sc);
  return res;
}

/**
 * Проксирует SSE-стрим Ивана НАСКВОЗЬ к браузеру (без буферизации тела).
 * Используется для чата (POST /course/messages). На 401 один раз пытается
 * refresh и переоткрывает стрим. relay-куки и SSE-заголовки ставятся до тела.
 * Не-ok ответ конвертируем в одно SSE-событие `error`, чтобы клиент его показал.
 */
export async function ivanStream(opts: {
  path: string;
  method?: string;
  body?: unknown;
  cookie?: string | null;
}): Promise<Response> {
  const headers = new Headers();
  headers.set("Content-Type", "text/event-stream");
  headers.set("Cache-Control", "no-cache, no-transform");
  headers.set("Connection", "keep-alive");

  const call: IvanCall = { method: opts.method ?? "POST", path: opts.path, body: opts.body, cookie: opts.cookie ?? null };
  try {
    let res = await rawCall(call);
    let relay = getSetCookies(res);

    if (res.status === 401) {
      const refresh = await rawCall({ method: "POST", path: "/auth/refresh", cookie: opts.cookie ?? null });
      const refreshSet = getSetCookies(refresh);
      if (refresh.ok && refreshSet.length) {
        const newCookie = mergeCookies(opts.cookie ?? null, refreshSet);
        res = await rawCall({ ...call, cookie: newCookie });
        relay = [...refreshSet, ...getSetCookies(res)];
      } else {
        relay = refreshSet;
      }
    }

    for (const sc of relay.map(rewriteSetCookie)) headers.append("set-cookie", sc);

    if (!res.ok || !res.body) {
      const data = JSON.stringify({ message: res.status === 403 ? "no_access_or_inactive" : "chat_failed", code: res.status });
      return new Response(`event: error\ndata: ${data}\n\n`, { status: 200, headers });
    }
    return new Response(res.body, { status: 200, headers });
  } catch {
    // Сетевой сбой к Amvera (после ретраев) — отдаём error-событие, не 500.
    const data = JSON.stringify({ message: "network", code: 502 });
    return new Response(`event: error\ndata: ${data}\n\n`, { status: 200, headers });
  }
}
