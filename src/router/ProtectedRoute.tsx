import { Navigate } from "react-router";
import type { ReactNode } from "react";
import type { Role } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  roles: Role[];
  children: ReactNode;
}

export default function ProtectedRoute({
  roles,
  children,
}: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (!roles.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}
