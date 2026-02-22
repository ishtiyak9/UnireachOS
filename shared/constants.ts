export const LEAD_STATUSES = {
  PRE_APPLICATION: [
    "New Inquiry",
    "Contacted",
    "Counselling Scheduled",
    "Counselling Completed",
    "Interested – Not Ready",
    "Eligible to Apply",
    "Not Eligible",
    "Awaiting Documents",
    "Documents Partially Received",
    "Documents Complete – Ready to Apply",
    "Application in Preparation",
    "Lead Closed – Spam",
    "Lead Closed – No Response",
  ],
  SUBMISSION: [
    "Application Submitted to University",
    "Application Submitted – Awaiting Acknowledgment",
    "Acknowledged by University",
    "Application Paid – University Fees",
    "Application Under Initial Review",
    "Application Under Academic Review",
    "Application Under Department Review",
    "Additional Documents Requested",
    "Documents Resubmitted",
    "Awaiting Decision",
  ],
  DECISION: [
    "Offer Issued – Conditional",
    "Offer Issued – Unconditional",
    "Offer Issued – With Interview",
    "Interview Prep Scheduled",
    "Interview Scheduled",
    "Interview Completed",
    "Waitlisted",
    "Deferred to Next Intake",
    "Application Rejected",
    "Application Withdrawn",
    "On Hold – Student Side",
    "On Hold – University Side",
    "On Hold – Unireach Side",
    "Pending – Student Side",
    "Pending – University Side",
    "Pending – Unireach Side",
  ],
  ACCEPTANCE: [
    "Offer Sent to Student",
    "Offer Accepted by Student",
    "Offer Declined by Student",
    "Bank Loan Guidance Provided",
    "Financial Documents Verified",
    "Deposit Invoice Sent",
    "Deposit Paid",
    "Deposit Pending",
    "Confirmation of Enrollment (CoE) Issued",
    "Enrollment Confirmed",
  ],
  VISA: [
    "Visa Documents in Preparation",
    "Visa Submitted",
    "Visa Under Processing",
    "Visa Approved",
    "Visa Refused",
    "Visa Appeal in Progress",
    "Pre-Departure Briefing Scheduled",
    "Pre-Departure Completed",
    "Accommodation Arranged",
    "Flight Booked",
  ],
  POST_ENROLLMENT: [
    "Student Enrolled",
    "Orientation Completed",
    "Arrived in Destination",
    "No Show",
    "Deferred After Visa",
    "Dropped Before Start",
    "Active Student",
    "Completed First Semester",
    "Graduated",
  ],
  INTERNAL: [
    "Escalated to University",
    "Awaiting Partner Feedback",
    "Ready for Compliance Audit",
    "Commission Pending",
    "Commission Received",
    "Case Closed",
  ],
};

export const ALL_LEAD_STATUSES = Object.values(LEAD_STATUSES).flat();

export const DEFAULT_LEAD_STATUS = "New Inquiry";

// --- APPLICATION ENGINE CONSTANTS (AEC) ---

export const APPLICATION_PRIORITIES = {
  URGENT: {
    label: "Urgent",
    code: "URGENT",
    color: "text-rose-500",
    icon: "pi pi-fire",
  },
  HIGH: {
    label: "High",
    code: "HIGH",
    color: "text-orange-500",
    icon: "pi pi-bolt",
  },
  MEDIUM: {
    label: "Medium",
    code: "MEDIUM",
    color: "text-blue-500",
    icon: "pi pi-gauge",
  },
  LOW: {
    label: "Low",
    code: "LOW",
    color: "text-slate-500",
    icon: "pi pi-snowflake",
  },
};

/**
 * STATUS_VISIBILITY_MAP
 * Maps granular Internal Statuses to simplified External (Applicant/Agent) Statuses.
 * Ensures institutional privacy while maintaining applicant transparency.
 */
export const STATUS_VISIBILITY_MAP: Record<string, string> = {
  // PRE_APPLICATION -> Pending
  "New Inquiry": "Pending",
  "Interested – Not Ready": "Pending",
  "Eligible to Apply": "Ready to Apply",
  "Awaiting Documents": "Action Required",
  "Documents Partially Received": "Action Required",
  "Documents Complete – Ready to Apply": "Ready to Apply",

  // SUBMISSION -> Under Review
  "Application Submitted to University": "Application Submitted",
  "Application Submitted – Awaiting Acknowledgment": "Processing",
  "Acknowledged by University": "Processing",
  "Application Paid – University Fees": "Processing",
  "Application Under Initial Review": "Under Review",
  "Application Under Academic Review": "Under Review",
  "Application Under Department Review": "Under Review",
  "Additional Documents Requested": "Action Required",
  "Documents Resubmitted": "Under Review",

  // INTERNAL -> Under Review (Masked)
  "Awaiting Partner Feedback": "Under Review",
  "Ready for Compliance Audit": "Finalizing",
};

export const NOTE_VISIBILITY = {
  PUBLIC: "PUBLIC", // Everyone (Applicant, Agent, Staff)
  PARTNER: "PARTNER", // Agent & Staff only
  INTERNAL: "INTERNAL", // Staff only
};

// --- FINANCIAL MODULE CONSTANTS (FMC) ---

export const EARNING_STATUSES = {
  PENDING_INVOICE: "PENDING_INVOICE",
  INVOICED: "INVOICED",
  PARTIALLY_RECEIVED: "PARTIALLY_RECEIVED",
  RECEIVED: "RECEIVED",
  OVERDUE: "OVERDUE",
  DISPUTED: "DISPUTED",
  WRITTEN_OFF: "WRITTEN_OFF",
  CANCELLED: "CANCELLED",
};

export const INVOICE_STATUSES = {
  DRAFT: "DRAFT",
  SENT: "SENT",
  VIEWED: "VIEWED",
  PARTIALLY_PAID: "PARTIALLY_PAID",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
  DISPUTED: "DISPUTED",
  VOIDED: "VOIDED",
  WRITTEN_OFF: "WRITTEN_OFF",
};

export const PAYOUT_STATUSES = {
  PENDING_APPROVAL: "PENDING_APPROVAL",
  APPROVED: "APPROVED",
  PROCESSING: "PROCESSING",
  PAID: "PAID",
  FAILED: "FAILED",
  ON_HOLD: "ON_HOLD",
  CANCELLED: "CANCELLED",
};

export const FEE_TYPES = {
  ONBOARDING_FEE: "ONBOARDING_FEE",
  APPLICATION_FEE: "APPLICATION_FEE",
  SERVICE_FEE: "SERVICE_FEE",
  VISA_FEE: "VISA_FEE",
  DOCUMENT_FEE: "DOCUMENT_FEE",
  TUITION_DEPOSIT: "TUITION_DEPOSIT",
  COURIER_FEE: "COURIER_FEE",
  ASSESSMENT_FEE: "ASSESSMENT_FEE",
  OTHER: "OTHER",
};

export const PAYMENT_METHODS = {
  BANK_TRANSFER: "BANK_TRANSFER",
  WIRE_TRANSFER: "WIRE_TRANSFER",
  CHEQUE: "CHEQUE",
  CASH: "CASH",
  ONLINE_PAYMENT: "ONLINE_PAYMENT",
  CRYPTO: "CRYPTO",
  OTHER: "OTHER",
};
