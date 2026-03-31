import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Radio,
  Separator,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@rocketmind/ui"
import { ArrowRight, Bell, Search, Sparkles, Trash2 } from "lucide-react"

const badgeVariants = [
  { label: "Neutral", variant: "neutral" as const },
  { label: "Yellow", variant: "yellow-subtle" as const },
  { label: "Violet", variant: "violet-subtle" as const },
  { label: "Sky", variant: "sky-subtle" as const },
  { label: "Terracotta", variant: "terracotta-subtle" as const },
  { label: "Pink", variant: "pink-subtle" as const },
  { label: "Blue", variant: "blue-subtle" as const },
  { label: "Red", variant: "red-subtle" as const },
  { label: "Green", variant: "green-subtle" as const },
]

const colorTokens = [
  { name: "Background", value: "var(--background)" },
  { name: "Card", value: "var(--card)" },
  { name: "Border", value: "var(--border)" },
  { name: "Yellow / 100", value: "var(--rm-yellow-100)" },
  { name: "Yellow / 900", value: "var(--rm-yellow-900)" },
  { name: "Gray / 1", value: "var(--rm-gray-1)" },
  { name: "Gray / 2", value: "var(--rm-gray-2)" },
  { name: "Gray / 3", value: "var(--rm-gray-3)" },
]

const exportNotes = [
  "Маршрут собран без хедера, сайдбара и dev-служебных блоков.",
  "Лучше импортировать секциями: hero, tokens, primitives, cards.",
  "Открывайте страницу на масштабе 100% и в светлой теме.",
]

function ExportSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-6 rounded-lg border border-border bg-card p-8">
      <div className="flex flex-col gap-3">
        <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground">
          {eyebrow}
        </span>
        <div className="flex flex-col gap-2">
          <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] uppercase leading-[1.05] tracking-[-0.01em] text-foreground">
            {title}
          </h2>
          <p className="max-w-[720px] text-[length:var(--text-16)] leading-[1.5] text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  )
}

function ToneTile({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-sm border border-border bg-background p-4">
      <div
        className="h-24 rounded-sm border border-border"
        style={{ backgroundColor: value }}
      />
      <div className="flex flex-col gap-1">
        <p className="text-[length:var(--text-14)] font-medium text-foreground">{name}</p>
        <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.04em] text-muted-foreground">
          {value}
        </p>
      </div>
    </div>
  )
}

