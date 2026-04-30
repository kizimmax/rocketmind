"use client";

import {
  ServicesSection,
  useFormModal,
  type ServiceCardData,
  type StyledParagraph,
} from "@rocketmind/ui";

export type ServicesSectionFormChips = {
  enabled: boolean;
  multi?: boolean;
  label?: string;
};

export type ServicesSectionWithFormProps = {
  tag?: string;
  title: string;
  titleSecondary?: string;
  description?: string;
  paragraphs?: StyledParagraph[];
  cards: ServiceCardData[];
  /** ID формы для открытия по клику на карточку. */
  formId?: string | null;
  /**
   * Конфиг чипсов в форме (настраивается на блоке «Услуги» в админке).
   * Если `enabled = false` или конфиг не передан — клик по карточке всё равно
   * открывает форму, но без чипсов. Если `true` — все карточки попадают
   * в форму как чипсы, плюс кликнутая выбирается заранее.
   */
  formChips?: ServicesSectionFormChips;
  className?: string;
};

/**
 * Site-обёртка для `<ServicesSection>`: при наличии `formId` клик по карточке
 * открывает форму с предзаданным чипсом = заголовок карточки. Конфиг чипсов
 * (single/multi + label) живёт на блоке «Услуги», а не на форме.
 */
export function ServicesSectionWithForm({
  formId,
  cards,
  formChips,
  ...rest
}: ServicesSectionWithFormProps) {
  const { openForm } = useFormModal();

  const chipsEnabled = formChips?.enabled === true;
  const availableChips = chipsEnabled
    ? cards.map((c) => c.title).filter(Boolean)
    : undefined;

  const onCardClick = formId
    ? (card: ServiceCardData) => {
        openForm(formId, {
          chipPrefilled: chipsEnabled ? card.title : undefined,
          availableChips,
          chipsConfig: chipsEnabled
            ? { multi: formChips?.multi, label: formChips?.label }
            : undefined,
        });
      }
    : undefined;

  return (
    <ServicesSection
      cards={cards}
      onCardClick={onCardClick}
      {...rest}
    />
  );
}
