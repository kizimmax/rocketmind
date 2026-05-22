/**
 * Прямой клиент к API Ивана (https://api.rocketmind.ru/api/v1).
 *
 * Браузер ходит на бэк Ивана НАПРЯМУЮ (без нашего BFF-прокси). Авторизация —
 * на http-only cookies его домена с `Domain=.rocketmind.ru; SameSite=None; Secure`,
 * поэтому кука общая для всех поддоменов (agents/admin/saas) и шлётся автоматически
 * при `credentials: "include"`. Нужен только CORS с `Allow-Credentials: true` на бэке.
 *
 * Базовый URL вшивается на сборке (NEXT_PUBLIC_*). Дефолт — прод; для локальной
 * разработки переопредели NEXT_PUBLIC_API_BASE_URL на локальный бэк (Docker).
 */
export const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.rocketmind.ru/api/v1"
).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiOpts = { method?: string; body?: unknown; signal?: AbortSignal };

function rawFetch(path: string, opts: ApiOpts): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    method: opts.method ?? "GET",
    credentials: "include",
    headers: opts.body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
    cache: "no-store",
  });
}

/** На 401 (кроме самих /auth/*) пробуем обновить пару токенов и повторить. */
async function withRefresh(path: string, opts: ApiOpts): Promise<Response> {
  let res = await rawFetch(path, opts);
  if (res.status === 401 && !path.startsWith("/auth/")) {
    const refreshed = await rawFetch("/auth/refresh", { method: "POST" });
    if (refreshed.ok) res = await rawFetch(path, opts);
  }
  return res;
}

/**
 * JSON-вызов API Ивана. Разворачивает конверт `{ success, message, data }` →
 * возвращает `data`. На не-2xx бросает ApiError (status + message из конверта).
 */
export async function apiCall<T = unknown>(path: string, opts: ApiOpts = {}): Promise<T> {
  const res = await withRefresh(path, opts);
  const json = (await res.json().catch(() => null)) as
    | { success?: boolean; message?: string; data?: T }
    | null;

  if (!res.ok) {
    throw new ApiError(res.status, json?.message ?? `HTTP ${res.status}`);
  }
  if (json && typeof json === "object" && "success" in json && "data" in json) {
    return json.data as T;
  }
  return json as T;
}

/**
 * SSE-стрим (чат). Прямой fetch с `credentials:"include"`; на 401 — один refresh
 * и повтор. Возвращает Response с body-стримом (тело читает вызывающий код).
 */
export function apiStream(path: string, body: unknown, signal?: AbortSignal): Promise<Response> {
  return withRefresh(path, { method: "POST", body, signal });
}
