import { axiosInstance } from "@/api/axios";
import type {
  GetRequestsParams,
  GetRequestsResponse,
  RequestDetail,
} from "@/types/request";

export const getRequest = async (
  params: GetRequestsParams
): Promise<GetRequestsResponse> => {
  const response = await axiosInstance.get("/tickets", {
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      status: params.status || undefined,
      sortBy: params.sortBy || "createdAt",
      sortOrder: params.sortOrder || "desc",
      search: params.search || undefined,
    },
  });
  return response.data;
};

export const getRequestById = async (id: string): Promise<RequestDetail> => {
  const res = await axiosInstance.get(`/tickets/${id}`);
  return res.data.data;
};
