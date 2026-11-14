import { z } from "zod";

const applicableTaxSchema = z.object({
  taxId: z.string(),
  coefficient: z.string(),
  ratePercent: z.string(),
});

export const workCatalogSchema = z.object({
  workType: z
    .string()
    .trim()
    .min(1, "Work name is required")
    .max(120, "Work name must not exceed 120 characters"),
  subCategoryId: z.string().trim().min(1, "Sub work category is required"),
  groupCategoryId: z.string().trim().min(1, "Group work category is required"),
  mainCategoryId: z.string().trim(),
  cashflowCategoryId: z
    .string()
    .trim()
    .min(1, "Cashflow category is required"),
  procurementSchemaId: z
    .string()
    .trim()
    .min(1, "Procurement schema is required"),
  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters"),
  businessEntityTaxes: z.array(applicableTaxSchema),
  individualTaxes: z.array(applicableTaxSchema),
}).superRefine((data, context) => {
  const hasSelectedTax = [
    ...data.businessEntityTaxes,
    ...data.individualTaxes,
  ].some((tax) => tax.taxId.trim().length > 0);
  if (hasSelectedTax) return;
  context.addIssue({
    code: "custom",
    path: ["businessEntityTaxes"],
    message: "Applicable tax is required",
  });
});

export type WorkCatalogFormData = z.output<typeof workCatalogSchema>;
