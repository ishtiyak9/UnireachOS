import { z } from "zod";
import { prisma } from "../../../utils/db";

const assignSchema = z.object({
  applicantId: z.string(), // User ID of the applicant
  staffProfileId: z.string(), // ID of the StaffProfile
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  // --- PERMISSIONS ---
  const user = session.user as any;
  const isAdmin = ["super_admin"].includes(user.roleCode || user.role || "");

  if (!isAdmin) {
    throw createError({
      statusCode: 403,
      message: "Neural Access Denied: Insufficient privilege for assignment.",
    });
  }

  const body = await readBody(event);
  const { applicantId, staffProfileId } = await assignSchema.parseAsync(body);

  try {
    // Strategic Update: Re-routing the applicant's lifecycle to a specific counselor
    const updated = await prisma.applicantProfile.update({
      where: { userId: applicantId },
      data: {
        assignedStaffId: staffProfileId,
      },
      include: {
        assignedStaff: true,
      },
    });

    // Auditor: Record the transaction in the global ledger
    await prisma.auditLog.create({
      data: {
        performedById: session.user.id,
        action: "APPLICANT_REASSIGN",
        entityType: "ApplicantProfile",
        entityId: updated.id,
        newValue: {
          assignedStaffId: staffProfileId,
          staffName: `${updated.assignedStaff?.firstName} ${updated.assignedStaff?.lastName}`,
        },
      },
    });

    return {
      success: true,
      message: `Node re-assigned to ${updated.assignedStaff?.firstName} ${updated.assignedStaff?.lastName}.`,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: "Protocol Interrupted: Failed to update assignment.",
      data: error.message,
    });
  }
});
