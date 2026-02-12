import { z } from "zod";
import { prisma } from "../../../utils/db";

const teamUpdateSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  vertical: z
    .enum([
      "EDUCATION",
      "MIGRATION",
      "SALES",
      "NETWORKING",
      "FINANCE",
      "ADMINISTRATION",
      "LEGAL",
    ])
    .optional(),
  targetLocale: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const body = await readBody(event);
  const validated = teamUpdateSchema.parse(body);

  const { id, targetLocale, ...rest } = validated;

  const team = await prisma.team.update({
    where: { id },
    data: {
      ...rest,
      targetLocale: targetLocale?.join(", "),
    },
  });

  return {
    success: true,
    data: team,
  };
});
