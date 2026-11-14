/**
 * Digital Vault Feature Schemas
 * Zod schemas for validation and type-safe forms
 */

import { z } from "zod";

// ============================================================================
// STATION SUMMARY LIST FILTERS
// ============================================================================

export const stationSummaryListFilterSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  search: z.string().max(255).optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
  page: z.number().int().min(0),
  size: z.number().int().min(1).max(100),
});

export type StationSummaryListFilterFormData = z.infer<
  typeof stationSummaryListFilterSchema
>;

// ============================================================================
// CLOSURE DETAIL FILTERS
// ============================================================================

export const closureDetailFilterSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  search: z.string().max(255).optional(), // closure number, VA, company code
  page: z.number().int().min(0),
  size: z.number().int().min(1).max(100),
});

export type ClosureDetailFilterFormData = z.infer<
  typeof closureDetailFilterSchema
>;
