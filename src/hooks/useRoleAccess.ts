import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types/auth";

export function useRoleAccess() {
  const { user } = useAuth();

  const hasRole = (roles: Role[]) => {
    return !!user?.role && roles.includes(user.role);
  };

  const canAccessDashboard = hasRole(["MANAGER", "MANAGER_IT", "VP"]);
  const canAccessRequests = hasRole(["USER"]);
  const canAccessManager = hasRole(["MANAGER"]);
  const canAccessVP = hasRole(["VP"]);
  const canAccessMapping = hasRole(["MANAGER_IT"]);
  const canAccessDev = hasRole(["DEV"]);

  return {
    hasRole,
    canAccessDashboard,
    canAccessRequests,
    canAccessManager,
    canAccessVP,
    canAccessMapping,
    canAccessDev,
  };
}
