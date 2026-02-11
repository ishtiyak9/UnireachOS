import { z } from "zod";

const accessSchema = z.object({
  type: z.enum(["ALLOW", "BLOCK"]),
  ipAddress: z.string().min(3),
  reason: z.string().optional(),
  expiresAt: z.string().optional(), // ISO Date string
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({ statusCode: 403, message: "Access Denied." });
  }

  const body = await readBody(event);
  const data = await accessSchema.parseAsync(body);

  const rule = await prisma.systemAccessControl.create({
    data: {
      type: data.type,
      ipAddress: data.ipAddress,
      reason: data.reason,
      addedBy: session.user.id,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  });

  return rule;
});
