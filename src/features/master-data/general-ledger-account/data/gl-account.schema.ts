import { z } from "zod";

export const glAccountSchema = z
  .object({
    companyCode: z
      .string()
      .min(1, "Company code is required")
      .max(5, "Company code must not exceed 5 characters"),
    baCode: z
      .string()
      .max(5, "Business area code must not exceed 5 characters")
      .optional(),
    name: z
      .string()
      .max(100, "Name must not exceed 100 characters")
      .optional(),
    account: z
      .string()
      .min(1, "Account code is required")
      .max(20, "Account code must not exceed 20 characters"),
    description: z
      .string()
      .max(255, "Description must not exceed 255 characters")
      .optional(),
    commitmentItem: z
      .string()
      .max(100, "Commitment item must not exceed 100 characters")
      .optional(),
    operationalCostComponent: z
      .string()
      .max(100, "Operational cost component must not exceed 100 characters")
      .optional(),
    imoCostComponent: z
      .string()
      .max(100, "IMO cost component must not exceed 100 characters")
      .optional(),
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

export type GLAccountFormData = z.output<typeof glAccountSchema>;
