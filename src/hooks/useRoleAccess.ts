import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types/auth";

export function useRoleAccess() {
  const { user } = useAuth();

  const hasRole = (roles: Role[]) => {
    return !!user?.role && roles.includes(user.role);
  };

  const canAccessDashboard = hasRole([
    "USER",
    "MANAGER",
    "MANAGER_IT",
    "VP",
    "DEV",
  ]);
  const canAccessRequests = hasRole(["USER"]);

  return {
    hasRole,
    canAccessDashboard,
    canAccessRequests,
  };
}
