import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/** Types of identity number accepted for a partner (NIK is the default). */
export const IDENTITY_NUMBER_TYPES = [
  "NIK",
  "KITAS",
  "PASPOR",
  "SIM",
  "LAINNYA",
] as const;

// Note: File validation is used internally but not exported to avoid conflicts with company module
z.instanceof(File).refine((file) => file.size <= MAX_FILE_SIZE, {
  message: "File size must be less than 10MB",
});

export const partnerFormSchema = z
  .object({
    partnerCode: z
      .string()
      .min(1, "Partner code is required")
      .max(50, "Partner code must not exceed 50 characters"),
    name: z
      .string()
      .min(1, "Partner name is required")
      .max(255, "Partner name must not exceed 255 characters"),
    legalName: z
      .string()
      .max(255, "Legal name must not exceed 255 characters")
      .nullish()
      .optional(),
    companyGroup: z
      .string()
      .max(255, "Company group must not exceed 255 characters")
      .nullish()
      .optional(),
    partnerClassificationId: z.number().int().nullish().optional(),
    partnerCategoryId: z.number().int().nullish().optional(),
    partnerTypeId: z.number().int().nullish().optional(),
    partnerSubTypeId: z.number().int().nullish().optional(),
    identityNumber: z
      .string()
      .max(50, "Identity number must not exceed 50 characters")
      .nullish()
      .optional(),
    identityNumberType: z
      .enum(IDENTITY_NUMBER_TYPES)
      .nullish()
      .optional(),
    region: z
      .string()
      .max(100, "Region must not exceed 100 characters")
      .nullish()
      .optional(),
    // Tax profile (NPWP / NITKU and the rest of the tax identity)
    taxpayerName: z
      .string()
      .max(255, "Taxpayer name must not exceed 255 characters")
      .nullish()
      .optional(),
    vatStatus: z
      .string()
      .max(50, "VAT status must not exceed 50 characters")
      .nullish()
      .optional(),
    taxAddress: z.string().nullish().optional(),
    taxableEmployerNo: z
      .string()
      .max(100, "Taxable employer number must not exceed 100 characters")
      .nullish()
      .optional(),
    npwpNumber: z
      .string()
      .max(50, "NPWP number must not exceed 50 characters")
      .nullish()
      .optional(),
    npwpDocument: z
      .string()
      .max(1024, "NPWP document must not exceed 1024 characters")
      .nullish()
      .optional(),
    nitkuNumber: z
      .string()
      .max(50, "NITKU number must not exceed 50 characters")
      .nullish()
      .optional(),
    taxDocument: z
      .string()
      .max(1024, "Tax document must not exceed 1024 characters")
      .nullish()
      .optional(),
    taxClassification: z
      .string()
      .max(100, "Tax classification must not exceed 100 characters")
      .nullish()
      .optional(),
    vatRate: z
      .string()
      .max(20, "VAT rate must not exceed 20 characters")
      .nullish()
      .optional(),
    wapuStatus: z
      .string()
      .max(50, "WAPU status must not exceed 50 characters")
      .nullish()
      .optional(),
    isTaxExempt: z.boolean().optional().default(false),
    taxExemptDocument: z
      .string()
      .max(1024, "Tax exempt document must not exceed 1024 characters")
      .nullish()
      .optional(),
    plans: z
      .string()
      .max(255, "Plans must not exceed 255 characters")
      .nullish()
      .optional(),
    companyWebsite: z
      .string()
      .max(255, "Company website must not exceed 255 characters")
      .nullish()
      .optional(),
    companyEmail: z
      .union([
        z
          .email({ error: "Invalid email format" })
          .max(255, "Email must not exceed 255 characters"),
        z.literal(""),
      ])
      .nullish()
      .optional(),
    companyPhoneNumber: z
      .string()
      .max(50, "Phone number must not exceed 50 characters")
      .nullish()
      .optional(),
    status: z
      .string()
      .max(50, "Status must not exceed 50 characters")
      .default("ACTIVE"),
    blacklistReason: z.string().nullish().optional(),
    blacklistDocument: z
      .string()
      .max(255, "Blacklist document must not exceed 255 characters")
      .nullish()
      .optional(),
    blacklistDocumentObject: z
      .file()
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: "Blacklist document size must be less than 10MB",
      })
      .nullish()
      .optional(),
    isValidatedByDjp: z.boolean().optional().default(false),
    integratedToErp: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.npwpNumber || data.npwpNumber.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "NPWP number is required",
        path: ["npwpNumber"],
      });
    }

    const categoryId = data.partnerCategoryId;
    if (categoryId == null) return;

    const isCategoryOne = categoryId === 1;

    if (isCategoryOne) {
      if (!data.identityNumber || data.identityNumber.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Identity number is required",
          path: ["identityNumber"],
        });
      }
    }
  });

