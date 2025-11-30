/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "@/api/axios";
import type { AuthUser } from "@/auth/types";

export type LoginResponse = {
  access_token: string;
  user: AuthUser;
  sessionId?: string; // mock server returns string ids in mock-db.json
};

export const getUser = async () => {
  const response = await axiosInstance.get<AuthUser[]>("/users");
  return response.data;
};

export const getUserById = async (id: number) => {
  const response = await axiosInstance.get<AuthUser[]>(`/users/${id}`);
  return response.data;
};

export const getUserByToken = async (token: string): Promise<AuthUser> => {
  // 1. Find the session by access_token
  const response = await axiosInstance.get<any[]>(`/login`, {
    params: { access_token: token },
  });

  if (!response.data || response.data.length === 0) {
    throw new Error("Invalid access token");
  }

  const session = response.data[0];

  // 2. Fetch the user details using the userId from the session
  // json-server returns a single object for ID lookup
  const userResponse = await axiosInstance.get<AuthUser>(
    `/users/${session.userId}`
  );
  return userResponse.data;
};

// Helper function to validate credentials with password
const validateUserCredentials = async (email: string, password: string) => {
  const response = await axiosInstance.get<AuthUser[]>("/users", {
    params: { email, password },
  });
  return response.data;
};

export const mockLogin = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  // validate user by querying users collection
  const users = await validateUserCredentials(email, password);

  if (!Array.isArray(users) || users.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = users[0];

  // generate a mock token (or read from /login if you prefer)
  const token = `mock-jwt-${Math.random().toString(36).slice(2, 10)}`;

  // create a session record on the server to emulate login (json-server will return the created object with id)
  const sessionPayload = {
    access_token: token,
    userId: user.id,
    createdAt: new Date().toISOString(),
  };

  const createSessionRes = await axiosInstance.post("/login", sessionPayload);
  const sessionId = createSessionRes?.data?.id;

  return {
    access_token: token,
    user,
    sessionId: sessionId ? String(sessionId) : undefined,
  };
};

export const apiLogout = async (sessionId?: string | number) => {
  if (!sessionId) {
    localStorage.removeItem("token");
    localStorage.removeItem("loginId");
    return;
  }
  try {
    await axiosInstance.delete(`/login/${sessionId}`);
  } catch (err) {
    // ignore network/server errors for best-effort cleanup
    console.warn("apiLogout failed:", err);
    throw err;
    // } finally {
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("loginId");
    //   console.log("apiLogout: cleared local storage and session login");
  }
};

export const getManagerByUnit = async (unit: string) => {
  const response = await axiosInstance.get<AuthUser[]>("/users", {
    params: { unit },
  });

  // Find the user with a manager role in this unit
  // This matches 'manager_unit', 'manager_it', etc.
  const manager = response.data.find((u) => u.role.includes("manager"));

  return manager || null;
};
