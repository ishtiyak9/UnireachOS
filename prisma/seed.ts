import "dotenv/config";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hash } from "argon2";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🧬 Initializing Cerebro Intelligence Core...");

  const password = await hash("admin123");

  // 1. Define Core Permissions (Future-Proof Registry)
  const permissionsList = [
    // --- CATEGORY: SYSTEM (Global Core) ---
    { code: "system:control", name: "System Control", group: "SYSTEM" },
    {
      code: "system:view_logs",
      name: "View Audit/Login Logs",
      group: "SYSTEM",
    },
    {
      code: "system:manage_access",
      name: "Manage IP/Firewall",
      group: "SYSTEM",
    },
    {
      code: "system:manage_config",
      name: "Manage Global Settings",
      group: "SYSTEM",
    },
    {
      code: "system:maintenance",
      name: "Manage Maintenance Mode",
      group: "SYSTEM",
    },

    // --- CATEGORY: AUTHORITY (Identity & RBAC) ---
    {
      code: "authority:manage_roles",
      name: "Manage System Roles",
      group: "AUTHORITY",
    },
    {
      code: "authority:manage_permissions",
      name: "Manage Permissions/Groups",
      group: "AUTHORITY",
    },
    {
      code: "authority:assign_roles",
      name: "Assign Roles to Users",
      group: "AUTHORITY",
    },

    // --- CATEGORY: ACCOUNTS (User Management) ---
    { code: "user:view", name: "Browse User Directory", group: "ACCOUNTS" },
    { code: "user:create", name: "Provision New Users", group: "ACCOUNTS" },
    { code: "user:update", name: "Edit User Accounts", group: "ACCOUNTS" },
    { code: "user:delete", name: "Deactivate/Delete Users", group: "ACCOUNTS" },

    // --- CATEGORY: APPLICANTS (Student/Expat Profiles) ---
    {
      code: "applicant:view_all",
      name: "View All Profiles",
      group: "APPLICANTS",
    },
    {
      code: "applicant:view_assigned",
      name: "View Assigned Profiles",
      group: "APPLICANTS",
    },
    {
      code: "applicant:update_profile",
      name: "Modify Profile Data",
      group: "APPLICANTS",
    },
    {
      code: "applicant:manage_unlocks",
      name: "Handle Profile Unlock Requests",
      group: "APPLICANTS",
    },
    {
      code: "applicant:lock_override",
      name: "Bypass Profile Lock",
      group: "APPLICANTS",
    },

    // --- CATEGORY: DMS (Document Management) ---
    { code: "document:view", name: "View/Download Documents", group: "DMS" },
    { code: "document:upload", name: "Upload Documents", group: "DMS" },
    { code: "document:verify", name: "Verify/Reject Documents", group: "DMS" },
    { code: "document:delete", name: "Remove Documents", group: "DMS" },
    {
      code: "document:manage_unlocks",
      name: "Handle Document Unlock Requests",
      group: "DMS",
    },
    {
      code: "document:access_official",
      name: "Access Official Admin-Only Docs",
      group: "DMS",
    },

    // --- CATEGORY: ADMISSION (Application Workflow) ---
    {
      code: "application:create",
      name: "Submit New Application",
      group: "ADMISSION",
    },
    {
      code: "application:view_all",
      name: "View All Applications",
      group: "ADMISSION",
    },
    {
      code: "application:review",
      name: "Review/Assess Applications",
      group: "ADMISSION",
    },
    {
      code: "application:decision",
      name: "Make Final Admission Decision",
      group: "ADMISSION",
    },
    {
      code: "application:manage_notes",
      name: "Manage Application Timeline",
      group: "ADMISSION",
    },

    // --- CATEGORY: INVENTORY (Catalog Management) ---
    {
      code: "inventory:view",
      name: "View Universities/Courses",
      group: "INVENTORY",
    },
    {
      code: "inventory:manage",
      name: "Manage Inventory Catalog",
      group: "INVENTORY",
    },

    // --- CATEGORY: PARTNER_MGMT (Admin control over Agents) ---
    {
      code: "agent:verify",
      name: "Audit & Verify Agencies",
      group: "PARTNER_MGMT",
    },
    {
      code: "agent:manage_commission",
      name: "Configure Commissions",
      group: "PARTNER_MGMT",
    },
    {
      code: "agent:set_quotas",
      name: "Set Usage/Student Limits",
      group: "PARTNER_MGMT",
    },

    // --- CATEGORY: AGENT_OPS (Actions by Agents) ---
    {
      code: "agent:portal_access",
      name: "Access Agent Dashboard",
      group: "AGENT_OPS",
    },
    {
      code: "agent:create_student",
      name: "Onboard/Create New Students",
      group: "AGENT_OPS",
    },
    {
      code: "agent:manage_students",
      name: "Manage Assigned Students",
      group: "AGENT_OPS",
    },
    {
      code: "agent:manage_docs",
      name: "Manage Documents for Students",
      group: "AGENT_OPS",
    },
    {
      code: "agent:submit_behalf",
      name: "Apply on Behalf of Students",
      group: "AGENT_OPS",
    },
    {
      code: "agent:enquiry_create",
      name: "Submit Enquiries for Students",
      group: "AGENT_OPS",
    },
    {
      code: "agent:view_earnings",
      name: "View Commission Statements",
      group: "AGENT_OPS",
    },
    {
      code: "agent:team_manage",
      name: "Manage Sub-Agents/Staff",
      group: "AGENT_OPS",
    },
    {
      code: "agent:priority_review",
      name: "Requested Priority Review",
      group: "AGENT_OPS",
    },
    {
      code: "agent:bulk_import",
      name: "Bulk Import Student Data",
      group: "AGENT_OPS",
    },

    // --- CATEGORY: SUPPORT (Enquiries & CRM) ---
    {
      code: "support:enquiry_view",
      name: "Monitor Enquiries",
      group: "SUPPORT",
    },
    {
      code: "support:enquiry_respond",
      name: "Respond to Enquiries",
      group: "SUPPORT",
    },

    // --- CATEGORY: COMMUNICATIONS ---
    {
      code: "notification:broadcast",
      name: "Send System Broadcasts",
      group: "COMMUNICATIONS",
    },

    // --- CATEGORY: CLIENT (End-User/Student Actions) ---
    {
      code: "client:portal_access",
      name: "Access Student Portal",
      group: "CLIENT",
    },
    {
      code: "client:apply",
      name: "Submit Personal Application",
      group: "CLIENT",
    },
    {
      code: "client:upload_docs",
      name: "Self-Upload Documents",
      group: "CLIENT",
    },
    {
      code: "client:unlock_request",
      name: "Request Profile/Doc Unlock",
      group: "CLIENT",
    },
  ];

  console.log("📡 Registering permissions...");
  for (const p of permissionsList) {
    await prisma.permission.upsert({
      where: { code: p.code },
      update: p,
      create: p,
    });
  }

  // 2. Define High-Authority Roles
  console.log("🛡️ Establishing system roles...");

  const superAdminRole = await prisma.systemRole.upsert({
    where: { code: "super_admin" },
    update: {},
    create: {
      name: "Supreme Administrator",
      code: "super_admin",
      category: "SYSTEM",
      description: "Full authority over the entire intelligence network",
      isSystem: true,
    },
  });

  const agentRole = await prisma.systemRole.upsert({
    where: { code: "agent_standard" },
    update: {},
    create: {
      name: "Verified Agency",
      code: "agent_standard",
      category: "AGENT",
      description: "Standard authority for partner agents",
      isSystem: true,
    },
  });

  const applicantRole = await prisma.systemRole.upsert({
    where: { code: "applicant_standard" },
    update: {},
    create: {
      name: "System Applicant",
      code: "applicant_standard",
      category: "APPLICANT",
      description: "Basic authority for students and clients",
      isSystem: true,
    },
  });

  // 3. Bind Permissions to Roles
  console.log("🔗 Binding permissions to authorities...");
  const allPermissions = await prisma.permission.findMany();

  for (const p of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: superAdminRole.id, permissionId: p.id },
      },
      update: {},
      create: { roleId: superAdminRole.id, permissionId: p.id },
    });
  }

  // 4. Create Initial User with Dynamic Role
  console.log("👤 Provisioning primary administrator...");
  const devUser = await prisma.user.upsert({
    where: { email: "admin@unireachbd.com" },
    update: {
      roleId: superAdminRole.id,
      status: "ACTIVE",
    },
    create: {
      email: "admin@unireachbd.com",
      password: password,
      roleId: superAdminRole.id,
      status: "ACTIVE",
      staffProfile: {
        create: {
          firstName: "Cerebro",
          lastName: "Admin",
          department: "Core Intelligence",
          position: "Grand Architect",
        },
      },
    },
  });

  console.log("\n✅ Intelligence Core Scaled Successfully!");
  console.log(`- Role: ${superAdminRole.name}`);
  console.log(`- Permissions Assigned: ${allPermissions.length}`);
  console.log(`- Master User: ${devUser.email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error("❌ Critical Core Failure:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
