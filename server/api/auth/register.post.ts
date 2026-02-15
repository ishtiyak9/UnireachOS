import { hash } from "argon2";
import { prisma } from "../../utils/db";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  type: z.enum(["STUDENT", "EXPATRIATE", "AGENT"]).optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validate input
    const validated = registerSchema.parse(body);

    // [GUARD] System Access Control
    const roleType = validated.type === "AGENT" ? "AGENT" : "PUBLIC"; // Map type to guard role
    await checkSystemAccess(event, "REGISTER", roleType);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await hash(validated.password);

    // Resolve the standard applicant role from the dynamic authority core
    const standardRole = await prisma.systemRole.findUnique({
      where: { code: "applicant_standard" },
    });

    if (!standardRole) {
      throw createError({
        statusCode: 500,
        message: "Neural Core Failure: Default authority role not established.",
      });
    }

    // Create user with Universal Applicant profile (enforcing STUDENT archetype)
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        password: hashedPassword,
        roleId: standardRole.id,
        status: "PENDING_VERIFICATION",
        applicantProfile: {
          create: {
            firstName: validated.firstName,
            lastName: validated.lastName,
            phone: validated.phone,
            type: "STUDENT", // Enforcing Student-First policy
          },
        },
      },
      include: {
        role: true,
        applicantProfile: true,
      },
    });

    const userData = {
      id: user.id,
      email: user.email,
      roleName: user.role.name,
      roleCode: user.role.code,
      permissions: [], // New users start with base authority
      status: user.status,
      profile: user.applicantProfile,
    };

    return {
      success: true,
      user: userData,
    };
  } catch (error: any) {
    if (error.issues) {
      throw createError({
        statusCode: 400,
        message: "Invalid input data",
        data: error.issues,
      });
    }
    throw error;
  }
});
