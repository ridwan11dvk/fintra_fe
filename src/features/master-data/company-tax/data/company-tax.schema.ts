import { z } from "zod";

export const companyTaxSchema = z
  .object({
    companyCode: z
      .string()
      .min(1, "Company code is required")
      .max(50, "Company code must not exceed 50 characters"),
    taxRateId: z
      .number({ message: "Tax rate is required" })
      .int()
      .positive("Tax rate is required"),
    glAccount: z
      .string()
      .max(50, "GL account must not exceed 50 characters")
      .optional()
      .or(z.literal("")),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional().or(z.literal("")),
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

export type CompanyTaxFormData = z.output<typeof companyTaxSchema>;
