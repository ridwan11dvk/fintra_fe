import { z } from "zod";

export const currencyRateSchema = z
  .object({
    currencyCode: z
      .string()
      .min(1, "Currency code is required")
      .max(3, "Currency code must not exceed 3 characters")
      .toUpperCase(),
    rateType: z.string().min(1, "Rate type is required"),
    rate: z
      .number()
      .positive("Rate must be greater than 0")
      .refine((value) => {
        // Check if the value has at most 6 decimal places
        const decimalPlaces = (value.toString().split(".")[1] || "").length;
        return decimalPlaces <= 6;
      }, "Rate can have maximum 6 decimal places"),
    description: z
      .string()
      .max(500, "Description must not exceed 500 characters")
      .optional(),
    startDate: z.string().refine((value) => {
      // Check if it's a valid ISO date
      return !Number.isNaN(Date.parse(value));
    }, "Start date must be a valid date (YYYY-MM-DD)"),
    endDate: z
      .string()
      .refine((value) => {
        // Check if it's a valid ISO date or empty string
        return value === "" || !Number.isNaN(Date.parse(value));
      }, "End date must be a valid date (YYYY-MM-DD)")
      .nullish(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.startDate) < new Date(data.endDate);
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

export type CurrencyRateFormData = z.output<typeof currencyRateSchema>;
