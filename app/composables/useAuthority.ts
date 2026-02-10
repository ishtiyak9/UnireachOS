import { Permissions, PermissionCode } from "./permissions";

/**
 * USE AUTHORITY
 * The frontend intelligence layer for capability-based UI rendering.
 */
export const useAuthority = () => {
  const { user } = useUserSession();

  /**
   * can() - The primary authority check function
   */
  const can = (permission: PermissionCode): boolean => {
    if (!user.value) return false;

    // Supreme Administrator ignores all granular restrictions
    if (user.value.roleCode === "super_admin") return true;

    return user.value.permissions?.includes(permission) || false;
  };

  /**
   * canAny() - Returns true if the user has at least one of the permissions
   */
  const canAny = (permissions: PermissionCode[]): boolean => {
    return permissions.some((p) => can(p));
  };

  return {
    can,
    canAny,
    Permissions, // Exporting so UI can use Permissions.USER_CREATE
  };
};
