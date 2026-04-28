---
slug: evalyuatsiya-ai-agentov-v-produkcii
status: published
order: 10
title: Оценка AI-агентов в продакшене — за пределами accuracy
description: >-
  Почему классические метрики ломаются на LLM-пайплайнах и какой набор
  показателей мы используем в проде вместо них.
publishedAt: '2026-03-12'
expertSlug: alexey-eremin
tags:
  - ai-products
  - expert
  - strategy
keyThoughts:
  - 'Accuracy — плохая опора, когда задача допускает несколько правильных ответов'
  - Offline-eval без прод-трафика превращается в self-fulfilling prophecy
  - 'Главная метрика AI-агента — вовсе не качество, а стоимость ошибки'
body:
  - id: s_test_ai_eval_1
    title: ''
    navLabel: ''
    blocks:
      - id: b_ai_eval_1_1
        type: paragraph
        data:
          text: >-
            В классическом ML мы привыкли сводить качество модели к одному
            числу. В продуктовых LLM-агентах это число почти всегда врёт —
            слишком много ответов формально правильные, но бесполезные для
            пользователя. лвдыоа 
      - id: b_moh5rvth_pglyq
        type: paragraph
        data:
          text: выа двылоалд выо
      - id: b_moh5rwh5_le7gu
        type: paragraph
        data:
          text: выа двфыоа лдыфво аы
      - id: b_moh5rx59_eaw2q
        type: paragraph
        data:
          text: в авыфлаор выфола выа ывалд в
      - id: b_moh5s27s_zuazg
        type: image
        data:
          src: ''
          caption: ''
      - id: b_moh5rxs3_ubldt
        type: paragraph
        data:
          text: ыва з
      - id: b_moh5rxx4_uxqun
        type: paragraph
        data:
          text: выф а
      - id: b_ai_eval_1_2
        type: paragraph
        data:
          text: >-
            Мы перестали требовать "правильный ответ" и стали требовать полезный
            следующий шаг. Это заняло около трёх месяцев калибровки рубрик.
    asides: []
    quotes: []
    asidesTitle: Материалы
    asidesTitleEnabled: true
  - id: s_test_ai_eval_2
    title: Что заменили и на что
    navLabel: Метрики
    blocks:
      - id: b_ai_eval_2_1
        type: paragraph
        data:
          text: >-
            Три группы: стоимость ошибки в деньгах, доля ассистированных решений
            и time-to-useful-output. Для каждой — отдельный reviewer pool с
            согласованными инструкциями.
    asides: []
    quotes: []
    asidesTitle: Материалы
    asidesTitleEnabled: true
cardVariant: wide
pinned: true
pinnedOrder: 0
metaTitle: Оценка AI-агентов в продакшене — за пределами accuracy | Rocketmind
metaDescription: >-
  Набор метрик для оценки LLM-агентов в продуктовой эксплуатации — альтернатива
  accuracy.
createdAt: '2026-03-12T09:00:00.000Z'
updatedAt: '2026-04-27T12:14:52.342Z'
---

