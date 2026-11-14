import { z } from "zod";

export const transactionCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Transaction category name is required")
    .max(255, "Transaction category name must not exceed 255 characters"),
  description: z
    .string()
    .max(65535, "Description must not exceed 65535 characters")
    .optional(),
  isActive: z.boolean(),
});

export type TransactionCategoryFormData = z.output<
  typeof transactionCategorySchema
>;
