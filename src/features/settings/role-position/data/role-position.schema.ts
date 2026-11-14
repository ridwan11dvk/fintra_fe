import { z } from "zod";

export const rolePositionSchema = z.object({
  jobPositionId: z.number().min(1, "Position is required"),
  roleIds: z.array(z.number()).min(1, "At least one role must be selected"),
});

export type RolePositionFormData = z.infer<typeof rolePositionSchema>;

// Schema for reverse perspective (one role → many job positions)
export const rolePositionByRoleSchema = z.object({
  roleId: z.number().min(1, "Role is required"),
  jobPositionIds: z
    .array(z.number())
    .min(1, "At least one job position must be selected"),
});

export type RolePositionByRoleFormData = z.infer<typeof rolePositionByRoleSchema>;
