import pg from "pg";
import { hash } from "argon2";
import "dotenv/config";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const permissionsList = [
  // SYSTEM
  { code: "system:control", name: "System Control", group: "SYSTEM" },
  { code: "system:settings", name: "System Settings", group: "SYSTEM" },
  { code: "system:audit", name: "View Security Audit", group: "SYSTEM" },
  { code: "system:metrics", name: "System Metrics", group: "SYSTEM" },

  // USERS
  { code: "user:view", name: "View Users", group: "ACCOUNTS" },
  { code: "user:create", name: "Create User", group: "ACCOUNTS" },
  { code: "user:edit", name: "Edit User", group: "ACCOUNTS" },
  { code: "user:delete", name: "Delete User", group: "ACCOUNTS" },
  { code: "user:manage", name: "Manage Account Status", group: "ACCOUNTS" },
  { code: "user:export", name: "Export User Data", group: "ACCOUNTS" },
  { code: "user:share", name: "Share User Profile", group: "ACCOUNTS" },

  // APPLICATIONS
  { code: "application:view", name: "View Applications", group: "ADMISSION" },
  {
    code: "application:create",
    name: "Create Application",
    group: "ADMISSION",
  },
  { code: "application:edit", name: "Edit Application", group: "ADMISSION" },
  {
    code: "application:delete",
    name: "Delete Application",
    group: "ADMISSION",
  },
  {
    code: "application:review",
    name: "Review Application",
    group: "ADMISSION",
  },
  {
    code: "application:approve",
    name: "Approve Application",
    group: "ADMISSION",
  },
  {
    code: "application:reject",
    name: "Reject Application",
    group: "ADMISSION",
  },
  {
    code: "application:export",
    name: "Export Applications",
    group: "ADMISSION",
  },
  { code: "application:share", name: "Share Application", group: "ADMISSION" },

  // PARTNERS (AGENTS)
  { code: "agent:view", name: "View Agents", group: "PARTNERS" },
  { code: "agent:create", name: "Register Agent", group: "PARTNERS" },
  { code: "agent:edit", name: "Edit Agent Profile", group: "PARTNERS" },
  { code: "agent:verify", name: "Verify Agency", group: "PARTNERS" },
  { code: "agent:manage", name: "Manage Agent Access", group: "PARTNERS" },
  { code: "agent:export", name: "Export Agent Data", group: "PARTNERS" },

  // DOCUMENTS
  { code: "doc:view", name: "View Documents", group: "KNOWLEDGE" },
  { code: "doc:upload", name: "Upload Document", group: "KNOWLEDGE" },
  { code: "doc:edit", name: "Edit Document Info", group: "KNOWLEDGE" },
  { code: "doc:delete", name: "Delete Document", group: "KNOWLEDGE" },
  { code: "doc:export", name: "Download/Export Docs", group: "KNOWLEDGE" },
  { code: "doc:share", name: "Share Document", group: "KNOWLEDGE" },

  // REPORTS
  { code: "report:view", name: "View Reports", group: "INTELLIGENCE" },
  { code: "report:generate", name: "Generate Report", group: "INTELLIGENCE" },
  { code: "report:export", name: "Export Intelligence", group: "INTELLIGENCE" },
  { code: "report:share", name: "Share Report", group: "INTELLIGENCE" },

  // FINANCE
  { code: "finance:view", name: "View Financials", group: "COMMERCE" },
  { code: "finance:manage", name: "Manage Commissions", group: "COMMERCE" },
  { code: "finance:export", name: "Export Finance Data", group: "COMMERCE" },

  // PORTAL
  { code: "portal:access", name: "Portal Access", group: "GENERAL" },
  { code: "portal:apply", name: "Self Application", group: "GENERAL" },
];

