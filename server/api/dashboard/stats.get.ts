import { prisma } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const { user } = session;

  // --- RBAC INTELLIGENCE GATE ---
  const hasAccess = ["SYSTEM", "STAFF"].includes(user.roleCategory);
  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: "Insufficient clearance level to access system analytics.",
    });
  }

  // --- DATA HARVESTING (Parallelized for Speed) ---
  const [
    totalApps,
    totalApplicants,
    totalStaff,
    revenueData,
    leadStatuses,
    countryCount,
    uniCount,
    courseCount,
    recentApplications,
  ] = await Promise.all([
    // Row 1: System Core
    prisma.application.count(),
    prisma.applicantProfile.count(),
    prisma.staffProfile.count(),
    prisma.commissionEarning.aggregate({ _sum: { grossAmountBDT: true } }),

    // Row 2: Lead Pipeline
    prisma.lead.groupBy({
      by: ["status"],
      _count: true,
    }),

    // Row 3: Inventory Network
    prisma.country.count({ where: { isActive: true } }),
    prisma.university.count(),
    prisma.course.count(),

    // Shared: Activity Feed
    prisma.application.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        applicant: { select: { firstName: true, lastName: true, type: true } },
      },
    }),
  ]);

  // Transform Lead Stats into a more usable map
  const leadsMap = Object.fromEntries(
    leadStatuses.map((ls) => [ls.status, ls._count])
  );

  return {
    success: true,
    data: {
      // Group 1: Overall System Intelligence
      system: [
        {
          label: "Total Applications",
          value: totalApps.toLocaleString(),
          change: "Live",
          trend: "up",
          icon: "pi pi-file-export",
          color: "from-blue-500 to-indigo-600",
          to: "/dashboard/applications",
        },
        {
          label: "Registered Applicants",
          value: totalApplicants.toLocaleString(),
          change: "Active Enrollment",
          trend: "up",
          icon: "pi pi-user-plus",
          color: "from-cyan-400 to-blue-500",
          to: "/dashboard/user/applicants",
        },
        {
          label: "Intelligence Officers",
          value: totalStaff.toLocaleString(),
          change: "Internal Staff",
          trend: "up",
          icon: "pi pi-id-card",
          color: "from-violet-500 to-purple-600",
          to: "/dashboard/user/staff",
        },
        {
          label: "Total Revenue",
          value: `৳${((revenueData._sum.grossAmountBDT || 0) / 1000).toFixed(
            1
          )}K`,
          change: "Gross Yield",
          trend: "up",
          icon: "pi pi-dollar",
          color: "from-fuchsia-500 to-purple-600",
          to: "/dashboard/finance",
        },
      ],

      // Group 2: Lead Funnel Analytics
      leads: [
        {
          label: "New Web Inquiries",
          value: (leadsMap["New Inquiry"] || 0).toLocaleString(),
          change: "Unassigned",
          trend: "up",
          icon: "pi pi-bolt",
          color: "from-orange-400 to-red-500",
          to: "/dashboard/leads?status=new",
        },
        {
          label: "Engaged Leads",
          value: (leadsMap["Contacted"] || 0).toLocaleString(),
          change: "In Progress",
          trend: "up",
          icon: "pi pi-comments",
          color: "from-amber-400 to-orange-500",
          to: "/dashboard/leads?status=contacted",
        },
        {
          label: "Qualified Pipeline",
          value: (leadsMap["Qualified"] || 0).toLocaleString(),
          change: "High Intent",
          trend: "up",
          icon: "pi pi-verified",
          color: "from-emerald-400 to-teal-600",
          to: "/dashboard/leads?status=qualified",
        },
        {
          label: "Success Conversions",
          value: (leadsMap["Converted"] || 0).toLocaleString(),
          change: "Goal Reached",
          trend: "up",
          icon: "pi pi-heart",
          color: "from-pink-500 to-rose-600",
          to: "/dashboard/leads?status=converted",
        },
      ],

      // Group 3: Global Inventory Registry
      inventory: [
        {
          label: "Global Destinations",
          value: countryCount.toLocaleString(),
          change: "Active Countries",
          trend: "up",
          icon: "pi pi-map-marker",
          color: "from-green-400 to-emerald-600",
          to: "/dashboard/settings/geo",
        },
        {
          label: "Partner Institutions",
          value: uniCount.toLocaleString(),
          change: "Universities",
          trend: "up",
          icon: "pi pi-building",
          color: "from-sky-400 to-blue-600",
          to: "/dashboard/inventory/universities",
        },
        {
          label: "Academic Catalog",
          value: courseCount.toLocaleString(),
          change: "Course Programs",
          trend: "up",
          icon: "pi pi-book",
          color: "from-indigo-400 to-violet-600",
          to: "/dashboard/inventory/courses",
        },
      ],

      recentActivity: recentApplications.map((app) => ({
        id: app.id,
        name: `${app.applicant.firstName} ${app.applicant.lastName}`,
        type: app.applicant.type,
        status: app.externalStatus.toUpperCase(),
        createdAt: app.createdAt,
      })),
    },
  };
});
