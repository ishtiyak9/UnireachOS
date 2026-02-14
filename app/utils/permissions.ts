/**
 * CEREBRO PERMISSION REGISTRY
 * Central authority for all capability tokens in the UniReach Ecosystem.
 * Architecture Standard: [domain]:[action]
 */
export const Permissions = {
  // --- SYSTEM & INFRASTRUCTURE ---
  SYSTEM_CONTROL: "system:control", // God-mode override
  SYSTEM_SETTINGS: "system:settings", // Environment & Config
  SYSTEM_AUDIT: "system:audit", // View security logs/trails
  SYSTEM_METRICS: "system:metrics", // View telemetry & load
  SYSTEM_NOTIFY: "system:notify", // View telemetry & load
  // --- IDENTITY & ACCESS (USER) ---
  USER_VIEW: "user:view",
  USER_CREATE: "user:create",
  USER_EDIT: "user:edit",
  USER_DELETE: "user:delete",
  USER_MANAGE: "user:manage", // Bulk actions, password resets
  USER_EXPORT: "user:export",
  USER_SHARE: "user:share",

  // --- ADMISSIONS (APPLICATION) ---
  APPLICATION_VIEW: "application:view",
  APPLICATION_CREATE: "application:create",
  APPLICATION_EDIT: "application:edit",
  APPLICATION_DELETE: "application:delete",
  APPLICATION_REVIEW: "application:review",
  APPLICATION_APPROVE: "application:approve",
  APPLICATION_REJECT: "application:reject",
  APPLICATION_EXPORT: "application:export",
  APPLICATION_SHARE: "application:share",

  // --- PARTNERS (AGENT) ---
  AGENT_VIEW: "agent:view",
  AGENT_CREATE: "agent:create",
  AGENT_EDIT: "agent:edit",
  AGENT_VERIFY: "agent:verify",
  AGENT_MANAGE: "agent:manage",
  AGENT_EXPORT: "agent:export",

  // --- KNOWLEDGE (DOCUMENT) ---
  DOC_VIEW: "doc:view",
  DOC_UPLOAD: "doc:upload",
  DOC_EDIT: "doc:edit",
  DOC_DELETE: "doc:delete",
  DOC_EXPORT: "doc:export",
  DOC_SHARE: "doc:share",

  // --- INTELLIGENCE (REPORTING) ---
  REPORT_VIEW: "report:view",
  REPORT_GENERATE: "report:generate",
  REPORT_EXPORT: "report:export",
  REPORT_SHARE: "report:share",

  // --- COMMERCE (FINANCE/COMMISSION) ---
  FINANCE_VIEW: "finance:view",
  FINANCE_MANAGE: "finance:manage",
  FINANCE_EXPORT: "finance:export",

  // --- CLIENT/PORTAL SPECIFIC ---
  PORTAL_ACCESS: "portal:access",
  PORTAL_APPLY: "portal:apply",

  // --- NOTIFICATION & ALERTS ---
  LEAD_NOTIFY: "lead:notify", // Receive alerts for new inbound leads
} as const;

export type PermissionCode = (typeof Permissions)[keyof typeof Permissions];
