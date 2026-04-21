"use client"

import React from "react"
import { Separator, CTASectionDark, CTASectionYellow, AccordionFAQ, ForWhomSection, ContactsSection, ProcessSection, ResultsSection, ExpertsSection, PartnershipBlock } from "@rocketmind/ui"
import { Section, SubSection, SpecBlock } from "@/components/ds/shared"
import { TokenChip } from "@/components/ds/color-helpers"
import { CasesSectionShowcase } from "@/components/ds/cases-section-showcase"

export default function MarketingBlocksPage() {
  return (
    <>
      <Section id="marketing-blocks" title="Маркетинг блоки">
        <p className="text-muted-foreground mb-8">
          Готовые блоки для лендинга и маркетинговых страниц. Используют токены дизайн-системы — стиль единый с основным приложением.
        </p>

        {/* ── Accordion 05 ── */}
        <SubSection id="marketing-blocks-faq" title="Аккордион — FAQ" first />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Аккордион для секций FAQ и «Часто задаваемые вопросы». Числа слева — порядковые метки. Заголовок раскрытого пункта подсвечивается акцентным жёлтым. Плавное открытие через <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]">grid-template-rows</code> (200ms, ease-standard).
        </p>
        <div className="-mx-5 md:-mx-10 border-y border-border py-10 px-5 md:px-10 mb-8">
          <AccordionFAQ />
        </div>
        <SpecBlock title="Токены">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Свойство</th>
                  <th className="text-left px-4 py-2 font-medium">Токен / значение</th>
                  <th className="text-left px-4 py-2 font-medium">Описание</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Закрытый заголовок",  "text-foreground/20",              "Приглушённый текст"],
                  ["Открытый заголовок",  "text-primary (--rm-yellow-100)",  "Акцентный жёлтый"],
                  ["Hover заголовок",     "text-foreground/50",              "Промежуточное состояние"],
                  ["Типографика",         "--font-heading-family, uppercase", "Bold, tracking -0.02em"],
                  ["Номер",              "--font-mono-family, --text-12",    "Tabular nums, mt-2"],
                  ["Контент",            "--text-14, text-muted-foreground", "Отступ pl-6 / md:px-20"],
                  ["Разделитель",         "border-b border-border",          "Стандартный бордер ДС"],
                  ["Анимация",            "grid-template-rows, 200ms",       "--ease-standard (0.4,0,0.2,1)"],
                ].map(([prop, token, desc]) => (
                  <tr key={prop} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{prop}</td>
                    <td className="px-4 py-2"><TokenChip>{token}</TokenChip></td>
                    <td className="px-4 py-2 text-[length:var(--text-14)] text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        {/* ── CTA — Тёмный ── */}
        <SubSection id="marketing-blocks-cta-dark" title="CTA — Тёмный" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Тёмный CTA-блок с желтой кнопкой и декоративным кругом с паттерном точек. Figma: 1400×424 px. Фон — <TokenChip>bg-[#0A0A0A]</TokenChip>, кнопка — <TokenChip>bg-[--rm-yellow-100]</TokenChip> с тёмным текстом.
        </p>
        {/* Live preview */}
        <div className="mb-8">
          <CTASectionDark className="!pb-0" />
        </div>
        <SpecBlock title="Токены">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Свойство</th>
                  <th className="text-left px-4 py-2 font-medium">Значение</th>
                  <th className="text-left px-4 py-2 font-medium">Описание</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Контейнер",        "border border-border",             "Рамка вокруг всего блока, px-5 md:px-8 xl:px-14 отступы секции"],
                  ["Фон секции",       "#0A0A0A",                          "bg-background (dark)"],
                  ["Заголовок",        "#F0F0F0 (foreground)",             "H2, Roboto Condensed 700, 52px desktop"],
                  ["Описание",         "text-muted-foreground",            "Copy 18, Roboto 400, 18px desktop"],
                  ["Кнопка",          "#FFCC00 (--rm-yellow-100)",        "Жёлтая, text #0A0A0A"],
                  ["Декор-круг",       "789×789 px, rgba(219,200,0,0.14)","Dot pattern + yellow glow"],
                  ["Оверлей",          "linear-gradient 90deg 38%→80%",   "Gradient overlay тёмный→прозрачный"],
                  ["Типографика кнопки","Loos Condensed 500, 16px, +4%",  "uppercase, border-radius 4px"],
                ].map(([prop, val, desc]) => (
                  <tr key={prop} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{prop}</td>
                    <td className="px-4 py-2"><TokenChip>{val}</TokenChip></td>
                    <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        {/* ── CTA — Жёлтый ── */}
        <SubSection id="marketing-blocks-cta-yellow" title="CTA — Жёлтый (золотое сечение)" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Жёлтый CTA-блок с тёмной кнопкой и спиралью золотого сечения. Figma: 442-1532 (desktop 1401×400 px) / 443-1546 (mobile 353×571 px). Фон — <TokenChip>#FFCC00</TokenChip>, кнопка — <TokenChip>#0A0A0A</TokenChip> с текстом <TokenChip>#F0F0F0</TokenChip>.
        </p>
        {/* Live preview */}
        <div className="mb-8">
          <CTASectionYellow className="!px-0 !pb-0" />
        </div>
        <SpecBlock title="Токены">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Свойство</th>
                  <th className="text-left px-4 py-2 font-medium">Значение</th>
                  <th className="text-left px-4 py-2 font-medium">Описание</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Фон секции",       "#FFCC00 (--rm-yellow-100)",        "Жёлтый"],
                  ["Заголовок",        "#0A0A0A",                          "H2, 52px desktop / H4 24px mobile"],
                  ["Описание",         "#0A0A0A",                          "18px desktop / 14px mobile"],
                  ["Кнопка",          "#0A0A0A, text #F0F0F0",            "Инверсия; mobile w-full, desktop w-fit (hug)"],
                  ["Декор-спираль",    "#FFE066 (--rm-yellow-300), right 47%, h-full", "Спираль золотого сечения"],
                  ["Высота desktop",   "min-h-[400px]",                    "1401×400 px по Figma"],
                  ["Типографика кнопки","Loos Condensed 500, 16px, +4%",  "uppercase, border-radius 4px"],
                ].map(([prop, val, desc]) => (
                  <tr key={prop} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{prop}</td>
                    <td className="px-4 py-2"><TokenChip>{val}</TokenChip></td>
                    <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        {/* ── Кейсы + Отзывы ── */}
        <SubSection id="marketing-blocks-cases" title="Кейсы + Отзывы" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Блок кейсов и отзывов с бегущей строкой логотипов партнёров. Тёмный фон <TokenChip>#0A0A0A</TokenChip>. Левая колонна — отзывы с fade-маской, правая — кейс с заголовком, стат-блоком, результатом и навигатором.
          Компонент <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]">CasesSection</code> из <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]">apps/site</code>.
        </p>
        <div className="-mx-5 md:-mx-10 border-y border-border overflow-hidden mb-8">
          <CasesSectionShowcase />
        </div>
        <SpecBlock title="Токены и структура">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Элемент</th>
                  <th className="text-left px-4 py-2 font-medium">Значение</th>
                  <th className="text-left px-4 py-2 font-medium">Описание</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Фон секции",       "#0A0A0A",                            "Тёмный (dark bg)"],
                  ["Лейблы",           "#FFCC00 (--rm-yellow-100)",          "Loos Condensed 500, 18px, uppercase"],
                  ["Заголовок кейса",  "#F0F0F0, Roboto Condensed 700",      "52px desktop / 36px md / 24px sm"],
                  ["Текст отзывов",    "#939393",                            "14px, leading 1.4"],
                  ["Отзывы fade",      "mask-image linear-gradient",         "Плавное исчезание сверху и снизу, 40px"],
                  ["Стат-блок",        "border #404040, p-5/p-8",           "Grid 1→3 col, gap-4/gap-6"],
                  ["Цифры статов",     "#F0F0F0, 52px desktop / 40px mob",  "Roboto Condensed 700"],
                  ["Результат",        "#F0F0F0, Loos Condensed 500, 16px", "uppercase, tracking 0.04em"],
                  ["Навигатор",        "#F0F0F0 / #939393",                  "Активный белый, остальные серые"],
                  ["Logo Marquee",     "opacity-55",                         "InfiniteLogoMarquee reverse, py-8"],
                  ["Разделители",      "#404040 (h-px)",                     "Сверху и снизу секции, вокруг марки"],
                ].map(([el, val, desc]) => (
                  <tr key={el} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{el}</td>
                    <td className="px-4 py-2"><TokenChip>{val}</TokenChip></td>
                    <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        {/* ── For Whom — Для кого ── */}
        <SubSection id="marketing-blocks-for-whom" title="Для кого (белый блок с фактами)" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Блок с белым фоном для секции «Для кого это решение». Поддерживает 2–4 факта с автоматической раскладкой по 2 колонкам. При 3 фактах можно выбрать, какая колонка содержит широкую карточку (<code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]">wideColumn</code>).
        </p>
        <div className="-mx-5 md:-mx-10 border-y border-border mb-8">
          <ForWhomSection
            tag="для кого"
            title="От продуктовой модели к партнерской среде"
            subtitle="Мы помогаем перейти от классической продуктовой модели к созданию комплексной партнерской среды."
            wideColumn="right"
            facts={[
              { title: "Крупные корпорации", text: "Выстроят единую и прозрачную стратегию для всего портфеля продуктов" },
              { title: "Платформы", text: "Создадут интегрированный клиентский опыт и масштабировать влияние" },
              { title: "Растущие компании", text: "Поймут устройство своей рыночной ниши и найдут новые источники монетизации" },
            ]}
          />
        </div>

        {/* ── Contacts — Контакты ── */}
        <SubSection id="marketing-blocks-contacts" title="Контакты (карточки с абзацами, соцсетями и персонами)" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Блок для страницы «О нас». В карточке свободный порядок элементов: абзацы, строка соцсетей (ВК/Telegram/кастом) и контакт-персона (аватар/имя/роль + телефон + соцсеть). Иконки соцсетей — линейные 40×40 с <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]">rounded-sm (4px)</code>, на hover — тултип с никнеймом.
        </p>
        <div className="-mx-5 md:-mx-10 border-y border-border mb-8">
          <ContactsSection
            tag="контакты"
            title="СВЯЗАТЬСЯ С НАМИ"
            paragraphs={[{ text: "Выберите тип задачи — мы подберём формат сотрудничества.", uppercase: true, color: "primary" }]}
            cards={[
              {
                id: "c1",
                title: "Соцсети",
                items: [
                  { id: "c1-p", kind: "paragraph", paragraph: { text: "Пишите в удобный канал.", color: "secondary" } },
                  {
                    id: "c1-s",
                    kind: "socials",
                    socials: [
                      { id: "s1", kind: "telegram", username: "rocketmind", url: "https://t.me/rocketmind" },
                      { id: "s2", kind: "vk", username: "rocketmind", url: "https://vk.com/rocketmind" },
                    ],
                  },
                ],
              },
              {
                id: "c2",
                title: "Прямой контакт",
                items: [
                  {
                    id: "c2-person",
                    kind: "person",
                    person: {
                      avatar: null,
                      name: "Алексей Ерёмин",
                      role: "Основатель, стратег",
                      phone: "+7 999 000-00-00",
                      social: { kind: "telegram", username: "alexey", url: "https://t.me/alexey" },
                    },
                  },
                ],
              },
            ]}
          />
        </div>

        {/* ── Results — Твёрдые результаты ── */}
        <SubSection id="marketing-blocks-results" title="Твёрдые результаты (лесенка)" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Блок с результатами работы. Десктоп: карточки расположены лесенкой — первая карточка жёлтая (активная), остальные с бордером. При скролле карточки последовательно опускаются до уровня первой и становятся жёлтыми. Мобайл: горизонтальная карусель 2×N, все карточки жёлтые.
        </p>
        <div className="-mx-5 md:-mx-10 border-y border-border mb-8">
          <ResultsSection
            tag="результат"
            title="Твёрдые результаты"
            description="По итогам дизайн-спринта вы получаете набор конкретных артефактов и навыков, готовых к внедрению."
            cards={[
              { title: "Ясная стратегия", text: "Четкое понимание векторов роста, структуры взаимодействия всех участников и новые идеи монетизации на основе данных" },
              { title: "Карта развития", text: "Пошаговый план внедрения изменений с приоритетами, последовательностью действий и опорой на реальные бизнес-задачи" },
              { title: "Обученная команда", text: "Члены команды освоят логику создания экосистемной ценности, принципы работы с партнерами и подход к развитию новых связей" },
              { title: "База знаний", text: "Доступ к базе знаний Rocketmind с методиками, канвасами и рабочими материалами для дальнейшей самостоятельной работы" },
            ]}
          />
        </div>
        <SpecBlock title="Токены">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Свойство</th>
                  <th className="text-left px-4 py-2 font-medium">Значение</th>
                  <th className="text-left px-4 py-2 font-medium">Описание</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Фон секции",          "#0A0A0A",                           "Тёмный фон"],
                  ["Карточка active",     "#FFCC00 (--rm-yellow-100)",         "Жёлтый фон, текст #0A0A0A"],
                  ["Карточка default",    "border 1px #404040",                "Прозрачный фон, бордер"],
                  ["Заголовок карточки",  "Roboto Condensed 700, 20px, UPPER", "--font-heading-family, -1% LS"],
                  ["Текст карточки",      "Roboto 400, 16px, 1.28 LH",        "#939393 default, #0A0A0A active"],
                  ["Лесенка offset",      "88px на шаг",                       "translateY, 500ms ease-out"],
                  ["Размер карточки",     "flex-1 × 240px (desktop)",          "350px × 240px (mobile)"],
                  ["Лейбл",              "Loos Condensed 500, 18px, UPPER",   "--font-mono-family, #FFCC00"],
                  ["Mobile carousel",     "grid-rows-2, gap-2, overflow-x",   "Горизонтальный скролл 2×N"],
                ].map(([prop, val, desc]) => (
                  <tr key={prop} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{prop}</td>
                    <td className="px-4 py-2"><TokenChip>{val}</TokenChip></td>
                    <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        {/* ── Process — Прозрачный процесс ── */}
        <SubSection id="marketing-blocks-process" title="Прозрачный процесс (этапы)" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Блок с этапами работы. Левая колонка sticky на desktop, правая — шаги с таймлайном. Шаги подсвечиваются при скролле через <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]">IntersectionObserver</code>. Опциональный блок участников внизу.
        </p>
        <div className="-mx-5 md:-mx-10 border-y border-border mb-8">
          <ProcessSection
            tag="этапы"
            title="Прозрачный процесс"
            subtitle="Общий срок проекта: ~10 недель"
            description="Бизнес-дизайн сессии проходят очно или онлайн 1 раз в неделю."
            steps={[
              { number: "01", title: "Образовательный практикум", text: "Погружение команды в методологию", duration: "1 неделя" },
              { number: "02", title: "Сессии бизнес-дизайна", text: "Аудит текущего состояния и поиск точек роста", duration: "6 недель" },
              { number: "03", title: "Разработка стратегии", text: "Проектирование связей и партнерств", duration: "2 недели" },
              { number: "04", title: "Завершение и поддержка", text: "Выбираем подходящую бизнес-модель", duration: "1 неделя" },
            ]}
            participantsTag="кого важно включить в процесс"
            participants={[
              { role: "Руководство", text: "Принимает стратегические решения и задаёт вектор развития" },
              { role: "Топ-менеджеры", text: "Согласовывают и внедряют экосистемные инициативы" },
              { role: "Лидеры направлений", text: "Отвечают за интеграцию новых решений" },
            ]}
          />
        </div>

        {/* ── Experts — Эксперты ── */}
        <SubSection id="marketing-blocks-experts" title="Эксперты продукта" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Опциональный блок с карточками экспертов. Десктоп: 2 карточки в ряд (горизонтальная раскладка: фото + текст). Если нечётное количество — пустой слот заполняется декоративным SVG-паттерном. Планшет: карточки в столбик на полную ширину. Мобайл: вертикальная раскладка (фото сверху).
        </p>
        <div className="-mx-5 md:-mx-10 border-y border-border mb-8">
          <ExpertsSection
            experts={[
              { name: "Ирина Гуренкова", bio: "Экосистемная стратегия — это переход к новой архитектуре устойчивости и роста бизнеса. Вместо того чтобы развивать один продукт изолированно, мы помогаем выстроить вокруг него единую партнерскую сеть.", image: "" },
            ]}
          />
        </div>

        {/* ── Partnership — Партнёрства ── */}
        <SubSection id="marketing-blocks-partnership" title="Партнёрства" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Блок партнёрств с бизнес-школами и организациями. Слева: жёлтый лейбл, заголовок, описание, логотипы партнёров. Справа: сетка 2×2 фотографий. Контент управляется через общий файл — синхронизируется между каталогом продуктов и страницами курсов.
        </p>
        <div className="-mx-5 md:-mx-10 border-y border-border py-10 px-5 md:px-10 mb-8">
          <PartnershipBlock
            caption="Партнёрства"
            title="Программы с ведущими бизнес-школами"
            description="Помогают собрать карту участников, связей и ценностных потоков помогают собрать карту участников, связей и ценностных потоков"
            logos={[
              { src: "/images/partnerships/sberuniver.svg", alt: "СберУниверситет" },
              { src: "/images/partnerships/skolkovo-moscow-school-160103.png", alt: "Сколково" },
            ]}
            photos={[
              { src: "/images/partnerships/photo-1.png" },
              { src: "/images/partnerships/photo-4.png" },
              { src: "/images/partnerships/photo-3.png" },
              { src: "/images/partnerships/photo-2.png" },
            ]}
          />
        </div>
        <SpecBlock title="Токены">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Свойство</th>
                  <th className="text-left px-4 py-2 font-medium">Значение</th>
                  <th className="text-left px-4 py-2 font-medium">Описание</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Лейбл",            "--font-mono-family, 18px, uppercase",  "--rm-yellow-100"],
                  ["Заголовок",        "--font-heading-family, 52/36/28px",    "Bold, uppercase, -2% LS"],
                  ["Описание",         "14px, 1.32 LH",                        "text-muted-foreground"],
                  ["Логотипы",         "max-h-[56px], max-w-[45%]",            "object-contain, gap-8"],
                  ["Фото-сетка",       "2×2 grid, gap-4, 696px desktop",       "aspect-[340/252], object-cover"],
                  ["Layout",           "flex col → lg:row, gap-10",            "Текст слева max-w-560px"],
                ].map(([prop, val, desc]) => (
                  <tr key={prop} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{prop}</td>
                    <td className="px-4 py-2"><TokenChip>{val}</TokenChip></td>
                    <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        {/* ── PageBottom — Состав ── */}
        <SubSection id="marketing-blocks-page-bottom" title="Состав PageBottom" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Компонент-обёртка <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]">PageBottom</code> объединяет три самостоятельных блока в стандартную последовательность конца страницы.
          Добавляется на всех страницах сайта, кроме <strong className="text-foreground">/cases</strong> и <strong className="text-foreground">/media</strong>.
        </p>
        <div className="-mx-5 md:-mx-10 border-y border-border py-6 px-5 md:px-10 mb-8">
          <div className="flex flex-col gap-1 text-[length:var(--text-14)]">
            <div className="flex items-center gap-3 py-2 border-b border-border">
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground w-6">1</span>
              <span className="font-medium text-foreground">CasesSection</span>
              <span className="text-muted-foreground">— авто-ротация кейсов (15 с), отзывы, бегущая строка логотипов партнёров</span>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-border">
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground w-6">2</span>
              <span className="font-medium text-foreground">CTASection</span>
              <span className="text-muted-foreground">— тёмный CTA с жёлтой кнопкой и декоративным кругом</span>
            </div>
            <div className="flex items-center gap-3 py-2">
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground w-6">3</span>
              <span className="font-medium text-foreground">Footer</span>
              <span className="text-muted-foreground">— футер сайта</span>
            </div>
          </div>
        </div>
        <SpecBlock title="Использование">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Страница</th>
                  <th className="text-left px-4 py-2 font-medium">PageBottom</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["/ (главная)",                        "✓"],
                  ["/consulting, /academy, /ai-products", "✓"],
                  ["/about",                             "✓"],
                  ["/consulting/* (все подстраницы)",    "✓ — через ServicePageTemplate"],
                  ["/academy/* (все подстраницы)",       "✓ — через ServicePageTemplate"],
                  ["/ai-products/* (все подстраницы)",   "✓ — через ServicePageTemplate"],
                  ["/cases, /cases/[slug]",              "✗ — страница кейсов"],
                  ["/media, /media/[slug]",              "✗ — медиа-страницы"],
                  ["/legal/*",                           "✗ — юридические страницы"],
                ].map(([page, status]) => (
                  <tr key={page} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">
                      <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded">{page}</code>
                    </td>
                    <td className={`px-4 py-2 ${status.startsWith("✓") ? "text-foreground" : "text-muted-foreground/50"}`}>
                      {status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

      </Section>

      <Separator />
    </>
  )
}
