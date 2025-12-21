import { useState, useRef, useEffect } from "react";
import { Bell, Loader2, CheckCheck } from "lucide-react";
import io, { Socket } from "socket.io-client";
import { useNotifications } from "@/hooks/useNotifications";
import type { NotificationItem } from "@/types/notification";
import { useNavigate } from "react-router";

interface NotificationBellProps {
  userId: string;
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    markRead,
    markAllRead,
    isMarkingAll,
    handleNewNotification,
  } = useNotifications(userId);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const socket: Socket = io("http://localhost:3000");

    socket.emit("join", userId);

    socket.on("notification", (data: NotificationItem) => {
      console.log("New Notification:", data);
      handleNewNotification(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, handleNewNotification]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      markRead(notification.id);
    }
    navigate(`/requests/${notification.relatedId}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-sm text-gray-700">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                disabled={isMarkingAll}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium disabled:opacity-50"
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 flex justify-center">
                <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleNotificationClick(note)}
                  className={`p-3 border-b border-gray-100 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                    !note.isRead ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-gray-800">
                      {note.title || "System"}
                    </p>
                    {!note.isRead && (
                      <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    )}
                  </div>
                  <p className="text-gray-600 mt-1 line-clamp-2">
                    {note.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}

            {hasNextPage && (
              <div className="p-2 text-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="text-xs text-blue-600 hover:underline py-2 w-full flex justify-center items-center gap-2"
                >
                  {isFetchingNextPage ? (
                    <Loader2 className="animate-spin h-3 w-3" />
                  ) : (
                    "Load older"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
