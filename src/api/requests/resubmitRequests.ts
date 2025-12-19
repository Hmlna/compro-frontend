import { axiosInstance } from "@/api/axios";

export const resubmitRequest = async (id: string) => {
  const response = await axiosInstance.post(`/tickets/${id}/resubmit`);
  return response.data;
};
