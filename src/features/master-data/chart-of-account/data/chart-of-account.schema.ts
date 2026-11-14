import { z } from "zod";

export const chartOfAccountSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Chart of Account name is required"),
  level: z.coerce.number().min(1, "Level must be greater than or equal to 1"),
  description: z.string().optional(),
  accountType: z.string().optional(),
  parentCode: z.string().optional(),
  isLinked: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type ChartOfAccountFormData = z.output<typeof chartOfAccountSchema>;
