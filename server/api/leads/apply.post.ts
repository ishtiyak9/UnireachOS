import { z } from "zod";
import { prisma } from "../../utils/db";
import { leadRouter } from "../../utils/leads";

const leadSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  whatsapp: z.string().min(1),
  destination: z.string().min(1),
  studyLevel: z.string().min(1),
  fieldOfStudy: z.string().optional(),
  academicResults: z.string().min(1),
  passingYear: z.string().min(1),
  englishProficiency: z.string().min(1),
  message: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validated = leadSchema.parse(body);

    // [CEREBRO LOGIC] Check for existing Lead with same email
    const existing = await prisma.lead.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      // Logic: If lead exists and is in a terminal state (LOST/SPAM), maybe allow re-inquiry?
      // For now, let's just update the message/interest or throw error
      throw createError({
        statusCode: 409,
        message:
          "An application with this email already exists inside our systems. Our team is already reviewing your profile.",
      });
    }

    // Split Full Name (Light Handshake)
    const nameParts = validated.fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    // --- CREATE LEAD ---
    const lead = await prisma.lead.create({
      data: {
        firstName,
        lastName,
        email: validated.email,
        phone: validated.whatsapp,
        preferredCountry: validated.destination,
        studyLevel: validated.studyLevel,
        fieldOfStudy: validated.fieldOfStudy,
        academicResults: validated.academicResults,
        passingYear: validated.passingYear,
        englishProficiency: validated.englishProficiency,
        message: validated.message,
        status: "New Inquiry",
        source: "LANDING_PAGE_EDU",
      },
    });

    // --- LOG INITIAL EVENT (Intelligence Layer) ---
    await prisma.leadEvent.create({
      data: {
        leadId: lead.id,
        type: "CREATE",
        metadata: {
          // The provided code edit was syntactically incorrect and introduced an undefined variable.
          // Assuming the intent was to add assignedCounselorId if available,
          // but without 'memberToAssign' defined, it's omitted.
          // The 'note' and 'platform' were also malformed in the edit, so they are corrected here.
          note: "Initial inquiry submitted via Education Landing Page.",
          platform: "Web",
        },
      },
    });

    // --- AUTONOMOUS ROUTING (Background Task) ---
    // We offload the routing logic to a background task so the student
    // gets their success message instantly.
    event.waitUntil(leadRouter.autoAssign(lead.id));

    return {
      success: true,
      message:
        "Application received successfully. An education specialist will contact you on WhatsApp.",
    };
  } catch (error: any) {
    if (error.issues) {
      throw createError({
        statusCode: 400,
        message: "Please check your data and try again.",
        data: error.issues,
      });
    }
    throw error;
  }
});
