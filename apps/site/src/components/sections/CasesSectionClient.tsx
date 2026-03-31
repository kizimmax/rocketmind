"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { InfiniteLogoMarquee, Slider } from "@rocketmind/ui";
import type { PartnerLogo } from "@/lib/partner-logos";

// ─────────────────────────────────────────────────────────────────────────────
// Data — sourced from /docs/page_old_site/cases/
// ─────────────────────────────────────────────────────────────────────────────

const CASE_DURATION_MS = 15_000;
const FADE_MS = 280;

/** Replace spaces after ≤2-letter words with non-breaking spaces (prevents typographic widows). */
function nb(text: string): string {
  const apply = (t: string) =>
    t.replace(/(^|[ \t\u00A0])([а-яёА-ЯЁa-zA-Z]{1,2}) (?=\S)/gm, "$1$2\u00A0");
  return apply(apply(apply(text)));
}

type CaseStat = {
  value: string;
  label: string;
  description: string;
};

type Case = {
  title: string;
  description: string;
  stats: [CaseStat, CaseStat, CaseStat];
  result: string;
};

const CASES: Case[] = [
  // ── 1. Product portfolio — File (2) ──────────────────────────────────────
  {
    title: "Развитие портфеля продуктов для новых рынков крупного промышленного предприятия",
    description:
      "Провели стратегические сессии с применением канвасов, сформировали более 20 бизнес-инициатив и разработали предварительные бизнес-модели. Помогли команде перейти от продуктовой логики к клиентоцентричному мышлению.",
    stats: [
      {
        value: "50",
        label: "участников\nпроекта",
        description:
          "Специалисты из четырёх регионов работали в единой методологии — сессии велись на двух языках одновременно",
      },
      {
        value: "4",
        label: "региона\nмира",
        description:
          "Объединили команды для совместной выработки стратегии и переосмысления продуктового портфеля компании",
      },
      {
        value: "20+",
        label: "бизнес-\nинициатив",
        description:
          "Сгенерировали гипотезы с бизнес-моделями, оценили потенциал и риски для каждого из направлений роста",
      },
    ],
    result:
      "Команда освоила клиентоцентричный подход и получила рабочую методологию для оценки новых продуктовых идей.",
  },

  // ── 2. Ecosystem strategy for developer — File (4) ────────────────────────
  {
    title: "Разработка экосистемной стратегии и дорожной карты для девелопера полного цикла",
    description:
      "Собрали и проанализировали данные, заполнили фреймворки, сформировали портфель бизнес-инициатив и разработали дорожную карту трансформации. Клиент получил понимание экосистемного подхода и активно его применяет.",
    stats: [
      {
        value: "30+",
        label: "глубинных\nинтервью",
        description:
          "Изучили потребности клиентов на всех этапах: от выбора объекта до проживания, выявили ключевые зоны роста",
      },
      {
        value: "12",
        label: "конкурентов\nизучено",
        description:
          "Проанализировали конкурентный ландшафт и выявили белые пятна рынка для уникального позиционирования",
      },
      {
        value: "500+",
        label: "источников\nинформации",
        description:
          "Провели масштабное исследование трендов рынка недвижимости и экосистемных моделей в смежных отраслях",
      },
    ],
    result:
      "Создан отдел экосистемных сервисов, внедрена цифровая автоматизация приёмки квартир. Дорожная карта до 2027 года.",
  },

  // ── 3. HR products for oil company — File (6) ────────────────────────────
  {
    title: "Диагностика и оптимизация линейки HR-продуктов для крупной топливной компании",
    description:
      "Провели глубокий анализ и стратегические сессии с 40+ сотрудниками, выявили узкие места, разработали интегрированные решения для повышения эффективности HR-продуктов и заложили основу для роста подразделений.",
    stats: [
      {
        value: "40+",
        label: "участников\nсессий",
        description:
          "Провели интервью и групповые сессии с представителями четырёх ключевых HR-подразделений компании",
      },
      {
        value: "30+",
        label: "внутренних\nпродуктов",
        description:
          "Проанализировали портфель HR-инструментов, выявили дублирование функций и незакрытые потребности сотрудников",
      },
      {
        value: "2",
        label: "этапа\nпроекта",
        description:
          "Провели диагностику и разработку решений последовательно — каждый этап строился на результатах предыдущего",
      },
    ],
    result:
      "Компания получила единую систему управления HR-продуктами с чётким планом интеграции и метриками вовлечённости.",
  },

  // ── 4. Bank CX analysis — File (22) ──────────────────────────────────────
  {
    title: "Диагностика клиентского пути и снижение барьеров обслуживания в крупном банке",
    description:
      "Разработали 10 карт клиентского пути, охватив ключевые сценарии взаимодействия с банком. Провели масштабный опрос клиентов, собрали данные и выявили барьеры на критических точках контакта клиента.",
    stats: [
      {
        value: "10",
        label: "карт\nклиентского пути",
        description:
          "Описали опыт клиента на критических этапах — от первого контакта до получения банковской услуги",
      },
      {
        value: "500+",
        label: "опросов\nклиентов",
        description:
          "Собрали данные для значимых выводов о причинах отказа и падения клиентской лояльности в ключевых сегментах",
      },
      {
        value: "15",
        label: "ключевых\nбарьеров",
        description:
          "Ранжировали проблемные зоны по влиянию на конверсию и определили приоритеты для устранения барьеров",
      },
    ],
    result:
      "Банк получил детальный отчёт с приоритизированными рекомендациями по повышению конверсии и снижению оттока.",
  },

  // ── 5. Product design for exporters — File (25) ───────────────────────────
  {
    title: "Бизнес-дизайн продуктовой стратегии для компании в сфере поддержки экспорта",
    description:
      "Провели 50 проблемных интервью с экспортёрами разных отраслей, выявили ключевые сегменты и их потребности, разработали карты клиентского пути и 8 продуктовых гипотез. Обучили сотрудников методам бизнес-дизайна.",
    stats: [
      {
        value: "50",
        label: "проблемных\nинтервью",
        description:
          "Выявили реальные барьеры и потребности экспортёров, сформировали систему приоритетных клиентских сегментов",
      },
      {
        value: "8",
        label: "продуктовых\nгипотез",
        description:
          "Структурировали гипотезы для тестирования, каждая подкреплена данными интервью и картами клиентского пути",
      },
      {
        value: "3+",
        label: "карты пути\nклиента",
        description:
          "Визуализировали ключевые сценарии, выявив точки, которые тормозят конверсию и снижают клиентскую лояльность",
      },
    ],
    result:
      "Сотрудники освоили методологию бизнес-дизайна. Компания запустила тестирование приоритетных продуктовых гипотез.",
  },
];

