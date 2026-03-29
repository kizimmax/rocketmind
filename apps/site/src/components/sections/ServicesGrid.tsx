import { ServicesGridClient, type ServiceSection } from "./ServicesGridClient";
import {
  CONSULTING_SERVICES,
  ACADEMY_COURSES,
  AI_PRODUCTS,
} from "@/content/site-nav";

const sectionsData: ServiceSection[] = [
  {
    trackName: "Консалтинг и стратегии",
    headerHighlight: "Стратегия и бизнес-модели",
    description:
      "Помогаем командам искать, проверять и усиливать бизнес-модели, связывать стратегию с операционными действиями и переходить от продуктовой логики к платформенной и экосистемной архитектуре.",
    catalogHref: "/consulting",
    cards: CONSULTING_SERVICES.map((s) => ({
      title: s.title,
      description: s.description,
      href: s.href,
    })),
  },
  {
    trackName: "Онлайн-школа",
    headerHighlight: "академия бизнес-дизайна",
    description:
      "Среда, где управленцы и команды осваивают бизнес-дизайн, платформенное мышление и работу с гипотезами. Мы обучаем тому, что сами применяем в проектах: от системной стратегии до запуска цифровых инициатив.",
    catalogHref: "/academy",
    cards: [
      ...ACADEMY_COURSES.map((s) => ({
        title: s.title,
        description: s.description,
        href: s.href,
      })),
      {
        title: "Программы с ведущими бизнес-школами",
        description:
          "Обучаем топ-менеджеров крупных компаний, помогаем трансформировать бизнес с помощью бизнес-дизайна",
        variant: "info" as const,
        partnerLogos: ["/partners/partner-logo-1.png", "/partners/partner-logo-2.png"],
      },
    ],
  },
  {
    trackName: "AI-продукты",
    headerHighlight: "продукты с AI для бизнеса",
    description:
      "Встроенные помощники, которые усиливают мышление, а не заменяют экспертов. Они помогают командам быстрее проходить через сложные задачи: от исследования и анализа до формирования бизнес-моделей и стратегий.",
    catalogHref: "/ai-products",
    cards: AI_PRODUCTS.map((s) => ({
      title: s.title,
      description: s.description,
      href: s.href,
    })),
  },
];

export function ServicesGrid() {
  return <ServicesGridClient sections={sectionsData} />;
}
