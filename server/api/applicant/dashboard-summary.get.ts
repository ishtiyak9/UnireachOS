import { prisma } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      applications: {
        include: {
          course: {
            include: { university: true },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: 5,
      },
      documents: {
        take: 1,
      },
      _count: {
        select: {
          applications: true,
          documents: true,
        },
      },
    },
  });

  if (!profile) {
    throw createError({ statusCode: 404, message: "Profile missing" });
  }

  // Calculate Profile Completion (Simplified logic for elite feel)
  const fields = [
    profile.firstName,
    profile.lastName,
    profile.gender,
    profile.dob,
    profile.nationality,
    profile.passportNumber,
    profile.phone,
    profile.addressMailing,
    profile.cityMailing,
    profile.countryMailing,
  ];
  const filledFields = fields.filter((f) => !!f).length;
  const profileCompletion = Math.round((filledFields / fields.length) * 100);

  // Determine Active Stage based on latest application
  const latestApp = profile.applications[0];
  let activeStage = 0; // 0: Start, 1: Applied, 2: Review, 3: Offer, 4: Visa

  if (latestApp) {
    const status = latestApp.externalStatus.toLowerCase();
    if (status.includes("visa")) activeStage = 4;
    else if (status.includes("offer") || status.includes("accepted"))
      activeStage = 3;
    else if (status.includes("review") || status.includes("verified"))
      activeStage = 2;
    else activeStage = 1;
  }

  // Determine Priority Action
  let priorityAction = {
    title: "Intelligence Discovery",
    desc: "Your academic profile is ready. Begin discovery to find elite programs curated for your background.",
    status: "Ready",
    actionLabel: "Find Programs",
    actionTo: "/applicant-portal/courses-finder",
  };

  if (profileCompletion < 80) {
    priorityAction = {
      title: "Identity Integrity",
      desc: "Your scholar profile requires additional data points to achieve high-fidelity institutional matching.",
      status: "Critical",
      actionLabel: "Complete Profile",
      actionTo: "/applicant-portal/profile",
    };
  } else if (profile._count.applications === 0) {
    priorityAction = {
      title: "Mission Launch",
      desc: "Your profile is verified. Launch your academic mission by applying to selected institutions.",
      status: "Strategic",
      actionLabel: "Launch Discovery",
      actionTo: "/applicant-portal/courses-finder",
    };
  } else if (latestApp) {
    priorityAction = {
      title: "Tracking Protocol",
      desc: `Your application for ${latestApp.course.name} is currently in the ${latestApp.externalStatus} phase.`,
      status: "Active",
      actionLabel: "Track Mission",
      actionTo: "/applicant-portal/applications",
    };
  }

  return {
    stats: {
      profileCompletion,
      totalApplications: profile._count.applications,
      totalDocuments: profile._count.documents,
      activeStage,
    },
    priorityAction,
    latestApplications: profile.applications,
  };
});
