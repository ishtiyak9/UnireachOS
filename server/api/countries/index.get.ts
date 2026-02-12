import { prisma } from "../../utils/db";

export default defineEventHandler(async () => {
  const countries = await prisma.country.findMany({
    where: {
      isActive: true,
    },
    select: {
      name: true,
      code: true,
      flag: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return {
    data: countries,
  };
});
