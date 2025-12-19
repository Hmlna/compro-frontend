import { axiosInstance } from "@/api/axios";

export const deleteDocument = async (requestId: string, documentId: string) => {
  const { data } = await axiosInstance.delete(
    `/tickets/${requestId}/documents/${documentId}`
  );
  return data;
};
