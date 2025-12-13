import { axiosInstance } from "@/api/axios";
import type { AuthUser, Role } from "@/types/auth";

export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
  role: Role;
  division: string;
};

export type RegisterResponse = {
  success: boolean;
  user: AuthUser;
  message: string;
};

export async function userRegister(
  data: RegisterPayload
): Promise<RegisterResponse> {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
}
export type LoginApiResponse = {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      division: string;
      createdAt: string;
      updatedAt: string;
    };
    token: string;
  };
};

export type LoginResponse = {
  access_token: string;
  user: AuthUser;
};

type LoginParams = {
  email: string;
  password: string;
};

export const userLogin = async ({
  email,
  password,
}: LoginParams): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginApiResponse>("/auth/login", {
    email,
    password,
  });

  if (!response.data.success) {
    throw new Error(response.data.message || "Login failed");
  }

  const { user, token } = response.data.data;

  return {
    access_token: token,
    user: {
      ...user,
      role: user.role as AuthUser["role"],
    },
  };
};

export type GetMeApiResponse = {
  success: boolean;
  data: AuthUser;
};

export const getUserByToken = async (): Promise<AuthUser> => {
  const response = await axiosInstance.get<GetMeApiResponse>("/auth/me");

  if (!response.data.success) {
    throw new Error("Failed to fetch user");
  }

  return {
    ...response.data.data,
    role: response.data.data.role as AuthUser["role"],
  };
};

export type GetUsersParams = {
  role: Role;
  division: string;
};

export type GetUsersResponse = {
  success: boolean;
  data: AuthUser[];
  message?: string;
};

export const getUsersbyRole = async (
  params: GetUsersParams
): Promise<AuthUser[]> => {
  const response = await axiosInstance.get<GetUsersResponse>("/auth/users", {
    params,
  });

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch users");
  }

  return response.data.data;
};

export const userLogout = async (): Promise<void> => {
  return;
};
