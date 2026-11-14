import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast, useHandleQueryResponse } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { notificationService } from "./notification.service";
import type {
  NotificationCategoryResponse,
  NotificationResponse,
} from "./notification.types";

// Query Keys
export const notificationQueryKeys = {
  all: ["notifications"],
  lists: () => [...notificationQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...notificationQueryKeys.lists(),
    params,
  ],
  details: () => [...notificationQueryKeys.all, "detail"],
  detail: (id: number) => [...notificationQueryKeys.details(), id],
  unreadCount: () => [...notificationQueryKeys.all, "unread-count"],
  categories: () => [...notificationQueryKeys.all, "categories"],
};

/**
 * Hook to fetch paginated notifications for the authenticated user
 */
export const useListNotifications = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<NotificationResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: notificationQueryKeys.list(params),
    queryFn: () => notificationService.listNotifications(params),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load notifications",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific notification by ID
 */
export const useGetNotificationById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<NotificationResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: notificationQueryKeys.detail(id),
    queryFn: () => notificationService.getNotificationById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load notification",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch unread notification count
 */
export const useGetUnreadCount = (
  options?: Omit<
    UseQueryOptions<ApiResponse<number>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: () => notificationService.getUnreadCount(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });

  useHandleQueryResponse(query);

  return query;
};

/**
 * Hook to fetch all notification categories
 */
export const useGetCategories = (
  options?: Omit<
    UseQueryOptions<ApiResponse<NotificationCategoryResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: notificationQueryKeys.categories(),
    queryFn: () => notificationService.getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load categories",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
