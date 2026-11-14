import { z } from "zod";

export const termOfPaymentSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(50, "Code must not exceed 50 characters"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must not exceed 255 characters"),
  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),
  numberOfDays: z
    .number()
    .min(0, "Number of days must be 0 or greater")
    .int("Number of days must be a whole number"),
  calculationType: z.string().min(1, "Calculation type is required"),
  discount: z
    .number()
    .min(0, "Discount must be 0 or greater")
    .nullable()
    .optional(),
  discountType: z.string().nullable().optional(),
  isActive: z.boolean(),
});

export type TermOfPaymentFormData = z.output<typeof termOfPaymentSchema>;
