export type Role =
  | "user"
  | "manager_unit"
  | "vp_it"
  | "manager_it"
  | "developer";

export type AuthUser = {
  id: number;
  email: string;
  role: Role;
  unit: string;
  name: string;
};

export type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  logout: () => void;
  isLoading: boolean;
};
