import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setProgramIntentCookie } from "@/lib/student-auth";

/**
 * /join?p=<programId>&t=<joinToken>
 *
 * Точка входа после сканирования QR. Валидирует токен против Program.joinToken
 * и, если совпадает, кладёт programId в HttpOnly cookie перед редиректом в
 * /login. После успешного OTP verify-code привязывает Student к программе.
 *
 * Если токен не валиден — показываем понятное сообщение, чтобы старые QR
 * после регенерации не молча редиректили в логин.
 */
export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string; t?: string }>;
}) {
  const { p, t } = await searchParams;

  if (!p || !t) {
    return (
      <ErrorBlock
        title="Ссылка некорректна"
        description="В QR должны быть параметры программы и токена."
      />
    );
  }

  const program = await prisma.program.findUnique({ where: { id: p } });
  if (!program || program.joinToken !== t) {
    return (
      <ErrorBlock
        title="Этот QR больше не действителен"
        description="Скорее всего, преподаватель обновил QR. Попросите свежий — старые ссылки перестают работать после регенерации."
      />
    );
  }

  await setProgramIntentCookie(program.id);
  redirect("/login");
}

function ErrorBlock({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-[length:var(--text-24)] font-bold text-foreground">{title}</h1>
      <p className="max-w-md text-[length:var(--text-14)] text-muted-foreground">
        {description}
      </p>
    </main>
  );
}
