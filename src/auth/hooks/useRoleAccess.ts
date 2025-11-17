import { useAuth } from "./useAuth";

export function useRoleAccess() {
  const { user } = useAuth();

  const hasRole = (roles: string[]) => {
    return user?.role && roles.includes(user.role);
  };

  const canAccessDashboard = hasRole(["manager", "vp"]);
  const canAccessRequests = hasRole(["user"]);
  const canAccessManager = hasRole(["manager", "vp"]);
  const canAccessVP = hasRole(["vp"]);

  return {
    hasRole,
    canAccessDashboard,
    canAccessRequests,
    canAccessManager,
    canAccessVP,
  };
}
