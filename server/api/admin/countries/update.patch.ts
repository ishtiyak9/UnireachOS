import { z } from "zod";
import { prisma } from "../../../utils/db";

const countryUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  code: z.string().min(2).max(5).optional(),
  flag: z.string().optional(),
  isActive: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const body = await readBody(event);
  const validated = countryUpdateSchema.parse(body);

  const { id, ...data } = validated;

  const country = await prisma.country.update({
    where: { id },
    data,
  });

  return {
    success: true,
    data: country,
  };
});
