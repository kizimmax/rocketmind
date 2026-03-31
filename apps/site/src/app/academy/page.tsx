import type { Metadata } from "next";
import { PageBottom } from "@/components/sections/PageBottom";

export const metadata: Metadata = {
  title: "Онлайн-школа | Rocketmind",
  description:
    "Курсы и практикумы по бизнес-дизайну, платформенному мышлению и AI.",
};

export default function AcademyPage() {
  return (
    <>
      <div className="px-5 py-24 md:px-8 xl:px-14">
        <div className="mx-auto max-w-[1512px]">
          <h1 className="font-heading text-4xl font-bold md:text-6xl">
            Онлайн-школа
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Каталог курсов — структура страницы будет добавлена позже.
          </p>
        </div>
      </div>
      <PageBottom />
    </>
  );
}
