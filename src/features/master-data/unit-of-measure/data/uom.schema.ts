import { z } from "zod";

export const uomSchema = z.object({
  code: z.string().min(1, "Code is required"),
  unit: z.string().min(1, "Unit is required"),
  unitEn: z.string().max(100, "Unit (EN) must be at most 100 characters").optional(),
  unitAlias: z
    .string()
    .min(1, "Alias is required")
    .max(20, "Alias must be at most 20 characters"),
  isActive: z.boolean(),
});

export type UomFormData = z.output<typeof uomSchema>;
