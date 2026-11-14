import { z } from "zod";

export const cashflowTypeValues = ["RECIPIENT", "PROVIDER"] as const;

export const cashflowGroupSchema = z.object({
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
  cashflowGroupId: z.string().trim().min(1, "Cashflow category is required"),
  cashflowType: z.enum(cashflowTypeValues, {
    message: "Cashflow type is required",
  }),
  exception: z.string(),
  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters"),
});

export type CashflowGroupFormValues = z.output<typeof cashflowGroupSchema>;
