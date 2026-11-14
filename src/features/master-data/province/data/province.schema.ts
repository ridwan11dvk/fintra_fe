import { z } from "zod";

export const provinceSchema = z.object({
  code: z
    .string()
    .max(50, "Code must not exceed 50 characters")
    .optional()
    .or(z.literal("")),
  name: z
    .string()
    .min(1, "Province name is required")
    .max(100, "Name must not exceed 100 characters"),
  alias: z
    .string()
    .max(100, "Alias must not exceed 100 characters")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().default(true),
});

export type ProvinceFormData = z.output<typeof provinceSchema>;
