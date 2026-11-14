// Response type is single-sourced from @railfinance/ui
export type { CurrencyResponse } from "@railfinance/core/masterdata";

/**
 * Currency Request - Payload for create and update operations
 */
export interface CurrencyRequest {
  countryId: number;
  code: string;
  name?: string;
  symbol?: string;
  lowestValue?: number;
  isPrimary?: boolean;
  isActive?: boolean;
}
