import { z } from "zod";

export const documentNameSchema = z.object({
  name: z.string().min(1, "Document name is required").max(100),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean(),
});

export type DocumentNameFormData = z.output<typeof documentNameSchema>;
