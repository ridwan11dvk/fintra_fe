import { z } from "zod";

export const revenueCenterSchema = z.object({
  revenueCenterCode: z
    .string()
    .min(1, "Revenue center code is required")
    .max(50, "Revenue center code must not exceed 50 characters"),
  revenueCenterName: z
    .string()
    .min(1, "Revenue center name is required")
    .max(255, "Revenue center name must not exceed 255 characters"),
  parentRevenueCenter: z
    .string()
    .optional(),
  segment: z
    .string()
    .min(1, "Segment is required")
    .max(50, "Segment must not exceed 50 characters"),
  businessUnit: z
    .string()
    .min(1, "Business unit is required")
    .max(50, "Business unit must not exceed 50 characters"),
  isActive: z.boolean(),
});

export type RevenueCenterFormData = z.output<typeof revenueCenterSchema>;
