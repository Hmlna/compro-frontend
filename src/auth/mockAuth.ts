/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AuthUser, Role } from "./types";

export async function mockLogin(
  email: string,
  password: string
): Promise<AuthUser> {
  let role: Role = "user";

  if (email.includes("vp")) role = "vp";
  else if (email.includes("manager")) role = "manager";

  return {
    email,
    role,
  };
}