export type PartnerFormData = z.output<typeof partnerFormSchema>;

/**
 * Partner Document schema for upload/update
 */
export const partnerDocumentSchema = z.object({
  partnerDocRefId: z
    .number()
    .int()
    .positive("Partner document reference ID is required")
    .nullish(),
  documentName: z
    .string()
    .min(1, "Document name is required")
    .max(255, "Document name must not exceed 255 characters"),
  documentType: z
    .string()
    .max(255, "Document type must not exceed 255 characters")
    .nullish()
    .optional(),
  documentDate: z.string().nullish().optional(),
  documentNumber: z
    .string()
    .max(255, "Document number must not exceed 255 characters")
    .nullish()
    .optional(),
  description: z.string().nullish().optional(),
  isActive: z.boolean().default(true),
});

export type PartnerDocumentFormData = z.output<typeof partnerDocumentSchema>;

/**
 * Partner Contact schema for creation/update. Replaces the former branch
 * (correspondent) schema.
 */
export const partnerContactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must not exceed 255 characters"),
  position: z
    .string()
    .max(255, "Position must not exceed 255 characters")
    .nullish()
    .optional(),
  department: z
    .string()
    .max(255, "Department must not exceed 255 characters")
    .nullish()
    .optional(),
  phoneNumber: z
    .string()
    .max(50, "Phone must not exceed 50 characters")
    .nullish()
    .optional(),
  email: z
    .union([
      z
        .email({ error: "Invalid email format" })
        .max(255, "Email must not exceed 255 characters"),
      z.literal(""),
    ])
    .nullish()
    .optional(),
  preferredCommChannel: z
    .string()
    .max(50, "Preferred communication channel must not exceed 50 characters")
    .nullish()
    .optional(),
});

export type PartnerContactFormData = z.output<typeof partnerContactSchema>;

/**
 * Partner Role schema for creation/update (vendor / mitra / customer role per
 * company code with lifecycle status and blacklist info).
 */
export const partnerRoleSchema = z.object({
  type: z
    .string()
    .min(1, "Role type is required")
    .max(20, "Role type cannot exceed 20 characters"),
  companyCode: z
    .string()
    .max(100, "Company code must not exceed 100 characters")
    .nullish()
    .optional(),
  status: z
    .enum(["ACTIVE", "INACTIVE", "BLACKLISTED"], {
      error: "Role status must be one of ACTIVE, INACTIVE, BLACKLISTED",
    })
    .nullish()
    .optional(),
  blacklistReason: z.string().nullish().optional(),
  blacklistDocument: z
    .string()
    .max(255, "Blacklist document must not exceed 255 characters")
    .nullish()
    .optional(),
});

export type PartnerRoleFormData = z.output<typeof partnerRoleSchema>;

/**
 * Partner Tax schema for creation/update (path /tax, entity PartnerTaxRate)
 */
export const partnerTaxSchema = z.object({
  taxRateId: z.number().int().positive("Tax rate is required"),
  active: z.boolean(),
});

export type PartnerTaxFormData = z.output<typeof partnerTaxSchema>;

/**
 * Partner Bank Account schema for creation/update
 */
export const partnerBankAccountSchema = z.object({
  accountNumber: z
    .string()
    .min(1, "Account number is required")
    .max(50, "Account number must not exceed 50 characters"),
  holderName: z
    .string()
    .min(1, "Account holder is required")
    .max(255, "Account holder must not exceed 255 characters"),
  bankCenter: z
    .string()
    .max(50, "Bank center must not exceed 50 characters")
    .nullish(),
  bankBranch: z
    .string()
    .max(50, "Bank branch must not exceed 50 characters")
    .nullish(),
  companyCode: z
    .string()
    .max(100, "Company code must not exceed 100 characters")
    .nullish(),
  currency: z
    .string()
    .max(10, "Currency must not exceed 10 characters")
    .nullish(),
  swiftCode: z
    .string()
    .max(50, "Swift code must not exceed 50 characters")
    .nullish(),
  isDefaultPayment: z.boolean().default(false),
  active: z.boolean().default(true),
});

export type PartnerBankAccountFormData = z.output<
  typeof partnerBankAccountSchema
>;

/**
 * Partner Virtual Account schema for creation/update
 */
