"use client";

import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Image from "next/image";
import type { ChatMessage } from "@/lib/use-consultant-chat";
import { useConsultantChat } from "@/lib/use-consultant-chat";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/* ── Suggested situations ── */
const SUGGESTIONS = [
  "Запустить бизнес",
  "Протестировать идею",
  "Найти бизнес-модель",
  "Построить стратегию",
  "Масштабировать продукт",
  "Перейти на платформу",
  "Оценить рынок",
  "Собрать команду",
  "Привлечь инвестиции",
  "Оптимизировать процессы",
  "Создать экосистему",
  "Выйти на новый рынок",
];

/* ── AiConsultant handle ── */
export interface AiConsultantHandle {
  scrollIntoView: () => void;
}

/* ══════════════════════════════════════════════════════════════
 * AiConsultant — chat overlay inside footer's DottedSurface.
 * Fills the entire dotted area; input sticks to bottom-[40px].
 * ══════════════════════════════════════════════════════════════ */
export const AiConsultant = forwardRef<AiConsultantHandle>(
  function AiConsultant(_props, ref) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { messages, sendMessage, isSending, streamingMsgId } =
      useConsultantChat();

    useImperativeHandle(ref, () => ({
      scrollIntoView() {
        wrapperRef.current?.scrollIntoView({ behavior: "smooth" });
      },
    }));

    const hasMessages = messages.length > 0;

    return (
      <div ref={wrapperRef} className="flex h-full flex-col">
        {/* Messages / chips — shrinks to fit, scrollable */}
        <div className="mx-auto flex w-full max-w-[1512px] min-h-0 flex-1 flex-col justify-end px-5 md:px-8 xl:px-14">
          {hasMessages ? (
            <MessagesArea
              messages={messages}
              isSending={isSending}
              streamingMsgId={streamingMsgId}
            />
          ) : (
            <SuggestionChips onSelect={(text) => sendMessage(text)} />
          )}
        </div>

        {/* Input — at the bottom with spacing */}
        <div className="mx-auto w-full max-w-[1512px] shrink-0 px-5 pb-4 md:px-8 md:pb-[40px] xl:px-14">
          <ConsultantInput onSend={sendMessage} disabled={isSending} />
        </div>
      </div>
    );
  }
);

/* ── Messages Area ── */
function MessagesArea({
  messages,
  isSending,
  streamingMsgId,
}: {
  messages: ChatMessage[];
  isSending: boolean;
  streamingMsgId: string | null;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  function checkScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 2);
    setCanScrollDown(
      el.scrollHeight - el.scrollTop - el.clientHeight > 2
    );
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    requestAnimationFrame(checkScroll);
  }, [messages.length, isSending]);

  // Keep scrolled to bottom during streaming
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);

    // MutationObserver catches text changes during streaming
    const mo = new MutationObserver(() => {
      if (!el) return;
      el.scrollTop = el.scrollHeight;
      checkScroll();
    });
    mo.observe(el, { childList: true, subtree: true, characterData: true });

    return () => {
      el.removeEventListener("scroll", checkScroll);
      mo.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-0 flex-1">
      {/* Top fade */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 transition-opacity duration-200 md:mx-[108px]"
        style={{
          opacity: canScrollUp ? 1 : 0,
          background:
            "linear-gradient(to bottom, var(--background) 0%, transparent 100%)",
        }}
      />
      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 transition-opacity duration-200 md:mx-[108px]"
        style={{
          opacity: canScrollDown ? 1 : 0,
          background:
            "linear-gradient(to top, var(--background) 0%, transparent 100%)",
        }}
      />
      <div
        ref={scrollRef}
        className="h-full space-y-3 overflow-y-auto pb-4 md:px-[108px]"
        style={{ scrollbarWidth: "none" }}
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isNew={msg.id === streamingMsgId}
          />
        ))}
        {isSending && <TypingIndicator />}
      </div>
    </div>
  );
}

