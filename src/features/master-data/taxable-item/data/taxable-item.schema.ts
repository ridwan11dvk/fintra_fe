import { z } from "zod";
import { TaxableItemType } from "./taxable-item.types";

export const taxableItemSchema = z.object({
  code: z
    .string()
    .max(50, "Code must not exceed 50 characters")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  altCode: z
    .string()
    .max(50, "Alternative code must not exceed 50 characters")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  fullCode: z
    .string()
    .max(100, "Full code must not exceed 100 characters")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  fullAltCode: z
    .string()
    .max(100, "Full alternative code must not exceed 100 characters")
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  name: z.string().min(1, "Taxable item name is required").max(100),
  level: z
    .number()
    .int()
    .positive("Level must be a positive number")
    .optional(),
  parentId: z
    .number()
    .int()
    .positive("Parent ID must be a positive number")
    .optional()
    .nullable(),
  type: z.union([
    z.literal(TaxableItemType.SERVICE),
    z.literal(TaxableItemType.GOODS),
  ]),
  moduleId: z
    .number()
    .int()
    .positive("Module ID must be a positive number")
    .optional(),
  costCenterIds: z.array(z.number().int().positive()).optional(),
  isActive: z.boolean().default(true),
});

export type TaxableItemFormData = z.input<typeof taxableItemSchema>;
