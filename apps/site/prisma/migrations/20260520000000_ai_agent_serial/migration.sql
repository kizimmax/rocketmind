-- Порядковый номер для сортировки AI-агентов в списках админки и в сайдбаре saas-teacher.
ALTER TABLE "ai_agents"
  ADD COLUMN "serial" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "ai_agents_serial_idx" ON "ai_agents" ("serial");
