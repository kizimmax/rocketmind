import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Бизнес-дизайн. Быстрый старт | Rocketmind",
  description:
    "Интенсивный курс по основам бизнес-дизайна для быстрого старта.",
};

export default function BusinessDesignQuickstartPage() {
  return (
    <div className="px-5 py-24 md:px-8 xl:px-14">
      <div className="mx-auto max-w-[1512px]">
        <h1 className="font-heading text-4xl font-bold md:text-6xl">
          Бизнес-дизайн. Быстрый старт
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Структура страницы курса будет добавлена позже.
        </p>
      </div>
    </div>
  );
}
