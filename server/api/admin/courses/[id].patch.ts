import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { id } = event.context.params as { id: string };
  const body = await readBody(event);

  const course = await prisma.course.update({
    where: { id },
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
      currency: body.currency,
      expectedCommission: body.expectedCommission,
      applicationDeadline: body.applicationDeadline,
      isActive: body.isActive,

      // Strategic Intelligence Flags
      isFastTrack: body.isFastTrack,
      hasScholarship: body.hasScholarship,
      highAcceptanceRate: body.highAcceptanceRate,
      isStem: body.isStem,
      isInterviewOptional: body.isInterviewOptional,
      hasEnglishWaiver: body.hasEnglishWaiver,
      hasAppFeeWaiver: body.hasAppFeeWaiver,
      lowTuitionDeposit: body.lowTuitionDeposit,
      hasLoanSupport: body.hasLoanSupport,
      isAffordable: body.isAffordable,
      isMajorCity: body.isMajorCity,
      isRegional: body.isRegional,
      hasCoop: body.hasCoop,
      highJobDemand: body.highJobDemand,
      hasMathsWaiver: body.hasMathsWaiver,
      hasGreGmatWaiver: body.hasGreGmatWaiver,
      requiresWorkExp: body.requiresWorkExp,
      strategicFlags: body.strategicFlags,

      studyAreaId: body.studyAreaId,
      disciplineId: body.disciplineId,
      entryRequirements: body.entryRequirements,
      englishRequirements: body.englishRequirements,
      moiAccepted: body.moiAccepted,
      standardizedTests: body.standardizedTests,
      remarks: body.remarks,
      extraNotes: body.extraNotes,
      additionalRequirements: body.additionalRequirements,
    },
  });

  return course;
});
