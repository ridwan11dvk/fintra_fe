import { describe, expect, it } from "vitest";
import {
  createBulkNotificationSchema,
  createNotificationSchema,
  filterNotificationsSchema,
} from "@/features/notification/data/notification.schema";

describe("createNotificationSchema", () => {
  const validData = {
    categoryId: 1,
    title: "Test Notification",
    message: "This is a test message",
    channel: "IN_APP" as const,
    maxRetries: 3,
  };

  describe("valid data", () => {
    it("accepts a minimal valid object", () => {
      const result = createNotificationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("accepts a fully populated valid object", () => {
      const result = createNotificationSchema.safeParse({
        ...validData,
        userId: 1,
        userType: "INTERNAL",
        recipientEmail: "test@example.com",
        recipientPhone: "+62812345678",
        scheduledAt: "2024-12-01T10:00",
        metadata: {
          links: [{ key: "docs", value: "https://example.com" }],
          actions: [{ key: "view", label: "View", icon: "eye" }],
          variables: { key1: "value1" },
        },
        maxRetries: 5,
      });
      expect(result.success).toBe(true);
    });

    it("accepts optional fields as undefined", () => {
      const result = createNotificationSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.userId).toBeUndefined();
        expect(result.data.scheduledAt).toBeUndefined();
      }
    });
  });

  describe("categoryId validation", () => {
    it("rejects zero categoryId", () => {
      const result = createNotificationSchema.safeParse({ ...validData, categoryId: 0 });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "categoryId");
        expect(err?.message).toBe("Category is required");
      }
    });
  });

  describe("title validation", () => {
    it("rejects empty title", () => {
      const result = createNotificationSchema.safeParse({ ...validData, title: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "title");
        expect(err).toBeDefined();
        expect(err?.message).toBe("Title is required");
      }
    });

    it("rejects title exceeding max length", () => {
      const result = createNotificationSchema.safeParse({
        ...validData,
        title: "x".repeat(256),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "title");
        expect(err).toBeDefined();
      }
    });

    it("accepts title at exactly max length", () => {
      const result = createNotificationSchema.safeParse({
        ...validData,
        title: "x".repeat(255),
      });
      expect(result.success).toBe(true);
    });
  });

  describe("message validation", () => {
    it("rejects empty message", () => {
      const result = createNotificationSchema.safeParse({ ...validData, message: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "message");
        expect(err?.message).toBe("Message is required");
      }
    });
  });

  describe("channel validation", () => {
    it("rejects invalid channel", () => {
      const result = createNotificationSchema.safeParse({
        ...validData,
        channel: "INVALID",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("channel conditional validation", () => {
    it("rejects EMAIL channel without recipientEmail", () => {
      const result = createNotificationSchema.safeParse({
        ...validData,
        channel: "EMAIL",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "recipientEmail");
        expect(err?.message).toBe("Recipient email is required for EMAIL channel");
      }
    });

    it("accepts EMAIL channel with recipientEmail", () => {
      const result = createNotificationSchema.safeParse({
        ...validData,
        channel: "EMAIL",
        recipientEmail: "user@example.com",
      });
      expect(result.success).toBe(true);
    });

    it("rejects SMS channel without recipientPhone", () => {
      const result = createNotificationSchema.safeParse({
        ...validData,
        channel: "SMS",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "recipientPhone");
        expect(err?.message).toBe("Recipient phone is required for SMS/WHATSAPP channels");
      }
    });

    it("rejects WHATSAPP channel without recipientPhone", () => {
      const result = createNotificationSchema.safeParse({
        ...validData,
        channel: "WHATSAPP",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "recipientPhone");
        expect(err?.message).toBe("Recipient phone is required for SMS/WHATSAPP channels");
      }
    });

    it("accepts SMS channel with recipientPhone", () => {
      const result = createNotificationSchema.safeParse({
        ...validData,
        channel: "SMS",
        recipientPhone: "+62812345678",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("userType conditional validation", () => {
    it("rejects userId without userType", () => {
      const result = createNotificationSchema.safeParse({
        ...validData,
        userId: 1,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "userType");
        expect(err?.message).toBe("User type is required when target user is specified");
      }
    });

    it("accepts userId with userType", () => {
      const result = createNotificationSchema.safeParse({
        ...validData,
        userId: 1,
        userType: "INTERNAL",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("maxRetries validation", () => {
    it("rejects negative maxRetries", () => {
      const result = createNotificationSchema.safeParse({
        ...validData,
        maxRetries: -1,
      });
      expect(result.success).toBe(false);
    });

    it("rejects maxRetries > 10", () => {
      const result = createNotificationSchema.safeParse({
        ...validData,
        maxRetries: 11,
      });
      expect(result.success).toBe(false);
    });

    it("accepts maxRetries at boundary 0", () => {
      const result = createNotificationSchema.safeParse({
        ...validData,
        maxRetries: 0,
      });
      expect(result.success).toBe(true);
    });

    it("accepts maxRetries at boundary 10", () => {
      const result = createNotificationSchema.safeParse({
        ...validData,
        maxRetries: 10,
      });
      expect(result.success).toBe(true);
    });
  });
});

describe("createBulkNotificationSchema", () => {
  const validData = {
    categoryId: 1,
    title: "Bulk Notification",
    message: "Bulk message",
    channels: ["IN_APP", "EMAIL"] as const,
    sendImmediately: true,
  };

  describe("valid data", () => {
    it("accepts a minimal valid object", () => {
      const result = createBulkNotificationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("accepts fully populated valid object", () => {
      const result = createBulkNotificationSchema.safeParse({
        ...validData,
        userIds: [1, 2, 3],
        userType: "INTERNAL",
        metadata: { links: [{ key: "docs", value: "https://example.com" }] },
      });
      expect(result.success).toBe(true);
    });
  });

  describe("channels validation", () => {
    it("rejects empty channels array", () => {
      const result = createBulkNotificationSchema.safeParse({
        ...validData,
        channels: [],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "channels");
        expect(err?.message).toBe("At least one channel is required");
      }
    });
  });

  describe("userIds conditional validation", () => {
    it("rejects userIds with users but no userType", () => {
      const result = createBulkNotificationSchema.safeParse({
        ...validData,
        userIds: [1],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "userType");
        expect(err).toBeDefined();
        expect(err?.message).toBe("User type is required when target users are specified");
      }
    });

    it("accepts userIds with userType", () => {
      const result = createBulkNotificationSchema.safeParse({
        ...validData,
        userIds: [1],
        userType: "EXTERNAL",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("title validation", () => {
    it("rejects empty title", () => {
      const result = createBulkNotificationSchema.safeParse({
        ...validData,
        title: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects title exceeding max length", () => {
      const result = createBulkNotificationSchema.safeParse({
        ...validData,
        title: "x".repeat(256),
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("filterNotificationsSchema", () => {
  it("accepts an empty object", () => {
    const result = filterNotificationsSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts valid filter values", () => {
    const result = filterNotificationsSchema.safeParse({
      channel: "EMAIL",
      isRead: "true",
      categoryId: 1,
      dateFrom: new Date("2024-01-01"),
      dateTo: new Date("2024-12-31"),
      page: 0,
      size: 10,
      sort: "createdAt,desc",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid channel value", () => {
    const result = filterNotificationsSchema.safeParse({
      channel: "INVALID",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid isRead value", () => {
    const result = filterNotificationsSchema.safeParse({
      isRead: "maybe",
    });
    expect(result.success).toBe(false);
  });

  it("accepts nullable categoryId", () => {
    const result = filterNotificationsSchema.safeParse({
      categoryId: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative page", () => {
    const result = filterNotificationsSchema.safeParse({
      page: -1,
    });
    expect(result.success).toBe(false);
  });
});
