import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { notificationQueryKeys } from "./notification.query";
import { notificationService } from "./notification.service";
import type {
  CreateBulkNotificationRequest,
  CreateNotificationRequest,
  NotificationResponse,
} from "./notification.types";

/**
 * Hook to create a new notification
 */
export const useCreateNotificationMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<NotificationResponse>,
      Error,
      CreateNotificationRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => notificationService.createNotification(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [notificationQueryKeys.all]);

  return mutation;
};

/**
 * Hook to create bulk notifications
 */
export const useCreateBulkNotificationsMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<null>, Error, CreateBulkNotificationRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => notificationService.createBulkNotifications(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [notificationQueryKeys.all]);

  return mutation;
};

/**
 * Hook to mark a notification as read
 */
export const useMarkAsReadMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<void>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    notificationQueryKeys.lists(),
    notificationQueryKeys.unreadCount(),
  ]);

  return mutation;
};

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllAsReadMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<void>, Error, void>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    notificationQueryKeys.lists(),
    notificationQueryKeys.unreadCount(),
  ]);

  return mutation;
};

/**
 * Hook to delete a notification
 */
export const useDeleteNotificationMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<void>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => notificationService.deleteNotification(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    notificationQueryKeys.lists(),
    notificationQueryKeys.unreadCount(),
  ]);

  return mutation;
};
