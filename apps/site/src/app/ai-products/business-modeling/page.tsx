import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ИИ-сервис моделирования бизнеса | Rocketmind",
  description:
    "SaaS-платформа для моделирования бизнеса с помощью искусственного интеллекта.",
};

export default function BusinessModelingPage() {
  return (
    <div className="px-5 py-24 md:px-8 xl:px-14">
      <div className="mx-auto max-w-[1512px]">
        <h1 className="font-heading text-4xl font-bold md:text-6xl">
          ИИ-сервис моделирования бизнеса
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Отдельный лендинг SaaS-сервиса — структура будет добавлена позже.
        </p>
      </div>
    </div>
  );
}
