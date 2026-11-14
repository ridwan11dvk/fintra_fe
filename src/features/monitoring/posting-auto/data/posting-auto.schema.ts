/**
 * Posting Auto Feature Schemas
 * Zod schemas for validation and type-safe forms
 */

import { z } from "zod";

// ============================================================================
// SHARED ENUMS
// ============================================================================

const reversalFlagEnum = z.enum(["A", "B"]);
const debitCreditFlagEnum = z.enum(["S", "H"]);
const sapStatusEnum = z.enum(["S", "C", "E"]);
const yyyymmddRegex = /^\d{8}$/;

// ============================================================================
// LIST FILTER SCHEMA
// ============================================================================

export const postingAutoListFilterSchema = z.object({
  search: z.string().max(255).optional(),
  sapStatus: sapStatusEnum.optional(),
  reversalFlag: reversalFlagEnum.optional(),
  postingStatus: z.coerce.number().int().min(0).max(2).optional(),
  startPostingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
  endPostingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
  startEntryDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
  endEntryDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
  startDocumentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
  endDocumentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
  page: z.number().int().min(0),
  size: z.number().int().min(1).max(100),
});

export type PostingAutoListFilterFormData = z.infer<
  typeof postingAutoListFilterSchema
>;

// ============================================================================
// CREATE / UPDATE SCHEMA
// ============================================================================

export const postingAutoFormSchema = z.object({
  fileName: z.string().max(16).optional(),
  recordNumber: z.string().max(4).optional(),
  transactionCode: z.string().min(1, "Required").max(4, "Max 4 characters"),
  withholdingTax: z.string().max(5).optional(),
  reversalFlag: reversalFlagEnum,
  documentType: z.string().min(1, "Required").max(2, "Max 2 characters"),
  postingDate: z
    .string()
    .regex(yyyymmddRegex, "Must be YYYYMMDD format")
    .optional(),
  documentDate: z.string().regex(yyyymmddRegex, "Must be YYYYMMDD format"),
  documentNumber: z.string().min(1, "Required").max(25, "Max 25 characters"),
  reference: z.string().max(50).optional(),
  debitCreditFlag: debitCreditFlagEnum,
  accountNumber: z.string().min(1, "Required").max(10, "Max 10 characters"),
  alternativeAccount: z.string().max(10).optional(),
  amount: z.coerce.number().min(0.01).optional(),
  businessArea: z.string().min(1, "Business Area is required"),
  segment: z.string().max(5).optional(),
  fixedAssetNumber: z.string().max(7).optional(),
  costCenter: z.string().max(10).optional(),
  profitCenter: z.string().max(10).optional(),
  assignment: z.string().max(16).optional(),
  vendor: z.string().max(6).optional(),
  customer: z.string().max(6).optional(),
  fiscalYear: z.coerce.number().int().optional(),
  sourceBusinessArea: z.string().max(4).optional(),
  virtualAccount: z.string().max(16).optional(),
  wwrvc: z.string().max(10).optional(),
  kndnr: z.string().max(6).optional(),
  wwprd: z.string().max(6).optional(),
  valueDate: z
    .string()
    .regex(yyyymmddRegex, "Must be YYYYMMDD format")
    .optional(),
});

export type PostingAutoFormData = z.infer<typeof postingAutoFormSchema>;
