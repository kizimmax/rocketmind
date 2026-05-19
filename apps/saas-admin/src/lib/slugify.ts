/**
 * Канонический slugify: транслитерирует кириллицу, оставляет только латиницу и
 * цифры через дефис, режет до 60 символов. Используется и на фронте (store.ts —
 * локальная копия для совместимости), и на бэке для нормализации входящих slug'ов
 * через POST/PUT, чтобы кириллические URL не уезжали в БД.
 */

const RU_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e",
  ж: "zh", з: "z", и: "i", й: "i", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function slugify(input: string): string {
  const lower = input.toLowerCase().trim();
  let out = "";
  for (const ch of lower) out += RU_MAP[ch] ?? ch;
  return out
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60);
}

/** Фильтрует ввод пользователя на лету: оставляет только [a-z0-9-], убирает
 *  кириллицу, пробелы и спецсимволы. Используется в onChange slug-инпутов. */
export function filterSlugInput(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .substring(0, 60);
}

/** Нормализует slug на бэке: пропускает уже-валидные ASCII slug'и без изменений,
 *  иначе прогоняет через slugify. Возвращает пустую строку если вход «мусорный». */
export function normalizeSlug(input: unknown): string {
  if (typeof input !== "string") return "";
  const trimmed = input.trim();
  if (!trimmed) return "";
  // Уже валидный slug — оставляем как есть (не теряем намеренно-кастомное «my-cool-page-v2»).
  if (/^[a-z0-9][a-z0-9-]{0,59}$/.test(trimmed)) return trimmed;
  return slugify(trimmed);
}
