import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";
import type {
  CreateBulkNotificationRequest,
  CreateNotificationRequest,
  NotificationCategoryResponse,
  NotificationResponse,
} from "./notification.types";

const NOTIFICATION_BASE_URL = "/notification";
const CATEGORIES_BASE_URL = "/notification-categories";

export const notificationService = {
  /**
   * Get paginated notifications for the authenticated user
   */
  listNotifications: async (
    params?: PaginationParams,
  ): Promise<PagedApiResponse<NotificationResponse>> => {
    const response = await axiosInstance.get<
      PagedApiResponse<NotificationResponse>
    >(NOTIFICATION_BASE_URL, {
      params,
    });
    return response.data;
  },

  /**
   * Get notification by ID
   */
  getNotificationById: async (
    id: number,
    userType?: string,
  ): Promise<ApiResponse<NotificationResponse>> => {
    const response = await axiosInstance.get<ApiResponse<NotificationResponse>>(
      `${NOTIFICATION_BASE_URL}/${id}`,
      {
        params: userType ? { userType } : undefined,
      },
    );
    return response.data;
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.get<ApiResponse<number>>(
      `${NOTIFICATION_BASE_URL}/unread/count`,
    );
    return response.data;
  },

  /**
   * Create a single notification
   */
  createNotification: async (
    data: CreateNotificationRequest,
  ): Promise<ApiResponse<NotificationResponse>> => {
    const response = await axiosInstance.post<
      ApiResponse<NotificationResponse>
    >(NOTIFICATION_BASE_URL, data);
    return response.data;
  },

  /**
   * Create bulk notifications
   */
  createBulkNotifications: async (
    data: CreateBulkNotificationRequest,
  ): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.post<ApiResponse<null>>(
      `${NOTIFICATION_BASE_URL}/bulk`,
      data,
    );
    return response.data;
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (
    id: number,
    userType?: string,
  ): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post<ApiResponse<void>>(
      `${NOTIFICATION_BASE_URL}/${id}/read`,
      {},
      {
        params: userType ? { userType } : undefined,
      },
    );
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (userType?: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post<ApiResponse<void>>(
      `${NOTIFICATION_BASE_URL}/read-all`,
      {},
      {
        params: userType ? { userType } : undefined,
      },
    );
    return response.data;
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (
    id: number,
    userType?: string,
  ): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      `${NOTIFICATION_BASE_URL}/${id}`,
      {
        params: userType ? { userType } : undefined,
      },
    );
    return response.data;
  },

  /**
   * Get all notification categories
   */
  getCategories: async (): Promise<
    ApiResponse<NotificationCategoryResponse[]>
  > => {
    const response =
      await axiosInstance.get<ApiResponse<NotificationCategoryResponse[]>>(
        CATEGORIES_BASE_URL,
      );
    return response.data;
  },
};
