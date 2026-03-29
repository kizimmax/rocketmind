import type { ReactNode } from "react";

interface LegalPageTemplateProps {
  title: string;
  children: ReactNode;
}

export function LegalPageTemplate({ title, children }: LegalPageTemplateProps) {
  return (
    <div className="px-5 py-24 md:px-8 xl:px-14">
      <div className="mx-auto max-w-[800px]">
        <h1 className="font-heading text-3xl font-bold md:text-4xl">
          {title}
        </h1>
        <div
          className={[
            "mt-8 text-muted-foreground",
            "[&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:font-heading [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-foreground md:[&>h2]:text-2xl",
            "[&>p]:mb-4 [&>p]:leading-relaxed",
            "[&>ul]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:leading-relaxed",
            "[&>ol]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:leading-relaxed",
            "[&_li]:mb-2",
          ].join(" ")}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
