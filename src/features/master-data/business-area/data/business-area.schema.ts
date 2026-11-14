import { z } from "zod";

export const businessAreaSchema = z.object({
  companyCode: z
    .string()
    .min(1, "Company code is required")
    .max(100, "Company code must not exceed 100 characters"),
  name: z
    .string()
    .min(1, "Business area name is required")
    .max(255, "Name must not exceed 255 characters"),
  baCode: z
    .string()
    .min(1, "Business area code is required")
    .max(50, "Business area code must not exceed 50 characters"),
  branchCode: z
    .string()
    .max(50, "Branch code must not exceed 50 characters")
    .optional(),
  email: z
    .email("Email must be valid")
    .max(255, "Email must not exceed 255 characters")
    .optional(),
  taxEmail: z
    .email("Tax email must be valid")
    .max(255, "Tax email must not exceed 255 characters")
    .optional(),
  nitku: z.string().max(50, "NITKU must not exceed 50 characters").optional(),
  npwp: z.string().max(50, "NPWP must not exceed 50 characters").optional(),
  clientId: z
    .string()
    .max(100, "Client ID must not exceed 100 characters")
    .optional(),
  clientSecret: z
    .string()
    .max(255, "Client secret must not exceed 255 characters")
    .optional(),
  isActive: z.boolean(),
});

export type BusinessAreaFormData = z.output<typeof businessAreaSchema>;
