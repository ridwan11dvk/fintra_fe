import type { ImportResponse } from "@railfinance/core/types";

// Response type is single-sourced from @railfinance/ui

/** Alias kept for import-preview rows */
export type BusinessAreaImportResponse = ImportResponse;

/**
 * Business Area Request - Payload for create and update operations
 */
export interface BusinessAreaRequest {
  companyCode: string;
  name: string;
  baCode: string;
  branchCode?: string;
  email?: string;
  taxEmail?: string;
  nitku?: string;
  npwp?: string;
  clientId?: string;
  clientSecret?: string;
}

export { type BusinessAreaResponse } from "@railfinance/core/masterdata";