export const partnerVirtualAccountSchema = z.object({
  number: z
    .string()
    .min(1, "Virtual account number is required")
    .max(50, "Virtual account number must not exceed 50 characters"),
  holder: z
    .string()
    .min(1, "Account holder is required")
    .max(255, "Account holder must not exceed 255 characters"),
  bankCode: z
    .string()
    .max(50, "Bank code must not exceed 50 characters")
    .nullish(),
  type: z.string().max(50, "Type must not exceed 50 characters").nullish(),
  companyCode: z
    .string()
    .max(100, "Company code must not exceed 100 characters")
    .nullish(),
  active: z.boolean().default(true),
});

export type PartnerVirtualAccountFormData = z.output<
  typeof partnerVirtualAccountSchema
>;

/**
 * Partner Tax Profile schema for creation/update (1:1 per partner)
 */
export const partnerTaxProfileSchema = z.object({
  taxpayerName: z
    .string()
    .max(255, "Taxpayer name must not exceed 255 characters")
    .nullish()
    .optional(),
  vatStatus: z
    .string()
    .max(50, "VAT status must not exceed 50 characters")
    .nullish()
    .optional(),
  address: z.string().nullish().optional(),
  taxableEmployerNo: z
    .string()
    .max(100, "Taxable employer number must not exceed 100 characters")
    .nullish()
    .optional(),
  npwpNumber: z
    .string()
    .max(50, "NPWP number must not exceed 50 characters")
    .nullish()
    .optional(),
  npwpDocument: z
    .string()
    .max(1024, "NPWP document must not exceed 1024 characters")
    .nullish()
    .optional(),
  nitkuNumber: z
    .string()
    .max(50, "NITKU number must not exceed 50 characters")
    .nullish()
    .optional(),
  document: z
    .string()
    .max(1024, "Document must not exceed 1024 characters")
    .nullish()
    .optional(),
  classification: z
    .string()
    .max(100, "Classification must not exceed 100 characters")
    .nullish()
    .optional(),
  vatRate: z
    .string()
    .max(20, "VAT rate must not exceed 20 characters")
    .nullish()
    .optional(),
  wapuStatus: z
    .string()
    .max(50, "WAPU status must not exceed 50 characters")
    .nullish()
    .optional(),
  isTaxExempt: z.boolean().default(false),
  exemptDocument: z
    .string()
    .max(1024, "Exempt document must not exceed 1024 characters")
    .nullish()
    .optional(),
});

export type PartnerTaxProfileFormData = z.output<typeof partnerTaxProfileSchema>;

/**
 * Partner Legality schema for creation/update (1:1 per partner)
 */
export const partnerLegalitySchema = z.object({
  nibNumber: z
    .string()
    .max(100, "NIB number must not exceed 100 characters")
    .nullish()
    .optional(),
  nibDate: z.string().nullish().optional(),
  nibDocument: z
    .string()
    .max(1024, "NIB document must not exceed 1024 characters")
    .nullish()
    .optional(),
  deedEstablishmentNumber: z
    .string()
    .max(100, "Deed establishment number must not exceed 100 characters")
    .nullish()
    .optional(),
  deedEstablishmentDate: z.string().nullish().optional(),
  deedEstablishmentDocument: z
    .string()
    .max(1024, "Deed establishment document must not exceed 1024 characters")
    .nullish()
    .optional(),
});

export type PartnerLegalityFormData = z.output<typeof partnerLegalitySchema>;

/**
 * Partner Deed Amendment schema for creation/update (child of legality)
 */
export const partnerDeedAmendmentSchema = z.object({
  number: z
    .string()
    .max(100, "Deed amendment number must not exceed 100 characters")
    .nullish()
    .optional(),
  date: z.string().nullish().optional(),
  document: z
    .string()
    .max(1024, "Document must not exceed 1024 characters")
    .nullish()
    .optional(),
});

export type PartnerDeedAmendmentFormData = z.output<
  typeof partnerDeedAmendmentSchema
>;

/**
 * Partner ERP Code schema for creation/update
 */
export const partnerErpCodeSchema = z.object({
  erpCode: z
    .string()
    .min(1, "ERP code is required")
    .max(100, "ERP code must not exceed 100 characters"),
  companyCode: z
    .string()
    .max(100, "Company code must not exceed 100 characters")
    .nullish(),
  partnerClassificationId: z.number().int().nullish().optional(),
  partnerCategoryId: z.number().int().nullish().optional(),
  partnerLegalityId: z.number().int().nullish().optional(),
  partnerRoleId: z.number().int().nullish().optional(),
  partnerTypeId: z.number().int().nullish().optional(),
  partnerSubTypeId: z.number().int().nullish().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.union([z.string(), z.null()]).optional(),
})
  .refine(
    (data) => {
      if (!data.endDate) return true;
      if (!data.startDate) return false;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      message: "End date must be on or after start date",
      path: ["endDate"],
    },
  );

export type PartnerErpCodeFormData = z.output<typeof partnerErpCodeSchema>;
