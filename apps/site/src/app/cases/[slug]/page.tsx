import type { Metadata } from "next";

export function generateStaticParams() {
  return [{ slug: "example-case" }];
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  return {
    title: "Кейс | Rocketmind",
    description: "Кейс Rocketmind — проблема, решение, результат.",
  };
}

export default function CasePage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <article className="px-5 py-24 md:px-8 xl:px-14">
      <div className="mx-auto max-w-[800px]">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Шаблон кейса
        </p>
        <h1 className="mt-4 font-heading text-4xl font-bold md:text-5xl">
          Заголовок кейса
        </h1>
        <div className="mt-8 text-muted-foreground">
          <p>Шаблонная страница кейса — контент будет добавлен позже.</p>
        </div>
      </div>
    </article>
  );
}
