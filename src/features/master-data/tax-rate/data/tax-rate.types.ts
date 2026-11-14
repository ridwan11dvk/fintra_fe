// Response type is single-sourced from @railfinance/ui
export type { TaxRateResponse } from "@railfinance/core/masterdata";

/**
 * Tax Rate Request - Payload for create and update operations
 */
export interface TaxRateRequest {
  code: string;
  name: string;
  description?: string;
  taxType: string;
  ratePercent: number;
  coefficientNumerator: number;
  coefficientDenominator: number;
  isUsedInRkip?: boolean;
  postingType?: string;
  isPostingRequired?: boolean;
  startDate: string;
  endDate?: string | null;
}