async function sync() {
  console.log("🧬 Initiating Full Cerebro Neural Cluster Synchronization...");
  let client;

  try {
    client = await pool.connect();
    await client.query("BEGIN");

    console.log("🧹 Clearing legacy structures...");
    const drops = [
      'DROP TABLE IF EXISTS "RolePermissionGroup" CASCADE',
      'DROP TABLE IF EXISTS "GroupPermission" CASCADE',
      'DROP TABLE IF EXISTS "PermissionGroup" CASCADE',
      'DROP TABLE IF EXISTS "RolePermission" CASCADE',
      'DROP TABLE IF EXISTS "Permission" CASCADE',
      'DROP TABLE IF EXISTS "SystemRole" CASCADE',
      'DROP TABLE IF EXISTS "LoginLog" CASCADE',
      'DROP TABLE IF EXISTS "AuditLog" CASCADE',
      'DROP TABLE IF EXISTS "ApplicantProfile" CASCADE',
      'DROP TABLE IF EXISTS "AgentProfile" CASCADE',
      'DROP TABLE IF EXISTS "StaffProfile" CASCADE',
      'DROP TABLE IF EXISTS "User" CASCADE',
      'DROP TYPE IF EXISTS "AccountStatus" CASCADE',
      'DROP TYPE IF EXISTS "ApplicantType" CASCADE',
      'DROP TYPE IF EXISTS "RoleCategory" CASCADE',
    ];
    for (const d of drops) await client.query(d);

    console.log("🛠️ Establishing Core Enums...");
    await client.query(
      `CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'DEACTIVATED')`
    );
    await client.query(
      `CREATE TYPE "ApplicantType" AS ENUM ('STUDENT', 'EXPATRIATE')`
    );
    await client.query(
      `CREATE TYPE "RoleCategory" AS ENUM ('SYSTEM', 'AGENT', 'APPLICANT')`
    );

    console.log("🛡️ Constructing Authorization Engine v2...");
    await client.query(
      `CREATE TABLE "SystemRole" (id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, code TEXT UNIQUE NOT NULL, category "RoleCategory" DEFAULT 'APPLICANT', description TEXT, "isSystem" BOOLEAN DEFAULT false, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`
    );
    await client.query(
      `CREATE TABLE "PermissionGroup" (id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, code TEXT UNIQUE NOT NULL, description TEXT, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`
    );
    await client.query(
      `CREATE TABLE "Permission" (id TEXT PRIMARY KEY, code TEXT UNIQUE NOT NULL, name TEXT NOT NULL, "group" TEXT DEFAULT 'GENERAL', description TEXT, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`
    );

    await client.query(
      `CREATE TABLE "RolePermission" ("roleId" TEXT REFERENCES "SystemRole"(id) ON DELETE CASCADE, "permissionId" TEXT REFERENCES "Permission"(id) ON DELETE CASCADE, PRIMARY KEY ("roleId", "permissionId"))`
    );
    await client.query(
      `CREATE TABLE "GroupPermission" ("groupId" TEXT REFERENCES "PermissionGroup"(id) ON DELETE CASCADE, "permissionId" TEXT REFERENCES "Permission"(id) ON DELETE CASCADE, PRIMARY KEY ("groupId", "permissionId"))`
    );
    await client.query(
      `CREATE TABLE "RolePermissionGroup" ("roleId" TEXT REFERENCES "SystemRole"(id) ON DELETE CASCADE, "groupId" TEXT REFERENCES "PermissionGroup"(id) ON DELETE CASCADE, PRIMARY KEY ("roleId", "groupId"))`
    );

    console.log("👤 Provisioning Identity Core...");
    await client.query(
      `CREATE TABLE "User" (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, "roleId" TEXT NOT NULL REFERENCES "SystemRole"(id), status "AccountStatus" DEFAULT 'PENDING_VERIFICATION', "lastLogin" TIMESTAMP(3), "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`
    );

    console.log("📂 Constructing Profile Layers...");
    await client.query(
      `CREATE TABLE "StaffProfile" (id TEXT PRIMARY KEY, "userId" TEXT UNIQUE NOT NULL REFERENCES "User"(id) ON DELETE CASCADE, "firstName" TEXT NOT NULL, "lastName" TEXT NOT NULL, department TEXT, position TEXT)`
    );
    await client.query(
      `CREATE TABLE "AgentProfile" (id TEXT PRIMARY KEY, "userId" TEXT UNIQUE NOT NULL REFERENCES "User"(id) ON DELETE CASCADE, "agencyName" TEXT NOT NULL, "licenseNo" TEXT UNIQUE, phone TEXT, commission NUMERIC DEFAULT 0.0, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`
    );
    await client.query(
      `CREATE TABLE "ApplicantProfile" (id TEXT PRIMARY KEY, "userId" TEXT UNIQUE NOT NULL REFERENCES "User"(id) ON DELETE CASCADE, type "ApplicantType" DEFAULT 'STUDENT', "agentId" TEXT REFERENCES "AgentProfile"(id), "assignedStaffId" TEXT REFERENCES "StaffProfile"(id), "firstName" TEXT NOT NULL, "lastName" TEXT NOT NULL, phone TEXT, nationality TEXT, "passportNo" TEXT UNIQUE, "dateOfBirth" TIMESTAMP(3), metadata JSONB, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`
    );

    console.log("📜 Initializing Audit Infrastructure...");
    await client.query(
      `CREATE TABLE "LoginLog" (id TEXT PRIMARY KEY, "userId" TEXT NOT NULL REFERENCES "User"(id), ip TEXT, "userAgent" TEXT, metadata JSONB, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`
    );
    await client.query(
      `CREATE TABLE "AuditLog" (id TEXT PRIMARY KEY, "performedById" TEXT NOT NULL REFERENCES "User"(id), action TEXT NOT NULL, "entityType" TEXT NOT NULL, "entityId" TEXT NOT NULL, "oldValue" JSONB, "newValue" JSONB, "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP)`
    );

    console.log("🧪 Injecting Neural Clusters & Master Data...");

    // 1. Inject All Permissions
    for (const p of permissionsList) {
      await client.query(
        `INSERT INTO "Permission" (id, code, name, "group") VALUES ($1, $2, $3, $4)`,
        [`perm_${p.code.replace(":", "_")}`, p.code, p.name, p.group]
      );
    }

    // 2. Create Neural clusters (Permission Groups)
    console.log("📦 Constructing Permission Clusters...");
    await client.query(
      `INSERT INTO "PermissionGroup" (id, name, code) VALUES ('pkg_admission_full', 'Full Admission Suite', 'admission_full')`
    );
    await client.query(
      `INSERT INTO "PermissionGroup" (id, name, code) VALUES ('pkg_agent_standard', 'Standard Agent Capabilities', 'agent_standard')`
    );

    // Bind Admissions cluster permissions
    const admissionPerms = await client.query(
      `SELECT id FROM "Permission" WHERE "group" = 'ADMISSION'`
    );
    for (const row of admissionPerms.rows) {
      await client.query(
        `INSERT INTO "GroupPermission" ("groupId", "permissionId") VALUES ('pkg_admission_full', $1)`,
        [row.id]
      );
    }

    // 3. Create Roles
    await client.query(
      `INSERT INTO "SystemRole" (id, name, code, category, "isSystem") VALUES ('super_admin', 'Supreme Administrator', 'super_admin', 'SYSTEM', true)`
    );
    await client.query(
      `INSERT INTO "SystemRole" (id, name, code, category, "isSystem") VALUES ('official_hq', 'Headquarters Official', 'official_hq', 'SYSTEM', false)`
    );
    await client.query(
      `INSERT INTO "SystemRole" (id, name, code, category, "isSystem") VALUES ('applicant_std', 'Standard Applicant', 'applicant_standard', 'APPLICANT', true)`
    );

    // 4. Bind Clusters to Roles
    console.log("🔗 Binding Clusters to Authority Nodes...");
    await client.query(
      `INSERT INTO "RolePermissionGroup" ("roleId", "groupId") VALUES ('official_hq', 'pkg_admission_full')`
    );

    // Super admin gets everything direct (Legacy protection)
    const allPerms = await client.query(`SELECT id FROM "Permission"`);
    for (const row of allPerms.rows) {
      await client.query(
        `INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('super_admin', $1)`,
        [row.id]
      );
    }

    const hashedPassword = await hash("admin123");
    await client.query(
      `INSERT INTO "User" (id, email, password, "roleId", status) VALUES ('admin_user', 'admin@unireachbd.com', $1, 'super_admin', 'ACTIVE')`,
      [hashedPassword]
    );
    await client.query(
      `INSERT INTO "StaffProfile" (id, "userId", "firstName", "lastName", position) VALUES ('admin_staff', 'admin_user', 'Supreme', 'Architect', 'Master Admin')`
    );

    await client.query("COMMIT");
    console.log("\n✅ Neural Cluster Network Established Successfully!");
  } catch (e) {
    if (client) await client.query("ROLLBACK");
    console.error("❌ Critical Sync Failure:", e);
  } finally {
    if (client) client.release();
    pool.end();
  }
}

sync();
