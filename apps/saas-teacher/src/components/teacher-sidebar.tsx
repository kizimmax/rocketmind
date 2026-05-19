"use client";

import Link from "next/link";
import { useAuth, type Student, type StudentProjectSummary } from "@/lib/auth-context";
import { Button } from "@rocketmind/ui";
import { LogOut, UserCircle, Lock } from "lucide-react";

export type TeacherAgent = {
  id: string;
  slug: string;
  name: string;
  role: string;
  valueDescription: string;
  avatarUrl: string | null;
  isAvailable: boolean;
};

interface TeacherSidebarProps {
  student: Student;
  project: StudentProjectSummary | null;
  agents: TeacherAgent[];
  selectedAgentId: string | null;
  onSelectAgent: (id: string) => void;
  loading: boolean;
}

export function TeacherSidebar({
  student,
  project,
  agents,
  selectedAgentId,
  onSelectAgent,
  loading,
}: TeacherSidebarProps) {
  const { logout } = useAuth();

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-rm-gray-1/30">
      {/* Project header */}
      <div className="border-b border-border px-4 py-3">
        <span className="text-[length:var(--text-10)] uppercase tracking-wide text-muted-foreground">
          Проект
        </span>
        <div className="mt-0.5 truncate text-[length:var(--text-14)] font-medium text-foreground">
          {project?.name ?? "—"}
        </div>
      </div>

      {/* Agents list */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <div className="px-2 pb-2 text-[length:var(--text-10)] uppercase tracking-wide text-muted-foreground">
          AI-эксперты
        </div>
        {loading ? (
          <p className="px-2 text-[length:var(--text-12)] text-muted-foreground">
            Загрузка…
          </p>
        ) : agents.length === 0 ? (
          <div className="rounded border border-dashed border-border px-3 py-4 text-[length:var(--text-12)] text-muted-foreground">
            <Lock className="mb-1 h-4 w-4" />
            Преподаватель ещё не открыл доступ. Скоро здесь появятся AI-эксперты.
          </div>
        ) : (
          <ul className="flex flex-col gap-1">
            {agents.map((agent) => {
              const isSelected = agent.id === selectedAgentId;
              return (
                <li key={agent.id}>
                  <button
                    type="button"
                    onClick={() => onSelectAgent(agent.id)}
                    className={`flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left transition-colors ${
                      isSelected
                        ? "bg-foreground/10 text-foreground"
                        : "text-muted-foreground hover:bg-foreground/5"
                    }`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-rm-gray-1/60">
                      {agent.avatarUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={agent.avatarUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-[length:var(--text-14)] font-medium text-foreground">
                        {agent.name}
                      </span>
                      {agent.role && (
                        <span className="truncate text-[length:var(--text-10)] text-muted-foreground">
                          {agent.role}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* User — клик ведёт на /profile (анкета редактируется там) */}
      <div className="flex items-center gap-2 border-t border-border px-3 py-3">
        <Link
          href="/profile"
          className="flex min-w-0 flex-1 items-center gap-2 hover:opacity-80 transition-opacity"
          title="Профиль и анкета"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-foreground/10">
            <UserCircle className="h-5 w-5 text-foreground" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[length:var(--text-12)] text-foreground">
              {[student.firstName, student.lastName].filter(Boolean).join(" ") ||
                student.email}
            </span>
            {student.role && (
              <span className="truncate text-[length:var(--text-10)] text-muted-foreground">
                {student.role}
              </span>
            )}
          </div>
        </Link>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => logout()}
          title="Выйти"
        >
          <LogOut className="h-3.5 w-3.5" />
        </Button>
      </div>
    </aside>
  );
}
