import { hash } from "argon2";
import { prisma } from "../../../../utils/db";
import { notify } from "../../../../utils/notify";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const leadId = getRouterParam(event, "id");

  // 1. Fetch Lead
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { assignedCounselor: true },
  });

  if (!lead) {
    throw createError({ statusCode: 404, message: "Lead not found" });
  }

  // 2. Security: Check if already converted (by email)
  const existingUser = await prisma.user.findUnique({
    where: { email: lead.email },
  });

  if (existingUser) {
    throw createError({
      statusCode: 400,
      message:
        "A user with this email identity already exists in the intelligence network.",
    });
  }

  // 3. Get Applicant Role
  const applicantRole = await prisma.systemRole.findUnique({
    where: { code: "applicant_standard" },
  });

  if (!applicantRole) {
    throw createError({
      statusCode: 500,
      message: "System configuration error: Applicant role matrix missing.",
    });
  }

  // 4. Fetch Performer Context
  const dbUser = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: { staffProfile: true },
  });

  // 5. Execute Conversion (Neural Transaction)
  const tempPassword = await hash("Unireach2026!"); // Default temporary clearance

  const result = await prisma.$transaction(async (tx) => {
    // A. Provision User Identity
    const user = await tx.user.create({
      data: {
        email: lead.email,
        password: tempPassword,
        roleId: applicantRole.id,
        status: "ACTIVE",
        applicantProfile: {
          create: {
            firstName: lead.firstName,
            lastName: lead.lastName || "",
            phone: lead.phone,
            currentCountry: lead.preferredCountry,
            // Link to the same staff who was handling the lead
            assignedStaffId: lead.assignedCounselorId,
          },
        },
      },
      include: { applicantProfile: true },
    });

    // B. Update Lead Lifecycle Status
    await tx.lead.update({
      where: { id: leadId },
      data: { status: "Converted to Applicant" },
    });

    // C. Record Conversion Event
    await tx.leadEvent.create({
      data: {
        leadId: leadId as string,
        type: "CONVERSION",
        performerId: dbUser?.staffProfile?.id,
        metadata: { to: "Applicant", userId: user.id },
      },
    });

    return user;
  });

  // 6. Broadcast Situational Awareness
  if (lead.assignedCounselorId) {
    const counselor = await prisma.staffProfile.findUnique({
      where: { id: lead.assignedCounselorId },
    });
    if (counselor) {
      await notify.send({
        userId: counselor.userId,
        title: "Lead Successfully Converted",
        message: `${lead.firstName} ${
          lead.lastName || ""
        } has been promoted to an Applicant profile.`,
        type: "SUCCESS",
        metadata: { link: `/dashboard/user/applicants/${result.id}` },
      });
    }
  }

  return {
    success: true,
    message: "Lead successfully promoted to Applicant identity.",
    data: result,
  };
});
