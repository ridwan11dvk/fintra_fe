// Response type is single-sourced from @railfinance/ui
export type { PartnerCategoryResponse } from "@railfinance/core/masterdata";

/**
 * Partner Category Request - Payload for create and update operations
 */
export interface PartnerCategoryRequest {
  name: string;
  description?: string;
  isActive?: boolean;
}
