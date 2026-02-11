export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({ statusCode: 403, message: "Access Denied." });
  }

  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "ID Required" });

  await prisma.systemAccessControl.delete({
    where: { id },
  });

  return { success: true };
});
