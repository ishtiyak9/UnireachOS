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

  // 1. Define Core Permissions
  const permissionsList = [
    { code: "system:control", name: "System Control", group: "SYSTEM" },
    { code: "user:manage", name: "User Management", group: "ACCOUNTS" },
    {
      code: "application:review",
      name: "Review Applications",
      group: "ADMISSION",
    },
    {
      code: "application:approve",
      name: "Approve Applications",
      group: "ADMISSION",
    },
    { code: "agent:verify", name: "Verify Agents", group: "PARTNERS" },
    { code: "client:apply", name: "Submit Application", group: "APPLICANT" },
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
