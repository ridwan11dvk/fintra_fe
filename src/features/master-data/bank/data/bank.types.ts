import type { ImportResponse } from "@railfinance/core/types";

// Response type is single-sourced from @railfinance/ui
export type { BankResponse } from "@railfinance/core/masterdata";

/**
 * Bank Request - Payload for create and update operations
 */
export interface BankRequest {
  name: string;
  code: string;
  color?: string;
  rtgsCode?: string;
  onlineCode?: string;
  bifastCode?: string;
  sknCode?: string;
  pgCode?: string;
  isActive?: boolean;
}

/**
 * Bank Import Response - Response from import endpoint
 */
export type BankImportResponse = ImportResponse;
