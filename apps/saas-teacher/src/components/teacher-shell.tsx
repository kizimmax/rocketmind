"use client";

import { useEffect, useState } from "react";
import { TeacherSidebar, type TeacherAgent } from "./teacher-sidebar";
import { TeacherChat } from "./teacher-chat";
import { OnboardingModal } from "./onboarding-modal";
import { ProgramClosedModal } from "./program-closed-modal";
import { useAuth, type Student } from "@/lib/auth-context";

type ActiveProgramResponse = {
  program: {
    id: string;
    title: string;
    startsAt: string;
    endsAt: string;
    place: { name: string } | null;
  } | null;
  agents: TeacherAgent[];
};

interface TeacherShellProps {
  student: Student;
}

export function TeacherShell({ student }: TeacherShellProps) {
  const { refresh } = useAuth();
  const [agents, setAgents] = useState<TeacherAgent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  const needsOnboarding =
    !student.firstName || !student.project;

  function loadAgents() {
    setLoading(true);
    fetch("/api/programs/active")
      .then((r) => r.json())
      .then((data: ActiveProgramResponse) => {
        const available = data.agents.filter((a) => a.isAvailable);
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

  const project = student.project;
  const selectedAgent =
    agents.find((a) => a.id === selectedAgentId) ?? null;

  return (
    <div className={`flex min-h-dvh ${needsOnboarding ? "overflow-hidden" : ""}`}>
      <TeacherSidebar
        student={student}
        project={project}
        agents={agents}
        selectedAgentId={selectedAgentId}
        onSelectAgent={setSelectedAgentId}
        loading={loading}
      />
      <main className="flex flex-1 flex-col">
        {selectedAgent && project ? (
          <TeacherChat
            agent={selectedAgent}
            projectId={project.id}
            programClosed={programClosed}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center px-6 text-center text-muted-foreground">
            {agents.length === 0
              ? "Преподаватель ещё не открыл доступ ни к одному AI-эксперту. Загляните позже."
              : "Выберите AI-эксперта в сайдбаре."}
          </div>
        )}
      </main>

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
