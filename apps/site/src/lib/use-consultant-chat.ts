"use client";

import { useCallback, useState, useRef } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

const MOCK_RESPONSES: Record<string, string> = {
  стратег:
    "Отличный вопрос! Стратегия начинается с анализа текущей позиции. Расскажите подробнее:\n\n1. **Какой у вас продукт или услуга?**\n2. **Кто ваша целевая аудитория?**\n3. **Какие основные проблемы роста вы видите?**\n\nНа основе этого я предложу конкретные шаги.",
  бизнес:
    "Бизнес-модель — это ключ к устойчивому росту. Я помогу разобраться:\n\n- **Value Proposition** — что именно вы даёте клиенту\n- **Revenue Model** — как монетизируете\n- **Unit-экономика** — сходится ли юнит\n\nОпишите вашу текущую модель, и я дам рекомендации.",
  идея:
    "Тестирование идеи — один из самых важных этапов. Вот что предлагаю:\n\n1. Сформулировать **ключевую гипотезу**\n2. Определить **минимальный эксперимент** для проверки\n3. Выбрать **метрики** успеха\n\nРасскажите о вашей идее — помогу структурировать проверку.",
  масштаб:
    "Масштабирование требует системного подхода. Ключевые области:\n\n- **Процессы** — что автоматизировать\n- **Команда** — какие роли нужны\n- **Каналы** — как привлекать больше клиентов\n- **Продукт** — какие функции критичны\n\nНа каком этапе вы сейчас?",
  команд:
    "Построение команды — это фундамент. Давайте разберём:\n\n1. **Текущий состав** и их роли\n2. **Недостающие компетенции**\n3. **Культура** и процессы\n\nРасскажите, какая у вас команда сейчас?",
  инвест:
    "Привлечение инвестиций — серьёзный шаг. Важно подготовить:\n\n- **Pitch deck** с ключевыми метриками\n- **Финансовую модель** на 3 года\n- **Стратегию использования** средств\n\nНа какой стадии ваш проект?",
  рынок:
    "Оценка рынка — это основа для принятия решений. Предлагаю:\n\n1. **TAM/SAM/SOM** анализ\n2. **Конкурентный ландшафт**\n3. **Тренды** и точки входа\n\nКакой рынок вас интересует?",
  платформ:
    "Переход к платформенной модели — мощный рычаг роста. Ключевые вопросы:\n\n- **Кто участники** вашей платформы?\n- **Какую ценность** каждая сторона получает?\n- **Network effects** — как запустить?\n\nОпишите вашу текущую модель, и я покажу путь к платформе.",
  процесс:
    "Оптимизация процессов — это про скорость и качество. Давайте:\n\n1. **Визуализируем** текущий поток\n2. **Найдём узкие места**\n3. **Спроектируем** улучшения\n\nКакие процессы вас беспокоят больше всего?",
  экосистем:
    "Экосистемная архитектура — это следующий уровень после платформы:\n\n- **Ядро** — основной продукт\n- **Партнёры** — кто создаёт дополнительную ценность\n- **API/SDK** — как интегрироваться\n\nРасскажите о вашем продукте, и я предложу экосистемную стратегию.",
};

export function generateMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  for (const [key, response] of Object.entries(MOCK_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return "Понял вас. Давайте разберёмся подробнее — опишите задачу конкретнее, и я подготовлю рекомендации с учётом вашей ситуации.";
}

export function useConsultantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const idCounter = useRef(0);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    setIsSending(true);

    const userMsg: ChatMessage = {
      id: `site_m_${Date.now()}_${idCounter.current++}`,
      role: "user",
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Simulate AI response delay
    await new Promise((r) => setTimeout(r, 1200));

    const assistantMsg: ChatMessage = {
      id: `site_m_${Date.now()}_${idCounter.current++}`,
      role: "assistant",
      content: generateMockResponse(content),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setStreamingMsgId(assistantMsg.id);
    setIsSending(false);
  }, []);

  return { messages, sendMessage, isSending, streamingMsgId };
}
