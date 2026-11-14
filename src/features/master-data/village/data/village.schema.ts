import { z } from "zod";

export const villageSchema = z.object({
  code: z
    .string()
    .max(50, "Village code must not exceed 50 characters")
    .optional()
    .or(z.literal("")),
  name: z
    .string()
    .min(1, "Village name is required")
    .max(100, "Village name must not exceed 100 characters"),
  postalCode: z
    .string()
    .max(20, "Postal code must not exceed 20 characters")
    .optional()
    .or(z.literal("")),
  provinceId: z
    .number()
    .int("Province is required")
    .min(1, "Province is required"),
  regencyId: z
    .number()
    .int("Regency is required")
    .min(1, "Regency is required"),
  districtId: z
    .number()
    .int("District is required")
    .min(1, "District is required"),
  isActive: z.boolean().default(true),
});

export type VillageFormData = z.output<typeof villageSchema>;
