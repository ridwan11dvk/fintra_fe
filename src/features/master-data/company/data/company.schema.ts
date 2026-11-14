import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const fileValidationSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File size must be less than 10MB",
  });

export const companyFormSchema = z.object({
  code: z
    .string()
    .min(1, "Company code is required")
    .max(50, "Company code must not exceed 50 characters"),
  name: z
    .string()
    .min(1, "Company name is required")
    .max(255, "Company name must not exceed 255 characters"),
  alias: z
    .string()
    .max(100, "Alias must not exceed 100 characters")
    .optional()
    .nullable(),
  npwp: z
    .string()
    .max(16, "NPWP must not exceed 16 characters")
    .optional()
    .nullable(),
  pgMerchantId: z
    .string()
    .max(100, "PG merchant ID must not exceed 100 characters")
    .optional()
    .nullable(),
  city: z
    .string()
    .max(255, "City must not exceed 255 characters")
    .optional()
    .nullable(),
  address: z
    .string()
    .max(255, "Address must not exceed 255 characters")
    .optional()
    .nullable(),
  businessType: z
    .string()
    .max(225, "Business type must not exceed 225 characters")
    .optional()
    .nullable(),
  moduleIds: z.array(z.number().int().positive()).optional().default([]),
  isActive: z.boolean().default(true),
});

export type CompanyFormData = z.output<typeof companyFormSchema>;

/**
 * File upload schema for company files
 */
export const companyFileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is requred")
    .max(255, "Name must not exceed 255 characters"),
  alias: z
    .string()
    .min(1, "Alias is required")
    .max(255, "Alias must not exceed 255 characters"),
  documentDate: z.string().optional().nullable(),
  validFrom: z.string().optional().nullable(),
  validTo: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

export type CompanyFileFormData = z.output<typeof companyFileSchema>;

/**
 * Extended file schema with file input validation
 * Used for create mode where file is required
 */
export const companyFileWithFileSchema = companyFileSchema.extend({
  file: fileValidationSchema,
});

export type CompanyFileWithFileData = z.output<
  typeof companyFileWithFileSchema
>;

/**
 * Extended file schema for edit mode where file is optional
 */
export const companyFileEditSchema = companyFileSchema.extend({
  file: fileValidationSchema.optional(),
});

export type CompanyFileEditData = z.output<typeof companyFileEditSchema>;
