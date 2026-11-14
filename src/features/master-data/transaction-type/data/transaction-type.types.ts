// Response type is single-sourced from @railfinance/ui
export type { TransactionTypeResponse } from "@railfinance/core/masterdata";

/**
 * Transaction Type Request - Payload for create and update operations
 */
export interface TransactionTypeRequest {
  companyCode: string;
  code: string;
  tcode?: string;
  name: string;
  description?: string;
  moduleId?: number;
  docType?: string;
  docBase?: string;
  formType?: string;
  type?: "revenue" | "prepaid" | "freight" | "";
  customerCode?: string;
  taxableItemCode?: string;
  invoiceCode?: string;
  isVatUsed?: boolean;
  hasVirtualPenalty?: boolean;
  isRevenueRecorded?: boolean;
  isAutoBilling?: boolean;
  glRevenue?: string;
  glPrepaid?: string;
  glFreight?: string;
  wwprd?: string;
  wwrvc?: string;
  vaSource?: string;
  isActive: boolean;
}
