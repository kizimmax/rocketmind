"use client";

import { useEffect, useState } from "react";

interface TypingTextProps {
  text: string;
  /** Если false — текст выводится сразу целиком, без анимации печати. */
  animate?: boolean;
  /** Миллисекунд на один символ. По умолчанию 18ms. */
  speed?: number;
  /** Callback после окончания печати. */
  onComplete?: () => void;
  className?: string;
  /** Render override: получает currentText, возвращает JSX (для inline markdown). */
  renderText?: (text: string) => React.ReactNode;
}

/**
 * Посимвольная печать текста. Общий компонент — используется и в ExpertChat
 * (AssistantMessage), и в ManagerChat.
 */
export function TypingText({
  text,
  animate = true,
  speed = 18,
  onComplete,
  className,
  renderText,
}: TypingTextProps) {
  const [displayed, setDisplayed] = useState(animate ? "" : text);

  useEffect(() => {
    if (!animate) {
      setDisplayed(text);
      return;
    }
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, animate, speed, onComplete]);

  const content = renderText ? renderText(displayed) : displayed;

  return <span className={className}>{content}</span>;
}
