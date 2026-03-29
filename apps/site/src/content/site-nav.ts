/**
 * Единый источник данных навигации сайта.
 * Используется в Header (RocketmindMenu), MobileNav и Footer.
 *
 * Контент редактируется в: content/nav-menu.md
 * После правок в .md — обновите данные здесь.
 */

export type NavItem = {
  href: string;
  title: string;
  description: string;
};

export type NavSection = {
  href: string;
  label: string;
  items?: NavItem[];
};

// ---------------------------------------------------------------------------
// Консалтинг и стратегии
// ---------------------------------------------------------------------------

export const CONSULTING_SERVICES: NavItem[] = [
  {
    href: "/consulting/ecosystem-strategy",
    title: "Экосистемная стратегия",
    description: "Переход от линейной модели к экосистемной архитектуре роста.",
  },
  {
    href: "/consulting/digital-platform",
    title: "Цифровая платформа",
    description: "Внедрение цифровой платформы в ваш бизнес.",
  },
  {
    href: "/consulting/smart-analytics",
    title: "Умная аналитика",
    description: "Аналитика для развития бизнеса на основе данных.",
  },
  {
    href: "/consulting/team-readiness",
    title: "Готовность команды",
    description: "Диагностика готовности команды к трансформации.",
  },
  {
    href: "/consulting/strategy-sessions",
    title: "Стратегические сессии",
    description: "Стратегические и дизайн-сессии для вашей команды.",
  },
  {
    href: "/consulting/design-sprints",
    title: "Дизайн-спринты",
    description: "Организация дизайн-спринтов для быстрого тестирования идей.",
  },
  {
    href: "/consulting/skolkovo",
    title: "Резидент Сколково",
    description: "Помощь в получении статуса резидента Сколково.",
  },
  {
    href: "/consulting/business-readiness",
    title: "Готовность бизнеса",
    description: "Диагностика готовности бизнеса к трансформации.",
  },
];

// ---------------------------------------------------------------------------
// Онлайн-школа
// ---------------------------------------------------------------------------

export const ACADEMY_COURSES: NavItem[] = [
  {
    href: "/academy/business-design-teams",
    title: "Бизнес-дизайн для команд",
    description: "Практикум по бизнес-дизайну для команд.",
  },
  {
    href: "/academy/business-design-quickstart",
    title: "Бизнес-дизайн. Быстрый старт",
    description: "Интенсивный курс по основам бизнес-дизайна.",
  },
];

// ---------------------------------------------------------------------------
// AI-продукты
// ---------------------------------------------------------------------------

export const AI_PRODUCTS: NavItem[] = [
  {
    href: "/ai-products/hypothesis-testing",
    title: "Тестирование гипотез",
    description: "ИИ-агент по тестированию бизнес-гипотез.",
  },
  {
    href: "/ai-products/business-modeling",
    title: "Моделирование бизнеса",
    description: "SaaS ИИ-сервис моделирования бизнеса.",
  },
];

// ---------------------------------------------------------------------------
// Меню шапки (полное)
// ---------------------------------------------------------------------------

export const HEADER_NAV: NavSection[] = [
  {
    href: "/consulting",
    label: "Консалтинг и стратегии",
    items: CONSULTING_SERVICES,
  },
  {
    href: "/academy",
    label: "Онлайн-школа",
    items: ACADEMY_COURSES,
  },
  {
    href: "/ai-products",
    label: "AI-продукты",
    items: AI_PRODUCTS,
  },
  { href: "/about", label: "О Rocketmind" },
  { href: "/media", label: "Медиа" },
];

// ---------------------------------------------------------------------------
// Юридические документы
// ---------------------------------------------------------------------------

export const LEGAL_LINKS = [
  { href: "/legal/privacy-policy", label: "Политика конфиденциальности" },
  { href: "/legal/data-consent", label: "Обработка персональных данных" },
  { href: "/legal/marketing-consent", label: "Рекламное согласие" },
];
