"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RotateCw, Sparkles, X } from "lucide-react";
import { DotGridLens } from "@rocketmind/ui";
import { ChatInput } from "./chat-input";
import { TypingText } from "./typing-text";
import { useManager, useProjects } from "@/lib/hooks";
import { computeStartingExpert, getMockExpert } from "@/lib/mock-data";
import type {
  Project,
  ProjectRole,
  ProjectStage,
  ReadyArtifact,
} from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// R-менеджер — чат-помощник. Base-mode = "free" (свободный чат + сценарии).
// Первый и единственный работающий сценарий в этой фазе — «Создать новый проект»,
// который запускает 5-шаговый онбординг. Остальные сценарии — осмысленные
// mock-ответы, которые позже заменяются RAG+LLM.
// ─────────────────────────────────────────────────────────────────────────────

type Mode =
  | "free" // свободный чат + scenario pills
  | "onboarding" // 5 вопросов создания проекта
  | "resume" // резюме + выбор режима (быстро/глубоко)
  | "creating" // показываем typing «собираю проект»
  | "done" // проект создан, кнопка «перейти»
  | "confirm-stop"; // подтверждение прерывания сценария

type Step = "role" | "industry" | "stage" | "readiness" | "result";

const STEP_ORDER: Step[] = ["role", "industry", "stage", "readiness", "result"];

const STEP_QUESTION: Record<Step, string> = {
  role: "Для начала — в какой вы сейчас роли?",
  industry: "В какой сфере проект?",
  stage: "На какой стадии сейчас проект?",
  readiness:
    "Что у вас уже готово? Выберите всё, что применимо — пропустим лишние этапы. Если ничего — выберите «Ничего из перечисленного».",
  result: "И последнее — какого результата хотите достичь?",
};

interface ChoiceOption {
  value: string;
  label: string;
  hint?: string;
}

const ROLE_OPTIONS: ChoiceOption[] = [
  { value: "founder", label: "Фаундер", hint: "Запускаю новый продукт" },
  { value: "sme-lead", label: "Руководитель SMB", hint: "Развиваю существующий бизнес" },
  { value: "team-lead", label: "Продакт / тимлид", hint: "Веду инициативу внутри компании" },
  { value: "mentor", label: "Ментор / трекер", hint: "Помогаю другим командам" },
];

const STAGE_OPTIONS: ChoiceOption[] = [
  { value: "idea", label: "Идея", hint: "Пока только концепция" },
  { value: "mvp", label: "MVP", hint: "Первые пользователи, тестируем" },
  { value: "seed", label: "Seed", hint: "Есть трекшн, ищу инвестиции" },
  { value: "early", label: "Early Stage", hint: "Растём, масштабируемся" },
  { value: "growth", label: "Growth", hint: "Отлаженная модель, захват рынка" },
];

const READINESS_OPTIONS: Array<{ value: ReadyArtifact; label: string }> = [
  { value: "market", label: "Маркет-анализ" },
  { value: "ua_segments", label: "Сегментация ЦА / ICP" },
  { value: "synth", label: "Проверенные гипотезы на аудитории" },
  { value: "biz_model", label: "Бизнес-модель + юнит-экономика" },
  { value: "mvp_plan", label: "MVP-план" },
  { value: "pitch", label: "Питч-дек" },
];

const INDUSTRY_SUGGESTIONS = [
  "SaaS / B2B",
  "EdTech",
  "FinTech",
  "E-commerce",
  "Marketplace",
  "HealthTech",
  "AI / ML",
];

const RESULT_SUGGESTIONS = [
  "Инвест-пакет для seed-раунда",
  "Валидировать продуктовую гипотезу",
  "Собрать питч-дек",
  "Понять свою unit-экономику",
];

// ─────────────────────────────────────────────────────────────────────────────
// Manager scenarios — 4 заготовленных сценария. Первый — работает (запускает
// онбординг). Остальные — осмысленные mock-ответы, которые станут RAG+LLM.
// ─────────────────────────────────────────────────────────────────────────────

type ScenarioCodename =
  | "new_project"
  | "explain_rteam"
  | "project_focus"
  | "ui_tour";

interface ManagerScenario {
  codename: ScenarioCodename;
  label: string;
  hint: string;
  is_primary: boolean;
}

