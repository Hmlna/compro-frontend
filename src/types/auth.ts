export type Role = "USER" | "MANAGER" | "VP" | "MANAGER_IT" | "DEV";
export const ROLE_OPTIONS: Role[] = [
  "USER",
  "MANAGER",
  "VP",
  "MANAGER_IT",
  "DEV",
];

export type AuthUser = {
  id: string; // UUID from API
  email: string;
  role: Role;
  division?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  logout: () => void;
  isLoading: boolean;
};
