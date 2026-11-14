// Response type is single-sourced from @railfinance/ui
export type { PartnerTypeResponse } from "@railfinance/core/masterdata";

/**
 * Partner Type Request - Payload for create and update operations
 */
export interface PartnerTypeRequest {
  code: string;
  partnerLegalityId: number;
  parentId?: number | null;
  name: string;
  description?: string;
  isActive?: boolean;
  integratedToErp?: boolean;
}
