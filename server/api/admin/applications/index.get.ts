import { prisma } from "../../../utils/db";

/**
 * Institutional Application Registry: Internal Fetch
 * Provides high-fidelity operational oversight for SuperAdmins and Counselors.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (
    !session?.user ||
    !["super_admin", "staff_standard"].includes((session.user as any).roleCode)
  ) {
    throw createError({ statusCode: 403, message: "Neural Access Denied" });
  }

  const query = getQuery(event);
  const { status, priority, assignedStaffId } = query;

  const applications = await prisma.application.findMany({
    where: {
      ...(status && { status: status as string }),
      ...(priority && { priority: priority as any }),
      ...(assignedStaffId && { assignedStaffId: assignedStaffId as string }),
    },
    include: {
      applicant: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          agent: { select: { agencyName: true } },
        },
      },
      course: {
        include: { university: { select: { name: true } } },
      },
      assignedStaff: {
        select: { firstName: true, lastName: true },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return { success: true, applications };
});
