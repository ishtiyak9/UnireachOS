import { prisma } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const {
    search,
    country,
    levelId,
    studyAreaId,
    disciplineId,
    intake,
    // Tactical Flags
    isFastTrack,
    hasScholarship,
    highAcceptanceRate,
    isStem,
    isInterviewOptional,
    hasEnglishWaiver,
    hasAppFeeWaiver,
    lowTuitionDeposit,
    hasLoanSupport,
    isAffordable,
    isMajorCity,
    isRegional,
    hasCoop,
    highJobDemand,
    hasMathsWaiver,
    hasGreGmatWaiver,
    requiresWorkExp,
    strategicFlag,
  } = query;

  const where: any = {
    isActive: true,
  };

  // Text Search Intelligence
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: "insensitive" } },
      {
        university: {
          name: { contains: search as string, mode: "insensitive" },
        },
      },
      { code: { contains: search as string, mode: "insensitive" } },
    ];
  }

  // Relational Filtering
  if (country) {
    where.university = {
      ...where.university,
      country: country as string,
    };
  }

  if (levelId) where.levelId = levelId as string;
  if (studyAreaId) where.studyAreaId = studyAreaId as string;
  if (disciplineId) where.disciplineId = disciplineId as string;

  // Temporal Intelligence (Intake)
  if (intake) {
    where.intakeMonths = {
      has: intake as string,
    };
  }

  // Tactical Intelligence Map (Booleans)
  const boolFlags = [
    "isFastTrack",
    "hasScholarship",
    "highAcceptanceRate",
    "isStem",
    "isInterviewOptional",
    "hasEnglishWaiver",
    "hasAppFeeWaiver",
    "lowTuitionDeposit",
    "hasLoanSupport",
    "isAffordable",
    "isMajorCity",
    "isRegional",
    "hasCoop",
    "highJobDemand",
    "hasMathsWaiver",
    "hasGreGmatWaiver",
    "requiresWorkExp",
  ];

  boolFlags.forEach((flag) => {
    if (query[flag] === "true") {
      where[flag] = true;
    }
  });

  // Advanced Strategic Filtering
  if (strategicFlag) {
    where.strategicFlags = {
      has: strategicFlag as string,
    };
  }

  const courses = await prisma.course.findMany({
    where,
    include: {
      university: {
        select: {
          id: true,
          name: true,
          logo: true,
          country: true,
          strategicRank: true,
          isPremiumPartner: true,
          website: true,
        },
      },
      level: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
    orderBy: [{ university: { strategicRank: "desc" } }, { createdAt: "desc" }],
  });

  // Fetch Country Intelligence (Flags)
  const countryNames = Array.from(
    new Set(courses.map((c) => c.university.country))
  );
  const countries = await prisma.country.findMany({
    where: { name: { in: countryNames } },
    select: { name: true, flag: true },
  });

  const countryFlagMap = Object.fromEntries(
    countries.map((c) => [c.name, c.flag])
  );

  const enrichedCourses = courses.map((course) => ({
    ...course,
    university: {
      ...course.university,
      countryFlag: countryFlagMap[course.university.country] || null,
    },
  }));

  return {
    data: enrichedCourses,
  };
});
