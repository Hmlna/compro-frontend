import { axiosInstance } from "@/api/axios";

export interface ProgressStep {
  step: number;
  name: string;
  status: "completed" | "current" | "pending" | "rejected";
  timestamp: string | null;
}

export interface ProgressResponse {
  crId: string;
  currentStatus: string;
  steps: ProgressStep[];
}

export const getRequestProgress = async (
  id: string
): Promise<ProgressResponse> => {
  const response = await axiosInstance.get(`/tickets/${id}/progress`);
  return response.data.data;
};
