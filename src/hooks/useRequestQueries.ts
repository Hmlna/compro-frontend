import { useQuery } from "@tanstack/react-query";
import { getRequestById } from "@/api/requests/getRequests";
import { getRequestProgress } from "@/api/requests/progressRequest";
import type { RequestDetail } from "@/types/request";

export const useRequestDetail = (id: string | undefined) => {
  return useQuery<RequestDetail>({
    queryKey: ["request-detail", id],
    queryFn: () => getRequestById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

export const useRequestProgress = (id: string | undefined) => {
  return useQuery({
    queryKey: ["request-progress", id],
    queryFn: () => getRequestProgress(id!),
    enabled: !!id,
    staleTime: 0,
  });
};
