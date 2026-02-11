-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "allowPublicRegister" BOOLEAN NOT NULL DEFAULT true,
    "allowAgentRegister" BOOLEAN NOT NULL DEFAULT true,
    "allowStudentLogin" BOOLEAN NOT NULL DEFAULT true,
    "allowAgentLogin" BOOLEAN NOT NULL DEFAULT true,
    "whitelistedIps" TEXT[],
    "systemBannerMessage" TEXT,
    "systemBannerType" TEXT,
    "metadata" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);
