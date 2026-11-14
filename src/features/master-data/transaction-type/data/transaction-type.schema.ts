import { z } from "zod";

export const transactionTypeSchema = z.object({
  companyCode: z
    .string()
    .min(1, "Company code is required")
    .max(100, "Company code must not exceed 100 characters"),
  code: z
    .string()
    .min(1, "Transaction type code is required")
    .max(50, "Code must not exceed 50 characters"),
  tcode: z
    .string()
    .max(50, "SAP transaction code must not exceed 50 characters")
    .optional()
    .or(z.literal("")),
  name: z
    .string()
    .min(1, "Transaction type name is required")
    .max(255, "Name must not exceed 255 characters"),
  description: z
    .string()
    .max(65535, "Description must not exceed 65535 characters")
    .optional()
    .or(z.literal("")),
  moduleId: z.number().int().optional(),
  docType: z
    .string()
    .max(50, "Document type must not exceed 50 characters")
    .optional()
    .or(z.literal("")),
  docBase: z
    .string()
    .max(255, "Document base must not exceed 255 characters")
    .optional()
    .or(z.literal("")),
  formType: z
    .string()
    .max(255, "Form type must not exceed 255 characters")
    .optional()
    .or(z.literal("")),
  type: z.enum(["revenue", "prepaid", "freight"]).optional().or(z.literal("")),
  customerCode: z
    .string()
    .max(255, "Customer code must not exceed 255 characters")
    .optional()
    .or(z.literal("")),
  taxableItemCode: z
    .string()
    .max(255, "Taxable item code must not exceed 255 characters")
    .optional()
    .or(z.literal("")),
  invoiceCode: z
    .string()
    .max(255, "Invoice code must not exceed 255 characters")
    .optional()
    .or(z.literal("")),
  isVatUsed: z.boolean().optional(),
  hasVirtualPenalty: z.boolean().optional(),
  isRevenueRecorded: z.boolean().optional(),
  isAutoBilling: z.boolean().optional(),
  glRevenue: z
    .string()
    .max(255, "GL Revenue must not exceed 255 characters")
    .optional()
    .or(z.literal("")),
  glPrepaid: z
    .string()
    .max(255, "GL Prepaid must not exceed 255 characters")
    .optional()
    .or(z.literal("")),
  glFreight: z
    .string()
    .max(255, "GL Freight must not exceed 255 characters")
    .optional()
    .or(z.literal("")),
  wwprd: z
    .string()
    .max(255, "WWPRD must not exceed 255 characters")
    .optional()
    .or(z.literal("")),
  wwrvc: z
    .string()
    .max(255, "WWRVC must not exceed 255 characters")
    .optional()
    .or(z.literal("")),
  vaSource: z
    .string()
    .max(255, "VA Source must not exceed 255 characters")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean(),
});

export type TransactionTypeFormData = z.output<typeof transactionTypeSchema>;
