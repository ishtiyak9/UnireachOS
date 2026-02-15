import { z } from "zod";
import { hash } from "argon2";
import { randomUUID } from "crypto";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  role: z.enum(["STUDENT", "AGENT", "STAFF"]),
  roleId: z.string().uuid().optional(),
  groupIds: z.array(z.string().uuid()).optional(),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Guard: Only Super Admin
  if (!session?.user || (session.user as any).roleCode !== "super_admin") {
    throw createError({ statusCode: 403, message: "Restricted Access" });
  }

  const body = await readBody(event);
  const data = await createUserSchema.parseAsync(body);

  // Check email uniqueness
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    throw createError({ statusCode: 409, message: "Email already exists" });
  }

  // Resolve Role ID
  let targetRoleId = data.roleId;

  if (targetRoleId) {
    const roleCheck = await prisma.systemRole.findUnique({
      where: { id: targetRoleId },
    });
    if (roleCheck?.code === "super_admin") {
      throw createError({
        statusCode: 403,
        message:
          "GOD MODE VIOLATION: There can be only one. You cannot clone the Architect.",
      });
    }
  } else {
    let roleCode = "applicant_standard";
    if (data.role === "AGENT") roleCode = "agent_standard";
    if (data.role === "STAFF") roleCode = "counselor";

    const roleFn = await prisma.systemRole.findUnique({
      where: { code: roleCode },
    });

    if (!roleFn) {
      throw createError({
        statusCode: 500,
        message: `Default role configuration '${roleCode}' is missing.`,
      });
    }
    targetRoleId = roleFn.id;
  }

  const hashedPassword = await hash(data.password);

  // corporate ID Generator
  let corporateId = null;
  if (data.role === "STAFF") {
    corporateId = await generateId.generateCorporateId(
      prisma.staffProfile,
      "employeeId",
      "URS"
    );
  } else if (data.role === "AGENT") {
    corporateId = await generateId.generateCorporateId(
      prisma.agentProfile,
      "agentCode",
      "URP"
    );
  }

  // Create User with appropriate profile
  // Note: Prisma create is atomic but ID generation is a separate query.
  // In high concurrency, duplicates might occur (rare for this admin-only endpoint).
  // A robust solution would use a sequence table or retry logic.
  // For now, simple pre-fetch is acceptable.

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      roleId: targetRoleId,
      status: "ACTIVE", // Admin-created users are pre-verified
      createdById: (session.user as any).id,

      applicantProfile:
        data.role === "STUDENT"
          ? {
              create: {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                userId: undefined, // Prisma handles relation
                createdById: (session.user as any).id,
                // AUTO-ASSIGN: If a staff/admin creates a student, they become the responsible owner
                ...(((session.user as any).roleCategory === "SYSTEM" ||
                  (session.user as any).roleCategory === "STAFF") &&
                (session.user as any).profile?.id
                  ? { assignedStaffId: (session.user as any).profile?.id }
                  : {}),
              },
            }
          : undefined,

      agentProfile:
        data.role === "AGENT"
          ? {
              create: {
                // id: randomUUID(), // Let Prisma default uuid() handle ID
                agencyName: `${data.firstName} ${data.lastName}`, // Default Agency Name
                primaryEmail: data.email,
                agentCode: corporateId,
                firstName: data.firstName,
                lastName: data.lastName,
                primaryPhone: data.phone,
                phone: data.phone,
              },
            }
          : undefined,

      staffProfile:
        data.role === "STAFF"
          ? {
              create: {
                firstName: data.firstName,
                lastName: data.lastName,
                employeeId: corporateId,
              },
            }
          : undefined,

      // Instance Permissions (Neural Add-ons)
      groups:
        data.groupIds && data.groupIds.length > 0
          ? {
              create: data.groupIds.map((gid) => ({ groupId: gid })),
            }
          : undefined,
    },
  });

  // Log Action
  await prisma.auditLog.create({
    data: {
      performedById: (session.user as any).id,
      action: "CREATE_USER",
      entityType: "User",
      entityId: user.id,
      newValue: {
        email: user.email,
        role: data.role,
        roleId: targetRoleId,
        groupIds: data.groupIds,
      },
    },
  });

  return { success: true, userId: user.id };
});
