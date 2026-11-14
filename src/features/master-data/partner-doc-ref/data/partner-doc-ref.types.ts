// Response type is single-sourced from @railfinance/ui
export type { PartnerDocRefResponse } from "@railfinance/core/masterdata";

/**
 * Partner Document Reference Request - Payload for create and update operations
 */
export interface PartnerDocRefRequest {
  countryId: number;
  companyCode: string;
  /** ID of the DOCUMENT_NAME lookup value from the document name master data */
  documentNameId: number;
  partnerLegalityId: number;
  partnerRoleId: number;
  partnerCategoryId?: number | null;
  partnerClassificationId?: number | null;
  partnerTypeId?: number | null;
  partnerSubTypeId?: number | null;
  isActive?: boolean;
}
