import { z } from "zod";

export const regencySchema = z.object({
  code: z
    .string()
    .max(50, "Regency code must not exceed 50 characters")
    .optional()
    .or(z.literal("")),
  name: z
    .string()
    .min(1, "Regency name is required")
    .max(100, "Regency name must not exceed 100 characters"),
  provinceId: z
    .number()
    .int("Province is required")
    .min(1, "Province is required"),
  isActive: z.boolean().default(true),
});

export type RegencyFormData = z.output<typeof regencySchema>;
