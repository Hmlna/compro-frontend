import { axiosInstance } from "@/api/axios";

export const processApproval = async (
  id: string,
  role: "manager" | "vp",
  action: "approve" | "reject" | "revision",
  notes?: string
) => {
  const url = `/approval/${id}/${role}/${action}`;

  const payload = notes ? { notes } : {};

  const response = await axiosInstance.post(url, payload);
  return response.data;
};

interface AssignDevPayload {
  developerIds: string[];
  notes: string;
}

export const assignDevelopers = async (
  requestId: string,
  payload: AssignDevPayload
) => {
  const response = await axiosInstance.post(
    `/approval/${requestId}/assign`,
    payload
  );
  return response.data;
};

export const markAsComplete = async (requestId: string) => {
  const response = await axiosInstance.post(`/approval/${requestId}/complete`);
  return response.data;
};
