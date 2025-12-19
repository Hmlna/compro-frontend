import { axiosInstance } from "@/api/axios";

export const submitRequest = async (id: string) => {
  const response = await axiosInstance.post(`/tickets/${id}/submit`);
  return response.data;
};
