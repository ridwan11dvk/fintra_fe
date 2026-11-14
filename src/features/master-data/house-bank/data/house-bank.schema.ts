import { z } from "zod";

export const houseBankSchema = z.object({
  bankCode: z
    .string()
    .min(1, "Bank is required")
    .max(50, "Bank code must not exceed 50 characters"),
  companyCode: z
    .string()
    .min(1, "Company code is required")
    .max(50, "Company code must not exceed 50 characters"),
  currencyCode: z
    .string()
    .min(1, "Currency code is required")
    .max(10, "Currency code must not exceed 10 characters"),
  accountId: z
    .string()
    .min(1, "Account ID is required")
    .max(100, "Account ID must not exceed 100 characters"),
  accountNumber: z
    .string()
    .min(1, "Account number is required")
    .max(50, "Account number must not exceed 50 characters"),
  accountName: z
    .string()
    .min(1, "Account name is required")
    .max(100, "Account name must not exceed 100 characters"),
  erpCode: z
    .string()
    .max(50, "ERP code must not exceed 50 characters")
    .optional(),
  isActive: z.boolean(),
});

export type HouseBankFormData = z.output<typeof houseBankSchema>;
