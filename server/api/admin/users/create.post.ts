import { z } from "zod";
import { hash } from "argon2";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["STUDENT", "AGENT", "STAFF"]),
  roleId: z.string().uuid().optional(),
  groupIds: z.array(z.string().uuid()).optional(),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Guard: Only Super Admin
  if (!session?.user || session.user.roleCode !== "super_admin") {
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

  if (!targetRoleId) {
    let roleCode = "applicant_standard";
    if (data.role === "AGENT") roleCode = "agent_standard";
    if (data.role === "STAFF") roleCode = "staff_standard";

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

  // Create User with appropriate profile
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      roleId: targetRoleId,
      status: "ACTIVE", // Admin-created users are pre-verified

      // Conditional Profile Creation
      ...(data.role === "STUDENT" && {
        applicantProfile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
        },
      }),

      ...(data.role === "AGENT" && {
        agentProfile: {
          create: {
            agencyName: data.firstName,
          },
        },
      }),

      ...(data.role === "STAFF" && {
        staffProfile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
        },
      }),

      // Instance Permissions (Neural Add-ons)
      ...(data.groupIds &&
        data.groupIds.length > 0 && {
          groups: {
            createMany: {
              data: data.groupIds.map((gid) => ({ groupId: gid })),
            },
          },
        }),
    },
  });

  // Log Action
  await prisma.auditLog.create({
    data: {
      performedById: session.user.id,
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
