import { Button } from "@rocketmind/ui";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 p-8">
        <div className="space-y-2 text-center">
          <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold uppercase tracking-tight">
            Войти
          </h1>
          <p className="text-[length:var(--text-14)] text-muted-foreground">
            Введите email для получения кода доступа
          </p>
        </div>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="email@example.com"
            className="w-full rounded-sm border border-border bg-rm-gray-1 px-4 py-2.5 text-[length:var(--text-14)] text-foreground placeholder:text-muted-foreground outline-none focus:border-ring transition-colors"
          />
          <Button className="w-full">Получить код</Button>
        </div>
      </div>
    </div>
  );
}
