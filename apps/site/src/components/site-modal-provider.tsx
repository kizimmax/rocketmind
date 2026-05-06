"use client";

import {
  ModalProvider,
  type FormConsentLink,
  type FormEntity,
} from "@rocketmind/ui";
import type { ReactNode } from "react";

export function SiteModalProvider({
  forms,
  defaultConsentLinks,
  children,
}: {
  forms: FormEntity[];
  defaultConsentLinks?: FormConsentLink[];
  children: ReactNode;
}) {
  return (
    <ModalProvider
      forms={forms}
      defaultConsentLinks={defaultConsentLinks}
      onSubmit={async (form, payload) => {
        const res = await fetch("/api/form-submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formId: form.id,
            fields: payload,
            pageUrl: typeof window !== "undefined" ? window.location.pathname : undefined,
          }),
        });
        if (!res.ok) {
          // FormModal сам поймает throw и покажет «попробуйте ещё раз».
          const text = await res.text().catch(() => "");
          throw new Error(`submission failed: ${res.status} ${text.slice(0, 200)}`);
        }
        // Заявка сохранена в БД; даже если каналы упали — для пользователя успех.
      }}
    >
      {children}
    </ModalProvider>
  );
}
