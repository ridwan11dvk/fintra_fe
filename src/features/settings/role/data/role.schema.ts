import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  code: z.string().max(100, "Code must be less than 100 characters"),
  companyCode: z
    .string()
    .min(1, "Company is required")
    .max(100, "Company code must be less than 100 characters"),
  isActive: z.boolean().optional(),
  type: z.enum(["CORE", "ENTITY"]).optional().or(z.literal("")),
  businessAreaIds: z.array(z.number()).optional(),
  permissionIds: z.array(z.number()),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

export type RoleFormData = z.infer<typeof roleSchema>;
