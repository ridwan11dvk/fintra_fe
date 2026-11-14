// Response type is single-sourced from @railfinance/ui
export type { PartnerClassificationResponse } from "@railfinance/core/masterdata";

/**
 * Partner Classification Request - Payload for create and update operations
 */
export interface PartnerClassificationRequest {
  name: string;
  description?: string;
  isActive?: boolean;
}
