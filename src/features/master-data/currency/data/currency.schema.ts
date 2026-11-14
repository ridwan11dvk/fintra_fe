import { z } from "zod";

export const currencySchema = z.object({
  countryId: z.number().int().positive("Country is required"),
  code: z
    .string()
    .length(3, "Currency code must be exactly 3 characters")
    .toUpperCase(),
  name: z.string().max(100, "Name must not exceed 100 characters").optional(),
  symbol: z.string().max(10, "Symbol must not exceed 10 characters").optional(),
  lowestValue: z.number().positive("Lowest value must be greater than 0").optional(),
  isPrimary: z.boolean().default(false).optional(),
  isActive: z.boolean().default(true).optional(),
});

export type CurrencyFormData = z.input<typeof currencySchema>;
