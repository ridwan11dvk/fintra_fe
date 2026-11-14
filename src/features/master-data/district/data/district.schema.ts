import { z } from "zod";

export const districtSchema = z.object({
  code: z
    .string()
    .max(50, "District code must not exceed 50 characters")
    .optional()
    .or(z.literal("")),
  name: z
    .string()
    .min(1, "District name is required")
    .max(100, "District name must not exceed 100 characters"),
  provinceId: z
    .number()
    .int("Province is required")
    .min(1, "Province is required"),
  regencyId: z
    .number()
    .int("Regency is required")
    .min(1, "Regency is required"),
  isActive: z.boolean().default(true),
});

export type DistrictFormData = z.output<typeof districtSchema>;
