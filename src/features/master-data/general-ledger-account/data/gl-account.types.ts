// Response type is single-sourced from @railfinance/ui
export type { GeneralLedgerAccountResponse } from "@railfinance/core/masterdata";

/**
 * GL Account Request - Payload for create and update operations
 */
export interface GLAccountRequest {
  companyCode: string;
  baCode?: string | null;
  account: string;
  name?: string | null;
  description?: string;
  commitmentItem?: string;
  operationalCostComponent?: string;
  imoCostComponent?: string;
  startDate: string;
  endDate?: string | null;
}
