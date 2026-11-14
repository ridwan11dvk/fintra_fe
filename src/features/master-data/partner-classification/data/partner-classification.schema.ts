import { z } from "zod";

export const partnerClassificationSchema = z.object({
  name: z
    .string()
    .min(1, "Partner Classification name is required")
    .max(255, "Partner Classification name must not exceed 255 characters"),
  description: z
    .string()
    .max(16000, "Description must not exceed 16000 characters")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().default(true),
});

export type PartnerClassificationFormData = z.output<
  typeof partnerClassificationSchema
>;
