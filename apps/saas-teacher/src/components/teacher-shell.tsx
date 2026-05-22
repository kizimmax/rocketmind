"use client";

import { useEffect, useRef, useState } from "react";
import { TeacherSidebar, type TeacherAgent } from "./teacher-sidebar";
import { TeacherMobileHeader } from "./teacher-mobile-header";
import { TeacherChat } from "./teacher-chat";
import { OnboardingModal } from "./onboarding-modal";
import { ProgramClosedModal } from "./program-closed-modal";
import { useAuth, type Student } from "@/lib/auth-context";
import { getAccessibleAgents } from "@/lib/ivan-client";

interface TeacherShellProps {
  student: Student;
}

export function TeacherShell({ student }: TeacherShellProps) {
  const { refresh } = useAuth();
  const [agents, setAgents] = useState<TeacherAgent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const shellRef = useRef<HTMLDivElement>(null);

  // Высота шелла = visualViewport (корректно учитывает виртуальную клавиатуру
  // на iOS) — как в apps/saas (app)/layout.tsx.
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    function update() {
      const vv = window.visualViewport;
      if (vv) {
        shell!.style.height = `${vv.height}px`;
        shell!.style.transform = `translateY(${vv.offsetTop}px)`;
      } else {
        shell!.style.height = `${window.innerHeight}px`;
        shell!.style.transform = "";
      }
    }

    update();

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", update);
      vv.addEventListener("scroll", update);
      return () => {
        vv.removeEventListener("resize", update);
        vv.removeEventListener("scroll", update);
      };
    }

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Программа закрыта — show one-time модалку, потом чат уходит в read-only.
  const programClosed = student.program?.isActive === false;
  const programKey = student.program?.id ?? "";
  const [programClosedModalShown, setProgramClosedModalShown] = useState(false);
  useEffect(() => {
    if (!programClosed || !programKey) {
      setProgramClosedModalShown(false);
      return;
    }
    const seenKey = `rm_program_closed_seen_${programKey}`;
    const alreadySeen =
      typeof window !== "undefined" && localStorage.getItem(seenKey) === "1";
    setProgramClosedModalShown(alreadySeen);
  }, [programClosed, programKey]);

  function dismissProgramClosed() {
    if (programKey && typeof window !== "undefined") {
      localStorage.setItem(`rm_program_closed_seen_${programKey}`, "1");
    }
    setProgramClosedModalShown(true);
  }

  // Онбординг — только пока не заполнено имя. Шаг «создать проект» убран:
  // у Ивана нет модели проектов, чат идёт напрямую к User+Group (Phase 3).
  const needsOnboarding = !student.firstName;

  function loadAgents() {
    setLoading(true);
    getAccessibleAgents()
      .then((all) => {
        const available = all.filter((a) => a.isAvailable);
        setAgents(available);
        setSelectedAgentId((prev) =>
          prev && available.some((a) => a.id === prev)
            ? prev
            : (available[0]?.id ?? null),
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAgents();
  }, []);

  const selectedAgent =
    agents.find((a) => a.id === selectedAgentId) ?? null;

  return (
    <div
      ref={shellRef}
      className="fixed inset-x-0 top-0 flex overflow-hidden bg-background"
      style={{ height: "100dvh" }}
    >
      {/* Десктоп-сайдбар */}
      <div className="hidden lg:flex">
        <TeacherSidebar
          student={student}
          agents={agents}
          selectedAgentId={selectedAgentId}
          onSelectAgent={setSelectedAgentId}
          loading={loading}
        />
      </div>

      {/* Мобила: шапка + контент стопкой */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TeacherMobileHeader
          student={student}
          agents={agents}
          selectedAgentId={selectedAgentId}
          onSelectAgent={setSelectedAgentId}
          loading={loading}
          selectedAgent={selectedAgent}
        />
        <main className="flex flex-1 flex-col overflow-hidden">
          <TeacherChat
            agents={agents}
            selectedAgent={selectedAgent}
            programClosed={programClosed}
          />
        </main>
      </div>

      {needsOnboarding && (
        <OnboardingModal
          student={student}
          onComplete={async () => {
            await refresh();
            loadAgents();
          }}
        />
      )}

      {programClosed && !needsOnboarding && (
        <ProgramClosedModal
          programTitle={student.program?.title ?? ""}
          open={!programClosedModalShown}
          onClose={dismissProgramClosed}
        />
      )}
    </div>
  );
}
