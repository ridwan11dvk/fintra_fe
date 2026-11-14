import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import type {
  CreateBulkNotificationRequest,
  CreateNotificationRequest,
} from "@/features/notification/data/notification.types";
import { notificationService } from "@/features/notification/data/notification.service";

const BASE = "http://localhost:3000";

describe("notificationService", () => {
  describe("listNotifications", () => {
    it("fetches paginated notifications", async () => {
      const result = await notificationService.listNotifications({
        page: 0,
        size: 10,
      });
      expect(result.status).toBe("SUCCESS");
      expect(result.data?.content).toBeInstanceOf(Array);
    });

    it("passes params to the API", async () => {
      const result = await notificationService.listNotifications({
        page: 0,
        size: 10,
        sort: "createdAt,desc",
      });
      expect(result.data?.pagination?.pageSize).toBe(10);
    });
  });

  describe("getNotificationById", () => {
    it("fetches a single notification by ID", async () => {
      const result = await notificationService.getNotificationById(1);
      expect(result.status).toBe("SUCCESS");
      expect(result.data?.id).toBe(1);
    });

    it("passes userType as query param when provided", async () => {
      const result = await notificationService.getNotificationById(1, "INTERNAL");
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("getUnreadCount", () => {
    it("fetches unread count", async () => {
      const result = await notificationService.getUnreadCount();
      expect(result.status).toBe("SUCCESS");
      expect(typeof result.data).toBe("number");
    });
  });

  describe("createNotification", () => {
    it("creates a notification and returns it", async () => {
      const payload: CreateNotificationRequest = {
        categoryId: 1,
        title: "Test",
        message: "Message",
        channel: "IN_APP",
      };
      const result = await notificationService.createNotification(payload);
      expect(result.status).toBe("SUCCESS");
      expect(result.data?.title).toBe("Test Notification");
    });
  });

  describe("createBulkNotifications", () => {
    it("creates bulk notifications", async () => {
      const payload: CreateBulkNotificationRequest = {
        categoryId: 1,
        title: "Bulk Test",
        message: "Bulk Message",
        channels: ["IN_APP", "EMAIL"],
      };
      const result = await notificationService.createBulkNotifications(payload);
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("markAsRead", () => {
    it("marks a notification as read", async () => {
      const result = await notificationService.markAsRead(1);
      expect(result.status).toBe("SUCCESS");
    });

    it("passes userType when provided", async () => {
      const result = await notificationService.markAsRead(1, "INTERNAL");
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("markAllAsRead", () => {
    it("marks all notifications as read", async () => {
      const result = await notificationService.markAllAsRead();
      expect(result.status).toBe("SUCCESS");
    });

    it("passes userType when provided", async () => {
      const result = await notificationService.markAllAsRead("EXTERNAL");
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("deleteNotification", () => {
    it("deletes a notification by ID", async () => {
      const result = await notificationService.deleteNotification(1);
      expect(result.status).toBe("SUCCESS");
    });

    it("passes userType when provided", async () => {
      const result = await notificationService.deleteNotification(1, "INTERNAL");
      expect(result.status).toBe("SUCCESS");
    });
  });

  describe("getCategories", () => {
    it("fetches notification categories", async () => {
      const result = await notificationService.getCategories();
      expect(result.status).toBe("SUCCESS");
      expect(result.data).toBeInstanceOf(Array);
    });
  });

  describe("error handling", () => {
    it("throws on server error when listing notifications", async () => {
      server.use(
        http.get(`${BASE}/notification`, () =>
          HttpResponse.json({ message: "Server error" }, { status: 500 }),
        ),
      );
      await expect(notificationService.listNotifications()).rejects.toThrow();
    });

    it("throws on server error when getting notification by ID", async () => {
      server.use(
        http.get(`${BASE}/notification/:id`, () =>
          HttpResponse.json({ message: "Not found" }, { status: 404 }),
        ),
      );
      await expect(notificationService.getNotificationById(999)).rejects.toThrow();
    });
  });
});
