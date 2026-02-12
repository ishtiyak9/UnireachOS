import { z } from "zod";
import { prisma } from "../../../utils/db";

const countrySchema = z.object({
  name: z.string().min(1),
  code: z.string().min(2).max(5),
  flag: z.string().optional(),
  isActive: z.boolean().default(true),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const body = await readBody(event);
  const validated = countrySchema.parse(body);

  const country = await prisma.country.create({
    data: validated,
  });

  return {
    success: true,
    data: country,
  };
});
