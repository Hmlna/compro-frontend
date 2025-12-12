import type { RequestFormSchema } from "@/schema/requestFormSchema";
import { axiosInstance } from "@/api/axios";

type CreateRequestResponse = RequestFormSchema;
export const createRequest = async (request: CreateRequestResponse) => {
  const response = await axiosInstance.post("/requests", request);
  return response.data;
};
