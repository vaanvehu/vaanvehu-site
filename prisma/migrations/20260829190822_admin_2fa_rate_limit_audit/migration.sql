-- AlterTable
ALTER TABLE "AdminSession" ADD COLUMN     "ip" TEXT;

-- AlterTable
ALTER TABLE "Settings" ALTER COLUMN "businessEmail" SET DEFAULT 'vanvehu4minim@gmail.com';

-- CreateTable
CREATE TABLE "AdminAuth" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "totpSecret" TEXT,
    "totpEnabled" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingAdminLogin" (
    "token" TEXT NOT NULL,
    "setup" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PendingAdminLogin_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "RateLimitEvent" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimitEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminActionLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "detail" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminActionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RateLimitEvent_scope_key_createdAt_idx" ON "RateLimitEvent"("scope", "key", "createdAt");

-- CreateIndex
CREATE INDEX "AdminActionLog_createdAt_idx" ON "AdminActionLog"("createdAt");
