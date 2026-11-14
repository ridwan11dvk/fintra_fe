import { z } from "zod";

export const taxRateSchema = z
  .object({
    code: z
      .string()
      .min(1, "Tax rate code is required")
      .max(50, "Tax rate code must not exceed 50 characters"),
    name: z
      .string()
      .min(1, "Tax rate name is required")
      .max(255, "Tax rate name must not exceed 255 characters"),
    description: z
      .string()
      .max(1000, "Description must not exceed 1000 characters")
      .optional(),
    taxType: z
      .string()
      .min(1, "Tax type is required")
      .max(20, "Tax type must not exceed 20 characters"),
    ratePercent: z
      .number()
      .min(0, "Rate percent must be at least 0")
      .max(100, "Rate percent must not exceed 100"),
    coefficientNumerator: z
      .number()
      .min(0.01, "Coefficient numerator must be greater than 0"),
    coefficientDenominator: z
      .number()
      .min(0.01, "Coefficient denominator must be greater than 0")
      .refine((val) => val !== 0, "Coefficient denominator cannot be zero"),
    isUsedInRkip: z.boolean().optional(),
    postingType: z
      .string()
      .max(50, "Posting type must not exceed 50 characters")
      .optional(),
    isPostingRequired: z.boolean().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.union([z.string(), z.null()]).optional(),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      if (!data.startDate) return false;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      message: "End date must be on or after start date",
      path: ["endDate"],
    },
  );

export type TaxRateFormData = z.output<typeof taxRateSchema>;