const MANAGER_SCENARIOS: ManagerScenario[] = [
  {
    codename: "new_project",
    label: "Создать новый проект",
    hint: "Проведу через 5 вопросов и отправлю к нужному эксперту",
    is_primary: true,
  },
  {
    codename: "explain_rteam",
    label: "Как работает R-команда",
    hint: "Расскажу про 6 ИИ-экспертов и логику pipeline",
    is_primary: false,
  },
  {
    codename: "project_focus",
    label: "В каком проекте сосредоточиться",
    hint: "Посмотрю ваши проекты и посоветую приоритет",
    is_primary: false,
  },
  {
    codename: "ui_tour",
    label: "Подсказать по интерфейсу",
    hint: "Быстрый тур по экранам платформы",
    is_primary: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// История сообщений
// ─────────────────────────────────────────────────────────────────────────────

type ManagerMsg = { id: string; role: "manager"; text: string };
type UserMsg = { id: string; role: "user"; text: string };
type HistoryItem = ManagerMsg | UserMsg;

interface Answers {
  role: ProjectRole | null;
  industry: string | null;
  stage: ProjectStage | null;
  readiness: ReadyArtifact[];
  expected_result: string | null;
}

export interface PrefillData {
  name?: string;
  role?: ProjectRole;
  industry?: string;
  stage?: ProjectStage;
  readiness?: ReadyArtifact[];
  files?: string[];
}

interface ManagerChatProps {
  prefill?: PrefillData;
  hasExistingProjects: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function ManagerChat({ prefill, hasExistingProjects }: ManagerChatProps) {
  const router = useRouter();
  const manager = useManager();
  const { activeProjects, createProject } = useProjects();

  const initialGreeting = prefill
    ? "Спасибо! Вижу ваш предварительный бриф. Давайте уточню пару деталей — это поможет определить, с какого эксперта начать."
    : hasExistingProjects
      ? `${manager.greeting_with_projects} Могу помочь с заготовленными сценариями ниже или свободно ответить на вопрос — пишите в чат.`
      : `${manager.greeting_no_projects} Выберите один из сценариев ниже — или напишите свой вопрос в чат.`;

  // Начальный режим: onboarding если пришли с prefill, иначе free
  const [mode, setMode] = useState<Mode>(prefill ? "onboarding" : "free");
  const [step, setStep] = useState<Step>(() => {
    if (!prefill) return "role";
    // Первый незаполненный шаг из prefill
    if (!prefill.role) return "role";
    if (!prefill.industry) return "industry";
    if (!prefill.stage) return "stage";
    if (!prefill.readiness || prefill.readiness.length === 0) return "readiness";
    return "result";
  });
  // Какой шаг был, когда пользователь запросил stop (для отката после «нет»)
  const [stepBeforeStop, setStepBeforeStop] = useState<Step | null>(null);
  const [modeBeforeStop, setModeBeforeStop] = useState<Mode | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([
    { id: "m-0", role: "manager", text: initialGreeting },
  ]);
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<Answers>({
    role: prefill?.role ?? null,
    industry: prefill?.industry ?? null,
    stage: prefill?.stage ?? null,
    readiness: prefill?.readiness ?? [],
    expected_result: null,
  });
  const [readinessDraft, setReadinessDraft] = useState<ReadyArtifact[]>(
    prefill?.readiness ?? []
  );
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const didInitRef = useRef(false);

  // При старте с prefill — показать summary и первый вопрос; без prefill — остаёмся в free с pills
  useEffect(() => {
    if (didInitRef.current) return;
    if (!prefill) return; // в free-моде автостарт не нужен — pills сами по себе
    didInitRef.current = true;

    const summary = [
      prefill.name ? `Название: ${prefill.name}` : null,
      prefill.stage
        ? `Стадия: ${STAGE_OPTIONS.find((s) => s.value === prefill.stage)?.label ?? prefill.stage}`
        : null,
      prefill.readiness && prefill.readiness.length > 0
        ? `Уже готово: ${prefill.readiness
            .map((r) => READINESS_OPTIONS.find((o) => o.value === r)?.label)
            .filter(Boolean)
            .join(", ")}`
        : null,
      prefill.files && prefill.files.length > 0
        ? `Файлы: ${prefill.files.join(", ")}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");
    if (summary) {
      pushUserRaw(summary, "u-prefill");
    }
    setTimeout(() => pushManager(STEP_QUESTION[step]), 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history.length]);

  // ─── Helpers: пушим в историю ───────────────────────────────────────────

  function pushUser(text: string) {
    const id = `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setHistory((h) => [...h, { id, role: "user", text }]);
    setFreshIds((prev) => new Set(prev).add(id));
  }

  function pushUserRaw(text: string, id: string) {
    setHistory((h) => [...h, { id, role: "user", text }]);
  }

  function pushManager(text: string, delay = 600) {
    setTimeout(() => {
      const id = `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setHistory((h) => [...h, { id, role: "manager", text }]);
      setFreshIds((prev) => new Set(prev).add(id));
    }, delay);
  }

  // ─── Intent detection ───────────────────────────────────────────────────

  function detectIntent(text: string): "stop" | "create" | "unknown" {
    const low = text.toLowerCase();
    // JS \b не работает с кириллицей — используем простое substring-матчение
    if (/(стоп|прерв|отмен|выйти|хватит|не сейчас|выход|брось)/.test(low))
      return "stop";
    if (
      /(новый проект|создать проект|создам проект|создам новый|хочу проект|хочу создать|запустить проект|запущу проект|нов(ую|ая) инициатив)/.test(
        low
      )
    )
      return "create";
    return "unknown";
  }

  function isQuestion(text: string): boolean {
    const low = text.toLowerCase();
    if (/\?/.test(low)) return true;
    if (/^(что|как|почему|зачем|расскажи|объясни|помоги|можешь|подскажи|кто)/.test(low))
      return true;
    return false;
  }

  // ─── Free-text обработка ────────────────────────────────────────────────

  function handleUserInput(text: string) {
    if (!text.trim()) return;
    pushUser(text.trim());
    const intent = detectIntent(text);

    // 1) stop-intent — только в активных сценариях имеет смысл
    if (
      intent === "stop" &&
      (mode === "onboarding" || mode === "resume")
    ) {
      setStepBeforeStop(step);
      setModeBeforeStop(mode);
      const left = STEP_ORDER.length - STEP_ORDER.indexOf(step);
      const leftText = mode === "resume" ? "финальный выбор режима" : `${left} ${pluralize(left, "вопрос", "вопроса", "вопросов")} до конца`;
      pushManager(
        `Хотите прервать создание проекта? У нас ${leftText}. Если прервём — придётся начать заново.`,
        600
      );
      setMode("confirm-stop");
      return;
    }

    // 2) create-intent — запускаем онбординг из free/done
    if (intent === "create" && (mode === "free" || mode === "done")) {
      pushManager("Отлично, запускаем! Сейчас задам 5 коротких вопросов.", 500);
      setTimeout(() => {
        setMode("onboarding");
        setStep("role");
        pushManager(STEP_QUESTION.role, 300);
      }, 1100);
      return;
    }

    // 3) В mode "free" — unknown → mock-ответ + показать сценарии
    if (mode === "free") {
      pushManager(freeModeUnknownReply(text, activeProjects, manager.name), 600);
      return;
    }

    // 4) В mode "onboarding" — зависит от шага
    if (mode === "onboarding") {
      if (step === "industry" || step === "result") {
        // Свободный текст: вопрос vs ответ на шаг
        if (isQuestion(text)) {
          pushManager(contextualReply(text, answers, activeProjects), 600);
          pushManager(`Возвращаюсь к нашему разговору. ${STEP_QUESTION[step]}`, 1800);
        } else {
          acceptStepAnswer(step, text.trim());
        }
      } else {
        // role / stage / readiness — ждём клик на pickere; текст считаем свободным вопросом
        pushManager(contextualReply(text, answers, activeProjects), 600);
        pushManager(
          `Вернёмся к сценарию. ${STEP_QUESTION[step]} — выберите вариант ниже.`,
          1800
        );
      }
      return;
    }

    // 5) В mode "resume" / "done" / "creating" / "confirm-stop" — free-ответ
    pushManager(contextualReply(text, answers, activeProjects), 600);
  }

  // ─── Scenario handlers (mode "free") ────────────────────────────────────

  function pickScenario(s: ManagerScenario) {
    pushUser(s.label);

    if (s.codename === "new_project") {
      pushManager("Отлично, запускаем! Сейчас задам 5 коротких вопросов.", 500);
      setTimeout(() => {
        setMode("onboarding");
        setStep("role");
        pushManager(STEP_QUESTION.role, 300);
      }, 1100);
      return;
    }

    if (s.codename === "explain_rteam") {
      pushManager(REPLY_EXPLAIN_RTEAM, 600);
      return;
    }

    if (s.codename === "project_focus") {
      pushManager(replyProjectFocus(activeProjects), 600);
      return;
    }

    if (s.codename === "ui_tour") {
      pushManager(REPLY_UI_TOUR, 600);
      return;
    }
  }

  // ─── Step handlers (mode "onboarding") ──────────────────────────────────

  function acceptStepAnswer(currentStep: Step, value: string | ReadyArtifact[]) {
    // Сохраняем ответ
    if (currentStep === "role") {
      const val = typeof value === "string" ? value : "";
      setAnswers((a) => ({ ...a, role: val as ProjectRole }));
    } else if (currentStep === "industry") {
      const val = typeof value === "string" ? value : "";
      setAnswers((a) => ({ ...a, industry: val }));
    } else if (currentStep === "stage") {
      const val = typeof value === "string" ? value : "";
      setAnswers((a) => ({ ...a, stage: val as ProjectStage }));
    } else if (currentStep === "readiness") {
      const items = Array.isArray(value) ? value : [];
      setAnswers((a) => ({ ...a, readiness: items }));
    } else if (currentStep === "result") {
      const val = typeof value === "string" ? value : "";
      setAnswers((a) => ({ ...a, expected_result: val }));
    }

    // Переход к следующему шагу (пропускаем те, которые уже заполнены prefill'ом)
    const idx = STEP_ORDER.indexOf(currentStep);
    let nextStep: Step | null = null;
    for (let i = idx + 1; i < STEP_ORDER.length; i++) {
      const s = STEP_ORDER[i];
      if (s === "industry" && answers.industry) continue;
      if (s === "stage" && answers.stage) continue;
      if (s === "readiness" && answers.readiness.length > 0) continue;
      nextStep = s;
      break;
    }

    if (nextStep) {
      setStep(nextStep);
      pushManager(STEP_QUESTION[nextStep], 500);
    } else {
      // Все шаги пройдены — переходим к resume
      setTimeout(() => showResume({ ...answers, [fieldFromStep(currentStep)]: value }), 500);
    }
  }

  function pickRole(opt: ChoiceOption) {
    pushUser(opt.label);
    acceptStepAnswer("role", opt.value);
  }

  function pickStage(opt: ChoiceOption) {
    pushUser(opt.label);
    acceptStepAnswer("stage", opt.value);
  }

  function submitReadiness(items: ReadyArtifact[]) {
    const labels =
      items.length === 0
        ? "Ничего из перечисленного"
        : items
            .map((r) => READINESS_OPTIONS.find((o) => o.value === r)?.label)
            .filter(Boolean)
            .join(", ");
    pushUser(labels);
    acceptStepAnswer("readiness", items);
  }

  function pickIndustrySuggestion(text: string) {
    pushUser(text);
    acceptStepAnswer("industry", text);
  }

  function pickResultSuggestion(text: string) {
    pushUser(text);
    acceptStepAnswer("result", text);
  }

  // ─── Resume (mode "resume") ─────────────────────────────────────────────

  function showResume(finalAnswers: Answers) {
    setAnswers(finalAnswers);
    const stage = finalAnswers.stage ?? "idea";
    const readiness = finalAnswers.readiness;
    const recommended = computeStartingExpert(stage, readiness);
    const expert = getMockExpert(recommended);
    const skipped = readiness.length;

    let message: string;
    if (skipped === 0) {
      message = `Понял! По вашей стадии и ответам предлагаю начать с полного пути — с **${expert?.name} (${recommended})**. Пройдём все 6 экспертов последовательно, чтобы получить крепкий инвест-пакет.`;
    } else {
      const saved = skipped * 2;
      message = `Отлично. Вижу, что у вас уже есть ${skipped} ${pluralize(skipped, "готовый артефакт", "готовых артефакта", "готовых артефактов")}. Могу сэкономить ~${saved} ${pluralize(saved, "час", "часа", "часов")} и сразу отправить к **${expert?.name} (${recommended})** — первому неохваченному эксперту. Или можем пройти весь путь с начала, чтобы перепроверить данные и улучшить их.`;
    }
    pushManager(message, 600);
    setMode("resume");
  }

  async function createWithSkip() {
    pushUser("Сэкономить время");
    executeCreate(answers.readiness);
  }

  async function createFullPath() {
    pushUser("Пройти полный путь");
    executeCreate([]);
  }

  async function executeCreate(readiness: ReadyArtifact[]) {
    setMode("creating");
    pushManager("Секунду, собираю проект…", 200);
    await new Promise((r) => setTimeout(r, 1100));

    const role = answers.role ?? prefill?.role ?? "founder";
    const industry = answers.industry ?? prefill?.industry ?? "—";
    const stage = answers.stage ?? prefill?.stage ?? "idea";
    const name = prefill?.name ?? makeProjectName(industry);

    const newProject = createProject({ name, role, industry, stage, readiness });
    setCreatedProjectId(newProject.id);

    const startingExpert = newProject.current_expert_codename;
    const expert = startingExpert ? getMockExpert(startingExpert) : null;

    pushManager(
      `Готово! Проект «${newProject.name}» создан. Вижу его справа и в левом меню — подсвечен как новый. Как будете готовы, кликните «Перейти к ${expert?.name ?? "эксперту"} →», и продолжим в рабочей области проекта.`,
      700
    );
    setTimeout(() => setMode("done"), 1400);
  }

  // ─── Confirm-stop ───────────────────────────────────────────────────────

  function confirmStopYes() {
    pushUser("Да, прервать");
    pushManager("Понял. Возвращаю к свободному чату. Если захотите снова — просто нажмите «Создать новый проект».", 500);
    setMode("free");
    setStep("role");
    setAnswers({
      role: null,
      industry: null,
      stage: null,
      readiness: [],
      expected_result: null,
    });
    setReadinessDraft([]);
    setStepBeforeStop(null);
    setModeBeforeStop(null);
  }

  function confirmStopNo() {
    pushUser("Нет, продолжить");
    const resumeMode = modeBeforeStop ?? "onboarding";
    const resumeStep = stepBeforeStop ?? "role";
    pushManager(
      resumeMode === "resume"
        ? "Хорошо, продолжаем! Выберите режим — быстро или глубокая работа."
        : `Хорошо, продолжаем! ${STEP_QUESTION[resumeStep]}`,
      500
    );
    setMode(resumeMode);
    setStep(resumeStep);
    setStepBeforeStop(null);
    setModeBeforeStop(null);
  }

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-hidden">
      <DotGridLens
        gridGap={10}
        baseRadius={0.75}
        maxScale={2.8}
        lensRadius={100}
        className="pointer-events-auto absolute inset-0 z-0"
      />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 border-b border-border bg-background px-5 py-3">
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
          <Image
            src={manager.avatar_url}
            alt={manager.name}
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-[family-name:var(--font-heading-family)] text-[length:var(--text-16)] font-bold uppercase leading-tight">
            {manager.name}
          </p>
          <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
            {manager.role}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-2xl flex-col gap-4 px-5 py-10">
          {history.map((msg) => (
            <Bubble
              key={msg.id}
              msg={msg}
              managerAvatar={manager.avatar_url}
              isFresh={freshIds.has(msg.id)}
            />
          ))}
          {mode === "creating" && <TypingIndicator managerAvatar={manager.avatar_url} />}
        </div>
      </div>

      {/* Picker zone + input (input всегда виден) */}
      <div className="relative z-10 border-t border-border bg-background/80 backdrop-blur-sm">
        {/* Mode-specific pickers НАД input */}
        <PickerArea
          mode={mode}
          step={step}
          readinessDraft={readinessDraft}
          setReadinessDraft={setReadinessDraft}
          hasExistingProjects={hasExistingProjects}
          onScenarioPick={pickScenario}
          onRolePick={pickRole}
          onStagePick={pickStage}
          onReadinessSubmit={submitReadiness}
          onIndustrySuggestion={pickIndustrySuggestion}
          onResultSuggestion={pickResultSuggestion}
          onCreateWithSkip={createWithSkip}
          onCreateFullPath={createFullPath}
          onConfirmStopYes={confirmStopYes}
          onConfirmStopNo={confirmStopNo}
          onGoToProject={() => {
            if (createdProjectId) router.push(`/projects/${createdProjectId}`);
          }}
          hasSkipOption={(answers.readiness?.length ?? 0) > 0}
        />

        {/* Input — всегда виден во всех modes */}
        <ChatInput
          onSend={handleUserInput}
          disabled={mode === "creating"}
          placeholder={inputPlaceholder(mode)}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PickerArea — что показываем над input в зависимости от mode
// ─────────────────────────────────────────────────────────────────────────────

function PickerArea({
  mode,
  step,
  readinessDraft,
  setReadinessDraft,
  hasExistingProjects,
  onScenarioPick,
  onRolePick,
  onStagePick,
  onReadinessSubmit,
  onIndustrySuggestion,
  onResultSuggestion,
  onCreateWithSkip,
  onCreateFullPath,
  onConfirmStopYes,
  onConfirmStopNo,
  onGoToProject,
  hasSkipOption,
}: {
  mode: Mode;
  step: Step;
  readinessDraft: ReadyArtifact[];
  setReadinessDraft: (v: ReadyArtifact[]) => void;
  hasExistingProjects: boolean;
  onScenarioPick: (s: ManagerScenario) => void;
  onRolePick: (opt: ChoiceOption) => void;
  onStagePick: (opt: ChoiceOption) => void;
  onReadinessSubmit: (items: ReadyArtifact[]) => void;
  onIndustrySuggestion: (t: string) => void;
  onResultSuggestion: (t: string) => void;
  onCreateWithSkip: () => void;
  onCreateFullPath: () => void;
  onConfirmStopYes: () => void;
  onConfirmStopNo: () => void;
  onGoToProject: () => void;
  hasSkipOption: boolean;
}) {
  if (mode === "free") {
    return <ScenarioPills scenarios={MANAGER_SCENARIOS} onPick={onScenarioPick} hasExistingProjects={hasExistingProjects} />;
  }
  if (mode === "onboarding") {
    if (step === "role") return <ChoiceGrid options={ROLE_OPTIONS} onPick={onRolePick} />;
    if (step === "stage") return <ChoiceGrid options={STAGE_OPTIONS} onPick={onStagePick} />;
    if (step === "readiness")
      return (
        <ReadinessPicker
          value={readinessDraft}
          onChange={setReadinessDraft}
          onSubmit={() => onReadinessSubmit(readinessDraft)}
        />
      );
    if (step === "industry") return <Suggestions items={INDUSTRY_SUGGESTIONS} onPick={onIndustrySuggestion} />;
    if (step === "result") return <Suggestions items={RESULT_SUGGESTIONS} onPick={onResultSuggestion} />;
  }
  if (mode === "resume") {
    return (
      <ResumeActions
        hasSkipOption={hasSkipOption}
        onSkip={onCreateWithSkip}
        onFullPath={onCreateFullPath}
      />
    );
  }
  if (mode === "confirm-stop") {
    return <StopConfirm onYes={onConfirmStopYes} onNo={onConfirmStopNo} />;
  }
  if (mode === "done") {
    return (
      <div className="mx-auto max-w-2xl px-5 pt-4 pb-2">
        <button
          type="button"
          onClick={onGoToProject}
          className="w-full rounded-sm bg-foreground py-2 text-[length:var(--text-14)] font-medium text-background transition-opacity hover:opacity-80"
        >
          Перейти к проекту →
        </button>
      </div>
    );
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Под-компоненты
// ─────────────────────────────────────────────────────────────────────────────

function Bubble({
  msg,
  managerAvatar,
  isFresh,
}: {
  msg: HistoryItem;
  managerAvatar: string;
  isFresh: boolean;
}) {
  if (msg.role === "manager") {
    return (
      <div className={`flex items-start gap-3 ${isFresh ? "rm-message-rise" : ""}`}>
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
          <Image
            src={managerAvatar}
            alt="R-менеджер"
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="max-w-[calc(100%-3rem)] whitespace-pre-wrap rounded-sm bg-rm-gray-1 px-4 py-2.5 text-[length:var(--text-14)] leading-relaxed">
          {isFresh ? (
            <TypingText
              text={msg.text}
              animate
              speed={16}
              renderText={(t) => renderMarkdown(t)}
            />
          ) : (
            renderMarkdown(msg.text)
          )}
        </div>
      </div>
    );
  }
  return (
    <div className={`flex justify-end ${isFresh ? "rm-message-rise" : ""}`}>
      <div className="max-w-[80%] whitespace-pre-wrap rounded-sm bg-foreground px-4 py-2.5 text-[length:var(--text-14)] leading-relaxed text-background">
        {msg.text}
      </div>
    </div>
  );
}

function TypingIndicator({ managerAvatar }: { managerAvatar: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
        <Image src={managerAvatar} alt="" width={36} height={36} className="h-full w-full object-cover" />
      </div>
      <div className="rounded-sm bg-rm-gray-1 px-4 py-2.5">
        <div className="flex space-x-1.5">
          <span className="h-2 w-2 rounded-full bg-rm-gray-3 animate-bounce [animation-delay:0ms]" />
          <span className="h-2 w-2 rounded-full bg-rm-gray-3 animate-bounce [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-rm-gray-3 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

function ScenarioPills({
  scenarios,
  onPick,
  hasExistingProjects,
}: {
  scenarios: ManagerScenario[];
  onPick: (s: ManagerScenario) => void;
  hasExistingProjects: boolean;
}) {
  // Для пользователей без проектов скрываем «project_focus» (нечего советовать)
  const filtered = hasExistingProjects
    ? scenarios
    : scenarios.filter((s) => s.codename !== "project_focus");
  return (
    <div className="mx-auto max-w-2xl px-5 pt-4 pb-3">
      <p className="mb-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
        Сценарии
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {filtered.map((s) => (
          <button
            key={s.codename}
            type="button"
            onClick={() => onPick(s)}
            className={`group flex items-start gap-2.5 rounded-sm border px-3.5 py-3 text-left transition-colors ${
              s.is_primary
                ? "border-foreground bg-foreground text-background hover:opacity-90"
                : "border-border bg-background/80 backdrop-blur-sm text-foreground hover:border-foreground"
            }`}
          >
            <Sparkles
              className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                s.is_primary
                  ? "text-[var(--rm-yellow-500)]"
                  : "text-[var(--rm-yellow-500)] opacity-60 group-hover:opacity-100 transition-opacity"
              }`}
            />
            <div className="flex flex-col">
              <span className="text-[length:var(--text-14)]">{s.label}</span>
              <span
                className={`text-[length:var(--text-12)] ${
                  s.is_primary ? "opacity-80" : "text-muted-foreground"
                }`}
              >
                {s.hint}
              </span>
              {s.is_primary && (
                <span className="mt-1 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-[var(--rm-yellow-500)]">
                  Рекомендую
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChoiceGrid({
  options,
  onPick,
}: {
  options: ChoiceOption[];
  onPick: (opt: ChoiceOption) => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-4 pb-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onPick(opt)}
            className="group flex items-start gap-2.5 rounded-sm border border-border bg-background/80 backdrop-blur-sm px-3.5 py-3 text-left transition-colors hover:border-foreground"
          >
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--rm-yellow-500)] opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col">
              <span className="text-[length:var(--text-14)] text-foreground">{opt.label}</span>
              {opt.hint && (
                <span className="text-[length:var(--text-12)] text-muted-foreground">
                  {opt.hint}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Suggestions({
  items,
  onPick,
}: {
  items: string[];
  onPick: (t: string) => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-3 pb-2">
      <p className="mb-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
        Быстрый выбор или впишите свой ответ
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="rounded-full border border-border bg-background px-3 py-1 text-[length:var(--text-12)] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReadinessPicker({
  value,
  onChange,
  onSubmit,
}: {
  value: ReadyArtifact[];
  onChange: (v: ReadyArtifact[]) => void;
  onSubmit: () => void;
}) {
  function toggle(item: ReadyArtifact) {
    if (value.includes(item)) onChange(value.filter((v) => v !== item));
    else onChange([...value, item]);
  }
  return (
    <div className="mx-auto max-w-2xl px-5 pt-4 pb-3 flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {READINESS_OPTIONS.map((opt) => {
          const isOn = value.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`rounded-full border px-3 py-1 text-[length:var(--text-12)] transition-colors ${
                isOn
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onSubmit}
        className="w-full rounded-sm bg-foreground py-2 text-[length:var(--text-14)] font-medium text-background transition-opacity hover:opacity-80"
      >
        {value.length === 0 ? "Ничего из перечисленного" : `Подтвердить (${value.length})`}
      </button>
    </div>
  );
}

function ResumeActions({
  hasSkipOption,
  onSkip,
  onFullPath,
}: {
  hasSkipOption: boolean;
  onSkip: () => void;
  onFullPath: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-4 pb-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {hasSkipOption && (
          <button
            type="button"
            onClick={onSkip}
            className="group flex items-start gap-2.5 rounded-sm border border-foreground bg-foreground px-3.5 py-3 text-left text-background transition-opacity hover:opacity-90"
          >
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--rm-yellow-500)]" />
            <div className="flex flex-col">
              <span className="text-[length:var(--text-14)]">Сэкономить время</span>
              <span className="text-[length:var(--text-12)] opacity-80">
                Пропустить пройденные этапы
              </span>
              <span className="mt-1 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-[var(--rm-yellow-500)]">
                Рекомендую
              </span>
            </div>
          </button>
        )}
        <button
          type="button"
          onClick={onFullPath}
          className="group flex items-start gap-2.5 rounded-sm border border-border bg-background/80 px-3.5 py-3 text-left backdrop-blur-sm transition-colors hover:border-foreground"
        >
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--rm-yellow-500)] opacity-60 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col">
            <span className="text-[length:var(--text-14)] text-foreground">Пройти полный путь</span>
            <span className="text-[length:var(--text-12)] text-muted-foreground">
              Начать с R1 — перепроверить всё
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

function StopConfirm({
  onYes,
  onNo,
}: {
  onYes: () => void;
  onNo: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-4 pb-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onYes}
          className="flex items-start gap-2.5 rounded-sm border border-[var(--rm-red-500)] bg-background px-3.5 py-3 text-left text-[var(--rm-red-500)] transition-colors hover:bg-[var(--rm-red-500)] hover:text-background"
        >
          <X className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[length:var(--text-14)] font-medium">Да, прервать</span>
            <span className="text-[length:var(--text-12)] opacity-80">
              Сброшу ответы и вернусь к свободному чату
            </span>
          </div>
        </button>
        <button
          type="button"
          onClick={onNo}
          className="flex items-start gap-2.5 rounded-sm border border-foreground bg-foreground px-3.5 py-3 text-left text-background transition-opacity hover:opacity-90"
        >
          <RotateCw className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--rm-yellow-500)]" />
          <div className="flex flex-col">
            <span className="text-[length:var(--text-14)] font-medium">Нет, продолжить</span>
            <span className="text-[length:var(--text-12)] opacity-80">
              Вернёмся туда, где остановились
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock-ответы для сценариев и свободных вопросов
// ─────────────────────────────────────────────────────────────────────────────

const REPLY_EXPLAIN_RTEAM = `R-команда — это 6 ИИ-экспертов, которые последовательно ведут проект от идеи до инвест-пакета:

**R1 Роман** — маркет-исследователь. Собирает размер рынка, конкурентов и тренды → Маркет-бриф.
**R2 Регина** — специалист по ЦА. Находит ICP и ключевые сегменты → Сегменты ЦА.
**R+ Роза** — синтетическая аудитория. Проверяет гипотезы через «виртуальных» респондентов.
**R3 Римма** — бизнес-модель и юнит-экономика → BMC + unit economics.
**R4 Роберт** — MVP и план экспериментов → MVP-план.
**R5 Рон** — питч-дек, one-pager и инвест-меморандум.

Каждый подхватывает контекст предыдущего. Если у вас уже есть готовые артефакты (маркет-анализ, ICP и т.д.) — при создании проекта скажите об этом, и мы пропустим эти этапы.

Чем ещё могу помочь?`;

const REPLY_UI_TOUR = `Коротко по интерфейсу:

**Слева — sidebar.** Наверху я (R-менеджер), ниже — ваши проекты.
**Клик на проект** — раскрывает команду из 6 экспертов. Пройденные — ярко, не начатые — приглушены.
**Клик на эксперта** — откроет чат. У каждого 3 сценария и выбор «быстро/глубоко».
**Справа в проекте** — артефакты со скорингом.
**Кнопка «+» рядом с «Проекты»** — быстрое создание через модалку.
**Архив внизу sidebar** — архивированные проекты.

Что хотите подробнее?`;

function replyProjectFocus(projects: Project[]): string {
  if (projects.length === 0) {
    return "У вас пока нет активных проектов. Создадим первый? Нажмите «Создать новый проект» выше — я проведу через 5 вопросов.";
  }
  // Приоритет 1: awaiting_validation (требует действия сейчас)
  // Приоритет 2: самый близкий к завершению (experts_completed / total)
  // Приоритет 3: самый свежий (updated_at)
  const byProgress = [...projects].sort(
    (a, b) => b.experts_completed - a.experts_completed
  );
  const top = byProgress[0];
  if (top.experts_completed === top.experts_total) {
    return `Проект «${top.name}» уже завершён (${top.experts_completed}/${top.experts_total}), все артефакты собраны. Можно возвращаться к инвесторам или запускать новую инициативу. ${projects.length > 1 ? `Из остальных — посмотрю следующий.` : ""}`;
  }
  if (top.experts_completed >= 3) {
    return `Рекомендую фокус на **${top.name}** — уже пройдено ${top.experts_completed} из ${top.experts_total} экспертов. Текущий эксперт — **${top.current_expert_codename ?? "R1"}**. Осталось немного до финального инвест-пакета.`;
  }
  if (top.experts_completed >= 1) {
    return `Работа идёт с **${top.name}** (${top.experts_completed}/${top.experts_total} экспертов). Продолжайте — наращиваете momentum. Текущий эксперт — **${top.current_expert_codename ?? "R1"}**.`;
  }
  return `Активный проект — **${top.name}**, вы только начали (${top.experts_completed}/${top.experts_total}). Заходите к **${top.current_expert_codename ?? "R1"}** — он подхватит ваш бриф и начнёт с маркет-исследования.`;
}

function freeModeUnknownReply(
  _text: string,
  projects: Project[],
  _managerName: string
): string {
  const hint =
    projects.length > 0
      ? "Пока я отвечаю на заготовленные сценарии ниже. Полноценный разбор через LLM+RAG подключим скоро. А сейчас — могу создать новый проект, рассказать про R-команду или посоветовать, какой проект в приоритете."
      : "Пока я отвечаю на заготовленные сценарии ниже. Полноценный разбор через LLM+RAG подключим скоро. Хотите создать первый проект или рассказать, как работает R-команда?";
  return hint;
}

function contextualReply(
  text: string,
  answers: Answers,
  projects: Project[]
): string {
  const low = text.toLowerCase();
  // Несколько распознаваемых тем, которые часто спрашивают посреди онбординга
  if (/эксперт|r-команда|команд[аы]|этап/.test(low)) {
    return "R-команда из 6 экспертов: R1 — маркет, R2 — ЦА, R+ — синтетические интервью, R3 — бизнес-модель и юнит-экономика, R4 — MVP, R5 — питч. Подробнее — по сценарию «Как работает R-команда» в свободном чате.";
  }
  if (/проект|прогресс|дашборд/.test(low)) {
    if (projects.length > 0) {
      return `У вас сейчас ${projects.length} ${pluralize(projects.length, "активный проект", "активных проекта", "активных проектов")}. Самый продвинутый — «${projects[0].name}». Подробнее — по сценарию «В каком проекте сосредоточиться».`;
    }
    return "Активных проектов ещё нет. Как только закончим онбординг — появится ваш первый.";
  }
  if (/скоринг|score|оценк/.test(low)) {
    return "Скоринг — это число 0–100, которое контролёр-агент выставляет проекту по итогам работы экспертов. Можно увидеть в карточке проекта на дашборде и в правой панели проекта.";
  }
  if (/артефакт/.test(low)) {
    return "Артефакт — это документ, который эксперт выдаёт на выходе (маркет-бриф, ICP, бизнес-модель, питч и т.д.). Они лежат в правой панели проекта, можно скачать PDF.";
  }
  if (/сколько|время|долго/.test(low)) {
    return "Полный pipeline R1→R5 — ~6–8 часов работы пользователя распределённо. В «глубоком режиме» эксперт собирает артефакт за 10–15 минут, в «быстром» — за 30 секунд с возможностью правок.";
  }
  if (/быстр|глубок/.test(low)) {
    return "У каждого эксперта 2 режима: **быстрый** — собрать первую версию сразу (30 сек), потом можно перезапустить с правками; **глубокий** — несколько внутренних итераций с самопроверкой (10–15 мин), результат заметно точнее. Рекомендую глубокий — как раз для инвест-пакета.";
  }
  if (/критик/.test(low)) {
    return "В глубоком режиме эксперт сам проверяет свою работу — видно по сообщениям с задумчивой аватаркой: он перепроверяет источники, добавляет оси сравнения, уточняет цифры. На проде это отдельный агент-критик внутри экспертного микросервиса.";
  }
  if (/биллинг|подписк|тариф|деньги|плата/.test(low)) {
    return "Биллинг-часть в разработке. Во время беты платформа бесплатная.";
  }
  if (/файл|загрузить|документ/.test(low)) {
    return "Файлы можно приложить при быстром создании проекта через модалку «+» в sidebar. Полная поддержка uploads подключится вместе с бэком.";
  }
  // Fallback
  if (answers.role || answers.industry || answers.stage) {
    return "Отмечу это на будущее. Полноценный ответ будет в следующей версии с LLM+RAG — сейчас отвечаю только на типовые вопросы.";
  }
  return "Пока отвечаю только на типовые вопросы — полный разбор через LLM+RAG подключим скоро. Используйте сценарии в меню или создавайте проект.";
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function inputPlaceholder(mode: Mode): string {
  switch (mode) {
    case "free":
      return "Спросите что-нибудь или выберите сценарий…";
    case "onboarding":
      return "Ответ на вопрос или спросите что-то ещё…";
    case "resume":
      return "Напишите, если нужно уточнение…";
    case "creating":
      return "Собираю проект…";
    case "done":
      return "Можно написать ещё — я отвечу";
    case "confirm-stop":
      return "Выберите действие выше";
  }
}

function makeProjectName(industry: string): string {
  const today = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
  return `${industry} — ${today}`;
}

function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

function fieldFromStep(step: Step): keyof Answers {
  if (step === "role") return "role";
  if (step === "industry") return "industry";
  if (step === "stage") return "stage";
  if (step === "readiness") return "readiness";
  return "expected_result";
}

// Минимальный markdown: **bold**
function renderMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}
