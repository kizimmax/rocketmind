import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-продукты | Rocketmind",
  description:
    "ИИ-агенты и SaaS-сервисы для тестирования гипотез и моделирования бизнеса.",
};

export default function AiProductsPage() {
  return (
    <div className="px-5 py-24 md:px-8 xl:px-14">
      <div className="mx-auto max-w-[1512px]">
        <h1 className="font-heading text-4xl font-bold md:text-6xl">
          AI-продукты
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Каталог продуктов — структура страницы будет добавлена позже.
        </p>
      </div>
    </div>
  );
}
