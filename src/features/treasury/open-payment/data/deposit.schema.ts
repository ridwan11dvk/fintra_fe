import { z } from "zod";

/**
 * Deposit Edit Schema - For editing deposit fields
 * Based on PRD section 5.3
 */
export const depositEditSchema = z.object({
  agentCode: z
    .string()
    .max(20, "Max 20 characters")
    .optional()
    .or(z.literal("")),
  virtualAccount: z
    .string()
    .max(18, "Max 18 characters")
    .optional()
    .or(z.literal("")),
  name: z.string().max(255, "Max 255 characters").optional().or(z.literal("")),
  referenceNumber: z
    .string()
    .max(255, "Max 255 characters")
    .optional()
    .or(z.literal("")),
  depositDate: z.string().optional().or(z.literal("")),
  openingBalance: z.string().optional().or(z.literal("")),
  amount: z.string().optional().or(z.literal("")),
  closingBalance: z.string().optional().or(z.literal("")),
  bankCode: z
    .string()
    .max(20, "Max 20 characters")
    .optional()
    .or(z.literal("")),
  documentPath: z.string().optional().or(z.literal("")),
  documentFile: z.instanceof(File).optional(),
});

export type DepositEditFormData = z.output<typeof depositEditSchema>;

/**
 * Send Status Update Schema
 */
export const sendStatusUpdateSchema = z.object({
  sendStatus: z.enum(["0", "1"]),
});

export type SendStatusUpdateFormData = z.output<typeof sendStatusUpdateSchema>;