type Testimonial = {
  text: string;
  name: string;
  position: string;
  avatar: string;
};

const BASE_PATH = process.env.NODE_ENV === "production" ? "/rocketmind" : "";

// Avatars stored locally in public/avatars/ to avoid external URL failures on mobile
const TESTIMONIALS: Testimonial[] = [
  {
    text: "Благодарим команду за проведение стратегической сессии юридического блока.\n\nОтдельное спасибо Алексею лично за технологичный подход, высокий уровень организации и личную вовлечённость на всех этапах подготовки и проведения мероприятия.\n\nОчень понравилось, как вы помогли выстроить цели сессии и маршрут работы команд через канвасы, а также тщательная предварительная проработка и инструментарий. Сессия прошла на драйве, в современной и лёгкой манере. Мы особенно ценим вашу гибкость, командную работу и клиентоориентированность — умение слышать запросы, предлагать идеи и направлять процесс так, чтобы решить задачи клиента.\n\nОчень признательны за аналитику, выполненную вашей командой в сжатые сроки. По итогам опроса после сессии коллеги дали очень высокие оценки.",
    name: "Ольга В.",
    position: "Руководитель юридического блока",
    avatar: `${BASE_PATH}/avatars/women-8.jpg`,
  },
  {
    text: "Перед нами стояла задача пересмотреть продуктовый портфель и найти новые идеи по каждому из ключевых направлений деятельности компании.\n\nПрименение подхода Rocketmind позволило получить более 20 новых гипотез для тестирования, запустило творческое мышление, но при этом помогло команде мыслить очень системно, оценивать риски и объективно подходить к выбору финальных идей.\n\nФормат такой работы позволяет создать максимальный эффект вовлечённости и синергии в работе команды — а это база для мотивации и дальше тестировать и внедрять идеи в жизнь.",
    name: "Елена У.",
    position: "Руководитель образовательного направления",
    avatar: `${BASE_PATH}/avatars/pravatar-5.jpg`,
  },
  {
    text: "С первой минуты общения ощущался профессионализм и ответственность команды Rocketmind. Мы быстро нашли общий язык, обозначили цели сотрудничества и критерии успеха, сформировали чёткий план и двигались по нему.\n\nОсобенно ценной была методология работы — визуальные инструменты, канвасы и фреймворки. Они позволили легко структурировать идеи, фиксировать решения и возвращаться к ним для рефлексии.\n\nИтогом стала проработанная экосистемная стратегия — инструмент, который мы продолжаем использовать. Мы регулярно к нему возвращаемся, дорабатываем, адаптируем под изменения рынка. Это фундамент, который останется с нами надолго.",
    name: "Дарья К.",
    position: "Директор экосистемы сервисов",
    avatar: `${BASE_PATH}/avatars/pravatar-9.jpg`,
  },
  {
    text: "От своего лица и от лица компании хочу выразить глубокую благодарность и признательность команде Rocketmind за подготовку и проведение стратегической сессии сегмента «Коммерческий транспорт».\n\nХочу отметить высокий профессионализм, дружелюбную и вовлекающую манеру взаимодействия.\n\nМы сделали огромный шаг в понимании нашего текущего статуса и следующих шагов в нашей работе. Спасибо.",
    name: "Игорь М.",
    position: "Руководитель направления коммерческого транспорта",
    avatar: `${BASE_PATH}/avatars/pravatar-52.jpg`,
  },
  {
    text: "Мы стремимся к осмысленному управлению продуктовой разработкой, созданию ценности для клиентов с учётом рыночного и организационного контекста. Подобный бизнес-практикум мы провели впервые в дирекции региональных продаж и пригласили руководителей подразделений, проектов и продуктов, чтобы они могли апробировать свои текущие или новые идеи, осмыслить их.\n\nЭто помогло коллегам проверить свои инициативы и гипотезы перед запуском, уточнить саму идею, вовлечь стейкхолдеров, получить финансирование и поддержку.",
    name: "Виктория Н.",
    position: "Директор направления",
    avatar: `${BASE_PATH}/avatars/women-26.jpg`,
  },
  {
    text: "Благодарю команду практикума за помощь в разработке цифрового паспорта для ПИК. Это помогло ускорить и выпустить прототип в сентябре 2023 года вместо планового 2 квартала 2024 года.\n\nМы сформировали паспорта для 456 тысяч контрагентов, создав полезный инструмент с обширной информацией и поддержкой. Также практикум способствовал сплочению распределенной аналитической команды. Спасибо за ваш вклад.",
    name: "Елена М.",
    position: "Директор отдела оргразвития",
    avatar: `${BASE_PATH}/avatars/pravatar-20.jpg`,
  },
  {
    text: "Команда проявила высокую подготовленность и вовлечённость. Полученные знания по бизнес-дизайну необходимо сохранить и распространить среди команды для освоения инструментария и принятия обоснованных решений. Важно совмещать текущие задачи со стратегическим планированием для достижения значимых результатов.\n\nСозданные гипотезы, идеи продуктов и бизнес-моделей станут основой для принятия решений, направленных на реализацию как амбициозных, так и простых проектов. Работа только начата, и текущие результаты являются шагом к финальным решениям.",
    name: "Сергей Б.",
    position: "Руководитель стратегического развития",
    avatar: `${BASE_PATH}/avatars/pravatar-54.jpg`,
  },
  {
    text: "Библиотеки адаптируются к современным требованиям, стремясь стать привлекательнее для читателей и улучшить сервис. Изменения требуют понимания миссии, стратегии, а также знания целей читателей и партнёров.\n\nСовместно с Rocketmind было проведено исследование, которое помогло определить и понять разные группы пользователей и их задачи, что ляжет в основу будущей стратегии библиотеки.",
    name: "Вадим Д.",
    position: "Генеральный директор",
    avatar: `${BASE_PATH}/avatars/pravatar-57.jpg`,
  },
  {
    text: "Rocketmind — это мета-агентство, то есть сеть из агентств и отдельных спецов. Когда вы обращаетесь в одну компанию, вы получаете её знания и опыт. Когда вы обращаетесь в Rocketmind, вы получаете в принципе все знания и опыт, которые есть в России и не только.\n\nБлагодаря такой структуре можно решать то, что кажется нерешаемым — например, за 4 месяца выстроить коммуникации в компании, которая не могла сделать это 10 лет.",
    name: "Максим И.",
    position: "Генеральный директор",
    avatar: `${BASE_PATH}/avatars/pravatar-59.jpg`,
  },
  {
    text: "Бизнес-дизайн кажется мне одной из самых перспективных методологий среди всех появившихся на русскоязычном пространстве в последние несколько лет. Он даёт набор инструментов для комплексной работы над продуктом — от выявления разных клиентских групп до проектирования многоуровневых платформ или даже экосистем.\n\nУчитывая перспективность и популярность платформ в современной цифровой экономике, на методологию бизнес-дизайна и инструменты Platform Innovation Kit определённо стоит обратить внимание.",
    name: "Алексей М.",
    position: "Директор по развитию экспорта",
    avatar: `${BASE_PATH}/avatars/men-22.jpg`,
  },
  {
    text: "Образовательные мероприятия по бизнес-дизайну, которые проводит сеть Rocketmind и лично Алексей, совмещают и широкий теоретический контекст, и исключительно практичные, полезные и понятные инструменты. Так участники видят картину в целом, могут посмотреть на свой бизнес с нового ракурса, но при этом чётко понимают, какие шаги предпринять, как исследовать задачи клиентов, как сформулировать и проверить бизнес-гипотезу.\n\nХорошо структурированная информация, хорошее соотношение теории и практики, достаточно оригинальный, но при этом аргументированный и обоснованный подход.",
    name: "Людмила Д.",
    position: "IT-директор",
    avatar: `${BASE_PATH}/avatars/pravatar-25.jpg`,
  },
  {
    text: "Новые методы организации работы, укрепление продуктового подхода и управляемые инновации — то, на чём мы больше всего фокусируемся сейчас. Знания о бизнес-моделях и бизнес-дизайне очень полезны в контексте наших задач.\n\nОтдельную пользу принесли практические блоки — все канвасы разобрали на примерах и попробовали в работе. Здорово, что этот подход можно применить во всех наших цифровых продуктах.",
    name: "Владимир И.",
    position: "Бренд-менеджер",
    avatar: `${BASE_PATH}/avatars/men-36.jpg`,
  },
  {
    text: "Я много лет занимаюсь гибкими методиками разработки, обучаю команды agile-подходу, помогаю адаптировать scrum и другие фреймворки. Это очень мощные инструменты. Но должен отметить, что намного большего успеха можно достичь, если умело совмещать их с методиками бизнес-дизайна.\n\nИменно бизнес-дизайн помогает сформулировать гипотезы будущего продукта или услуги, выявить ценностное предложение, спроектировать бизнес-модель и приступить к её тестированию и улучшению.",
    name: "Сергей Д.",
    position: "Agile-коуч, основатель",
    avatar: `${BASE_PATH}/avatars/pravatar-65.jpg`,
  },
  {
    text: "Благодарим за выступление на очном модуле!\n\nСлушатели высоко оценили ваше выступление: CSI 9,7; NPS 100% (!) Огромная благодарность и будем ждать на вебинаре.\n\nВеликолепная подача материала, который можно применить в работе. Интересные инструменты о платформах. Структурированные данные по экосистемам. Самый насыщенный курс по теме.",
    name: "Ирина С.",
    position: "Куратор образовательных программ",
    avatar: `${BASE_PATH}/avatars/pravatar-32.jpg`,
  },
  {
    text: "Многие стартапы и компании не понимают, что такое бизнес-модель и как её улучшать. В прошлом не было нужды в постоянной итерации над продуктом и поиске новых решений, но сегодня это критично.\n\nБизнес-дизайн позволяет видеть общую картину, определять взаимосвязи между элементами бизнеса и способствует эффективному взаимодействию команды для достижения целей.",
    name: "Александр П.",
    position: "Digital UX-директор",
    avatar: `${BASE_PATH}/avatars/pravatar-56.jpg`,
  },
  {
    text: "Хочу сказать большое спасибо за ваше участие в наших проектах в 2024 году! Вы настоящий профессионал и эксперт — работать с вами приятно и легко. Ваше участие в программе — залог качественного контента для слушателей. Каждая встреча с вами давала мощный заряд мотивации и бесценные знания нашим участникам.",
    name: "Ксения Л.",
    position: "Директор программы",
    avatar: `${BASE_PATH}/avatars/women-44.jpg`,
  },
  {
    text: "Спасибо большое! Всем участникам очень понравилась ваша лекция: чёткий и понятный материал и сама возможность общения с вами, как с человеком, который имеет обширный опыт в этой сфере.\n\nИз отзывов слушателей: «Это первая лекция, которая сложила для меня чёткую картину экосистемного подхода, впервые вижу такое глубокое понимание вопроса».",
    name: "Павел Ж.",
    position: "Организатор программы",
    avatar: `${BASE_PATH}/avatars/pravatar-60.jpg`,
  },
  {
    text: "Благодарю Алексея за индивидуальную консультацию по платформам. Он внимательно выслушал рассказ о проекте, задал точные вопросы и дал ёмкую обратную связь.\n\nМне было интересно знать мнение профи — тот ли я выбираю формат для проекта и какие есть пути для дальнейшего развития на следующих этапах.\n\nПолучила ощущение полного взаимопонимания и поддержки, что очень требовалось сейчас. Спасибо!",
    name: "Анастасия Р.",
    position: "Предприниматель",
    avatar: `${BASE_PATH}/avatars/pravatar-35.jpg`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Auto-scroll speed in px/frame at ~60 fps */
const SCROLL_SPEED = 0.5;

function TestimonialsColumn({
  scrollWindowRef,
}: {
  scrollWindowRef: React.RefObject<HTMLDivElement | null>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const scrollY = useRef(0);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragScrollStart = useRef(0);
  const lastTime = useRef(0);
  // Momentum / inertia
  const velocity = useRef(0);
  const lastPointerY = useRef(0);
  const lastPointerTime = useRef(0);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const FRICTION = 0.95;

  // Auto-scroll loop with seamless wrap + momentum
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const tick = (time: number) => {
      const dt = lastTime.current ? (time - lastTime.current) / 16.67 : 1;

      if (!isDragging.current) {
        // Apply momentum if still decelerating
        if (Math.abs(velocity.current) > 0.1) {
          scrollY.current += velocity.current * dt;
          velocity.current *= FRICTION;
        } else {
          // Momentum spent — resume auto-scroll
          velocity.current = 0;
          scrollY.current += SCROLL_SPEED * dt;
        }

        // Seamless loop
        const halfHeight = track.scrollHeight / 2;
        if (halfHeight > 0) {
          scrollY.current = ((scrollY.current % halfHeight) + halfHeight) % halfHeight;
        }
      }

      lastTime.current = time;
      track.style.transform = `translateY(${-scrollY.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Mouse / touch handlers for press-and-drag with momentum
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    velocity.current = 0;
    dragStartY.current = e.clientY;
    dragScrollStart.current = scrollY.current;
    lastPointerY.current = e.clientY;
    lastPointerTime.current = performance.now();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;

    const now = performance.now();
    const dtMs = now - lastPointerTime.current;
    if (dtMs > 0) {
      velocity.current = (lastPointerY.current - e.clientY) / dtMs * 16.67;
    }
    lastPointerY.current = e.clientY;
    lastPointerTime.current = now;

    const delta = dragStartY.current - e.clientY;
    const track = trackRef.current;
    let next = dragScrollStart.current + delta;

    // Wrap within bounds
    if (track) {
      const halfHeight = track.scrollHeight / 2;
      if (halfHeight > 0) {
        next = ((next % halfHeight) + halfHeight) % halfHeight;
      }
    }
    scrollY.current = next;
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    // velocity is already set from last pointer move — momentum will take over in tick()
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full lg:w-[320px]">
      <span className="flex-none font-['Loos_Condensed',sans-serif] text-[16px] md:text-[18px] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[#FFCC00]">
        Отзывы
      </span>

      {/* Clipping window — height set by ResizeObserver in parent (matches cases column). */}
      <div
        ref={scrollWindowRef}
        className={`relative overflow-hidden min-h-[300px] ${!isMobile ? "cursor-grab active:cursor-grabbing select-none touch-none" : ""}`}
        style={{
          maskImage:
            "linear-gradient(180deg, transparent 0px, #000 64px, #000 calc(100% - 64px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0px, #000 64px, #000 calc(100% - 64px), transparent 100%)",
        }}
        onPointerDown={isMobile ? undefined : handlePointerDown}
        onPointerMove={isMobile ? undefined : handlePointerMove}
        onPointerUp={isMobile ? undefined : handlePointerUp}
        onPointerCancel={isMobile ? undefined : handlePointerUp}
      >
        {/* Double the list for a seamless vertical loop */}
        <div ref={trackRef} className="will-change-transform">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <div key={i}>
              {/* Author card — at top so it's always visible as item enters the window */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex-none w-8 h-8 rounded-full bg-[#2a2a2a] bg-cover bg-center"
                  style={{ backgroundImage: `url(${t.avatar})` }}
                />
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-[#F0F0F0] leading-[1.2]">
                    {t.name}
                  </span>
                  <span className="text-[12px] text-[#6B6B6B] leading-[1.2]">
                    {t.position}
                  </span>
                </div>
              </div>
              <div className="text-[14px] leading-[1.4] tracking-[0.01em] text-[#939393]">
                {t.text.split("\n\n").map((para, pi) => (
                  <p key={pi} className={pi > 0 ? "mt-2" : ""}>
                    {nb(para.replace(/\n/g, " "))}
                  </p>
                ))}
              </div>
              {i < TESTIMONIALS.length * 2 - 1 && (
                <div className="h-px bg-[#404040] my-5" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function CaseNavigator({
  activeCase,
  onSelect,
}: {
  activeCase: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      {CASES.map((_, i) => (
        <React.Fragment key={i}>
          <button
            onClick={() => onSelect(i)}
            aria-label={`Кейс ${i + 1}`}
            className={[
              "font-['Loos_Condensed',sans-serif] text-[16px] font-medium uppercase tracking-[0.02em] leading-[1.16] transition-colors cursor-pointer",
              i === activeCase
                ? "text-[#F0F0F0]"
                : "text-[#939393] hover:text-[#F0F0F0]",
            ].join(" ")}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
          {i === activeCase && (
            <Slider animate animateKey={activeCase} animationDuration={CASE_DURATION_MS} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

/** Stagger delays for each content block (title, desc, stats, result) */
const STAGGER_MS = 60;
const SLIDE_PX = 40;

/** Returns inline style for a staggered slide animation block.
 *  @param phase  "out" = exiting, "in" = entering, null = idle
 *  @param dir    1 = forward (slide left), -1 = backward (slide right)
 *  @param index  stagger order (0 = title, 1 = desc, 2 = stats, 3 = result)
 */
function staggerStyle(
  phase: "out" | "in" | null,
  dir: number,
  index: number,
): React.CSSProperties {
  if (phase === null) {
    return {
      opacity: 1,
      transform: "translateX(0)",
      transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
    };
  }
  const delay = index * STAGGER_MS;
  if (phase === "out") {
    return {
      opacity: 0,
      transform: `translateX(${-dir * SLIDE_PX}px)`,
      transition: `opacity ${FADE_MS}ms ease ${delay}ms, transform ${FADE_MS}ms ease ${delay}ms`,
    };
  }
  // phase === "in"
  return {
    opacity: 1,
    transform: "translateX(0)",
    transition: `opacity ${FADE_MS}ms ease ${delay}ms, transform ${FADE_MS}ms ease ${delay}ms`,
  };
}

export function CasesSectionClient({ logos }: { logos: PartnerLogo[] }) {
  /**
   * activeCase  — drives the progress bar & 15 s timer (updates immediately)
   * displayCase — drives the visible content (updates after fade-out)
   * phase       — "out" while exiting, "in" while entering, null when idle
   * direction   — 1 = forward (slide left), -1 = backward (slide right)
   */
  const [activeCase, setActiveCase] = useState(0);
  const [displayCase, setDisplayCase] = useState(0);
  const [phase, setPhase] = useState<"out" | "in" | null>(null);
  const [direction, setDirection] = useState(1);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const casesColumnRef = useRef<HTMLDivElement>(null);
  const scrollWindowRef = useRef<HTMLDivElement>(null);

  const switchToCase = useCallback((i: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);

    setDirection(
      i > displayCase || (i === 0 && displayCase === CASES.length - 1) ? 1 : -1,
    );
    setPhase("out");
    setActiveCase(i);

    // After exit animation, swap content and start enter
    fadeTimerRef.current = setTimeout(() => {
      setDisplayCase(i);
      setPhase("in");
      // After enter animation completes, go idle
      fadeTimerRef.current = setTimeout(() => {
        setPhase(null);
      }, FADE_MS + STAGGER_MS * 4);
    }, FADE_MS + STAGGER_MS * 3);
  }, [displayCase]);

  // Restart 15 s auto-advance whenever activeCase changes
  useEffect(() => {
    timerRef.current = setTimeout(
      () => switchToCase((activeCase + 1) % CASES.length),
      CASE_DURATION_MS,
    );
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activeCase, switchToCase]);

  // Cleanup fade timer on unmount
  useEffect(() => {
    return () => { if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current); };
  }, []);

  // Sync testimonials scroll-window height to cases column height (lg+ only)
  useEffect(() => {
    const casesEl = casesColumnRef.current;
    const scrollEl = scrollWindowRef.current;
    if (!casesEl || !scrollEl) return;

    const update = () => {
      if (window.innerWidth >= 1024) {
        // Subtract label height + gap (≈37px) so total testimonials column = cases column
        const labelOffset = scrollEl.offsetTop - (scrollEl.parentElement?.offsetTop ?? 0);
        scrollEl.style.height = `${casesEl.offsetHeight - labelOffset}px`;
      } else {
        scrollEl.style.height = "380px";
      }
    };

    const ro = new ResizeObserver(update);
    ro.observe(casesEl);
    window.addEventListener("resize", update);
    update();

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const current = CASES[displayCase];

  return (
    <section className="dark bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1512px] px-5 md:px-8 xl:px-14">

        {/* ── Top rule ── */}
        <div className="h-px bg-[#404040]" />

        {/* ══════════════════════════════════════════════════════════════
         *  Two-column layout
         *  xl+: testimonials LEFT 320 px  |  cases RIGHT flex-1
         *  <xl:  cases on top, testimonials below
         * ══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row lg:gap-8 pt-10 lg:pt-12 pb-10 lg:pb-12 lg:items-start">

          {/* ── LEFT / BOTTOM: Testimonials ─────────────────────────── */}
          <div className="order-2 lg:order-1 lg:w-[320px] lg:flex-none lg:overflow-hidden lg:self-stretch">
            <TestimonialsColumn scrollWindowRef={scrollWindowRef} />
          </div>

          {/* ── RIGHT / TOP: Cases ──────────────────────────────────── */}
          <div ref={casesColumnRef} className="flex-1 flex flex-col order-1 lg:order-2 mb-10 lg:mb-0">

            {/* Label + mobile slider row */}
            <div className="flex items-center justify-between gap-2.5 mb-4">
              <span className="font-['Loos_Condensed',sans-serif] text-[16px] md:text-[18px] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[#FFCC00]">
                кейсы
              </span>
              <div className="block lg:hidden">
                <CaseNavigator activeCase={activeCase} onSelect={switchToCase} />
              </div>
            </div>

            {/* Staggered slide content: title, description, stats, result */}
            <div className="flex flex-col gap-5 lg:gap-11">
              {/* Title + Description */}
              <div className="flex flex-col gap-2 lg:gap-5">
                <div className="flex flex-col gap-2 overflow-hidden">
                  <h2
                    className="font-heading text-[24px] md:text-[36px] xl:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0] min-h-[78px] md:min-h-[117px] xl:min-h-[168px]"
                    style={staggerStyle(phase, direction, 0)}
                  >
                    {nb(current.title)}
                  </h2>
                </div>
                <div className="overflow-hidden">
                  <p
                    className="text-[16px] xl:text-[18px] leading-[1.32] text-[#939393] 2xl:pr-[200px] xl:min-h-[72px]"
                    style={staggerStyle(phase, direction, 1)}
                  >
                    {nb(current.description)}
                  </p>
                </div>
              </div>

              {/* Stats — bordered box */}
              <div className="overflow-hidden">
                <div
                  className="border border-[#404040] p-5 sm:p-6 xl:p-8"
                  style={staggerStyle(phase, direction, 2)}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    {current.stats.map((stat, i) => (
                      <div key={i} className="flex flex-col gap-1 sm:gap-5 xl:justify-between">
                        <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-start sm:gap-1 xl:flex-row xl:items-center xl:gap-3">
                          <div className="font-heading text-[52px] sm:text-[40px] xl:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0] flex-none">
                            {stat.value}
                          </div>
                          <div className="font-['Loos_Condensed',sans-serif] text-[18px] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[#F0F0F0] whitespace-pre-wrap">
                            {stat.label}
                          </div>
                        </div>
                        <p className="text-[12px] sm:text-[14px] leading-[1.4] tracking-[0.01em] text-[#939393]">
                          {nb(stat.description)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom row: result + desktop navigator */}
            <div className="mt-5 lg:mt-11 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-[80px]">
              <div className="md:flex-1 overflow-hidden">
                <p
                  className="font-['Loos_Condensed',sans-serif] text-[16px] font-medium uppercase tracking-[0.04em] leading-[1.16] text-[#F0F0F0]"
                  style={staggerStyle(phase, direction, 3)}
                >
                  {nb(current.result)}
                </p>
              </div>
              <div className="hidden lg:block">
                <CaseNavigator activeCase={activeCase} onSelect={switchToCase} />
              </div>
            </div>

          </div>
        </div>

        {/* ── Rule above logo stripe ── */}
        <div className="h-px bg-[#404040]" />

        {/* ── Logo marquee ── */}
        <div className="py-8 opacity-55">
          <InfiniteLogoMarquee logos={logos} reverse />
        </div>

        {/* ── Rule below logo stripe ── */}
        <div className="h-px bg-[#404040]" />

      </div>
    </section>
  );
}
