import { useAuth } from "./useAuth";
import type { Role } from "../types";

export function useRoleAccess() {
  const { user } = useAuth();

  const hasRole = (roles: Role[]) => {
    return !!user?.role && roles.includes(user.role);
  };

  const canAccessDashboard = hasRole(["manager_unit", "manager_it", "vp_it"]);
  const canAccessRequests = hasRole(["user"]);
  const canAccessManager = hasRole(["manager_unit", "manager_it"]);
  const canAccessVP = hasRole(["vp_it"]);

  return {
    hasRole,
    canAccessDashboard,
    canAccessRequests,
    canAccessManager,
    canAccessVP,
  };
}
