import type { Metadata } from "next";

// Для static export нужен generateStaticParams
export function generateStaticParams() {
  // Заглушка — пока нет реальных статей
  return [{ slug: "example-article" }];
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  return {
    title: `Статья | Rocketmind`,
    description: "Статья блога Rocketmind.",
  };
}

export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <article className="px-5 py-24 md:px-8 xl:px-14">
      <div className="mx-auto max-w-[800px]">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Шаблон статьи
        </p>
        <h1 className="mt-4 font-heading text-4xl font-bold md:text-5xl">
          Заголовок статьи
        </h1>
        <div className="mt-8 text-muted-foreground">
          <p>Шаблонная страница статьи — контент будет добавлен позже.</p>
        </div>
      </div>
    </article>
  );
}
