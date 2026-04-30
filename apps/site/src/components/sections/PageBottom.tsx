import { CasesSection } from "./CasesSection";
import { PageBottomCta } from "./PageBottomCta";
import { getCtaById } from "@/lib/ctas";

export type PageBottomProps = {
  /**
   * CTA-блок страницы. Если не задан — подхватывается «default»-CTA из
   * `content/ctas/default.md`. Если и его нет — используется дефолт
   * `CTASectionYellow` (захардкоженный текст-фолбэк).
   */
  cta?: {
    heading?: string;
    body?: string;
    buttonText?: string;
    /** ID формы по умолчанию у CTA (используется в статьях; на продуктовой странице перебивается pageFormId). */
    formId?: string;
  } | null;
  /** ID формы страницы. Перебивает `cta.formId` (продуктовые страницы). */
  pageFormId?: string | null;
  /** Опции чипсов (заголовки карточек блока «Услуги»). */
  availableChips?: string[];
  /** Конфиг чипсов в форме (multi/label). Передаётся блоком «Услуги». */
  chipsConfig?: { multi?: boolean; label?: string };
};

export function PageBottom({
  cta,
  pageFormId,
  availableChips,
  chipsConfig,
}: PageBottomProps = {}) {
  // Если страница не задаёт свой CTA — подтягиваем «default» из админки.
  let resolved = cta;
  if (!resolved) {
    const defaultCta = getCtaById("default");
    if (defaultCta) {
      resolved = {
        heading: defaultCta.heading,
        body: defaultCta.body,
        buttonText: defaultCta.buttonText,
        formId: defaultCta.formId,
      };
    }
  }

  return (
    <>
      <CasesSection />
      <PageBottomCta
        cta={resolved}
        pageFormId={pageFormId}
        availableChips={availableChips}
        chipsConfig={chipsConfig}
      />
    </>
  );
}
