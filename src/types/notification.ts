export interface NotificationItem {
  id: number;
  userId: string;
  title: string;
  message: string;
  type: string;
  relatedId: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: NotificationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface NotificationParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unreadCount: number;
  };
}
