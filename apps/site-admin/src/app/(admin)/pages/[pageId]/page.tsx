import {
  CONSULTING_SERVICES,
  ACADEMY_COURSES,
  AI_PRODUCTS,
} from "@rocketmind/ui/content";
import { PageEditorClient } from "./client";

export function generateStaticParams() {
  const allItems = [
    ...CONSULTING_SERVICES.map((s) => ({
      section: "consulting",
      slug: s.href.split("/").pop()!,
    })),
    ...ACADEMY_COURSES.map((s) => ({
      section: "academy",
      slug: s.href.split("/").pop()!,
    })),
    ...AI_PRODUCTS.map((s) => ({
      section: "ai-products",
      slug: s.href.split("/").pop()!,
    })),
  ];

  return allItems.map(({ section, slug }) => ({
    pageId: encodeURIComponent(`${section}/${slug}`),
  }));
}

export default function PageEditorPage({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  return <PageEditorClient params={params} />;
}
