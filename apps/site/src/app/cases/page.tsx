import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Кейсы | Rocketmind",
  description:
    "Реальные примеры решения бизнес-задач — проблема, решение, измеримый результат.",
};

export default function CasesPage() {
  return (
    <div className="px-5 py-24 md:px-8 xl:px-14">
      <div className="mx-auto max-w-[1512px]">
        <h1 className="font-heading text-4xl font-bold md:text-6xl">
          Кейсы
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Каталог кейсов — структура страницы будет добавлена позже.
        </p>
      </div>
    </div>
  );
}
