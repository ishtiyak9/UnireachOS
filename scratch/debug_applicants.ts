import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  // Mock event for testing
  const users = await prisma.user.findMany({
    where: {
      role: { category: "APPLICANT" }
    },
    include: {
      role: true,
      applicantProfile: true
    }
  });
  console.log("Found Applicants:", users.length);
  users.forEach(u => {
    console.log(`- ${u.email} (Profile exists: ${!!u.applicantProfile})`);
  });
});
