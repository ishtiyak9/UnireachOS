import { prisma } from "../../utils/db";
import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  passportNo: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  agencyName: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  notificationPreferences: z
    .object({
      emailEnabled: z.boolean().optional(),
      pushEnabled: z.boolean().optional(),
      systemEnabled: z.boolean().optional(),
      agentEnabled: z.boolean().optional(),
      applicantEnabled: z.boolean().optional(),
      leadEnabled: z.boolean().optional(),
      marketingEnabled: z.boolean().optional(),
    })
    .optional(),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const userId = (session.user as any).id;
  const roleCategory = (session.user as any).roleCategory;
  const body = await readBody(event);

  try {
    const validated = profileSchema.parse(body);

    let updatedProfile = null;

    if (roleCategory === "SYSTEM") {
      updatedProfile = await prisma.staffProfile.update({
        where: { userId },
        data: {
          firstName: validated.firstName,
          lastName: validated.lastName,
          department: validated.department,
          position: validated.position,
        },
      });
    } else if (roleCategory === "AGENT") {
      updatedProfile = await prisma.agentProfile.update({
        where: { userId },
        data: {
          agencyName: validated.agencyName || "Unnamed Agency",
          phone: validated.phone,
        },
      });
    } else {
      updatedProfile = await prisma.applicantProfile.update({
        where: { userId },
        data: {
          firstName: validated.firstName,
          lastName: validated.lastName,
          phone: validated.phone,
          nationality: validated.nationality,
          passportNo: validated.passportNo,
          dateOfBirth: validated.dateOfBirth
            ? new Date(validated.dateOfBirth)
            : null,
        },
      });
    }

    let updatedPreferences = null;
    if (validated.notificationPreferences) {
      updatedPreferences = await prisma.notificationPreference.upsert({
        where: { userId },
        create: {
          userId,
          ...validated.notificationPreferences,
        },
        update: {
          ...validated.notificationPreferences,
        },
      });
    } else {
      // Fetch existing if not updating, to keep session consistent
      updatedPreferences = await prisma.notificationPreference.findUnique({
        where: { userId },
      });
    }

    // Update the session with new profile data
    await setUserSession(event, {
      ...session,
      user: {
        ...session.user,
        profile: updatedProfile,
        notificationPreferences: updatedPreferences,
      },
    });

    return {
      success: true,
      profile: updatedProfile,
    };
  } catch (error: any) {
    if (error.issues) {
      throw createError({
        statusCode: 400,
        message: "Validation failed",
        data: error.issues,
      });
    }
    throw error;
  }
});
