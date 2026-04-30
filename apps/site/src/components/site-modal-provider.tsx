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
    <ModalProvider forms={forms} defaultConsentLinks={defaultConsentLinks}>
      {children}
    </ModalProvider>
  );
}
