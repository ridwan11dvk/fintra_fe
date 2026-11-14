import type { ImportResponse } from "@railfinance/core/types";

/** Alias kept for import-preview rows */
export type HouseBankImportResponse = ImportResponse;

/**
 * House Bank Request - Payload for create and update operations
 */
export interface HouseBankRequest {
  bankCode: string;
  companyCode: string;
  currencyCode: string;
  accountId: string;
  accountNumber: string;
  accountName: string;
  erpCode?: string;
}

// Response type is single-sourced from @railfinance/ui
export { type HouseBankResponse } from "@railfinance/core/masterdata";
