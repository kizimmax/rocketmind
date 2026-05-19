import { NextResponse } from "next/server";
import { getCurrentStudent } from "@/lib/student-auth";
import { prisma } from "@/lib/prisma";
import { getTransport, type AgentContext } from "@/lib/agents";

/**
 * POST /api/chat
 * Body: { projectId, agentId, content }
 *
 * Поток:
 *  1. Авторизуем студента, проверяем что projectId принадлежит ему и что
 *     agentId доступен в его программе (ProgramAgent.isAvailable=true).
 *  2. Апсёртим StudentSession для пары (projectId, agentId).
 *  3. Сохраняем входящее user-сообщение.
 *  4. Собираем общий контекст: профиль + анкета + последние артефакты
 *     + сводки других агентов проекта.
 *  5. Транспорт (мок или n8n) стримит AgentStreamEvent.
 *  6. Чанки delta-текста накапливаем в финальное assistant-сообщение и
 *     одновременно прокидываем в SSE на клиент. По завершении сохраняем
 *     результат + summary + artifacts.
 */
export async function POST(request: Request) {
  const student = await getCurrentStudent();
  if (!student) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const projectId = String(body.projectId ?? "");
  const agentId = String(body.agentId ?? "");
  const content = String(body.content ?? "").trim();

  if (!projectId || !agentId || !content) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const project = await prisma.studentProject.findUnique({
    where: { id: projectId },
  });
  if (!project || project.studentId !== student.id) {
    return NextResponse.json({ error: "project_not_found" }, { status: 404 });
  }

  const agent = await prisma.aiAgent.findUnique({ where: { id: agentId } });
  if (!agent) {
    return NextResponse.json({ error: "agent_not_found" }, { status: 404 });
  }

  // Verify agent is available for this student's program; also enforce that
  // the program itself is still active (super-admin может закрыть программу —
  // тогда новые сообщения недоступны до оформления подписки).
  if (student.programId) {
    const program = await prisma.program.findUnique({
      where: { id: student.programId },
      select: { isActive: true },
    });
    if (program && program.isActive === false) {
      return NextResponse.json({ error: "program_closed" }, { status: 403 });
    }
    const pa = await prisma.programAgent.findUnique({
      where: { programId_agentId: { programId: student.programId, agentId } },
    });
    if (!pa?.isAvailable) {
      return NextResponse.json({ error: "agent_not_available" }, { status: 403 });
    }
  }

  // Upsert session
  const session = await prisma.studentSession.upsert({
    where: { projectId_agentId: { projectId, agentId } },
    update: { lastMessageAt: new Date() },
    create: {
      studentId: student.id,
      projectId,
      agentId,
      lastMessageAt: new Date(),
    },
  });

  await prisma.studentMessage.create({
    data: { sessionId: session.id, role: "user", content },
  });

  // Build context
  const [historyRows, artifactRows, otherSessions] = await Promise.all([
    prisma.studentMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: "asc" },
      take: 50,
    }),
    prisma.studentArtifact.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.studentSession.findMany({
      where: { projectId, agentId: { not: agentId }, summary: { not: null } },
      include: { agent: { select: { slug: true } } },
    }),
  ]);

  const context: AgentContext = {
    project: { id: project.id, name: project.name, profile: project.profile },
    student: {
      id: student.id,
      email: student.email,
      firstName: student.firstName,
      role: student.role,
    },
    history: historyRows.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    })),
    artifacts: artifactRows.map((a) => ({ kind: a.kind, content: a.content })),
    summaries: otherSessions
      .filter((s) => s.summary)
      .map((s) => ({ agentSlug: s.agent.slug, summary: s.summary as string })),
  };

  const transport = getTransport();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function emit(event: unknown) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      }
      let assistantText = "";
      let summary: string | null = null;
      const artifacts: { kind: string; title?: string; content: unknown }[] = [];

      try {
        for await (const evt of transport.send({
          agent,
          userMessage: content,
          context,
        })) {
          if (evt.type === "delta") {
            assistantText += evt.text;
            emit(evt);
          } else if (evt.type === "summary") {
            summary = evt.summary;
          } else if (evt.type === "artifact") {
            artifacts.push({
              kind: evt.kind,
              title: evt.title,
              content: evt.content,
            });
          } else if (evt.type === "done") {
            break;
          }
        }
      } catch (err) {
        emit({
          type: "delta",
          text: `\n(Ошибка стрима: ${(err as Error).message})`,
        });
      }

      // Persist
      await prisma.studentMessage.create({
        data: {
          sessionId: session.id,
          role: "assistant",
          content: assistantText,
        },
      });
      if (summary) {
        await prisma.studentSession.update({
          where: { id: session.id },
          data: { summary },
        });
      }
      for (const art of artifacts) {
        await prisma.studentArtifact.create({
          data: {
            projectId,
            agentId,
            kind: art.kind,
            title: art.title ?? null,
            content: art.content as object,
          },
        });
      }

      emit({ type: "done" });
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
