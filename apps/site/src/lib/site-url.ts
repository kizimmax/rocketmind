/**
 * Canonical базовый URL сайта. Один источник истины для sitemap, robots,
 * canonical-link, OG-meta. На проде задаётся `SITE_URL=https://rocketmind.ru`
 * в env Amvera. Локально — fallback на хост-имя продакшена (не localhost,
 * чтобы относительные ссылки в sitemap были корректны для проверки).
 */
export const SITE_URL = (process.env.SITE_URL ?? "https://rocketmind.ru").replace(/\/$/, "");
