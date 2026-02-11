import { z } from "zod";
import { hash } from "argon2";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["STUDENT", "AGENT", "STAFF"]),
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

  // Resolve Role
  let roleCode = "applicant_standard";
  if (data.role === "AGENT") roleCode = "agent_standard";
  if (data.role === "STAFF") roleCode = "staff_standard";

  const roleFn = await prisma.systemRole.findUnique({
    where: { code: roleCode },
  });

  if (!roleFn) {
    throw createError({
      statusCode: 500,
      message: `Role configuration '${roleCode}' is missing.`,
    });
  }

  const hashedPassword = await hash(data.password);

  // Create User with appropriate profile
  // Note: User model does not have name fields, they belong to profiles.
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      roleId: roleFn.id,
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
            // Agents use Agency Name. We map name to agency name for now.
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
    },
    // select: { id: true, email: true }, // Return minimal info
  });

  // Log Action
  await prisma.auditLog.create({
    data: {
      performedById: session.user.id,
      action: "CREATE_USER",
      entityType: "User",
      entityId: user.id,
      newValue: { email: user.email, role: data.role },
    },
  });

  return { success: true, userId: user.id };
});
