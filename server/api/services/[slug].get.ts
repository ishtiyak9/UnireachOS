import { prisma } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({ statusCode: 400, message: "Missing service slug" });
  }

  // Find the service by slug
  const service = await prisma.alliedService.findUnique({
    where: { slug },
  });

  if (!service) {
    throw createError({ statusCode: 404, message: "Service not found" });
  }

  if (!service.isActive) {
    throw createError({ statusCode: 403, message: "Service is inactive" });
  }

  return service;
});
