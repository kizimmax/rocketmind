"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth, type Student } from "@/lib/auth-context";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@rocketmind/ui";
import { LogOut, UserCircle, Lock, EllipsisVertical, Sun, Moon } from "lucide-react";

type FontSize = "sm" | "md" | "lg";

const FONT_SIZE_MAP: Record<FontSize, string> = {
  sm: "100%",
  md: "112.5%",
  lg: "125%",
};

function applyFontSize(size: FontSize) {
  document.documentElement.style.fontSize = FONT_SIZE_MAP[size];
}

// Единый тип агента — из lib/ivan-auth (маппер mapAgent). Импорт для локального
// использования + ре-экспорт, чтобы `{ TeacherAgent } from "./teacher-sidebar"`
// у существующих потребителей не ломался.
import type { TeacherAgent } from "@/lib/ivan-auth";
export type { TeacherAgent };

interface TeacherSidebarProps {
  student: Student;
  agents: TeacherAgent[];
  selectedAgentId: string | null;
  onSelectAgent: (id: string) => void;
  loading: boolean;
  /** Закрыть мобильный drawer после выбора/перехода (на десктопе не передаётся). */
  onNavigate?: () => void;
}

export function TeacherSidebar({
  student,
  agents,
  selectedAgentId,
  onSelectAgent,
  loading,
  onNavigate,
}: TeacherSidebarProps) {
  const { logout } = useAuth();

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-border bg-rm-gray-1/30">
      {/* Текстовый логотип сверху — как LogoHeader в saas */}
      <TeacherLogoHeader />

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
                    onClick={() => {
                      onSelectAgent(agent.id);
                      onNavigate?.();
                    }}
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

      {/* User — меню: размер шрифта, тема, профиль, выход (как UserMenu в saas) */}
      <div className="border-t border-border px-3 py-3">
        <TeacherUserMenu student={student} onLogout={logout} onNavigate={onNavigate} />
      </div>
    </aside>
  );
}

function TeacherLogoHeader() {
  const { resolvedTheme } = useTheme();
  const bp = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const src =
    resolvedTheme === "dark"
      ? `${bp}/text_logo_dark_background_en.svg`
      : `${bp}/text_logo_light_background_en.svg`;

  return (
    <div className="flex items-center border-b border-border px-4 py-3">
      <Link href="/" aria-label="На главную">
        <Image src={src} alt="Rocketmind" width={140} height={24} priority />
      </Link>
    </div>
  );
}

function TeacherUserMenu({
  student,
  onLogout,
  onNavigate,
}: {
  student: Student;
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState<FontSize>("sm");

  useEffect(() => {
    const saved = (localStorage.getItem("rm-font-size") as FontSize) ?? "sm";
    setFontSize(saved);
    applyFontSize(saved);
  }, []);

  function handleFontSize(size: FontSize) {
    setFontSize(size);
    localStorage.setItem("rm-font-size", size);
    applyFontSize(size);
  }

  const displayName =
    [student.firstName, student.lastName].filter(Boolean).join(" ") || student.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-sm px-1 py-1 transition-colors hover:bg-foreground/5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-foreground/10">
            <UserCircle className="h-5 w-5 text-foreground" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col text-left">
            <span className="truncate text-[length:var(--text-12)] text-foreground">
              {displayName}
            </span>
            {student.role && (
              <span className="truncate text-[length:var(--text-10)] text-muted-foreground">
                {student.role}
              </span>
            )}
          </div>
          <EllipsisVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="z-[80] w-64">
        {/* Размер шрифта */}
        <div className="flex items-center gap-2 px-3 py-3">
          <span className="flex-1 text-[length:var(--text-16)]">Размер</span>
          <div className="flex gap-1">
            {(["sm", "md", "lg"] as const).map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => handleFontSize(s)}
                className={`flex h-9 w-9 items-center justify-center rounded-sm font-medium transition-colors ${
                  fontSize === s
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground"
                }`}
                style={{ fontSize: i === 0 ? "12px" : i === 1 ? "15px" : "18px" }}
              >
                Аа
              </button>
            ))}
          </div>
        </div>
        <DropdownMenuSeparator />
        {/* Смена темы */}
        <DropdownMenuItem
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="h-auto py-3 text-[length:var(--text-16)] [&_svg]:!size-5"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="mr-3 h-5 w-5" />
          ) : (
            <Moon className="mr-3 h-5 w-5" />
          )}
          {resolvedTheme === "dark" ? "Светлая тема" : "Тёмная тема"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* Профиль / анкета */}
        <DropdownMenuItem asChild className="h-auto py-3 text-[length:var(--text-16)] [&_svg]:!size-5">
          <Link href="/profile" onClick={() => onNavigate?.()}>
            <UserCircle className="mr-3 h-5 w-5" />
            Профиль
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="h-auto py-3 text-[length:var(--text-16)] [&_svg]:!size-5 text-[var(--rm-red-500)]"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
