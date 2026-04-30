"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import type { FormEntity } from "@/lib/types";
import { CtaPanel } from "@/components/cta-forms/cta-panel";
import { FormsPanel } from "@/components/cta-forms/forms-panel";

export default function CtaFormsPage() {
  const [forms, setForms] = useState<FormEntity[]>([]);

  const reloadForms = useCallback(() => {
    apiFetch("/api/forms")
      .then((r) => r.json() as Promise<FormEntity[]>)
      .then(setForms)
      .catch(() => {});
  }, []);

  useEffect(() => {
    reloadForms();
  }, [reloadForms]);

  return (
    /* min-h-0 на корневом контейнере и на дочерней grid-обёртке —
       разрешает flex-детям сжиматься ниже своего content height,
       чтобы overflow-y-auto на колонках реально включался. */
    <div className="flex flex-1 min-h-0 flex-col">
      {/* Sticky-заголовок остаётся видимым при скролле колонок ниже */}
      <h1 className="shrink-0 px-6 py-5 font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
        CTA и формы
      </h1>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
        <div className="min-h-0 min-w-0 overflow-y-auto border-b border-border px-6 pb-6 lg:border-b-0 lg:border-r">
          <CtaPanel forms={forms} />
        </div>
        <div className="min-h-0 min-w-0 overflow-y-auto px-6 pb-6">
          <FormsPanel forms={forms} setForms={setForms} />
        </div>
      </div>
    </div>
  );
}
