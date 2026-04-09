"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/lib/store";
import { EditorShell } from "@/components/page-editor/editor-shell";

export function PageEditorClient({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId: rawId } = use(params);
  const pageId = decodeURIComponent(rawId);
  const { getPage } = useAdminStore();
  const router = useRouter();

  const page = getPage(pageId);

  if (!page) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Страница не найдена</p>
        <button
          onClick={() => router.push("/pages")}
          className="text-[length:var(--text-14)] text-foreground underline underline-offset-4"
        >
          Назад к списку
        </button>
      </div>
    );
  }

  return <EditorShell initialPage={page} />;
}
