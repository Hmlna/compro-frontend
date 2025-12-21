import { axiosInstance } from "@/api/axios";
import type {
  NotificationResponse,
  UnreadCountResponse,
} from "@/types/notification";

export const getNotifications = async ({
  pageParam = 1,
}: {
  pageParam?: number;
}) => {
  const response = await axiosInstance.get<NotificationResponse>(
    "/notifications",
    {
      params: {
        page: pageParam,
        limit: 10,
      },
    }
  );
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await axiosInstance.get<UnreadCountResponse>(
    "/notifications/unread-count"
  );
  return response.data;
};

export const markNotificationRead = async (id: number) => {
  const response = await axiosInstance.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await axiosInstance.put("/notifications/read-all");
  return response.data;
};
