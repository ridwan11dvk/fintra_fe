/**
 * Access Request Feature - Zod Validation Schemas
 */

import { z } from "zod";

// Change Access Request Status
export const changeAccessRequestStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  roles: z.array(z.number().int().positive()).default([]),
  responseNotes: z
    .string()
    .max(1000, "Response notes must be less than 1000 characters")
    .optional(),
});

export type ChangeAccessRequestStatusInput = z.infer<
  typeof changeAccessRequestStatusSchema
>;

// List Query Parameters
export const accessRequestListParamsSchema = z.object({
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

export type AccessRequestListParamsInput = z.infer<
  typeof accessRequestListParamsSchema
>;

// Rejection Modal Form
export const rejectAccessRequestSchema = z.object({
  rejectionReason: z
    .string()
    .min(1, "Rejection reason is required")
    .max(500, "Rejection reason must be less than 500 characters"),
});

export type RejectAccessRequestInput = z.infer<
  typeof rejectAccessRequestSchema
>;

// Approval Form (with role selection)
export const approveAccessRequestSchema = z.object({
  roles: z.array(z.int()).min(1, "At least one role is required"),
  responseNotes: z
    .string()
    .max(500, "Response notes must be less than 500 characters"),
});

export type ApproveAccessRequestInput = z.infer<
  typeof approveAccessRequestSchema
>;
