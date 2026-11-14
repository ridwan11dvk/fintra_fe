import { z } from "zod";

export const customsOfficeSchema = z.object({
  code: z
    .string()
    .min(1, "Customs office code is required")
    .max(50, "Code must not exceed 50 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Code can only contain uppercase letters, numbers, underscores, and hyphens",
    ),
  name: z
    .string()
    .min(1, "Customs office name is required")
    .max(255, "Name must not exceed 255 characters"),
  isActive: z.boolean(),
});

export type CustomsOfficeFormData = z.output<typeof customsOfficeSchema>;
