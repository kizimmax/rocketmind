-- CreateTable
CREATE TABLE "preview_drafts" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "preview_drafts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "preview_drafts_slug_type_idx" ON "preview_drafts"("slug", "type");

-- CreateIndex
CREATE INDEX "preview_drafts_expiresAt_idx" ON "preview_drafts"("expiresAt");