/* ── Message Bubble ── */
function MessageBubble({
  message,
  isNew,
}: {
  message: ChatMessage;
  isNew?: boolean;
}) {
  const [displayedText, setDisplayedText] = useState(
    isNew ? "" : message.content
  );
  const [isStreaming, setIsStreaming] = useState(!!isNew);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!isNew) return;
    const full = message.content;
    const speed = 18;
    indexRef.current = 0;
    setDisplayedText("");
    setIsStreaming(true);

    const timer = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current >= full.length) {
        setDisplayedText(full);
        setIsStreaming(false);
        clearInterval(timer);
      } else {
        setDisplayedText(full.slice(0, indexRef.current));
      }
    }, speed);

    return () => clearInterval(timer);
  }, [isNew, message.content]);

  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-sm px-3 py-2.5 text-[length:var(--text-16)] leading-[1.28] text-foreground ${
          isUser
            ? "max-w-[85%] bg-rm-gray-2 md:max-w-[620px]"
            : "max-w-[95%] bg-card md:max-w-[858px]"
        }`}
      >
        <p className="whitespace-pre-wrap">
          {displayedText}
          {isStreaming && (
            <span className="ml-0.5 inline-block h-[1em] w-[2px] bg-foreground align-text-bottom animate-blink" />
          )}
        </p>
      </div>
    </div>
  );
}

/* ── Typing Indicator ── */
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-sm bg-card px-4 py-2.5">
        <div className="flex space-x-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-border [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-border [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-border [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

/* ── Suggestion Chips ── */
function SuggestionChips({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="relative mb-2">
      <div
        className="flex gap-2 overflow-x-auto md:px-[108px]"
        style={{ scrollbarWidth: "none" }}
      >
        {SUGGESTIONS.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => onSelect(text)}
            className="shrink-0 cursor-pointer rounded-sm border border-border bg-background px-3 py-2.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] font-medium uppercase leading-[1.16] tracking-[0.02em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            {text}
          </button>
        ))}
      </div>

      {/* Left fade */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-8"
        style={{
          background:
            "linear-gradient(90deg, var(--background) 0%, transparent 100%)",
        }}
      />
      {/* Right fade */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-8"
        style={{
          background:
            "linear-gradient(-90deg, var(--background) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}

/* ── Consultant Input ── */
function ConsultantInput({
  onSend,
  disabled,
}: {
  onSend: (message: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

  const hasValue = value.trim().length > 0;

  return (
    <div
      className="flex items-stretch gap-0 rounded-lg border border-border p-0.5"
      style={{
        background: "rgba(18, 18, 18, 0.01)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* Mascot (left side — desktop) */}
      <div className="hidden w-[108px] shrink-0 items-center justify-center md:flex">
        <Image
          src={`${BASE_PATH}/ai-mascots/alex/alex_base.png`}
          alt="Алекс"
          width={108}
          height={108}
          className="h-[100px] w-[100px] object-contain"
        />
      </div>

      {/* Input area */}
      <div className="flex flex-1 items-center gap-2 px-2 py-2 md:gap-6 md:px-4 md:pr-[30px] md:pl-4">
        {/* Mobile mascot (small) */}
        <div className="relative flex h-[48px] w-[48px] shrink-0 items-center justify-center overflow-hidden md:hidden">
          <Image
            src={`${BASE_PATH}/ai-mascots/alex/alex_base.png`}
            alt="Алекс"
            width={80}
            height={80}
            className="relative h-[44px] w-[44px] object-contain"
          />
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            // Scroll input into view above mobile keyboard
            setTimeout(() => {
              textareaRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }, 300);
          }}
          placeholder="Расскажите, какой у вас запрос..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none self-center bg-transparent text-[length:var(--text-16)] text-foreground placeholder:text-rm-gray-4 focus:outline-none md:text-[length:var(--text-24)]"
          style={{ lineHeight: 1.16, letterSpacing: "0.02em", height: "auto" }}
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!hasValue || disabled}
          className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-border transition-colors md:h-14 md:w-14 ${
            hasValue
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 md:h-6 md:w-6"
          >
            <path
              d="M12.0468 4.58813L5 11.6131M12.0468 4.58813L12.0468 19.4117M12.0468 4.58813L19 11.6131"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
