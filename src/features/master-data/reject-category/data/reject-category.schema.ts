import { z } from "zod";

export const rejectCategorySchema = z.object({
  code: z
    .string()
    .max(50, "Code cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, "Reject category name is required").max(100),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  moduleId: z.number().int().optional(),
  featureId: z.number().int().optional(),
  isActive: z.boolean(),
});

export type RejectCategoryFormData = z.output<typeof rejectCategorySchema>;
