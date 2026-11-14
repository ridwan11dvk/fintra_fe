import { describe, expect, it } from "vitest";
import {
  ANNOUNCEMENT_BASE,
  ANNOUNCEMENT_LIST_PAGE_TITLE,
  ANNOUNCEMENT_URL,
  NOTIFICATION_BASE,
  NOTIFICATION_CREATE_PERMISSION,
  NOTIFICATION_DELETE_PERMISSION,
  NOTIFICATION_LIST_PAGE_TITLE,
  NOTIFICATION_LIST_PERMISSION,
  NOTIFICATION_PERMISSION,
  NOTIFICATION_READ_PERMISSION,
  NOTIFICATION_UPDATE_PERMISSION,
  NOTIFICATION_URL,
  announcementUrl,
  notificationUrl,
} from "@/features/notification/data/notification.utils";

describe("notification.utils", () => {
  describe("URL constants", () => {
    it("has correct NOTIFICATION_LIST_PAGE_TITLE", () => {
      expect(NOTIFICATION_LIST_PAGE_TITLE).toBe("Notification");
    });

    it("has correct NOTIFICATION_BASE", () => {
      expect(NOTIFICATION_BASE).toBe("notification");
    });

    it("has correct NOTIFICATION_URL", () => {
      expect(NOTIFICATION_URL).toBe("/notification");
    });

    it("has correct ANNOUNCEMENT_LIST_PAGE_TITLE", () => {
      expect(ANNOUNCEMENT_LIST_PAGE_TITLE).toBe("Announcement");
    });

    it("has correct ANNOUNCEMENT_BASE", () => {
      expect(ANNOUNCEMENT_BASE).toBe("announcement");
    });

    it("has correct ANNOUNCEMENT_URL", () => {
      expect(ANNOUNCEMENT_URL).toBe("/announcement");
    });

    it("notificationUrl returns NOTIFICATION_URL", () => {
      expect(notificationUrl()).toBe(NOTIFICATION_URL);
    });

    it("announcementUrl returns ANNOUNCEMENT_URL", () => {
      expect(announcementUrl()).toBe(ANNOUNCEMENT_URL);
    });
  });

  describe("permission constants", () => {
    it("has correct NOTIFICATION_PERMISSION prefix", () => {
      expect(NOTIFICATION_PERMISSION).toBe("app:notification:");
    });

    it("all action permissions start with NOTIFICATION_PERMISSION prefix", () => {
      const permissions = [
        NOTIFICATION_LIST_PERMISSION,
        NOTIFICATION_READ_PERMISSION,
        NOTIFICATION_CREATE_PERMISSION,
        NOTIFICATION_UPDATE_PERMISSION,
        NOTIFICATION_DELETE_PERMISSION,
      ];
      permissions.forEach((p) => {
        expect(p).toMatch(/^app:notification:/);
      });
    });

    it("has correct NOTIFICATION_LIST_PERMISSION", () => {
      expect(NOTIFICATION_LIST_PERMISSION).toBe("app:notification:view");
    });

    it("has correct NOTIFICATION_READ_PERMISSION", () => {
      expect(NOTIFICATION_READ_PERMISSION).toBe("app:notification:view");
    });

    it("has correct NOTIFICATION_CREATE_PERMISSION", () => {
      expect(NOTIFICATION_CREATE_PERMISSION).toBe("app:notification:manage");
    });

    it("has correct NOTIFICATION_UPDATE_PERMISSION", () => {
      expect(NOTIFICATION_UPDATE_PERMISSION).toBe("app:notification:manage");
    });

    it("has correct NOTIFICATION_DELETE_PERMISSION", () => {
      expect(NOTIFICATION_DELETE_PERMISSION).toBe("app:notification:delete");
    });

    it("all action permissions are distinct by value", () => {
      const permissions = [
        NOTIFICATION_LIST_PERMISSION,
        NOTIFICATION_READ_PERMISSION,
        NOTIFICATION_CREATE_PERMISSION,
        NOTIFICATION_UPDATE_PERMISSION,
        NOTIFICATION_DELETE_PERMISSION,
      ];
      const unique = new Set(permissions);
      expect(unique.size).toBe(3);
    });
  });
});
