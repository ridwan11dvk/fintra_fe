import { z } from "zod";

export const categorySchema = z.object({
  typeCode: z.string().min(1, "Lookup value type is required"),
  code: z
    .string()
    .min(1, "Code is required")
    .max(50, "Code cannot exceed 50 characters"),
  name: z.string().min(1, "Lookup value name is required").max(255),
  nameEn: z
    .string()
    .max(255, "Name (EN) cannot exceed 255 characters")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  descriptionEn: z
    .string()
    .max(500, "Description (EN) cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  moduleId: z.number().int().nullable().optional(),
  featureId: z.number().int().nullable().optional(),
  isActive: z.boolean(),
});

export type CategoryFormData = z.output<typeof categorySchema>;
