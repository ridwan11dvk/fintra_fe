import { z } from "zod";

export const costCenterSchema = z
  .object({
    companyCode: z
      .string()
      .min(1, "Company code is required")
      .max(5, "Company code must not exceed 5 characters"),
    businessAreaCode: z
      .string()
      .max(5, "Business area code must not exceed 5 characters")
      .optional(),
    costCenterCode: z
      .string()
      .min(1, "Cost center code is required")
      .max(20, "Cost center code must not exceed 20 characters"),
    costCenterName: z
      .string()
      .min(1, "Cost center name is required")
      .max(150, "Cost center name must not exceed 150 characters"),
    description: z
      .string()
      .max(255, "Description must not exceed 255 characters")
      .optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.union([z.string(), z.null()]).optional(),
    categoryId: z.union([z.number(), z.null()]).optional(),
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

export type CostCenterFormData = z.output<typeof costCenterSchema>;
