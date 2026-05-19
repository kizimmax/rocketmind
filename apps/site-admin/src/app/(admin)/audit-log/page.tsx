"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Filter, RotateCcw } from "lucide-react";
import { Button, Input } from "@rocketmind/ui";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";

interface Participant {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
}

interface AuditEvent {
  id: string;
  actorId: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  metadata: Record<string, unknown> | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface ApiResponse {
  events: AuditEvent[];
  participants: Record<string, Participant>;
  nextCursor: string | null;
}

const ACTION_LABELS: Record<string, string> = {
  "login.success": "Вход",
  "login.failed": "Неудачный вход",
  "logout": "Выход",
  "password.reset_requested": "Запрошен сброс пароля",
  "password.reset_completed": "Пароль сброшен",
  "password.regenerated_by_admin": "Пароль перегенерирован админом",
  "password.changed_self": "Сменён свой пароль",
  "email.verification_requested": "Запрошено подтверждение email",
  "email.verified": "Email подтверждён",
  "email.secondary_added": "Добавлен доп. email",
  "email.secondary_removed": "Удалён доп. email",
  "email.changed_by_admin": "Email изменён админом",
  "user.created": "Пользователь создан",
  "user.frozen": "Заморожен",
  "user.unfrozen": "Разморожен",
  "user.deleted": "Удалён",
  "user.login_changed": "Изменён логин",
  "permissions.updated": "Права обновлены",
  "role.changed": "Изменена роль",
};

const ACTION_GROUPS: Array<{ title: string; codes: string[] }> = [
  { title: "Сессии", codes: ["login.success", "login.failed", "logout"] },
  {
    title: "Пароли",
    codes: [
      "password.changed_self",
      "password.regenerated_by_admin",
      "password.reset_requested",
      "password.reset_completed",
    ],
  },
  {
    title: "Email",
    codes: [
      "email.verification_requested",
      "email.verified",
      "email.secondary_added",
      "email.secondary_removed",
      "email.changed_by_admin",
    ],
  },
  {
    title: "Пользователи и права",
    codes: [
      "user.created",
      "user.frozen",
      "user.unfrozen",
      "user.deleted",
      "user.login_changed",
      "permissions.updated",
      "role.changed",
    ],
  },
];

function fmt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function actionLabel(action: string): string {
  return ACTION_LABELS[action] ?? action;
}

function participantLabel(id: string | null, map: Record<string, Participant>): string {
  if (!id) return "—";
  const p = map[id];
  if (!p) return id.slice(0, 8);
  return `${p.firstName} ${p.lastName} · ${p.login}`;
}

export default function AuditLogPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [participants, setParticipants] = useState<Record<string, Participant>>({});
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filters
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());
  const [actorLogin, setActorLogin] = useState("");
  const [targetLogin, setTargetLogin] = useState("");
  const [since, setSince] = useState("");
  const [until, setUntil] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (selectedActions.size > 0) p.set("actions", Array.from(selectedActions).join(","));
    if (actorLogin.trim()) p.set("actorLogin", actorLogin.trim());
    if (targetLogin.trim()) p.set("targetLogin", targetLogin.trim());
    if (since) p.set("since", new Date(since).toISOString());
    if (until) p.set("until", new Date(until).toISOString());
    return p.toString();
  }, [selectedActions, actorLogin, targetLogin, since, until]);

  function loadFirst() {
    setLoading(true);
    const url = `/api/admin/audit-log${queryString ? `?${queryString}` : ""}`;
    apiFetch(url)
      .then((r) => {
        if (r.status === 403) {
          toast.error("Доступ только у главного администратора");
          return null;
        }
        return r.json();
      })
      .then((data: ApiResponse | null) => {
        if (!data) return;
        setEvents(data.events);
        setParticipants(data.participants);
        setNextCursor(data.nextCursor);
      })
      .catch(() => toast.error("Не удалось загрузить журнал"))
      .finally(() => setLoading(false));
  }

  function loadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    const base = `/api/admin/audit-log${queryString ? `?${queryString}&` : "?"}`;
    apiFetch(`${base}cursor=${encodeURIComponent(nextCursor)}`)
      .then((r) => r.json())
      .then((data: ApiResponse) => {
        setEvents((prev) => [...prev, ...data.events]);
        setParticipants((prev) => ({ ...prev, ...data.participants }));
        setNextCursor(data.nextCursor);
      })
      .catch(() => toast.error("Не удалось подгрузить"))
      .finally(() => setLoadingMore(false));
  }

  useEffect(() => {
    loadFirst();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  function toggleAction(code: string) {
    setSelectedActions((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  function resetFilters() {
    setSelectedActions(new Set());
    setActorLogin("");
    setTargetLogin("");
    setSince("");
    setUntil("");
  }

  const hasFilters =
    selectedActions.size > 0 || actorLogin || targetLogin || since || until;

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-border">
        <h1 className="text-[length:var(--text-20)] font-semibold text-foreground">
          Журнал аудита
        </h1>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <Button variant="outline" onClick={resetFilters}>
              <RotateCcw size={14} className="mr-1" />
              Сбросить
            </Button>
          )}
          <Button variant="outline" onClick={() => setFiltersOpen((x) => !x)}>
            <Filter size={14} className="mr-1" />
            Фильтры
            {selectedActions.size > 0 && (
              <span className="ml-1 text-muted-foreground">({selectedActions.size})</span>
            )}
          </Button>
        </div>
      </div>

      {filtersOpen && (
        <div className="shrink-0 border-b border-border px-6 py-4 space-y-4 bg-rm-gray-2/20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">
                Логин инициатора
              </label>
              <Input
                value={actorLogin}
                onChange={(e) => setActorLogin(e.target.value)}
                placeholder="например: admin"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">
                Логин цели
              </label>
              <Input
                value={targetLogin}
                onChange={(e) => setTargetLogin(e.target.value)}
                placeholder="например: editor1"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">С даты</label>
              <Input type="datetime-local" value={since} onChange={(e) => setSince(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">По дату</label>
              <Input type="datetime-local" value={until} onChange={(e) => setUntil(e.target.value)} />
            </div>
          </div>

          <div className="space-y-3">
            {ACTION_GROUPS.map((group) => (
              <div key={group.title} className="space-y-1.5">
                <div className="text-[length:var(--text-11)] text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.codes.map((code) => {
                    const active = selectedActions.has(code);
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => toggleAction(code)}
                        className={`px-2.5 h-7 rounded border text-[length:var(--text-12)] cursor-pointer ${
                          active
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {actionLabel(code)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="p-6 text-muted-foreground">Загрузка…</div>
        ) : events.length === 0 ? (
          <div className="p-6 text-muted-foreground">События не найдены</div>
        ) : (
          <table className="w-full text-[length:var(--text-12)]">
            <thead className="sticky top-0 bg-background border-b border-border text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-normal w-[170px]">Когда</th>
                <th className="text-left px-3 py-3 font-normal w-[220px]">Действие</th>
                <th className="text-left px-3 py-3 font-normal">Инициатор</th>
                <th className="text-left px-3 py-3 font-normal">Цель</th>
                <th className="text-left px-3 py-3 font-normal w-[140px]">IP</th>
                <th className="text-left px-3 py-3 font-normal">Детали</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-b border-border hover:bg-rm-gray-2/30">
                  <td className="px-6 py-2.5 text-muted-foreground whitespace-nowrap">
                    {fmt(e.createdAt)}
                  </td>
                  <td className="px-3 py-2.5 text-foreground">{actionLabel(e.action)}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {participantLabel(e.actorId, participants)}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {e.targetType === "user" && e.targetId ? (
                      <Link
                        href={`/users/${e.targetId}`}
                        className="hover:text-foreground hover:underline"
                      >
                        {participantLabel(e.targetId, participants)}
                      </Link>
                    ) : (
                      participantLabel(e.targetId, participants)
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground font-mono text-[length:var(--text-11)]">
                    {e.ip ?? "—"}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    <MetadataCell metadata={e.metadata} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {nextCursor && !loading && (
          <div className="p-4 flex justify-center">
            <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? "Загрузка…" : "Загрузить ещё"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function MetadataCell({ metadata }: { metadata: Record<string, unknown> | null }) {
  if (!metadata) return <span className="text-muted-foreground/50">—</span>;
  const entries = Object.entries(metadata);
  if (entries.length === 0) return <span className="text-muted-foreground/50">—</span>;
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-0.5 max-w-[420px]">
      {entries.map(([k, v]) => (
        <span key={k} className="whitespace-nowrap">
          <span className="text-muted-foreground/70">{k}:</span>{" "}
          <span className="text-foreground/80">{String(v)}</span>
        </span>
      ))}
    </div>
  );
}
