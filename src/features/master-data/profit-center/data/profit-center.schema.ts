import { z } from "zod";

export const profitCenterSchema = z.object({
  profitCenterId: z.string().trim().min(1, "Profit Center ID is required.").max(32),
  profitCenterName: z.string().trim().min(1, "Profit Center Name is required.").max(120),
  parentProfitCenterId: z.string().trim().max(32),
  segmentId: z.string().trim().max(32),
  businessUnitId: z.string().trim().min(1, "Business Unit ID is required.").max(32),
  responsiblePerson: z.string().trim().max(120),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});
