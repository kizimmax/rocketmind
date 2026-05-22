/**
 * Отложенное присоединение к группе по QR.
 *
 * Сценарий: незарегистрированный юзер сканирует QR → /join?code=… → его просят
 * войти/зарегистрироваться. Чтобы после регистрации НЕ пришлось сканировать QR
 * повторно, код сохраняем в localStorage при заходе на /join и «дожимаем» join
 * сразу как появится сессия (см. consumePendingJoin в шелле).
 */
import { joinGroup } from "./ivan-client";
import { ApiError } from "./api";

const KEY = "rm_pending_join";

export function setPendingJoin(code: string): void {
  try {
    localStorage.setItem(KEY, code);
  } catch {
    /* приватный режим/недоступен — не критично */
  }
}

export function getPendingJoin(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function clearPendingJoin(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

/**
 * Если есть отложенный QR-код — присоединяем текущего (уже авторизованного)
 * юзера к группе и чистим код. Возвращает true, если join прошёл.
 * Мёртвый код (400/404) тоже чистим, чтобы не зацикливаться; сетевые ошибки
 * оставляем — попробуем в следующий раз.
 */
export async function consumePendingJoin(): Promise<boolean> {
  const code = getPendingJoin();
  if (!code) return false;
  try {
    await joinGroup(code);
    clearPendingJoin();
    return true;
  } catch (e) {
    if (e instanceof ApiError && (e.status === 400 || e.status === 404)) clearPendingJoin();
    return false;
  }
}
