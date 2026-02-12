import { z } from "zod";
import { prisma } from "../../../utils/db";

const teamSchema = z.object({
  name: z.string().min(1),
  vertical: z.enum([
    "EDUCATION",
    "MIGRATION",
    "SALES",
    "NETWORKING",
    "FINANCE",
    "ADMINISTRATION",
    "LEGAL",
  ]),
  targetLocale: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  // TODO: Check for Super Admin or specialized Admin role

  const body = await readBody(event);
  const validated = teamSchema.parse(body);

  const team = await prisma.team.create({
    data: {
      name: validated.name,
      vertical: validated.vertical,
      targetLocale: validated.targetLocale?.join(", "),
      description: validated.description,
    },
  });

  return {
    success: true,
    data: team,
  };
});
