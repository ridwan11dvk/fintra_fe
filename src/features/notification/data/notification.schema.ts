import { z } from "zod";

// Metadata schemas
const notificationLinkSchema = z.object({
  key: z.string().min(1, "Link key is required"),
  value: z.string().min(1, "Link value is required"),
});

const notificationActionIconEnum = z.enum([
  "eye",
  "leftarrow",
  "rightarrow",
  "delete",
  "edit",
  "send",
  "sync",
]);

const notificationActionSchema = z.object({
  key: z.string().min(1, "Action key is required"),
  label: z.string().optional(),
  icon: notificationActionIconEnum.optional(),
  action: z.string().optional(),
  url: z.string().optional(),
});

const notificationMetadataSchema = z.object({
  links: z.array(notificationLinkSchema).optional(),
  actions: z.array(notificationActionSchema).optional(),
  variables: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
});

// Channel validation
const channelEnum = z.enum(["IN_APP", "EMAIL", "SMS", "WHATSAPP"]);
const userTypeEnum = z.enum(["INTERNAL", "EXTERNAL"]);

// Create Notification Schema
export const createNotificationSchema = z
  .object({
    categoryId: z.number().int().positive("Category is required"),
    title: z
      .string()
      .min(1, "Title is required")
      .max(255, "Title must be 255 characters or less"),
    message: z.string().min(1, "Message is required"),
    channel: channelEnum,
    userId: z.number().int().optional(),
    userType: userTypeEnum.optional(),
    recipientEmail: z.email("Invalid email address").optional(),
    recipientPhone: z.string().optional(),
    scheduledAt: z.string().optional(), // Allow string for form datetime-local input
    metadata: notificationMetadataSchema.optional(),
    maxRetries: z.number().int().min(0).max(10).optional(),
  })
  .refine(
    (data) => {
      return !(data.channel === "EMAIL" && !data.recipientEmail);
    },
    {
      message: "Recipient email is required for EMAIL channel",
      path: ["recipientEmail"],
    },
  )
  .refine(
    (data) => {
      return !((data.channel === "SMS" || data.channel === "WHATSAPP") && !data.recipientPhone);
    },
    {
      message: "Recipient phone is required for SMS/WHATSAPP channels",
      path: ["recipientPhone"],
    },
  )
  .refine(
    (data) => {
      return !(data.userId && !data.userType);
    },
    {
      message: "User type is required when target user is specified",
      path: ["userType"],
    },
  );

export type CreateNotificationFormData = z.output<
  typeof createNotificationSchema
>;

// Create Bulk Notification Schema
export const createBulkNotificationSchema = z
  .object({
    categoryId: z.number().int().positive("Category is required"),
    title: z
      .string()
      .min(1, "Title is required")
      .max(255, "Title must be 255 characters or less"),
    message: z.string().min(1, "Message is required"),
    channels: z.array(channelEnum).min(1, "At least one channel is required"),
    userIds: z.array(z.number().int()).optional(),
    userType: userTypeEnum.optional(),
    metadata: notificationMetadataSchema.optional(),
    sendImmediately: z.boolean().optional(),
  })
  .refine(
    (data) => {
      return !(data.userIds && data.userIds.length > 0 && !data.userType);
    },
    {
      message: "User type is required when target users are specified",
      path: ["userType"],
    },
  );

export type CreateBulkNotificationFormData = z.output<
  typeof createBulkNotificationSchema
>;

// Filter schema
export const filterNotificationsSchema = z.object({
  channel: z.enum(["", "IN_APP", "EMAIL", "SMS", "WHATSAPP"]).optional(),
  isRead: z.enum(["", "true", "false"]).optional(),
  categoryId: z.number().int().optional().nullable(),
  dateFrom: z.date().optional().nullable(),
  dateTo: z.date().optional().nullable(),
  page: z.number().int().min(0).optional(),
  size: z.number().int().min(1).optional(),
  sort: z.string().optional(),
});

export type FilterNotificationsFormData = z.output<
  typeof filterNotificationsSchema
>;
