import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Initializing Global Catalog Seeding...");

  // 1. Ensure Study Areas & Disciplines
  const techArea = await prisma.studyArea.upsert({
    where: { name: "Engineering & Technology" },
    update: {},
    create: { name: "Engineering & Technology" },
  });

  const csDiscipline = await prisma.discipline.upsert({
    where: { name: "Computer Science" },
    update: { studyAreaId: techArea.id },
    create: { name: "Computer Science", studyAreaId: techArea.id },
  });

  const businessArea = await prisma.studyArea.upsert({
    where: { name: "Business & Management" },
    update: {},
    create: { name: "Business & Management" },
  });

  const mbaDiscipline = await prisma.discipline.upsert({
    where: { name: "Business Administration" },
    update: { studyAreaId: businessArea.id },
    create: { name: "Business Administration", studyAreaId: businessArea.id },
  });

  // 2. Fetch Program Levels
  const ugLevel = await prisma.programLevel.findFirst({
    where: { code: "UG" },
  });
  const pgLevel = await prisma.programLevel.findFirst({
    where: { code: "PG" },
  });

  if (!ugLevel || !pgLevel) {
    throw new Error("Program Levels (UG/PG) not found. Run main seed first.");
  }

  // 3. Seed Premium Universities
  console.log("🏛️ Provisioning Elite Universities...");

  const unis = [
    {
      name: "University of Oxford",
      country: "United Kingdom",
      code: "UNI_OXF",
      isPremiumPartner: true,
      strategicRank: 1,
      commissionSpeed: 5,
      offerTATIndex: 5,
      visaSuccessRate: 98.5,
      strategicTags: ["Elite Tier", "Russel Group", "Global Top 10"],
    },
    {
      name: "University of Melbourne",
      country: "Australia",
      code: "UNI_MELB",
      isPremiumPartner: true,
      strategicRank: 2,
      commissionSpeed: 4,
      offerTATIndex: 4,
      visaSuccessRate: 96,
      strategicTags: ["Go8", "Top Tier Australia", "Research Leader"],
    },
    {
      name: "IU International University of Applied Sciences",
      country: "Germany",
      code: "IU_INT_UNI",
      isPremiumPartner: true,
      strategicRank: 5,
      commissionSpeed: 5,
      offerTATIndex: 5,
      visaSuccessRate: 92,
      strategicTags: ["Fast Admissions", "Affordable", "Work-Friendly"],
    },
  ];

  const createdUnis = [];
  for (const uniData of unis) {
    const uni = await prisma.university.upsert({
      where: { name: uniData.name },
      update: uniData,
      create: uniData,
    });
    createdUnis.push(uni);
  }

  // 4. Seed Strategic Courses
  console.log("📚 Deploying Intelligence-Driven Courses...");

  const courses = [
    {
      name: "M.Sc. in Advanced Computer Science",
      universityId: createdUnis[0].id,
      levelId: pgLevel.id,
      duration: "1 Year",
      tuitionFee: 35000,
      currency: "GBP",
      courseUrl:
        "https://www.ox.ac.uk/admissions/graduate/courses/msc-advanced-computer-science",
      isStem: true,
      isFastTrack: true,
      highJobDemand: true,
      studyAreaId: techArea.id,
      disciplineId: csDiscipline.id,
      strategicFlags: ["Ivy Equivalent", "AI Specialization"],
      intakeMonths: ["October"],
      isActive: true,
    },
    {
      name: "Master of Business Administration (MBA)",
      universityId: createdUnis[1].id,
      levelId: pgLevel.id,
      duration: "1.5 Years",
      tuitionFee: 45000,
      currency: "AUD",
      courseUrl: "https://mbs.edu/degree-programs/full-time-mba",
      hasCoop: true,
      isMajorCity: true,
      strategicFlags: ["Premium Career Support", "Industry Integrated"],
      studyAreaId: businessArea.id,
      disciplineId: mbaDiscipline.id,
      intakeMonths: ["February", "July"],
      isActive: true,
    },
    {
      name: "B.Sc. in Computer Science",
      universityId: createdUnis[2].id,
      levelId: ugLevel.id,
      duration: "3 Years",
      tuitionFee: 0,
      currency: "EUR",
      courseUrl: "https://www.iu.org/bachelor/computer-science/",
      isAffordable: true,
      hasScholarship: true,
      hasEnglishWaiver: true,
      hasAppFeeWaiver: true,
      studyAreaId: techArea.id,
      disciplineId: csDiscipline.id,
      strategicFlags: ["Zero Tuition", "Pathway Available"],
      intakeMonths: ["October", "April"],
      isActive: true,
    },
  ];

  for (const courseData of courses) {
    try {
      await prisma.course.upsert({
        where: {
          id: `seed-${courseData.name.replace(/ /g, "-").toLowerCase()}`,
        },
        update: courseData,
        create: {
          id: `seed-${courseData.name.replace(/ /g, "-").toLowerCase()}`,
          ...courseData,
        },
      });
    } catch (err) {
      console.error(`Failed to create course ${courseData.name}:`, err);
    }
  }

  console.log("✅ Catalog Seeding Synchronized Successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Failure:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
