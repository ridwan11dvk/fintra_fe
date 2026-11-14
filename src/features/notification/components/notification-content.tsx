import {
  notificationQueryKeys,
  useListNotifications,
  useMarkAsReadMutation,
} from "@/features/notification";
import type { PaginationParams } from "@railfinance/core/types";
import { ScrollArea } from "@railfinance/core/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router";

export type NotificationContentProps = {
  asChildren?: boolean;
  handleViewAll?: () => void;
};
export function NotificationContent({
  asChildren = false,
  handleViewAll,
}: Readonly<NotificationContentProps>) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch unread notifications only
  const notificationParams: PaginationParams = {
    page: 0,
    size: asChildren ? 5 : 10, // Show more in standalone view
    sort: "createdAt,desc",
    isRead: "false", // Only unread
  };

  const { data, isLoading } = useListNotifications(notificationParams, {
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const markAsReadMutation = useMarkAsReadMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.all,
      });
    },
  });

  const notifications = data?.data?.content || [];

  const handleNotificationClick = (id: number, url: string) => {
    // Optionally mark as read when viewing
    markAsReadMutation.mutate(id);
    if (url) {
      navigate(url);
    } else {
      handleViewAll?.();
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notifications.length > 0) {
    return (
      <div className="space-y-1">
        <ScrollArea>
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() =>
                handleNotificationClick(
                  notification.id,
                  notification?.metadata?.url || "",
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleNotificationClick(
                    notification.id,
                    notification?.metadata?.url || "",
                  );
                }
              }}
              className="w-full text-left flex items-start gap-3 px-3 py-2 cursor-pointer hover:bg-slate-100 transition-colors"
              type="button"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">
                    {notification.title}
                  </p>
                  {/* <Badge variant="outline" className="text-xs shrink-0">
                    {notification.channel}
                  </Badge> */}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
              {!notification.isRead && (
                <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-2" />
              )}
            </button>
          ))}
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="px-3 py-6 text-center text-sm text-muted-foreground">
      No notifications
    </div>
  );
}
