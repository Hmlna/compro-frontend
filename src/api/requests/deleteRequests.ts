import { axiosInstance } from "@/api/axios";

export const deleteRequest = async (id: string) => {
  const response = await axiosInstance.delete(`/tickets/${id}`);
  return response.data;
};
