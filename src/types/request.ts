import type { RequestFormSchema } from "@/schema/requestFormSchema";

export type RequestStatus =
  | "pending_manager" // 1. Initial state: Waiting for Unit Manager
  | "revision_needed" // 1b. Manager sent back to User
  | "pending_vp" // 2. Manager approved: Waiting for VP IT
  | "rejected" // X. Rejected by Manager or VP
  | "approved" // 3. VP Approved: Ready for IT Manager to assign
  | "in_progress" // 4. Developer working
  | "completed"; // 5. Done

// The full object stored in JSON Server
export type RequestRecord = RequestFormSchema & {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: RequestStatus;
  createdByEmail: string;
  createdById: string;
  unit: string;

  // Approval tracking (optional but recommended)
  managerComment?: string;
  vpComment?: string;
  assignedDeveloperId?: number;
};
