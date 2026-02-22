-- ============================================================
-- MIGRATION: add_financial_module
-- DATE: 2026-02-22
-- DESCRIPTION: Enterprise Financial Ledger System
--   Covers: Commission Agreements → Earnings → Invoicing → Receipts
--           Agent Payouts → Clawbacks / Debit Notes
--           Applicant Fee Collections → Exchange Rates → Audit Log
-- ============================================================

-- CreateEnum
CREATE TYPE "PeriodType" AS ENUM ('MONTHLY', 'QUARTERLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "PeriodStatus" AS ENUM ('OPEN', 'LOCKED', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "CommissionType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'TIERED');

-- CreateEnum
CREATE TYPE "InvoiceTrigger" AS ENUM ('ON_ENROLLMENT', 'ON_OFFER_ACCEPTED', 'ON_VISA_APPROVAL', 'ON_TUITION_PAYMENT', 'MANUAL');

-- CreateEnum
CREATE TYPE "EarningStatus" AS ENUM ('PENDING_INVOICE', 'INVOICED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'OVERDUE', 'DISPUTED', 'WRITTEN_OFF', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'DISPUTED', 'VOIDED', 'WRITTEN_OFF');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BANK_TRANSFER', 'WIRE_TRANSFER', 'CHEQUE', 'CASH', 'ONLINE_PAYMENT', 'CRYPTO', 'OTHER');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING_APPROVAL', 'APPROVED', 'PROCESSING', 'PAID', 'FAILED', 'ON_HOLD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DebitNoteType" AS ENUM ('CLAWBACK', 'AGENT_CLAWBACK', 'ADJUSTMENT', 'PENALTY', 'REFUND_ISSUED');

-- CreateEnum
CREATE TYPE "DebitNoteStatus" AS ENUM ('PENDING', 'APPLIED', 'CANCELLED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "FeeType" AS ENUM ('APPLICATION_FEE', 'SERVICE_FEE', 'VISA_FEE', 'DOCUMENT_FEE', 'TUITION_DEPOSIT', 'COURIER_FEE', 'ASSESSMENT_FEE', 'OTHER');

-- CreateEnum
CREATE TYPE "FeeStatus" AS ENUM ('PENDING', 'PAID', 'WAIVED', 'OVERDUE', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FinancialAuditAction" AS ENUM (
    'CREATED', 'STATUS_CHANGED', 'PAYMENT_RECORDED', 'INVOICE_SENT', 'INVOICE_VOIDED',
    'PAYOUT_APPROVED', 'PAYOUT_PROCESSED', 'PAYOUT_FAILED', 'RATE_APPLIED',
    'DEBIT_NOTE_RAISED', 'DEBIT_NOTE_APPLIED', 'PERIOD_LOCKED', 'PERIOD_CLOSED',
    'EXCHANGE_RATE_SET', 'NOTE_ADDED', 'WAIVER_GRANTED', 'MANUAL_ADJUSTMENT'
);

-- CreateTable: FinancialPeriod
CREATE TABLE "FinancialPeriod" (
    "id"         TEXT NOT NULL,
    "name"       TEXT NOT NULL,
    "type"       "PeriodType" NOT NULL,
    "startDate"  TIMESTAMP(3) NOT NULL,
    "endDate"    TIMESTAMP(3) NOT NULL,
    "status"     "PeriodStatus" NOT NULL DEFAULT 'OPEN',
    "closedById" TEXT,
    "closedAt"   TIMESTAMP(3),
    "notes"      TEXT,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FinancialPeriod_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "FinancialPeriod_status_idx" ON "FinancialPeriod"("status");
CREATE INDEX "FinancialPeriod_startDate_endDate_idx" ON "FinancialPeriod"("startDate", "endDate");

-- CreateTable: ExchangeRate
CREATE TABLE "ExchangeRate" (
    "id"            TEXT NOT NULL,
    "fromCurrency"  TEXT NOT NULL,
    "toCurrency"    TEXT NOT NULL DEFAULT 'BDT',
    "rate"          DOUBLE PRECISION NOT NULL,
    "source"        TEXT,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "isActive"      BOOLEAN NOT NULL DEFAULT true,
    "createdById"   TEXT,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ExchangeRate_fromCurrency_toCurrency_effectiveDate_key" ON "ExchangeRate"("fromCurrency", "toCurrency", "effectiveDate");
CREATE INDEX "ExchangeRate_fromCurrency_toCurrency_isActive_idx" ON "ExchangeRate"("fromCurrency", "toCurrency", "isActive");

-- CreateTable: CommissionAgreement
CREATE TABLE "CommissionAgreement" (
    "id"              TEXT NOT NULL,
    "code"            TEXT NOT NULL,
    "universityId"    TEXT NOT NULL,
    "effectiveFrom"   TIMESTAMP(3) NOT NULL,
    "effectiveTo"     TIMESTAMP(3),
    "status"          "AgreementStatus" NOT NULL DEFAULT 'DRAFT',
    "commissionType"  "CommissionType" NOT NULL DEFAULT 'PERCENTAGE',
    "commissionRate"  DOUBLE PRECISION NOT NULL,
    "currency"        TEXT NOT NULL DEFAULT 'GBP',
    "paymentTermDays" INTEGER NOT NULL DEFAULT 90,
    "invoiceTrigger"  "InvoiceTrigger" NOT NULL DEFAULT 'ON_ENROLLMENT',
    "notes"           TEXT,
    "documentKey"     TEXT,
    "createdById"     TEXT,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CommissionAgreement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CommissionAgreement_code_key" ON "CommissionAgreement"("code");
CREATE INDEX "CommissionAgreement_universityId_idx" ON "CommissionAgreement"("universityId");
CREATE INDEX "CommissionAgreement_status_idx" ON "CommissionAgreement"("status");
CREATE INDEX "CommissionAgreement_effectiveFrom_effectiveTo_idx" ON "CommissionAgreement"("effectiveFrom", "effectiveTo");

-- CreateTable: AgentCommissionTier
CREATE TABLE "AgentCommissionTier" (
    "id"             TEXT NOT NULL,
    "agentId"        TEXT NOT NULL,
    "label"          TEXT NOT NULL,
    "priority"       INTEGER NOT NULL DEFAULT 0,
    "universityId"   TEXT,
    "commissionType" "CommissionType" NOT NULL DEFAULT 'PERCENTAGE',
    "commissionRate" DOUBLE PRECISION NOT NULL,
    "isActive"       BOOLEAN NOT NULL DEFAULT true,
    "validFrom"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validTo"        TIMESTAMP(3),
    "createdById"    TEXT,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AgentCommissionTier_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AgentCommissionTier_agentId_isActive_idx" ON "AgentCommissionTier"("agentId", "isActive");
CREATE INDEX "AgentCommissionTier_universityId_idx" ON "AgentCommissionTier"("universityId");

-- CreateTable: CommissionEarning
CREATE TABLE "CommissionEarning" (
    "id"             TEXT NOT NULL,
    "code"           TEXT NOT NULL,
    "applicationId"  TEXT NOT NULL,
    "universityId"   TEXT NOT NULL,
    "agreementId"    TEXT,
    "periodId"       TEXT,
    "trigger"        "InvoiceTrigger" NOT NULL,
    "triggerDate"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate"        TIMESTAMP(3),
    "grossAmount"    DOUBLE PRECISION NOT NULL,
    "currency"       TEXT NOT NULL,
    "exchangeRate"   DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "grossAmountBDT" DOUBLE PRECISION,
    "agentShare"     DOUBLE PRECISION,
    "agentShareBDT"  DOUBLE PRECISION,
    "netAmount"      DOUBLE PRECISION,
    "netAmountBDT"   DOUBLE PRECISION,
    "status"         "EarningStatus" NOT NULL DEFAULT 'PENDING_INVOICE',
    "rateSnapshot"   JSONB,
    "notes"          TEXT,
    "createdById"    TEXT,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CommissionEarning_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CommissionEarning_code_key" ON "CommissionEarning"("code");
CREATE UNIQUE INDEX "CommissionEarning_applicationId_key" ON "CommissionEarning"("applicationId");
CREATE INDEX "CommissionEarning_status_idx" ON "CommissionEarning"("status");
CREATE INDEX "CommissionEarning_universityId_idx" ON "CommissionEarning"("universityId");
CREATE INDEX "CommissionEarning_periodId_idx" ON "CommissionEarning"("periodId");
CREATE INDEX "CommissionEarning_triggerDate_idx" ON "CommissionEarning"("triggerDate");

-- CreateTable: CommissionInvoice
CREATE TABLE "CommissionInvoice" (
    "id"          TEXT NOT NULL,
    "code"        TEXT NOT NULL,
    "earningId"   TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate"     TIMESTAMP(3) NOT NULL,
    "subtotal"    DOUBLE PRECISION NOT NULL,
    "taxRate"     DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxAmount"   DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "currency"    TEXT NOT NULL,
    "amountPaid"  DOUBLE PRECISION NOT NULL DEFAULT 0,
    "amountDue"   DOUBLE PRECISION NOT NULL,
    "status"      "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "fileKey"     TEXT,
    "notes"       TEXT,
    "terms"       TEXT,
    "sentAt"      TIMESTAMP(3),
    "paidAt"      TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CommissionInvoice_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CommissionInvoice_code_key" ON "CommissionInvoice"("code");
CREATE UNIQUE INDEX "CommissionInvoice_earningId_key" ON "CommissionInvoice"("earningId");
CREATE INDEX "CommissionInvoice_universityId_idx" ON "CommissionInvoice"("universityId");
CREATE INDEX "CommissionInvoice_status_idx" ON "CommissionInvoice"("status");
CREATE INDEX "CommissionInvoice_dueDate_idx" ON "CommissionInvoice"("dueDate");

-- CreateTable: InvoicePayment
CREATE TABLE "InvoicePayment" (
    "id"            TEXT NOT NULL,
    "invoiceId"     TEXT NOT NULL,
    "amount"        DOUBLE PRECISION NOT NULL,
    "currency"      TEXT NOT NULL,
    "exchangeRate"  DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "amountBDT"     DOUBLE PRECISION,
    "paymentDate"   TIMESTAMP(3) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'BANK_TRANSFER',
    "referenceNo"   TEXT,
    "notes"         TEXT,
    "receiptKey"    TEXT,
    "confirmedById" TEXT,
    "confirmedAt"   TIMESTAMP(3),
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InvoicePayment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "InvoicePayment_invoiceId_idx" ON "InvoicePayment"("invoiceId");

-- CreateTable: AgentPayout
CREATE TABLE "AgentPayout" (
    "id"            TEXT NOT NULL,
    "code"          TEXT NOT NULL,
    "earningId"     TEXT NOT NULL,
    "agentId"       TEXT NOT NULL,
    "periodId"      TEXT,
    "grossEarning"  DOUBLE PRECISION NOT NULL,
    "commissionRate" DOUBLE PRECISION NOT NULL,
    "amount"        DOUBLE PRECISION NOT NULL,
    "currency"      TEXT NOT NULL,
    "exchangeRate"  DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "amountBDT"     DOUBLE PRECISION,
    "status"        "PayoutStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "bankSnapshot"  JSONB,
    "paymentMethod" "PaymentMethod",
    "paymentRef"    TEXT,
    "paymentDate"   TIMESTAMP(3),
    "receiptKey"    TEXT,
    "approvedById"  TEXT,
    "approvedAt"    TIMESTAMP(3),
    "notes"         TEXT,
    "createdById"   TEXT,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AgentPayout_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AgentPayout_code_key" ON "AgentPayout"("code");
CREATE UNIQUE INDEX "AgentPayout_earningId_key" ON "AgentPayout"("earningId");
CREATE INDEX "AgentPayout_agentId_idx" ON "AgentPayout"("agentId");
CREATE INDEX "AgentPayout_status_idx" ON "AgentPayout"("status");
CREATE INDEX "AgentPayout_periodId_idx" ON "AgentPayout"("periodId");
CREATE INDEX "AgentPayout_paymentDate_idx" ON "AgentPayout"("paymentDate");

-- CreateTable: DebitNote
CREATE TABLE "DebitNote" (
    "id"             TEXT NOT NULL,
    "code"           TEXT NOT NULL,
    "type"           "DebitNoteType" NOT NULL,
    "reason"         TEXT NOT NULL,
    "earningId"      TEXT,
    "payoutId"       TEXT,
    "amount"         DOUBLE PRECISION NOT NULL,
    "currency"       TEXT NOT NULL,
    "exchangeRate"   DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "amountBDT"      DOUBLE PRECISION,
    "status"         "DebitNoteStatus" NOT NULL DEFAULT 'PENDING',
    "resolvedById"   TEXT,
    "resolvedAt"     TIMESTAMP(3),
    "resolutionNote" TEXT,
    "documentKey"    TEXT,
    "createdById"    TEXT,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DebitNote_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DebitNote_code_key" ON "DebitNote"("code");
CREATE INDEX "DebitNote_earningId_idx" ON "DebitNote"("earningId");
CREATE INDEX "DebitNote_payoutId_idx" ON "DebitNote"("payoutId");
CREATE INDEX "DebitNote_status_idx" ON "DebitNote"("status");

-- CreateTable: FeeCollection
CREATE TABLE "FeeCollection" (
    "id"            TEXT NOT NULL,
    "code"          TEXT NOT NULL,
    "applicantId"   TEXT NOT NULL,
    "applicationId" TEXT,
    "feeType"       "FeeType" NOT NULL,
    "description"   TEXT,
    "amount"        DOUBLE PRECISION NOT NULL,
    "currency"      TEXT NOT NULL DEFAULT 'BDT',
    "exchangeRate"  DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "amountBDT"     DOUBLE PRECISION,
    "status"        "FeeStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate"       TIMESTAMP(3),
    "paymentMethod" "PaymentMethod",
    "paymentRef"    TEXT,
    "paidAt"        TIMESTAMP(3),
    "receiptKey"    TEXT,
    "isWaived"      BOOLEAN NOT NULL DEFAULT false,
    "waivedById"    TEXT,
    "waivedAt"      TIMESTAMP(3),
    "waivedReason"  TEXT,
    "collectedById" TEXT,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FeeCollection_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "FeeCollection_code_key" ON "FeeCollection"("code");
CREATE INDEX "FeeCollection_applicantId_idx" ON "FeeCollection"("applicantId");
CREATE INDEX "FeeCollection_applicationId_idx" ON "FeeCollection"("applicationId");
CREATE INDEX "FeeCollection_status_idx" ON "FeeCollection"("status");
CREATE INDEX "FeeCollection_feeType_idx" ON "FeeCollection"("feeType");

-- CreateTable: FinancialAuditLog
CREATE TABLE "FinancialAuditLog" (
    "id"              TEXT NOT NULL,
    "entityType"      TEXT NOT NULL,
    "entityId"        TEXT NOT NULL,
    "entityCode"      TEXT,
    "action"          "FinancialAuditAction" NOT NULL,
    "fromState"       TEXT,
    "toState"         TEXT,
    "amount"          DOUBLE PRECISION,
    "currency"        TEXT,
    "performedById"   TEXT NOT NULL,
    "performedByName" TEXT,
    "notes"           TEXT,
    "metadata"        JSONB,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FinancialAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "FinancialAuditLog_entityType_entityId_idx" ON "FinancialAuditLog"("entityType", "entityId");
CREATE INDEX "FinancialAuditLog_performedById_idx" ON "FinancialAuditLog"("performedById");
CREATE INDEX "FinancialAuditLog_createdAt_idx" ON "FinancialAuditLog"("createdAt");

-- AddForeignKey: CommissionAgreement.universityId → University
ALTER TABLE "CommissionAgreement" ADD CONSTRAINT "CommissionAgreement_universityId_fkey"
    FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: AgentCommissionTier.agentId → AgentProfile
ALTER TABLE "AgentCommissionTier" ADD CONSTRAINT "AgentCommissionTier_agentId_fkey"
    FOREIGN KEY ("agentId") REFERENCES "AgentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: AgentCommissionTier.universityId → University (optional)
ALTER TABLE "AgentCommissionTier" ADD CONSTRAINT "AgentCommissionTier_universityId_fkey"
    FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: CommissionEarning.applicationId → Application
ALTER TABLE "CommissionEarning" ADD CONSTRAINT "CommissionEarning_applicationId_fkey"
    FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: CommissionEarning.universityId → University
ALTER TABLE "CommissionEarning" ADD CONSTRAINT "CommissionEarning_universityId_fkey"
    FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: CommissionEarning.agreementId → CommissionAgreement (optional)
ALTER TABLE "CommissionEarning" ADD CONSTRAINT "CommissionEarning_agreementId_fkey"
    FOREIGN KEY ("agreementId") REFERENCES "CommissionAgreement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: CommissionEarning.periodId → FinancialPeriod (optional)
ALTER TABLE "CommissionEarning" ADD CONSTRAINT "CommissionEarning_periodId_fkey"
    FOREIGN KEY ("periodId") REFERENCES "FinancialPeriod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: CommissionInvoice.earningId → CommissionEarning
ALTER TABLE "CommissionInvoice" ADD CONSTRAINT "CommissionInvoice_earningId_fkey"
    FOREIGN KEY ("earningId") REFERENCES "CommissionEarning"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: CommissionInvoice.universityId → University
ALTER TABLE "CommissionInvoice" ADD CONSTRAINT "CommissionInvoice_universityId_fkey"
    FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: InvoicePayment.invoiceId → CommissionInvoice
ALTER TABLE "InvoicePayment" ADD CONSTRAINT "InvoicePayment_invoiceId_fkey"
    FOREIGN KEY ("invoiceId") REFERENCES "CommissionInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: AgentPayout.earningId → CommissionEarning
ALTER TABLE "AgentPayout" ADD CONSTRAINT "AgentPayout_earningId_fkey"
    FOREIGN KEY ("earningId") REFERENCES "CommissionEarning"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: AgentPayout.agentId → AgentProfile
ALTER TABLE "AgentPayout" ADD CONSTRAINT "AgentPayout_agentId_fkey"
    FOREIGN KEY ("agentId") REFERENCES "AgentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: AgentPayout.periodId → FinancialPeriod (optional)
ALTER TABLE "AgentPayout" ADD CONSTRAINT "AgentPayout_periodId_fkey"
    FOREIGN KEY ("periodId") REFERENCES "FinancialPeriod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: DebitNote.earningId → CommissionEarning (optional)
ALTER TABLE "DebitNote" ADD CONSTRAINT "DebitNote_earningId_fkey"
    FOREIGN KEY ("earningId") REFERENCES "CommissionEarning"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: DebitNote.payoutId → AgentPayout (optional)
ALTER TABLE "DebitNote" ADD CONSTRAINT "DebitNote_payoutId_fkey"
    FOREIGN KEY ("payoutId") REFERENCES "AgentPayout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: FeeCollection.applicantId → ApplicantProfile
ALTER TABLE "FeeCollection" ADD CONSTRAINT "FeeCollection_applicantId_fkey"
    FOREIGN KEY ("applicantId") REFERENCES "ApplicantProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: FeeCollection.applicationId → Application (optional)
ALTER TABLE "FeeCollection" ADD CONSTRAINT "FeeCollection_applicationId_fkey"
    FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;
