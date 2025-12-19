import { axiosInstance } from "@/api/axios";
import type { CreateRequestPayload } from "@/types/request";

export const updateRequest = async (id: string, data: CreateRequestPayload) => {
  const response = await axiosInstance.put(`/tickets/${id}`, data);
  return response.data;
};
