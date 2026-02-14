import { prisma } from "./db";
import { notify } from "./notify";

/**
 * INTELLIGENCE LAYER: Autonomous Lead Router
 * Implements 'Fair-Load' Round-Robin assignment to specialized teams.
 */
export const leadRouter = {
  /**
   * Automatically assign a lead to the best available counselor.
   */
  async autoAssign(leadId: string) {
    try {
      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
      });

      if (!lead) return null;

      // 1. Find the target team based on locale and vertical (EDUCATION)
      const team = await prisma.team.findFirst({
        where: {
          vertical: "EDUCATION",
          targetLocale: {
            contains: lead.preferredCountry,
          },
        },
        include: {
          members: {
            where: { isAutoAssignEnabled: true },
            orderBy: { lastLeadAssignedAt: "asc" }, // Round-Robin: least recently assigned
            take: 1,
          },
        },
      });

      // 2. Fallback: Find a 'Global' or 'General' team if no specific locale matches
      let teamToUse = team;
      let memberToAssign = team?.members[0];

      if (!memberToAssign) {
        const globalTeam = await prisma.team.findFirst({
          where: {
            vertical: "EDUCATION",
            targetLocale: "Global",
          },
          include: {
            members: {
              where: { isAutoAssignEnabled: true },
              orderBy: { lastLeadAssignedAt: "asc" },
              take: 1,
            },
          },
        });

        if (globalTeam?.members[0]) {
          teamToUse = globalTeam;
          memberToAssign = globalTeam.members[0];
        }
      }

      // 3. Perform Assignment
      if (memberToAssign) {
        await prisma.$transaction([
          // Update Lead
          prisma.lead.update({
            where: { id: leadId },
            data: {
              assignedCounselorId: memberToAssign.id,
            },
          }),
          // Update Counselor timestamp
          prisma.staffProfile.update({
            where: { id: memberToAssign.id },
            data: { lastLeadAssignedAt: new Date() },
          }),
          // Log Event
          prisma.leadEvent.create({
            data: {
              leadId: lead.id,
              type: "ASSIGNMENT",
              metadata: {
                reason: "Auto-Assignment via Round-Robin",
                team: teamToUse?.name,
                counselor: memberToAssign.firstName,
              },
            },
          }),
        ]);

        // 4. Dispatch Realtime Notification (Individual Specialist)
        await notify.send({
          userId: memberToAssign.userId,
          title: "🎯 New Lead Assigned",
          message: `${lead.firstName} from ${lead.preferredCountry} has been assigned to you.`,
          type: "SUCCESS",
          metadata: {
            leadId: lead.id,
            action: "VIEW_LEAD",
            link: `/dashboard/leads/${lead.id}`,
          },
        });

        // [SITUATIONAL AWARENESS] Broadcast to Managers/Admins with notification clearance
        // This ensures the 'Admin Panel' (authorized users) gets the alert without bothering the Super Admin hierarchy.
        await notify.broadcastByPermission("lead:notify", {
          title: "📢 Inbound Lead Alert",
          message: `New intelligence received: ${lead.firstName} (${lead.preferredCountry}) has entered the ecosystem.`,
          type: "INFO",
          metadata: {
            leadId: lead.id,
            action: "VIEW_LEAD",
            link: `/dashboard/leads/${lead.id}`,
          },
        });

        // 5. Dispatch Team Cluster Notification (Visibility Layer)
        if (teamToUse) {
          await notify.broadcastToTeam(
            teamToUse.id,
            {
              title: `📣 Team Update: ${teamToUse.name}`,
              message: `New ${lead.preferredCountry} lead [${lead.firstName}] assigned to ${memberToAssign.firstName}.`,
              type: "INFO",
              metadata: {
                leadId: lead.id,
                action: "VIEW_LEAD",
                link: `/dashboard/leads/${lead.id}`,
              },
            },
            [memberToAssign.userId]
          );
        }

        return memberToAssign;
      }

      return null;
    } catch (error) {
      console.error("❌ Autonomous Router Failure:", error);
      return null;
    }
  },

  /**
   * Manually assign/reassign a lead.
   */
  async manualAssign(
    leadId: string,
    counselorId: string,
    performerId?: string
  ) {
    const counselor = await prisma.staffProfile.findUnique({
      where: { id: counselorId },
    });
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });

    if (!counselor || !lead) throw new Error("Entity not found.");

    return await prisma.$transaction(async (tx: any) => {
      await tx.lead.update({
        where: { id: leadId },
        data: { assignedCounselorId: counselorId },
      });

      await tx.leadEvent.create({
        data: {
          leadId,
          type: "TRANSFER",
          performerId,
          metadata: {
            note: "Manual assignment update.",
            to: counselor.firstName,
          },
        },
      });

      await notify.send({
        userId: counselor.userId,
        title: "📲 Lead Transferred to You",
        message: `Lead ${lead.firstName} has been manually assigned to your portfolio.`,
        type: "INFO",
        metadata: {
          leadId,
          action: "VIEW_LEAD",
          link: `/dashboard/leads/${leadId}`,
        },
      });
    });
  },

  /**
   * Forward a lead to a team (Round-Robin within that team).
   */
  async forwardToTeam(leadId: string, teamId: string, performerId?: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          where: { isAutoAssignEnabled: true },
          orderBy: { lastLeadAssignedAt: "asc" },
          take: 1,
        },
      },
    });

    if (!team || !team.members[0]) {
      throw new Error("Target team is inactive or has no available officers.");
    }

    const memberToAssign = team.members[0];

    return await prisma.$transaction(async (tx: any) => {
      await tx.lead.update({
        where: { id: leadId },
        data: { assignedCounselorId: memberToAssign.id },
      });

      await tx.staffProfile.update({
        where: { id: memberToAssign.id },
        data: { lastLeadAssignedAt: new Date() },
      });

      await tx.leadEvent.create({
        data: {
          leadId,
          type: "TRANSFER",
          performerId,
          metadata: {
            note: `Forwarded to team: ${team.name}`,
            team: team.name,
            to: memberToAssign.firstName,
          },
        },
      });

      await notify.send({
        userId: memberToAssign.userId,
        title: "🎯 Team Forward: New Lead",
        message: `Lead has been forwarded to the ${team.name} cell and assigned to you.`,
        type: "SUCCESS",
        metadata: {
          leadId,
          action: "VIEW_LEAD",
          link: `/dashboard/leads/${leadId}`,
        },
      });

      return memberToAssign;
    });
  },
};
