/**
 * Posting Auto Legacy Feature Zod Schemas
 */

import { z } from "zod";

// ============================================================================
// LIST FILTER SCHEMA
// ============================================================================

export const postingAutoLegacyListFilterSchema = z.object({
  search: z.string().max(255).optional(),
  status: z.string().optional(),
  postingDate: z.string().optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().optional(),
  sort: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  ids: z.string().optional(),
  page: z.number().int().min(0),
  size: z.number().int().min(1).max(100),
});

export type PostingAutoLegacyListFilterFormData = z.infer<
  typeof postingAutoLegacyListFilterSchema
>;

// ============================================================================
// CREATE / UPDATE SCHEMA
// ============================================================================

export const postingAutoLegacyFormSchema = z.object({
  RECORD_NUMBER: z.coerce.number().int().min(1, "Required"),
  TCODE: z.string().min(1, "Required").max(4, "Max 4 characters"),
  REVERSAL: z.enum(["A", "B"]),
  DOC_TYPE: z.string().min(1, "Required").max(2, "Max 2 characters"),
  NO_DOK: z.string().min(1, "Required").max(25, "Max 25 characters"),
  REFERENCE: z.string().max(50).optional(),
  DEBIT_KREDIT: z.enum(["D", "K"]),
  ACCOUNT: z.string().min(1, "Required").max(10, "Max 10 characters"),
  AMOUNT: z.string().min(1, "Required"),
  BA: z.string().min(1, "Business Area is required"),
  Fiscal_year: z.coerce.number().int().min(2000).max(2100),
  virtual_acc: z.string().max(16),
  FILE_NAME: z.string().max(16).optional(),
  PPH: z.string().max(5).optional(),
  POSTING_DATE: z.string().optional(),
  DOC_DATE: z.string().optional(),
  VALUE_DATE: z.string().optional(),
  ALTERNATIVE_ACC: z.string().max(10).optional(),
  SEGMEN: z.string().max(5).optional(),
  FA: z.string().max(7).optional(),
  CC: z.string().max(10).optional(),
  PC: z.string().max(10).optional(),
  INTERNAL_ORDER: z.string().optional(),
  ASSIGNMENT: z.string().max(16).optional(),
  VENDOR: z.string().max(6).optional(),
  CUSTOMER: z.string().max(6).optional(),
  XREF1: z.string().optional(),
  XREF2: z.string().optional(),
  BA_ASAL: z.string().max(4).optional(),
  WWRVC: z.string().max(10).optional(),
  KNDNR: z.string().max(6).optional(),
  WWPRD: z.string().max(6).optional(),
  pos_status: z.coerce.number().int().optional(),
  status0: z.string().optional(),
  NO_DOKSAP: z.string().optional(),
});

export type PostingAutoLegacyFormData = z.infer<
  typeof postingAutoLegacyFormSchema
>;

// ============================================================================
// GENERATE SCHEMA
// ============================================================================

export const postingAutoLegacyGenerateSchema = z.object({
  invoice: z.string().min(1, "Invoice number is required"),
});

export type PostingAutoLegacyGenerateFormData = z.infer<
  typeof postingAutoLegacyGenerateSchema
>;
