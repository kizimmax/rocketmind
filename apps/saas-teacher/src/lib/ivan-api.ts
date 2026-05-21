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
  return fetch(`${baseUrl()}${c.path}`, {
    method: c.method ?? "GET",
    headers,
    body: c.body !== undefined ? JSON.stringify(c.body) : undefined,
    cache: "no-store",
    redirect: "manual",
  });
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
