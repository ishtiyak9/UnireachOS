import { prisma } from "../../../utils/db";
import {
  STATUS_VISIBILITY_MAP,
  DEFAULT_LEAD_STATUS,
} from "../../../../shared/constants";

/**
 * Submission Engine: The "Flight Data Recorder" for Applications
 * This specialized endpoint creates the immutable application record by
 * performing a clinical snapshot of the Applicant and Course at the moment of submission.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Authentication Required" });
  }

  const body = await readBody(event);
  const { courseId, applicantId, priority = "MEDIUM" } = body;

  if (!courseId || !applicantId) {
    throw createError({
      statusCode: 400,
      message: "Missing Course or Applicant Identifier",
    });
  }

  // 1. Fetch Fresh Core Data for Snapshotting
  const [course, applicant] = await Promise.all([
    prisma.course.findUnique({
      where: { id: courseId },
      include: {
        university: true,
        level: true,
      },
    }),
    prisma.applicantProfile.findUnique({
      where: { id: applicantId },
      include: {
        addresses: true,
        educationHistory: true,
        englishProficiency: true,
        documents: true,
        agent: true,
      },
    }),
  ]);

  if (!course || !applicant) {
    throw createError({
      statusCode: 404,
      message: "Entities not found for snapshotting",
    });
  }

  // 2. Perform Internal Validation (Final Sentinel Check)
  // This ensures no one bypasses the UI validation
  if (
    !applicant.firstName ||
    !applicant.lastName ||
    applicant.documents.length < 3
  ) {
    throw createError({
      statusCode: 422,
      message: "Sentinel Block: Profile fails 100% compliance check.",
    });
  }

  // 3. Orchestrate the Transaction
  return await prisma.$transaction(async (tx) => {
    // Check for existing application to prevent duplicates (Unique Constraint redundant check)
    const existing = await tx.application.findUnique({
      where: { applicantId_courseId: { applicantId, courseId } },
    });

    if (existing) {
      throw createError({
        statusCode: 409,
        message:
          "Immutable Node Collision: Application already exists for this course.",
      });
    }

    // A. Generate Clinical Snapshots
    const profileSnapshot = {
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      email: applicant.email,
      phone: applicant.phone,
      passportNo: applicant.passportNo,
      addresses: applicant.addresses,
      educationHistory: applicant.educationHistory,
      englishProficiency: applicant.englishProficiency,
      agentId: applicant.agentId,
      agentName: applicant.agent?.agencyName,
    };

    const courseSnapshot = {
      name: course.name,
      universityName: course.university.name,
      universityCode: course.university.code,
      tuitionFee: course.tuitionFee,
      applicationFee: course.applicationFee,
      currency: course.currency,
      duration: course.duration,
      level: course.level.name,
    };

    // B. Map Initial Status Visibility
    const initialStatus = DEFAULT_LEAD_STATUS; // Typically "New Inquiry" or "Application Submitted to University"
    const externalStatus = STATUS_VISIBILITY_MAP[initialStatus] || "Pending";

    // C. Create the Application Node
    const application = await tx.application.create({
      data: {
        applicantId,
        courseId,
        status: "Application Submitted to University", // Strategic starting point
        externalStatus: "Processing",
        priority: priority as any,
        profileSnapshot: profileSnapshot as any,
        courseSnapshot: courseSnapshot as any,
        // Inherit assigned counselor from applicant if exists
        assignedStaffId: applicant.assignedStaffId,
      },
    });

    // D. Initialize the Audit Lineage
    await tx.applicationStatusHistory.create({
      data: {
        applicationId: application.id,
        fromStatus: "DRAFT",
        toStatus: "Application Submitted to University",
        reason: "Initial submission through the Application Engine.",
        performedBy: session.user.id as string,
      },
    });

    // E. Link submitted documents to this specific application (Reference Link)
    // This allows staff to see which documents were part of the 100% check
    if (applicant.documents.length > 0) {
      await tx.document.updateMany({
        where: { id: { in: applicant.documents.map((d) => d.id) } },
        data: { applicationId: application.id },
      });
    }

    // F. Return the Node with Metadata
    return {
      success: true,
      applicationId: application.id,
      code: application.code,
      message: "Immutable Application State created successfully.",
    };
  });
});
