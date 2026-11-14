import type {
  NotificationCategoryResponse,
  NotificationResponse,
} from "@/features/notification/data/notification.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";

export const mockNotification: NotificationResponse = {
  id: 1,
  categoryId: 1,
  categoryName: "System Alert",
  title: "Test Notification",
  message: "This is a test notification message",
  status: "SENT",
  channel: "IN_APP",
  userId: 1,
  userType: "INTERNAL",
  recipientEmail: null,
  recipientPhone: null,
  scheduledAt: null,
  sentAt: "2024-01-01T12:00:00Z",
  metadata: {
    url: "https://example.com",
    links: [{ key: "docs", value: "https://example.com/docs" }],
    actions: [
      {
        key: "view",
        label: "View Details",
        icon: "eye",
        url: "https://example.com",
      },
    ],
    variables: { key1: "value1", count: 42, active: true },
  },
  retryCount: 0,
  maxRetries: 3,
  nextRetryAt: null,
  errorMessage: null,
  isRead: false,
  readAt: null,
  createdAt: "2024-01-01T12:00:00Z",
  updatedAt: "2024-01-01T12:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export const mockReadNotification: NotificationResponse = {
  ...mockNotification,
  id: 2,
  isRead: true,
  readAt: "2024-01-02T12:00:00Z",
  channel: "EMAIL",
  recipientEmail: "user@example.com",
  status: "PENDING",
};

export const mockCategory: NotificationCategoryResponse = {
  id: 1,
  name: "System Alert",
  description: "System alert notifications",
  isActive: true,
};

export const pagedNotificationResponse: PagedApiResponse<NotificationResponse> =
  {
    status: "SUCCESS",
    message: "Data fetched successfully",
    data: {
      content: [mockNotification, mockReadNotification],
      pagination: {
        total: 2,
        pageSize: 10,
        pageNumber: 0,
        totalPages: 1,
        currentPage: 0,
        from: 1,
        to: 2,
      },
    },
  };

export const singleNotificationResponse: ApiResponse<NotificationResponse> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: mockNotification,
};

export const unreadCountResponse: ApiResponse<number> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: 5,
};

export const categoriesResponse: ApiResponse<NotificationCategoryResponse[]> = {
  status: "SUCCESS",
  message: "Data fetched successfully",
  data: [mockCategory],
};

export const successResponse: ApiResponse<null> = {
  status: "SUCCESS",
  message: "Operation completed successfully",
  data: null,
};

export const notificationHandlers = [
  http.get(`${BASE}/notification`, () =>
    HttpResponse.json(pagedNotificationResponse),
  ),

  http.get(`${BASE}/notification/:id`, ({ params: _params }) =>
    HttpResponse.json(singleNotificationResponse),
  ),

  http.get(`${BASE}/notification/unread/count`, () =>
    HttpResponse.json(unreadCountResponse),
  ),

  http.post(`${BASE}/notification`, () =>
    HttpResponse.json(singleNotificationResponse, { status: 201 }),
  ),

  http.post(`${BASE}/notification/bulk`, () =>
    HttpResponse.json(successResponse, { status: 201 }),
  ),

  http.post(`${BASE}/notification/:id/read`, () =>
    HttpResponse.json(successResponse),
  ),

  http.post(`${BASE}/notification/read-all`, () =>
    HttpResponse.json(successResponse),
  ),

  http.delete(`${BASE}/notification/:id`, () =>
    HttpResponse.json(successResponse),
  ),

  http.get(`${BASE}/notification-categories`, () =>
    HttpResponse.json(categoriesResponse),
  ),
];
