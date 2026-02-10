import { H3Event } from "h3";
import { PermissionCode } from "../../app/utils/permissions";

/**
 * AUTHORITY GUARD
 * The industrial-grade enforcement layer for UniReach Intelligence.
 * Verifies if the authenticated entity possesses specific capability tokens.
 */
export const ensurePermission = async (
  event: H3Event,
  permission: PermissionCode
) => {
  const session = await getUserSession(event);

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: "Neural Identity Missing: Authentication required.",
    });
  }

  // 1. Check for Supreme Administrator (God Mode Override)
  if (session.user.roleCode === "super_admin") {
    return true;
  }

  // 2. Perform Granular Intelligence Check
  const hasPermission = session.user.permissions.includes(permission);

  if (!hasPermission) {
    throw createError({
      statusCode: 403,
      message: `Neural Access Denied: Missing clearance for [${permission}].`,
    });
  }

  return true;
};

/**
 * COMPOSITE GUARD
 * Checks for multiple permissions (Logical AND)
 */
export const ensureAllPermissions = async (
  event: H3Event,
  permissions: PermissionCode[]
) => {
  for (const perm of permissions) {
    await ensurePermission(event, perm);
  }
  return true;
};
