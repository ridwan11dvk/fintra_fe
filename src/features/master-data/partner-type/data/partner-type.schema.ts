import { z } from "zod";

export const partnerTypeSchema = z.object({
  code: z
    .string()
    .min(1, "Partner type code is required")
    .max(50, "Partner type code must not exceed 50 characters"),
  name: z
    .string()
    .min(1, "Partner type name is required")
    .max(255, "Partner type name must not exceed 255 characters"),
  partnerLegalityId: z
    .number()
    .int("Partner legality is required")
    .min(1, "Partner legality is required"),
  parentId: z.number().int().optional().nullable(),
  description: z
    .string()
    .max(16000, "Description must not exceed 16000 characters")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().default(true),
  integratedToErp: z.boolean().default(false),
});

export type PartnerTypeFormData = z.output<typeof partnerTypeSchema>;
