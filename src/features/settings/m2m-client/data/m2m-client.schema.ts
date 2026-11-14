import { z } from "zod";

export const m2mClientCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional()
    .or(z.null()),
  permissionIds: z.array(z.number()).optional(),
  expiresAt: z.string().optional().or(z.null()),
});

export const m2mClientUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional()
    .or(z.null()),
  status: z.string().optional(),
  expiresAt: z.string().optional().or(z.null()),
});

export type M2mClientCreateFormData = z.infer<typeof m2mClientCreateSchema>;
export type M2mClientUpdateFormData = z.infer<typeof m2mClientUpdateSchema>;
