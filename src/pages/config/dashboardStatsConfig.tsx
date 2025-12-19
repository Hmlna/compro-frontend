import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  File as FileIcon,
  Network,
  LayoutDashboard,
  Code2,
  type LucideIcon,
} from "lucide-react";

export interface StatConfigItem {
  label: string;
  dataKey: string;
  icon: LucideIcon;
  color: string;
}

export const ROLE_STATS_CONFIG: Record<string, StatConfigItem[]> = {
  USER: [
    {
      label: "Drafts",
      dataKey: "draft",
      icon: FileText,
      color: "text-gray-600",
    },
    {
      label: "Pending",
      dataKey: "pending",
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      label: "Revisions",
      dataKey: "revision",
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      label: "Approved",
      dataKey: "approved",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      label: "Rejected",
      dataKey: "rejected",
      icon: XCircle,
      color: "text-red-600",
    },
  ],
  MANAGER: [
    {
      label: "Pending Approval",
      dataKey: "pendingApproval",
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      label: "Total Requests",
      dataKey: "totalDivision",
      icon: FileIcon,
      color: "text-gray-600",
    },
    {
      label: "Approved",
      dataKey: "approved",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      label: "Rejected",
      dataKey: "rejected",
      icon: XCircle,
      color: "text-red-600",
    },
  ],
  VP: [
    {
      label: "Pending Approval",
      dataKey: "pendingApproval",
      icon: Clock,
      color: "text-blue-600",
    },
    {
      label: "Assigned IT",
      dataKey: "assigned",
      icon: Network,
      color: "text-purple-600",
    },
    {
      label: "Completed",
      dataKey: "completed",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      label: "Total Requests",
      dataKey: "totalAll",
      icon: LayoutDashboard,
      color: "text-gray-600",
    },
  ],
  MANAGER_IT: [
    {
      label: "Need Mapping",
      dataKey: "needMapping",
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      label: "Total Assigned",
      dataKey: "totalAssigned",
      icon: Code2,
      color: "text-blue-600",
    },
  ],
  DEV: [
    {
      label: "Assigned To Me",
      dataKey: "assigned",
      icon: AlertCircle,
      color: "text-blue-600",
    },
    {
      label: "In Progress",
      dataKey: "inProgress",
      icon: Code2,
      color: "text-orange-600",
    },
    {
      label: "Completed",
      dataKey: "completed",
      icon: CheckCircle2,
      color: "text-green-600",
    },
  ],
};
