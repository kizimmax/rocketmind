"use client";

import { useParams } from "next/navigation";
import { GlossaryTermEditor } from "@/components/media/glossary-term-editor";

export default function GlossaryEditPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  return <GlossaryTermEditor termId={`glossary/${slug}`} />;
}
