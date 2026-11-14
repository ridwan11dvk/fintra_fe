import type { ImportResponse } from "@railfinance/core/types";

// Enums
export type NotificationChannel = "IN_APP" | "EMAIL" | "SMS" | "WHATSAPP";
export type NotificationStatus = "PENDING" | "SENT" | "FAILED" | "RETRYING";
export type NotificationUserType = "INTERNAL" | "EXTERNAL";

// Metadata
export interface NotificationLink {
  key: string;
  value: string;
}

export interface NotificationAction {
  key: string;
  label?: string;
  icon?:
    | "eye"
    | "leftarrow"
    | "rightarrow"
    | "delete"
    | "edit"
    | "send"
    | "sync";
  action?: string;
  url?: string;
}

export interface NotificationMetadata {
  url?: string;
  links?: NotificationLink[];
  actions?: NotificationAction[];
  variables?: Record<string, string | number | boolean>;
}

// API Responses
export interface NotificationResponse {
  id: number;
  categoryId: number;
  categoryName: string;
  title: string;
  message: string;
  status: NotificationStatus;
  channel: NotificationChannel;
  userId?: number | null;
  userType?: NotificationUserType | null;
  recipientEmail?: string | null;
  recipientPhone?: string | null;
  scheduledAt?: string | null;
  sentAt?: string | null;
  metadata?: NotificationMetadata | null;
  retryCount: number;
  maxRetries: number;
  nextRetryAt?: string | null;
  errorMessage?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string | null;
}

export interface NotificationCategoryResponse {
  id: number;
  name: string;
  description?: string | null;
  isActive: boolean;
}

// Requests
export interface CreateNotificationRequest {
  categoryId: number;
  title: string;
  message: string;
  channel: NotificationChannel;
  userId?: number | null;
  userType?: NotificationUserType | null;
  recipientEmail?: string | null;
  recipientPhone?: string | null;
  scheduledAt?: string | null;
  metadata?: NotificationMetadata;
  maxRetries?: number;
}

export interface CreateBulkNotificationRequest {
  categoryId: number;
  title: string;
  message: string;
  channels: NotificationChannel[];
  userIds?: number[] | null;
  userType?: NotificationUserType | null;
  metadata?: NotificationMetadata;
  sendImmediately?: boolean;
}

export interface MarkAsReadRequest {
  userType?: NotificationUserType;
}

// Note: Form data types (CreateNotificationFormData, CreateBulkNotificationFormData) are exported from notification.schema.ts

export type BulkImportResponse = ImportResponse;
