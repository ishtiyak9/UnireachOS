import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session?.user || (session.user as any).roleCategory !== "AGENT") {
    throw createError({
      statusCode: 403,
      message: "Neural Access Denied.",
    });
  }

  const agentProfileId = (session.user as any).profile?.id;

  try {
    const students = await prisma.user.findMany({
      where: {
        applicantProfile: {
          agentId: agentProfileId,
        },
      },
      include: {
        applicantProfile: {
          include: {
            assignedStaff: true,
            applications: {
              select: {
                id: true,
                status: true,
                updatedAt: true,
              },
              orderBy: { updatedAt: "desc" },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return students.map((s: any) => ({
      id: s.id,
      firstName: s.applicantProfile?.firstName || "Unknown",
      lastName: s.applicantProfile?.lastName || "",
      fullName: `${s.applicantProfile?.firstName} ${s.applicantProfile?.lastName}`,
      email: s.email,
      status: s.status,
      applicationStatus:
        s.applicantProfile?.applications?.[0]?.status || "Pre-Application",
      assignedTo: s.applicantProfile?.assignedStaff
        ? `${s.applicantProfile.assignedStaff.firstName} ${s.applicantProfile.assignedStaff.lastName}`
        : "Unassigned",
      createdAt: s.createdAt,
    }));
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch partner pipeline.",
    });
  }
});