export default function FigmaExportPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-8 px-8 py-8">
        <section className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="grid gap-px bg-border lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col gap-8 bg-background p-8">
              <div className="flex flex-col gap-4">
                <Badge variant="yellow-subtle" size="md" className="w-fit">
                  Figma Export
                </Badge>
                <div className="flex flex-col gap-4">
                  <h1 className="max-w-[840px] font-[family-name:var(--font-heading-family)] text-[length:var(--text-52)] uppercase leading-[0.96] tracking-[-0.02em] text-foreground">
                    Rocketmind DS canvas for clean import into Figma
                  </h1>
                  <p className="max-w-[760px] text-[length:var(--text-18)] leading-[1.32] text-muted-foreground">
                    Страница собирает токены и ключевые компоненты в плоскую витрину без навигации. Импортируйте её в Figma как отдельные editable-группы и уже там превращайте в компоненты и variants.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {exportNotes.map((note, index) => (
                  <div key={note} className="rounded-sm border border-border bg-card p-4">
                    <p className="mb-2 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground">
                      Step {index + 1}
                    </p>
                    <p className="text-[length:var(--text-14)] leading-[1.4] text-foreground">{note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 bg-card p-8">
              <div className="rounded-sm border border-border bg-background p-5">
                <p className="mb-3 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground">
                  Suggested Frame
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between rounded-sm border border-border bg-card px-4 py-3">
                    <span className="text-[length:var(--text-14)] text-foreground">Desktop canvas</span>
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.04em] text-muted-foreground">
                      1560 px
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-sm border border-border bg-card px-4 py-3">
                    <span className="text-[length:var(--text-14)] text-foreground">Section gap</span>
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.04em] text-muted-foreground">
                      32 px
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-sm border border-border bg-card px-4 py-3">
                    <span className="text-[length:var(--text-14)] text-foreground">Card padding</span>
                    <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.04em] text-muted-foreground">
                      32 px
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-sm border border-border bg-background p-5">
                <p className="mb-3 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground">
                  Import Order
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="neutral" size="sm">Hero</Badge>
                  <Badge variant="neutral" size="sm">Color tokens</Badge>
                  <Badge variant="neutral" size="sm">Typography</Badge>
                  <Badge variant="neutral" size="sm">Buttons</Badge>
                  <Badge variant="neutral" size="sm">Forms</Badge>
                  <Badge variant="neutral" size="sm">Cards</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ExportSection
          eyebrow="Tokens"
          title="Color palette"
          description="Базовые поверхности и опорные тона, которыми удобно собрать foundation-стили в Figma Variables или быстрые color styles."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {colorTokens.map((token) => (
              <ToneTile key={token.name} name={token.name} value={token.value} />
            ))}
          </div>
        </ExportSection>

        <ExportSection
          eyebrow="Typography"
          title="Type specimens"
          description="Крупные заголовки, интерфейсные подписи и body-текст собраны без вспомогательных описаний, чтобы импорт дал чистые текстовые слои."
        >
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col gap-4 rounded-sm border border-border bg-background p-6">
              <p className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-52)] uppercase leading-[0.96] tracking-[-0.02em] text-foreground">
                Agent workspace
              </p>
              <p className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] uppercase leading-[1.05] tracking-[-0.01em] text-foreground">
                Case summary and payment flow
              </p>
              <p className="text-[length:var(--text-18)] leading-[1.32] text-muted-foreground">
                Rocketmind помогает быстро запускать кейсы через AI-агентов, сохранять контекст диалога и доводить пользователя до следующего бизнес-шага.
              </p>
              <p className="text-[length:var(--text-16)] leading-[1.5] text-foreground">
                Интерфейсный copy должен оставаться спокойным и плотным, а акцент строится на структуре, расстояниях и жёлтом action-tone.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-sm border border-border bg-background p-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground">
                  Label / caption
                </span>
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.04em] text-muted-foreground">
                  Mono
                </span>
              </div>
              <p className="text-[length:var(--text-14)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-foreground">
                Billing state
              </p>
              <p className="text-[length:var(--text-12)] font-[family-name:var(--font-caption-family)] text-muted-foreground">
                INV-2048 / 30 MAR 2026 / 14:25
              </p>
              <Separator />
              <div className="flex flex-wrap gap-2">
                <Badge variant="green-subtle" size="sm">Active</Badge>
                <Badge variant="yellow-subtle" size="sm">Pending</Badge>
                <Badge variant="red-subtle" size="sm">Blocked</Badge>
              </div>
            </div>
          </div>
        </ExportSection>

        <ExportSection
          eyebrow="Primitives"
          title="Buttons, badges and switches"
          description="Самые важные интерактивные паттерны собраны в повторяемые линейки, которые потом проще превратить в variants внутри Figma."
        >
          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-4 rounded-sm border border-border bg-background p-6">
              <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground">
                Buttons
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="default" size="lg">Запустить агент</Button>
                <Button variant="secondary" size="lg">Подробнее</Button>
                <Button variant="ghost" size="lg">Отмена</Button>
                <Button variant="destructive" size="lg">
                  <Trash2 />
                  Удалить
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="default" size="default">Primary</Button>
                <Button variant="secondary" size="default">Secondary</Button>
                <Button variant="ghost" size="default">Ghost</Button>
                <Button variant="outline" size="default">Outline</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="default" size="sm">SM</Button>
                <Button variant="default" size="xs">XS</Button>
                <Button variant="ghost" size="icon"><Bell /></Button>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-sm border border-border bg-background p-6">
                <p className="mb-4 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground">
                  Badge variants
                </p>
                <div className="flex flex-wrap gap-2">
                  {badgeVariants.map((item) => (
                    <Badge key={item.label} variant={item.variant} size="md">
                      {item.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-sm border border-border bg-background p-6">
                <p className="mb-4 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground">
                  Choice controls
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="flex items-center gap-3 rounded-sm border border-border bg-card px-4 py-3">
                    <Checkbox defaultChecked />
                    <span className="text-[length:var(--text-14)] text-foreground">Email alerts</span>
                  </label>
                  <label className="flex items-center gap-3 rounded-sm border border-border bg-card px-4 py-3">
                    <Radio defaultChecked name="export-mode" />
                    <span className="text-[length:var(--text-14)] text-foreground">Single case</span>
                  </label>
                  <div className="flex items-center justify-between rounded-sm border border-border bg-card px-4 py-3">
                    <span className="text-[length:var(--text-14)] text-foreground">Auto paywall</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ExportSection>

        <ExportSection
          eyebrow="Forms"
          title="Inputs and chat composer"
          description="Поля сгруппированы так, чтобы HTML-to-Figma импортировал и одиночные input-patterns, и более живой чат-композер с реальными соседями."
        >
          <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="flex flex-col gap-4 rounded-sm border border-border bg-background p-6">
              <Input size="lg" placeholder="Название кейса" defaultValue="Аудит onboarding-воронки" />
              <Input size="md" placeholder="Email" defaultValue="team@rocketmind.ru" />
              <Input size="sm" placeholder="Search agent" defaultValue="Sales Copilot" />
              <Input size="xs" placeholder="Slug" defaultValue="sales-copilot" />
            </div>

            <div className="flex flex-col gap-4 rounded-sm border border-border bg-background p-6">
              <div className="flex items-center gap-2">
                <Badge variant="neutral" size="sm">Chat</Badge>
                <Badge variant="yellow-subtle" size="sm">Agent ready</Badge>
              </div>
              <Textarea
                variant="chat"
                defaultValue="Нужно оценить кейс, сформировать план внедрения и вернуть ссылку на оплату следующим сообщением."
              />
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground">
                  <span>Context locked</span>
                  <span>v1.1</span>
                </div>
                <Button variant="default" size="default">
                  Отправить
                  <ArrowRight />
                </Button>
              </div>
            </div>
          </div>
        </ExportSection>

        <ExportSection
          eyebrow="Navigation"
          title="Tabs and compact surfaces"
          description="Небольшие навигационные композиции лучше импортировать отдельно, чтобы потом быстро превратить их в component sets без лишней разметки."
        >
          <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-sm border border-border bg-background p-6">
              <Tabs defaultValue="summary">
                <TabsList>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="dialog">Dialog</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="pt-4">
                  <p className="text-[length:var(--text-14)] text-muted-foreground">
                    Структура кейса, ключевые артефакты и следующий рекомендуемый шаг для менеджера.
                  </p>
                </TabsContent>
                <TabsContent value="dialog" className="pt-4">
                  <p className="text-[length:var(--text-14)] text-muted-foreground">
                    История сообщений между пользователем и агентом с системными статусами.
                  </p>
                </TabsContent>
                <TabsContent value="files" className="pt-4">
                  <p className="text-[length:var(--text-14)] text-muted-foreground">
                    Бриф, коммерческое предложение и экспортированные результаты анализа.
                  </p>
                </TabsContent>
              </Tabs>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <Badge variant="blue-subtle" size="sm" className="w-fit">Insight</Badge>
                  <CardTitle>Case progress</CardTitle>
                  <CardDescription>AI-агент завершил сбор контекста и ждёт подтверждение оплаты.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-sm border border-border bg-background px-4 py-3">
                    <span className="text-[length:var(--text-14)] text-muted-foreground">Completion</span>
                    <span className="text-[length:var(--text-14)] font-medium text-foreground">82%</span>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground">
                    Updated 2 min ago
                  </span>
                  <Button variant="ghost" size="sm">Open</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar size="md">
                      <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" />
                      <AvatarFallback>AK</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                      <CardTitle>Agent analyst</CardTitle>
                      <CardDescription>Финансовая диагностика и приоритизация рисков</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge variant="green-subtle" size="sm">Online</Badge>
                  <Badge variant="neutral" size="sm">n8n connected</Badge>
                  <Badge variant="yellow-subtle" size="sm">Payment ready</Badge>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="secondary" size="sm">
                    <Sparkles />
                    Run
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Search />
                    Inspect
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </ExportSection>
      </div>
    </main>
  )
}
