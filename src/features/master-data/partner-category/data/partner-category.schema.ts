import { z } from "zod";

export const partnerCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Partner Category name is required")
    .max(255, "Partner Category name must not exceed 255 characters"),
  description: z
    .string()
    .max(16000, "Description must not exceed 16000 characters")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().default(true),
});

export type PartnerCategoryFormData = z.output<typeof partnerCategorySchema>;
