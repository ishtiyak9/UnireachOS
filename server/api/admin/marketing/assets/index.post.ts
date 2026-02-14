import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  const body = await readBody(event);
  const { title, description, fileUrl, fileType, visibility, thumbnail } = body;

  try {
    const asset = await prisma.marketingAsset.create({
      data: {
        title,
        description,
        fileUrl,
        fileType,
        visibility,
        thumbnail,
      },
    });
    return asset;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to create tactical asset.",
    });
  }
});
