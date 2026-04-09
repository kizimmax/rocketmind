// Shared types & defaults for AboutRocketmind section
// Separate file (no "use client") so Server Components can import safely

export type AboutRocketmindVariant = "dark" | "light";

export interface AboutRmFeature {
  title: string;
  text: string;
}

export type AboutRocketmindSectionProps = {
  heading: string;
  founderName: string;
  founderBio: string;
  founderRole: string;
  features: AboutRmFeature[];
  variant?: AboutRocketmindVariant;
};

export const ABOUT_RM_DEFAULTS: AboutRocketmindSectionProps = {
  heading: "От идеи\nдо бизнес-модели",
  founderName: "Алексей Еремин",
  founderBio: "Мы не просто консультируем, мы строим работающие сетевые структуры",
  founderRole: "Основатель Rocketmind, эксперт по экосистемной архитектуре и стратег цифровой трансформации.",
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
  variant: "dark",
};
