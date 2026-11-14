// Response type is single-sourced from @railfinance/ui
export type { CompanyTaxResponse } from "@railfinance/core/masterdata";

/**
 * Company Tax Request - Payload for create and update operations
 */
export interface CompanyTaxRequest {
  companyCode: string;
  taxRateId: number;
  glAccount?: string | null;
  startDate: string;
  endDate?: string | null;
}
