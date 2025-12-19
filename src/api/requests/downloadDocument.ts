import { axiosInstance } from "@/api/axios";
interface DownloadData {
  downloadUrl: string;
  fileName: string;
  expiresAt: string;
}

interface DownloadApiResponse {
  success: boolean;
  message: string;
  data: DownloadData;
}

export const downloadDocument = async (
  requestId: string,
  documentId: string
) => {
  const response = await axiosInstance.get<DownloadApiResponse>(
    `/tickets/${requestId}/documents/${documentId}/download`,
    {
      params: {
        redirect: false,
      },
    }
  );
  return response.data.data;
};
