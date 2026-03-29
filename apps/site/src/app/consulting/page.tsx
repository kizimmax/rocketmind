import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Консалтинг и стратегии | Rocketmind",
  description:
    "Стратегический консалтинг, дизайн-спринты, диагностика и внедрение платформенных моделей.",
};

export default function ConsultingPage() {
  return (
    <div className="px-5 py-24 md:px-8 xl:px-14">
      <div className="mx-auto max-w-[1512px]">
        <h1 className="font-heading text-4xl font-bold md:text-6xl">
          Консалтинг и стратегии
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Каталог услуг — структура страницы будет добавлена позже.
        </p>
      </div>
    </div>
  );
}
