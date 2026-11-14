import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().trim().min(1, "Department Name is required").max(100, "Department Name must be 100 characters or fewer"),
  code: z.string().trim().min(1, "Department Code is required").max(30, "Department Code must be 30 characters or fewer"),
  parentDepartmentId: z.string().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;
