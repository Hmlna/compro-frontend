import type { RequestStatus } from "@/types/request";

// Sub-types for List Items
export interface DashboardCRBasic {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
  status?: RequestStatus;
  requester?: string;
  division?: string;
  assignedBy?: string;
  assignedAt?: string;
  targetDate?: string;
  notes?: string;
  developer?: string;
  assignedCrs?: number;
}

// Sub-types for Stats
export interface DashboardStats {
  // User
  total?: number;
  draft?: number;
  pending?: number;
  revision?: number;
  approved?: number;
  rejected?: number;
  completed?: number;

  // Manager/VP
  pendingApproval?: number;
  totalDivision?: number;
  totalAll?: number;
  assigned?: number;

  // IT Manager
  needMapping?: number;
  totalAssigned?: number;

  // Dev
  inProgress?: number;
}

export interface DashboardUser {
  id: string;
  name: string;
  role: "USER" | "MANAGER" | "VP" | "MANAGER_IT" | "DEV";
  division: string;
}

// Main Response Data
export interface DashboardData {
  user: DashboardUser;
  stats: DashboardStats;
  recentCRs?: DashboardCRBasic[]; // USER
  pendingCRs?: DashboardCRBasic[]; // MANAGER, VP, IT
  assignedCRs?: DashboardCRBasic[]; // DEV
  developerWorkload?: DashboardCRBasic[]; // MANAGER_IT
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}
