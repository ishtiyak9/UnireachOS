/*
  Warnings:

  - You are about to drop the column `whitelistedIps` on the `SystemConfig` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AccessControlType" AS ENUM ('ALLOW', 'BLOCK');

-- AlterTable
ALTER TABLE "SystemConfig" DROP COLUMN "whitelistedIps";

-- CreateTable
CREATE TABLE "SystemAccessControl" (
    "id" TEXT NOT NULL,
    "type" "AccessControlType" NOT NULL DEFAULT 'ALLOW',
    "ipAddress" TEXT NOT NULL,
    "reason" TEXT,
    "addedBy" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemAccessControl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SystemAccessControl_ipAddress_key" ON "SystemAccessControl"("ipAddress");
