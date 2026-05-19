"use client";

import { useState } from "react";
import { Dialog, DialogContent, Button, Input } from "@rocketmind/ui";
import { Loader2, ChevronRight } from "lucide-react";
import type { Student } from "@/lib/auth-context";

interface OnboardingModalProps {
  student: Student;
  onComplete: () => void | Promise<void>;
}

type Step =
  | { kind: "promo"; index: 0 | 1 | 2 | 3 }
  | { kind: "profile" }
  | { kind: "project" };

const PROMO_SLIDES: { title: string; body: string; image?: string }[] = [
  {
    title: "Добро пожаловать в Rocketmind Teacher",
    body: "Здесь вы будете работать с AI-экспертами над вашим проектом по ходу программы.",
    image: "/onboarding/slide-1.png",
  },
  {
    title: "Каждый AI-эксперт — отдельный наставник",
    body: "Они независимы, но видят контекст вашего проекта — не нужно объяснять одно и то же дважды.",
    image: "/onboarding/slide-2.png",
  },
  {
    title: "Артефакты сохраняются",
    body: "Канвасы и результаты диалогов остаются в проекте и доступны другим AI-экспертам.",
    image: "/onboarding/slide-3.png",
  },
  {
    title: "Доступ открывается по ходу программы",
    body: "Преподаватель открывает новых AI-экспертов каждый день. Заглядывайте в сайдбар.",
    image: "/onboarding/slide-4.png",
  },
];

export function OnboardingModal({ student, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<Step>(
    student.firstName ? { kind: "project" } : { kind: "promo", index: 0 },
  );

  const [firstName, setFirstName] = useState(student.firstName ?? "");
  const [lastName, setLastName] = useState(student.lastName ?? "");
  const [role, setRole] = useState(student.role ?? "");
  const [industry, setIndustry] = useState(student.industry ?? "");
  const [region, setRegion] = useState(student.region ?? "");
  const [projectName, setProjectName] = useState("");
  const [saving, setSaving] = useState(false);

  function nextPromo() {
    if (step.kind !== "promo") return;
    if (step.index < 3) {
      setStep({ kind: "promo", index: (step.index + 1) as 1 | 2 | 3 });
    } else {
      setStep({ kind: "profile" });
    }
  }

  async function saveProfile() {
    if (!firstName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/students/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, role, industry, region }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStep({ kind: "project" });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function skipProfile() {
    // Save whatever is already filled (or nothing) and move on
    setSaving(true);
    try {
      if (firstName.trim() || lastName.trim() || role.trim() || industry.trim() || region.trim()) {
        await fetch("/api/students/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, role, industry, region }),
        }).catch(() => {});
      }
      setStep({ kind: "project" });
    } finally {
      setSaving(false);
    }
  }

  async function createProject() {
    if (!projectName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/students/me/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName }),
      });
      if (!res.ok) throw new Error(await res.text());
      await onComplete();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent className="max-w-xl">
        {step.kind === "promo" && (
          <PromoSlide
            slide={PROMO_SLIDES[step.index]}
            index={step.index}
            total={PROMO_SLIDES.length}
            onNext={nextPromo}
            onSkip={() => setStep({ kind: "profile" })}
          />
        )}

        {step.kind === "profile" && (
          <div className="flex flex-col gap-5 py-2">
            <div>
              <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
                Расскажи о себе
              </h2>
              <p className="mt-1 text-[length:var(--text-14)] text-muted-foreground">
                Это поможет ИИ-агентам говорить с тобой на одном языке и учитывать
                контекст твоего бизнеса.
              </p>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
                  Имя
                </label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
                  Фамилия
                </label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
                  Роль в бизнесе
                </label>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Укажите роль"
                />
                <p className="mt-1 text-[length:var(--text-12)] text-muted-foreground/70">
                  Например: генеральный директор
                </p>
              </div>
              <div>
                <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
                  Сфера деятельности
                </label>
                <Input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Укажите сферу"
                />
                <p className="mt-1 text-[length:var(--text-12)] text-muted-foreground/70">
                  Например: производство, образование
                </p>
              </div>
              <div>
                <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
                  Регион
                </label>
                <Input
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Укажите регион"
                />
                <p className="mt-1 text-[length:var(--text-12)] text-muted-foreground/70">
                  Например: Московская область
                </p>
              </div>
            </div>
            <Button onClick={saveProfile} disabled={!firstName.trim() || saving}>
              {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              Продолжить
            </Button>
            <button
              type="button"
              onClick={skipProfile}
              disabled={saving}
              className="text-center text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-[var(--rm-yellow-100)] hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50"
            >
              Заполнить позже
            </button>
          </div>
        )}

        {step.kind === "project" && (
          <div className="flex flex-col gap-5 py-2">
            <div className="text-center">
              <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
                Создать первый проект
              </h2>
              <p className="mt-1 text-[length:var(--text-14)] text-muted-foreground">
                Над чем будете работать в программе?
              </p>
            </div>
            <div>
              <label className="mb-1 block text-[length:var(--text-12)] text-muted-foreground">
                Название проекта
              </label>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="напр. Бизнес-модель для AI-консалтинга"
                autoFocus
              />
            </div>
            <Button onClick={createProject} disabled={!projectName.trim() || saving}>
              {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              Создать
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PromoSlide({
  slide,
  index,
  total,
  onNext,
  onSkip,
}: {
  slide: { title: string; body: string; image?: string };
  index: number;
  total: number;
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="flex flex-col gap-5 py-2">
      <div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded bg-rm-gray-1/40">
        {slide.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={slide.image}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}
      </div>
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
          {slide.title}
        </h2>
        <p className="mt-2 text-[length:var(--text-14)] text-muted-foreground">
          {slide.body}
        </p>
      </div>
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-foreground" : "bg-foreground/20"}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onSkip}>
          Пропустить
        </Button>
        <Button size="sm" onClick={onNext}>
          {index < total - 1 ? (
            <>
              Дальше <ChevronRight className="ml-1 h-4 w-4" />
            </>
          ) : (
            "Продолжить"
          )}
        </Button>
      </div>
    </div>
  );
}
