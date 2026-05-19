-- CreateTable
CREATE TABLE "places" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "placeId" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "joinToken" TEXT,
    "joinTokenRotatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "programs_joinToken_key" ON "programs"("joinToken");

-- CreateTable
CREATE TABLE "mascots" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pack" TEXT,
    "imagePath" TEXT NOT NULL,
    "isBuiltIn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mascots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mascots_pack_idx" ON "mascots"("pack");

-- CreateTable
CREATE TABLE "ai_agents" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT '',
    "valueDescription" TEXT NOT NULL DEFAULT '',
    "avatarMascotId" TEXT,
    "avatarPath" TEXT,
    "targets" TEXT[],
    "n8nWebhookUrl" TEXT NOT NULL,
    "n8nSecret" TEXT,
    "systemPrompt" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_agents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_agents_slug_key" ON "ai_agents"("slug");

-- CreateTable
CREATE TABLE "program_agents" (
    "programId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,
    "availableSince" TIMESTAMP(3),

    CONSTRAINT "program_agents_pkey" PRIMARY KEY ("programId", "agentId")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "programId" TEXT,
    "joinedVia" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateTable
CREATE TABLE "student_projects" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profile" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_sessions" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "threadId" TEXT,
    "summary" TEXT,
    "lastMessageAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_sessions_projectId_agentId_key" ON "student_sessions"("projectId", "agentId");

-- CreateTable
CREATE TABLE "student_messages" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "student_messages_sessionId_idx" ON "student_messages"("sessionId");

-- CreateTable
CREATE TABLE "student_artifacts" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "agentId" TEXT,
    "kind" TEXT NOT NULL,
    "title" TEXT,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "student_artifacts_projectId_idx" ON "student_artifacts"("projectId");

-- CreateTable
CREATE TABLE "otp_codes" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "programId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "otp_codes_email_idx" ON "otp_codes"("email");

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_agents" ADD CONSTRAINT "ai_agents_avatarMascotId_fkey" FOREIGN KEY ("avatarMascotId") REFERENCES "mascots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_agents" ADD CONSTRAINT "program_agents_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_agents" ADD CONSTRAINT "program_agents_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "ai_agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_projects" ADD CONSTRAINT "student_projects_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_sessions" ADD CONSTRAINT "student_sessions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_sessions" ADD CONSTRAINT "student_sessions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "student_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_sessions" ADD CONSTRAINT "student_sessions_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "ai_agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_messages" ADD CONSTRAINT "student_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "student_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_artifacts" ADD CONSTRAINT "student_artifacts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "student_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
