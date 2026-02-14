import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Academic Taxonomy...");

  const areas = [
    {
      name: "Engineering & Technology",
      disciplines: [
        "Computer Science",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Civil Engineering",
        "Chemical Engineering",
        "Software Engineering",
        "Cyber Security",
        "Data Science",
      ],
    },
    {
      name: "Business & Management",
      disciplines: [
        "Business Administration",
        "Finance",
        "International Business",
        "Marketing",
        "Accounting",
        "Digital Marketing",
        "HR Management",
        "Supply Chain Management",
      ],
    },
    {
      name: "Health & Medicine",
      disciplines: [
        "Nursing",
        "Public Health",
        "Pharmacy",
        "Biomedical Science",
        "Medicine",
        "Dentistry",
        "Physiotherapy",
      ],
    },
    {
      name: "Social Sciences & Humanities",
      disciplines: [
        "Psychology",
        "Sociology",
        "International Relations",
        "Political Science",
        "History",
        "Media & Communication",
      ],
    },
    {
      name: "Natural Sciences",
      disciplines: [
        "Physics",
        "Chemistry",
        "Biology",
        "Environmental Science",
        "Mathematics",
        "Astronomy",
      ],
    },
    {
      name: "Arts & Design",
      disciplines: [
        "Graphic Design",
        "Architecture",
        "Fashion Design",
        "Fine Arts",
        "Interior Design",
        "Animation",
      ],
    },
  ];

  for (const area of areas) {
    const createdArea = await prisma.studyArea.upsert({
      where: { name: area.name },
      update: {},
      create: { name: area.name },
    });

    for (const disp of area.disciplines) {
      await prisma.discipline.upsert({
        where: { name: disp },
        update: { studyAreaId: createdArea.id },
        create: {
          name: disp,
          studyAreaId: createdArea.id,
        },
      });
    }
  }

  console.log("Intelligence Seeding Complete.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
