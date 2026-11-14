// Response type is single-sourced from @railfinance/ui
export type { CurrencyRateDetailResponse, CurrencyRateResponse } from "@railfinance/core/masterdata";

/**
 * Currency Rate Request - Payload for create and update operations
 */
export interface CurrencyRateRequest {
  currencyCode: string;
  rateType: string;
  rate: number;
  description?: string;
  startDate: string;
  endDate?: string | null;
}

/**
 * Rate Type - Valid rate type values
 */
export const RateType = {
  KMK: "KMK",
  BI: "BI",
} as const;

export type RateType = (typeof RateType)[keyof typeof RateType];
