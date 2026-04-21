// Shared types & defaults for AboutRocketmind section
// Separate file (no "use client") so Server Components can import safely

export type AboutRocketmindLeftVariant = "alex" | "canvas";

export interface AboutRmFeature {
  title: string;
  text: string;
}

export type AboutRocketmindSectionProps = {
  heading: string;
  founderName: string;
  founderBio: string;
  founderRole: string;
  /** Canvas variant — title + description instead of founder info */
  canvasTitle: string;
  canvasText: string;
  features: AboutRmFeature[];
  /** Left part variant: "alex" = founder photo, "canvas" = methodology image */
  leftVariant?: AboutRocketmindLeftVariant;
  /** Override for the founder photo URL (relative to site root). */
  alexPhoto?: string;
  /** Override for the canvas (methodology) image URL (relative to site root). */
  canvasPhoto?: string;
};

export const DEFAULT_ALEX_PHOTO = "/images/about/alexey-eremin.png";
export const DEFAULT_CANVAS_PHOTO = "/images/about/canvas-image.png";

export const ABOUT_RM_DEFAULTS: AboutRocketmindSectionProps = {
  heading: "От идеи\nдо бизнес-модели",
  founderName: "Алексей Еремин",
  founderBio: "Мы не просто консультируем, мы строим работающие сетевые структуры",
  founderRole: "Основатель Rocketmind, эксперт по экосистемной архитектуре и стратег цифровой трансформации.",
  canvasTitle: "Цифровые платформы\nи экосистемы",
  canvasText: "Развиваем и используем международную методологию Platform Innovation Kit, представляем её в России и странах Азии, помогая компаниям проектировать платформенные модели, находить новые точки роста и выстраивать более сильную архитектуру бизнеса.",
  features: [
    {
      title: "Доступ к ИИ-агентам",
      text: "Встроенные интеллектуальные ассистенты, которые усиливают командную работу. Работают внутри каждого продукта Rocketmind.",
    },
    {
      title: "Более 20 лет в IT",
      text: "Мы создавали онлайн-продукты, сервисы и платформы, выступали с лекциями для научного и бизнес-сообщества в России и за рубежом.",
    },
    {
      title: "Экспертная команда",
      text: "Над исследованиями работают аналитики и маркетологи, команда редакторов делает материалы простыми для восприятия.",
    },
  ],
  leftVariant: "alex",
};
