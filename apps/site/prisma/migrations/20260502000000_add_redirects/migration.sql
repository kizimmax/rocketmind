-- CreateTable
CREATE TABLE "redirects" (
    "id" TEXT NOT NULL,
    "fromUrl" TEXT NOT NULL,
    "toUrl" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 301,
    "kind" TEXT NOT NULL DEFAULT 'manual',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "entityType" TEXT,
    "entityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "redirects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "redirects_fromUrl_key" ON "redirects"("fromUrl");
