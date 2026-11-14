import { z } from "zod";

export const businessUnitSchema = z.object({
  code: z.string().min(1, "Business Unit ID is required"),
  parentBusinessUnit: z.string().optional(),
  status: z.boolean().optional(),
  name: z.string().min(1, "Business Unit Name is required"),
  businessUnitType: z.string().optional(),
  companyCode: z.string().optional(),
  segment: z.string().optional(),
  region: z.string().optional(),
  effectiveDate: z.boolean().optional(),
  endDate: z.boolean().optional(),
  createdBy: z.string().optional(),
  createdDate: z.boolean().optional(),
  lastUpdatedBy: z.string().optional(),
  lastUpdatedDate: z.boolean().optional(),
  description: z.string().optional(),
  isLinked: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type BusinessUnitFormData = z.output<typeof businessUnitSchema>;
