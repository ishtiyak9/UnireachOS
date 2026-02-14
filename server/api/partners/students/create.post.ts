import { z } from "zod";
import { hash } from "argon2";
import { prisma } from "../../../utils/db";

const createStudentSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Access Control: Partner Network Only
  if (!session?.user || (session.user as any).roleCategory !== "AGENT") {
    throw createError({
      statusCode: 403,
      message: "Neural Access Denied: Unauthorized Entity.",
    });
  }

  const agentProfileId = (session.user as any).profile?.id;
  if (!agentProfileId) {
    throw createError({
      statusCode: 412,
      message: "Identity Error: Partner Profile not synchronized.",
    });
  }

  const body = await readBody(event);
  const data = await createStudentSchema.parseAsync(body);

  // Check for collision
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    throw createError({
      statusCode: 409,
      message: "Collision Detected: Identity already registered in Registry.",
    });
  }

  // Resolve standard applicant role
  const standardRole = await prisma.systemRole.findUnique({
    where: { code: "applicant_standard" },
  });

  if (!standardRole) {
    throw createError({
      statusCode: 500,
      message: "Neural Core Failure: Default authority role not found.",
    });
  }

  const hashedPassword = await hash(data.password);

  // Atomic creation of User + ApplicantProfile + Lineage
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      roleId: standardRole.id,
      status: "ACTIVE", // Partner-vetted students are active
      createdById: (session.user as any).id,
      applicantProfile: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
          agentId: agentProfileId, // Establish Chain of Custody (Partner Ownership)
        },
      },
    },
    include: {
      applicantProfile: true,
    },
  });

  // Log Strategic Transaction
  await prisma.auditLog.create({
    data: {
      performedById: (session.user as any).id,
      action: "PARTNER_STUDENT_CREATE",
      entityType: "User",
      entityId: user.id,
      newValue: {
        email: user.email,
        agentId: agentProfileId,
        vetted: true,
      },
    },
  });

  return {
    success: true,
    message: "Student node successfully integrated into Partner Pipeline.",
    userId: user.id,
  };
});
