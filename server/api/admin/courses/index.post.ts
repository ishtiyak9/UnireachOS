import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const body = await readBody(event);

  // Validation
  if (!body.name || !body.universityId || !body.levelId) {
    throw createError({
      statusCode: 400,
      message: "Missing mission-critical program parameters.",
    });
  }

  const course = await prisma.course.create({
    data: {
      universityId: body.universityId,
      levelId: body.levelId,
      name: body.name,
      code: body.code,
      duration: body.duration,
      campus: body.campus,
      courseUrl: body.courseUrl,
      intakeMonths: body.intakeMonths || [],
      tuitionFee: parseFloat(body.tuitionFee) || 0,
      applicationFee: parseFloat(body.applicationFee) || 0,
      currency: body.currency || "USD",
      unireachCommission: body.unireachCommission,
      partnerCommission: body.partnerCommission,
      applicationDeadline: body.applicationDeadline,
      isActive: body.isActive ?? true,

      // Strategic Intelligence Flags
      isFastTrack: body.isFastTrack ?? false,
      hasScholarship: body.hasScholarship ?? false,
      highAcceptanceRate: body.highAcceptanceRate ?? false,
      isStem: body.isStem ?? false,
      isInterviewOptional: body.isInterviewOptional ?? false,
      hasEnglishWaiver: body.hasEnglishWaiver ?? false,
      hasAppFeeWaiver: body.hasAppFeeWaiver ?? false,
      lowTuitionDeposit: body.lowTuitionDeposit ?? false,
      hasLoanSupport: body.hasLoanSupport ?? false,
      isAffordable: body.isAffordable ?? false,
      isMajorCity: body.isMajorCity ?? false,
      isRegional: body.isRegional ?? false,
      hasCoop: body.hasCoop ?? false,
      highJobDemand: body.highJobDemand ?? false,
      hasMathsWaiver: body.hasMathsWaiver ?? false,
      hasGreGmatWaiver: body.hasGreGmatWaiver ?? false,
      requiresWorkExp: body.requiresWorkExp ?? false,
      strategicFlags: body.strategicFlags || [],

      studyAreaId: body.studyAreaId,
      disciplineId: body.disciplineId,
      entryRequirements: body.entryRequirements,
      englishRequirements: body.englishRequirements,
      moiAccepted: body.moiAccepted ?? false,
      standardizedTests: body.standardizedTests,
      remarks: body.remarks,
      extraNotes: body.extraNotes,
      additionalRequirements: body.additionalRequirements || {},
    },
  });

  return course;
});
