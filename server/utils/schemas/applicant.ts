import { z } from "zod";

// Enums matching Prisma (manually defined to avoid importing Prisma client in schema file if desired, or just strings)
export const AddressTypeSchema = z.enum(["MAILING", "PERMANENT"]);
export const EducationLevelSchema = z.enum([
  "GRADE_10",
  "GRADE_12",
  "DIPLOMA",
  "UNDERGRADUATE",
  "POSTGRADUATE",
  "PHD",
  "OTHER",
]);
export const EnglishTestTypeSchema = z.enum([
  "IELTS",
  "TOEFL",
  "PTE",
  "DUOLINGO",
  "GRE",
  "GMAT",
  "OTHER",
]);

// --- Sub-Schemas ---

export const addressSchema = z.object({
  id: z.string().optional(),
  type: AddressTypeSchema,
  address1: z.string().min(1),
  address2: z.string().optional().nullable(),
  country: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
  pincode: z.string().min(1),
});

export const emergencyContactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().nullable(),
  relation: z.string().min(1),
});

export const educationHistorySchema = z.object({
  id: z.string().optional(),
  level: EducationLevelSchema,
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  institutionName: z.string().min(1, "Institution Name is required"),
  boardOrUniversity: z.string().min(1, "Board/University is required"),
  qualification: z.string().optional().nullable(),
  gradingSystem: z.string().min(1, "Grading System is required"),
  score: z.string().min(1, "Score is required"),
  primaryLanguage: z.string().min(1, "Primary Language is required"),
  startDate: z.coerce.date({ required_error: "Start Date is required" }),
  endDate: z.coerce.date().optional().nullable(),
  isPursuing: z.boolean().optional(),
});

export const workExperienceSchema = z.object({
  id: z.string().optional(),
  employerName: z.string().min(1, "Organization Name is required"),
  address: z.string().min(1, "Organization Address is required"),
  designation: z.string().min(1, "Designation is required"),
  startDate: z.coerce.date({
    required_error: "Start Date (Working From) is required",
  }),
  endDate: z.coerce.date().optional().nullable(),
  isCurrent: z.boolean().optional(),
  responsibilities: z.string().optional().nullable(),
});

export const englishProficiencySchema = z.object({
  id: z.string().optional(),
  testName: EnglishTestTypeSchema,
  examDate: z.coerce.date(),
  overallScore: z.number().min(0).optional().nullable(),
  reading: z.number().optional().nullable(),
  writing: z.number().optional().nullable(),
  listening: z.number().optional().nullable(),
  speaking: z.number().optional().nullable(),

  // Dynamic scores for tests like GRE
  scoreDetails: z.any().optional().nullable(),

  trfNumber: z.string().optional().nullable(),

  certificatePending: z.boolean().optional(),
  hasMOI: z.boolean().optional(),
});

// --- Main Profile Schema ---

export const applicantProfileSchema = z.object({
  // Personal Info
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  gender: z.string().optional().nullable(),
  maritalStatus: z.string().optional().nullable(),

  // Contact
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),

  // Passport & Nationality
  passportNo: z.string().optional().nullable(),
  passportIssueDate: z.coerce.date().optional().nullable(),
  passportExpiryDate: z.coerce.date().optional().nullable(),
  passportIssueCountry: z.string().optional().nullable(),
  cityOfBirth: z.string().optional().nullable(),
  countryOfBirth: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  citizenship: z.string().optional().nullable(),
  otherCitizenships: z.array(z.string()).optional(),
  livingInOtherCountry: z.boolean().optional(),
  currentCountry: z.string().optional().nullable(),
  visaStatus: z.string().optional().nullable(),

  // Background
  immigrationApplied: z.boolean().optional(),
  immigrationDetails: z.string().optional().nullable(),
  medicalCondition: z.boolean().optional(),
  medicalDetails: z.string().optional().nullable(),
  visaRefusal: z.boolean().optional(),
  refusalDetails: z.any().optional().nullable(), // Json type
  criminalOffence: z.boolean().optional(),
  criminalDetails: z.string().optional().nullable(),

  isUSGreenCardHolder: z.boolean().optional(),
  isCanadianPR: z.boolean().optional(),
  gapExplanation: z.string().optional().nullable(),

  // Nested Relations
  addresses: z.array(addressSchema).optional(),
  emergencyContacts: z.array(emergencyContactSchema).optional(),
  educationHistory: z.array(educationHistorySchema).optional(),
  workExperience: z.array(workExperienceSchema).optional(),
  englishProficiency: z.array(englishProficiencySchema).optional(),
});

export type ApplicantProfileInput = z.infer<typeof applicantProfileSchema>;
