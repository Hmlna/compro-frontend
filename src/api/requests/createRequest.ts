import { axiosInstance } from "@/api/axios";
import type { CreateRequestPayload } from "@/types/request";

export const createRequest = async (request: CreateRequestPayload) => {
  const response = await axiosInstance.post("/tickets", request);
  return response.data;
};
