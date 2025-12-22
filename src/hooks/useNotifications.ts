import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/api/notifications";
import type {
  NotificationItem,
  NotificationResponse,
  UnreadCountResponse,
} from "@/types/notification";

export const useNotifications = (userId: string) => {
  const queryClient = useQueryClient();

  const KEYS = {
    list: ["notifications", "list", userId],
    unread: ["notifications", "unread", userId],
  };

  const unreadQuery = useQuery({
    queryKey: KEYS.unread,
    queryFn: getUnreadCount,
    refetchInterval: 60000,
  });

  const listQuery = useInfiniteQuery({
    queryKey: KEYS.list,
    queryFn: getNotifications,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    initialPageParam: 1,
  });

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: KEYS.list });
      await queryClient.cancelQueries({ queryKey: KEYS.unread });

      const previousList = queryClient.getQueryData(KEYS.list);
      const previousUnread = queryClient.getQueryData(KEYS.unread);

      queryClient.setQueryData<InfiniteData<NotificationResponse>>(
        KEYS.list,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((item) =>
                item.id === notificationId ? { ...item, isRead: true } : item
              ),
            })),
          };
        }
      );

      queryClient.setQueryData<UnreadCountResponse>(KEYS.unread, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: { unreadCount: Math.max(0, old.data.unreadCount - 1) },
        };
      });

      return { previousList, previousUnread };
    },
    onError: (_err, _newTodo, context) => {
      if (context?.previousList)
        queryClient.setQueryData(KEYS.list, context.previousList);
      if (context?.previousUnread)
        queryClient.setQueryData(KEYS.unread, context.previousUnread);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.unread });
    },
  });

  const markAllRead = useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: KEYS.list });
      await queryClient.cancelQueries({ queryKey: KEYS.unread });

      const previousList = queryClient.getQueryData(KEYS.list);
      const previousUnread = queryClient.getQueryData(KEYS.unread);

      queryClient.setQueryData<InfiniteData<NotificationResponse>>(
        KEYS.list,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((item) => ({ ...item, isRead: true })),
            })),
          };
        }
      );

      queryClient.setQueryData<UnreadCountResponse>(KEYS.unread, (old) =>
        old ? { ...old, data: { unreadCount: 0 } } : old
      );

      return { previousList, previousUnread };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousList)
        queryClient.setQueryData(KEYS.list, context.previousList);
      if (context?.previousUnread)
        queryClient.setQueryData(KEYS.unread, context.previousUnread);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.list });
      queryClient.invalidateQueries({ queryKey: KEYS.unread });
    },
  });

  const handleNewNotification = (newNotification: NotificationItem) => {
    queryClient.setQueryData<InfiniteData<NotificationResponse>>(
      KEYS.list,
      (old) => {
        if (!old) return old;
        const newPages = [...old.pages];
        if (newPages.length > 0) {
          newPages[0] = {
            ...newPages[0],
            data: [newNotification, ...newPages[0].data],
          };
        }
        return { ...old, pages: newPages };
      }
    );

    queryClient.setQueryData<UnreadCountResponse>(KEYS.unread, (old) =>
      old ? { ...old, data: { unreadCount: old.data.unreadCount + 1 } } : old
    );
  };

  return {
    notifications: listQuery.data?.pages.flatMap((page) => page.data) || [],
    unreadCount: unreadQuery.data?.data.unreadCount || 0,
    isLoading: listQuery.isLoading,
    isFetchingNextPage: listQuery.isFetchingNextPage,
    hasNextPage: listQuery.hasNextPage,

    fetchNextPage: listQuery.fetchNextPage,
    markRead: markRead.mutate,
    markAllRead: markAllRead.mutate,
    isMarkingAll: markAllRead.isPending,

    handleNewNotification,
  };
};
