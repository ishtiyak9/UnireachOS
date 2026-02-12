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
    { code: "user:view", name: "Browse User Directory", group: "USER" },
    { code: "user:create", name: "Provision New Users", group: "USER" },
    { code: "user:update", name: "Edit User Accounts", group: "USER" },
    { code: "user:delete", name: "Deactivate/Delete Users", group: "USER" },

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

    // --- CATEGORY: LEADS (Intake & Routing) ---
    { code: "leads:view_all", name: "View All Leads (Global)", group: "LEADS" },
    {
      code: "leads:view_assigned",
      name: "View Only Assigned Leads",
      group: "LEADS",
    },
    {
      code: "leads:assign_manual",
      name: "Manually (Re)Assign Leads",
      group: "LEADS",
    },
    {
      code: "leads:auto_route_config",
      name: "Configure Auto-Assignment",
      group: "LEADS",
    },

    // --- CATEGORY: TEAMS (Specialized Cells) ---
    { code: "teams:view", name: "View Team Structures", group: "TEAMS" },
    { code: "teams:manage", name: "Provision/Delete Teams", group: "TEAMS" },
    {
      code: "teams:assign_members",
      name: "Manage Team Memberships",
      group: "TEAMS",
    },

    // --- CATEGORY: GEO (Global Registry) ---
    {
      code: "geo:manage_countries",
      name: "Manage Countries & Flags",
      group: "GEO",
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

  // 5. Seed Geo-Registry (Countries)
  console.log("🗺️ Provisioning Geo-Registry...");
  const countries = [
    { name: "Austria", code: "AT", flag: "https://flagcdn.com/w320/at.png" },
    { name: "Belgium", code: "BE", flag: "https://flagcdn.com/w320/be.png" },
    { name: "Bulgaria", code: "BG", flag: "https://flagcdn.com/w320/bg.png" },
    { name: "Croatia", code: "HR", flag: "https://flagcdn.com/w320/hr.png" },
    {
      name: "Czech Republic",
      code: "CZ",
      flag: "https://flagcdn.com/w320/cz.png",
    },
    { name: "Denmark", code: "DK", flag: "https://flagcdn.com/w320/dk.png" },
    { name: "Estonia", code: "EE", flag: "https://flagcdn.com/w320/ee.png" },
    { name: "Finland", code: "FI", flag: "https://flagcdn.com/w320/fi.png" },
    { name: "France", code: "FR", flag: "https://flagcdn.com/w320/fr.png" },
    { name: "Germany", code: "DE", flag: "https://flagcdn.com/w320/de.png" },
    { name: "Greece", code: "GR", flag: "https://flagcdn.com/w320/gr.png" },
    { name: "Hungary", code: "HU", flag: "https://flagcdn.com/w320/hu.png" },
    { name: "Iceland", code: "IS", flag: "https://flagcdn.com/w320/is.png" },
    { name: "Italy", code: "IT", flag: "https://flagcdn.com/w320/it.png" },
    { name: "Latvia", code: "LV", flag: "https://flagcdn.com/w320/lv.png" },
    {
      name: "Liechtenstein",
      code: "LI",
      flag: "https://flagcdn.com/w320/li.png",
    },
    { name: "Lithuania", code: "LT", flag: "https://flagcdn.com/w320/lt.png" },
    { name: "Luxembourg", code: "LU", flag: "https://flagcdn.com/w320/lu.png" },
    { name: "Malta", code: "MT", flag: "https://flagcdn.com/w320/mt.png" },
    {
      name: "Netherlands",
      code: "NL",
      flag: "https://flagcdn.com/w320/nl.png",
    },
    { name: "Norway", code: "NO", flag: "https://flagcdn.com/w320/no.png" },
    { name: "Poland", code: "PL", flag: "https://flagcdn.com/w320/pl.png" },
    { name: "Portugal", code: "PT", flag: "https://flagcdn.com/w320/pt.png" },
    { name: "Romania", code: "RO", flag: "https://flagcdn.com/w320/ro.png" },
    { name: "Slovakia", code: "SK", flag: "https://flagcdn.com/w320/sk.png" },
    { name: "Slovenia", code: "SI", flag: "https://flagcdn.com/w320/si.png" },
    { name: "Spain", code: "ES", flag: "https://flagcdn.com/w320/es.png" },
    { name: "Sweden", code: "SE", flag: "https://flagcdn.com/w320/se.png" },
    { name: "Australia", code: "AU", flag: "https://flagcdn.com/w320/au.png" },
    { name: "Global", code: "GL", flag: "" },
  ];

  for (const c of countries) {
    await prisma.country.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }

  // 6. Seed Specialized Teams
  console.log("🏢 Architecting Specialized Teams...");
  const teams = [
    {
      name: "Rhine Admissions Cell",
      vertical: "EDUCATION",
      targetLocale: "Germany",
    },
    {
      name: "Outback Education Team",
      vertical: "EDUCATION",
      targetLocale: "Australia",
    },
    {
      name: "Global Intake Hub",
      vertical: "EDUCATION",
      targetLocale: "Global",
    },
  ];

  const teamRecords: any = {};
  for (const t of teams) {
    const record = await prisma.team.upsert({
      where: { id: t.name.toLowerCase().replace(/ /g, "_") }, // Temporary ID logic for seed
      update: t,
      create: {
        id: t.name.toLowerCase().replace(/ /g, "_"),
        ...t,
      },
    });
    teamRecords[t.targetLocale] = record;
  }

  // 7. Seed Staff Roles (Counselors)
  const counselorRole = await prisma.systemRole.upsert({
    where: { code: "counselor" },
    update: {},
    create: {
      name: "Education Counselor",
      code: "counselor",
      category: "STAFF",
      description: "Standard student advisor for specialized cells",
      isSystem: true,
    },
  });

  // 8. Provision Specialized Counselors
  console.log("🧑‍💻 Deploying specialized counselors...");
  const counselors = [
    {
      email: "hans.miller@unireachbd.com",
      first: "Hans",
      last: "Miller",
      locale: "Germany",
      specialties: ["DAAD", "Public Universities"],
    },
    {
      email: "sarah.smith@unireachbd.com",
      first: "Sarah",
      last: "Smith",
      locale: "Australia",
      specialties: ["GTE", "Level 1 Uni"],
    },
    {
      email: "alex.jones@unireachbd.com",
      first: "Alex",
      last: "Jones",
      locale: "Global",
      specialties: ["General Counseling"],
    },
  ];

  for (const c of counselors) {
    await prisma.user.upsert({
      where: { email: c.email },
      update: {
        roleId: counselorRole.id,
      },
      create: {
        email: c.email,
        password: password,
        roleId: counselorRole.id,
        status: "ACTIVE",
        staffProfile: {
          create: {
            firstName: c.first,
            lastName: c.last,
            specialties: c.specialties,
            department: "Admissions",
            position: "Senior Counselor",
            teamId: teamRecords[c.locale]?.id,
            isAutoAssignEnabled: true,
          },
        },
      },
    });
  }

  console.log("\n✅ Intelligence Core Scaled Successfully!");
  console.log(`- Countries Seeded: ${countries.length}`);
  console.log(`- Teams provisioned: ${teams.length}`);
  console.log(`- Master User: ${devUser.email}`);
  console.log(`- Staff Accounts:Hans, Sarah, Alex (Password: admin123)`);
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
