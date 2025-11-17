export type Role = "user" | "manager" | "vp";

export interface AuthUser {
  email: string;
  role: Role;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (userData: AuthUser) => void;
  logout: () => void;
}
