import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  mockLogin,
  apiLogout,
  getUserByToken,
  type LoginResponse,
} from "@/api/auth";
import type { AuthUser } from "@/types/auth";

type LoginArgs = { email: string; password: string };

export function useAuth() {
  const qc = useQueryClient();
  const token = localStorage.getItem("token");

  // currentUser fetched via token validation
  const currentUserQuery = useQuery<AuthUser | null>({
    queryKey: ["currentUser", token],
    queryFn: async () => {
      const currentToken = localStorage.getItem("token");
      if (!currentToken) return null;

      try {
        // Verify token with server and get fresh user data
        // console.log("User fetched by token:", currentToken);
        return await getUserByToken(currentToken);
      } catch (error) {
        // If token is invalid (e.g. server restarted/wiped), clear local storage
        console.warn("Session invalid, logging out...", error);
        localStorage.removeItem("authLogin");
        localStorage.removeItem("token");
        localStorage.removeItem("loginId");
        return null;
      }
    },
    // Optional: Use localStorage as initial placeholder to prevent flicker
    initialData: () => {
      const saved = localStorage.getItem("authLogin");
      return saved ? (JSON.parse(saved) as AuthUser) : undefined;
    },
    retry: false,
    staleTime: 0,
  });

  const loginMutation = useMutation<LoginResponse, Error, LoginArgs>({
    mutationFn: ({ email, password }) => mockLogin(email, password),
    onSuccess: (res) => {
      const userData: AuthUser = res.user;
      localStorage.setItem("authLogin", JSON.stringify(userData));
      localStorage.setItem("token", res.access_token);
      if (res.sessionId) localStorage.setItem("loginId", String(res.sessionId));

      // Update query cache immediately
      qc.setQueryData(["currentUser", res.access_token], userData);
      qc.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: () => {
      const loginId = localStorage.getItem("loginId");
      return apiLogout(loginId || undefined);
    },
    onSettled: () => {
      localStorage.removeItem("authLogin");
      localStorage.removeItem("token");
      localStorage.removeItem("loginId");
      qc.setQueryData(["currentUser", null], null);
      qc.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  return {
    user: currentUserQuery.data,
    isLoading:
      currentUserQuery.isLoading ||
      loginMutation.isPending ||
      logoutMutation.isPending,
    error:
      currentUserQuery.error ?? loginMutation.error ?? logoutMutation.error,
    login: (email: string, password: string) =>
      loginMutation.mutateAsync({ email, password }),
    logout: () => logoutMutation.mutateAsync(),
    _internal: { currentUserQuery, loginMutation, logoutMutation },
  };
}
