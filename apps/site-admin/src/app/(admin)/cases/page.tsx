"use client";

import { Suspense } from "react";
import { ADMIN_SECTIONS } from "@/lib/constants";
import { PagesView } from "@/components/pages-view";

export default function CasesPage() {
  const sections = ADMIN_SECTIONS.filter((s) => s.id === "cases");
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-rm-gray-3 border-t-foreground" />
        </div>
      }
    >
      <PagesView title="Кейсы" sections={sections} defaultSection="cases" />
    </Suspense>
  );
}
