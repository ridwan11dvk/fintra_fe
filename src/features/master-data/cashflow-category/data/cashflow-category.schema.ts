import { z } from "zod";

export const cashflowCategorySchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Code is required")
    .max(50, "Code must not exceed 50 characters"),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(200, "Name must not exceed 200 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters"),
});

export type CashflowCategoryFormValues = z.output<typeof cashflowCategorySchema>;
