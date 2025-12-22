import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  userLogin,
  userLogout,
  getUserByToken,
  type LoginResponse,
  type RegisterResponse,
  type RegisterPayload,
  userRegister,
} from "@/api/users";
import type { AuthUser } from "@/types/auth";

type LoginArgs = { email: string; password: string };

export function useAuth() {
  const qc = useQueryClient();
  const token = localStorage.getItem("token");

  const currentUserQuery = useQuery<AuthUser | null>({
    queryKey: ["currentUser", token],
    queryFn: async () => {
      const tk = localStorage.getItem("token");
      if (!tk) return null;

      try {
        return await getUserByToken();
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("authLogin");
        return null;
      }
    },
    initialData: () => {
      const saved = localStorage.getItem("authLogin");
      return saved ? (JSON.parse(saved) as AuthUser) : undefined;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const registerMutation = useMutation<
    RegisterResponse,
    Error,
    RegisterPayload
  >({
    mutationFn: userRegister,
  });

  const loginMutation = useMutation<LoginResponse, Error, LoginArgs>({
    mutationFn: userLogin,
    onSuccess: (res) => {
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("authLogin", JSON.stringify(res.user));

      qc.setQueryData(["currentUser", res.access_token], res.user);
      qc.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const logoutMutation = useMutation<void, Error>({
    mutationFn: userLogout,
    onSuccess: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("authLogin");
      localStorage.clear();
      qc.clear();

      qc.setQueryData(["currentUser"], null);
      qc.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  return {
    user: currentUserQuery.data,
    isLoading:
      currentUserQuery.isLoading ||
      loginMutation.isPending ||
      logoutMutation.isPending ||
      registerMutation.isPending,

    login: (email: string, password: string) =>
      loginMutation.mutateAsync({ email, password }),

    register: (data: RegisterPayload) => registerMutation.mutateAsync(data),

    logout: () => logoutMutation.mutateAsync(),
  };
}
