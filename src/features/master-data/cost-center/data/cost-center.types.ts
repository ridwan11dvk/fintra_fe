/**
 * Cost Center Request - Payload for create and update operations
 */
// Response type is single-sourced from @railfinance/ui
export type { CostCenterResponse } from "@railfinance/core/masterdata";

export interface CostCenterRequest {
  companyCode: string;
  businessAreaCode?: string | null;
  costCenterCode: string;
  costCenterName: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  categoryId?: number | null;
}
