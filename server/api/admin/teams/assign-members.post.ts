import { z } from "zod";
import { prisma } from "../../../utils/db";

const teamAssignmentSchema = z.object({
  teamId: z.string(),
  memberIds: z.array(z.string()),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const body = await readBody(event);
  const { teamId, memberIds } = teamAssignmentSchema.parse(body);

  // 0. Get Team Context and Current Members
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { name: true, members: { select: { userId: true } } },
  });

  if (!team) throw createError({ statusCode: 404, message: "Cell not found" });

  const currentMemberIds = team.members.map(
    (m: { userId: string }) => m.userId
  );
  const addedIds = memberIds.filter(
    (id: string) => !currentMemberIds.includes(id)
  );
  const removedIds = currentMemberIds.filter(
    (id: string) => !memberIds.includes(id)
  );

  // 1. Remove personnel who were in this team but are not in the new batch
  await prisma.staffProfile.updateMany({
    where: {
      teamId,
      userId: { notIn: memberIds },
    },
    data: { teamId: null },
  });

  // 2. Deploy selected batch to this team
  await prisma.staffProfile.updateMany({
    where: {
      userId: { in: memberIds },
    },
    data: {
      teamId,
    },
  });

  // 3. Realtime Intelligence: Notify Affected Personnel
  for (const id of addedIds) {
    await notify.send({
      userId: id,
      title: "Cell Deployment",
      message: `You have been deployed to the ${team.name} operational unit.`,
      type: "SUCCESS",
      metadata: { link: "/dashboard/teams", action: "View Cell" },
    });
  }

  for (const id of removedIds) {
    await notify.send({
      userId: id,
      title: "Cell Withdrawal",
      message: `You have been withdrawn from the ${team.name} unit.`,
      type: "WARNING",
      metadata: { link: "/dashboard/teams" },
    });
  }

  // 4. Group Situational Awareness: Notify the whole team
  if (addedIds.length > 0 || removedIds.length > 0) {
    await notify.broadcastToTeam(teamId, {
      title: "Personnel Configuration Shift",
      message: `${addedIds.length} added, ${removedIds.length} removed from ${team.name}.`,
      type: "SYSTEM",
      metadata: { link: "/dashboard/teams" },
    });
  }

  return {
    success: true,
    message: `Successfully assigned ${memberIds.length} members to the cell.`,
  };
});
