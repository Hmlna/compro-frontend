import { axiosInstance } from "../axios";

export const getRequestsbyCreatedById = async (userId?: number | string) => {
  // If userId is provided, filter by it.
  // We cast to String() to ensure it matches the string IDs in mock-db.json
  const params = userId ? { createdById: String(userId) } : {};

  const response = await axiosInstance.get("/requests", { params });
  return response.data;
};
