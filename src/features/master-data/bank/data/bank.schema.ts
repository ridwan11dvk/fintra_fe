import { z } from "zod";

export const bankSchema = z.object({
  name: z.string().min(1, "Bank name is required").max(100),
  code: z.string().min(1, "Bank code is required").max(50),
  color: z
    .string()
    .max(20)
    .optional()
    .refine(
      (value) => !value || /^#[0-9A-Fa-f]{6}$/.test(value),
      "Color must be in hex format (e.g., #0066CC)",
    ),
  rtgsCode: z.string().max(50).optional(),
  onlineCode: z.string().max(50).optional(),
  bifastCode: z.string().max(50).optional(),
  sknCode: z.string().max(50).optional(),
  pgCode: z.string().max(50).optional(),
  isActive: z.boolean(),
});

export type BankFormData = z.output<typeof bankSchema>;
