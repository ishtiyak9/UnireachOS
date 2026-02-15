import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  // Fetch all staff profiles (excluding super_admin)
  const staff = await prisma.staffProfile.findMany({
    where: {
      // Ensure the user has a staff profile (implicit by querying staffProfile)
      // We removed the restriction on super_admin to allow admins to also be counselors
      user: {
        status: "ACTIVE",
      },
    },
    orderBy: {
      firstName: "asc",
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      position: true,
      department: true,
    },
  });

  // Fetch all Teams for round-robin forwarding
  const teams = await prisma.team.findMany({
    orderBy: { name: "asc" },
  });

  const staffList = staff.map((s) => ({
    id: s.id,
    type: "INDIVIDUAL",
    name: `${s.firstName} ${s.lastName}`,
    label: `👤 ${s.firstName} ${s.lastName} (${s.position || "Staff"})`,
  }));

  const teamList = teams.map((t) => ({
    id: t.id,
    type: "TEAM",
    name: t.name,
    label: `🏢 TEAM: ${t.name} (${t.vertical})`,
  }));

  return {
    data: [...staffList, ...teamList],
  };
});
