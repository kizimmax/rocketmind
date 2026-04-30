"use client";

import { CTASectionYellow, useFormModal } from "@rocketmind/ui";

export type PageBottomCtaProps = {
  cta?: {
    heading?: string;
    body?: string;
    buttonText?: string;
    formId?: string;
  } | null;
  pageFormId?: string | null;
  availableChips?: string[];
  chipsConfig?: { multi?: boolean; label?: string };
};

export function PageBottomCta({
  cta,
  pageFormId,
  availableChips,
  chipsConfig,
}: PageBottomCtaProps) {
  const { openForm } = useFormModal();
  const formId = pageFormId || cta?.formId;

  const handleClick = formId
    ? () => openForm(formId, { availableChips, chipsConfig })
    : undefined;

  return (
    <CTASectionYellow
      heading={cta?.heading}
      body={cta?.body}
      buttonText={cta?.buttonText}
      onClick={handleClick}
    />
  );
}
