import { z } from "zod";

export const partnerDocRefSchema = z.object({
  countryId: z.number().int().positive("Country is required"),
  companyCode: z
    .string()
    .min(1, "Company code is required")
    .max(100, "Company code must not exceed 100 characters"),
  partnerCategoryId: z.number().int().positive().optional().nullable(),
  partnerClassificationId: z
    .number()
    .int()
    .positive()
    .optional()
    .nullable(),
  partnerLegalityId: z.number().int().positive("Partner legality is required"),
  partnerRoleId: z.number().int().positive("Partner role is required"),
  partnerTypeId: z.number().int().positive().optional().nullable(),
  partnerSubTypeId: z.number().int().positive().optional().nullable(),
  documentNameId: z.number().int().positive("Document name is required"),
  isActive: z.boolean().default(true).optional(),
});

export type PartnerDocRefFormData = z.output<typeof partnerDocRefSchema>;
