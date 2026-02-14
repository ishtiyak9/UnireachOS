import { prisma } from "../../../utils/db";

/**
 * Readiness Sentinel: Application Pre-flight Validation
 * This engine performs a deep clinical analysis of the Applicant Profile
 * for a specific Course to ensure 100% compliance before submission.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Authentication Required" });
  }

  const query = getQuery(event);
  const courseId = query.courseId as string;
  const applicantId = query.applicantId as string;

  if (!courseId || !applicantId) {
    throw createError({
      statusCode: 400,
      message: "Missing Course or Applicant Identifier",
    });
  }

  // 1. Fetch the Course Requirements and the Applicant's state
  const [course, applicant] = await Promise.all([
    prisma.course.findUnique({
      where: { id: courseId },
      include: {
        level: true,
        university: true,
      },
    }),
    prisma.applicantProfile.findUnique({
      where: { id: applicantId },
      include: {
        addresses: true,
        educationHistory: true,
        documents: true,
        englishProficiency: true,
      },
    }),
  ]);

  if (!course || !applicant) {
    throw createError({ statusCode: 404, message: "Core entities not found" });
  }

  // 2. Define Requirement Gates
  const checks = {
    personal: {
      label: "Personal Profile",
      status: false,
      missing: [] as string[],
    },
    academic: {
      label: "Academic History",
      status: false,
      missing: [] as string[],
    },
    documents: {
      label: "Mandatory Documents",
      status: false,
      missing: [] as string[],
    },
  };

  // --- GATE 1: Personal Data Verification ---
  if (!applicant.firstName || !applicant.lastName)
    checks.personal.missing.push("Full Name");
  if (!applicant.dateOfBirth) checks.personal.missing.push("Date of Birth");
  if (!applicant.nationality) checks.personal.missing.push("Nationality");
  if (!applicant.passportNo) checks.personal.missing.push("Passport Number");
  if (applicant.addresses.length === 0)
    checks.personal.missing.push("Address Details");

  checks.personal.status = checks.personal.missing.length === 0;

  // --- GATE 2: Academic Verification ---
  if (applicant.educationHistory.length === 0) {
    checks.academic.missing.push("No Education Records found");
  } else {
    // Basic verification: Ensure there is at least a secondary and high-school record
    // This can be expanded based on the course level requirement.
    const hasHighSchool = applicant.educationHistory.some((edu) =>
      ["GRADE_12", "DIPLOMA", "UNDERGRADUATE"].includes(edu.level)
    );
    if (!hasHighSchool)
      checks.academic.missing.push("Latest Qualification Certificate");
  }
  checks.academic.status = checks.academic.missing.length === 0;

  // --- GATE 3: Document Compliance (Course Related) ---
  const uploadedCategories = applicant.documents.map((d) => d.category);

  // Universal Mandatory Documents
  const universalMandatory = [
    "PASSPORT",
    "CV",
    "STD_10_MARKSHEET",
    "STD_12_MARKSHEET",
  ];

  // Course-specific Logic (E.g. Masters requires Bachelor certificates)
  if (course.level.code === "PG_DEGREE" || course.level.code === "MASTERS") {
    universalMandatory.push("BACHELORS_TRANSCRIPTS", "BACHELORS_CERTIFICATE");
  }

  // SOP/LOR Check for specific university requirements (Placeholder for future courses-related requirements)
  universalMandatory.push("SOP_ESSAY");

  for (const category of universalMandatory) {
    if (!uploadedCategories.includes(category as any)) {
      checks.documents.missing.push(category.replace(/_/g, " "));
    }
  }

  checks.documents.status = checks.documents.missing.length === 0;

  // 3. Final Compliance Decision
  const score = Object.values(checks).filter((c) => c.status).length;
  const totalChecks = Object.keys(checks).length;
  const isCompliant = score === totalChecks;

  return {
    isCompliant,
    complianceScore: Math.round((score / totalChecks) * 100),
    checks,
    meta: {
      courseName: course.name,
      universityName: course.university.name,
    },
  };
});
