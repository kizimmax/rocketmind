"use client";

import { useParams } from "next/navigation";
import { ArticleEditor } from "@/components/media/article-editor";

export default function MediaEditPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  return <ArticleEditor articleId={`media/${slug}`} />;
}
