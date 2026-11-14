// Response type is single-sourced from @railfinance/ui
export type { CustomsOfficeResponse } from "@railfinance/core/masterdata";

/**
 * Customs Office Request - Payload for create and update operations
 */
export interface CustomsOfficeRequest {
  code: string;
  name: string;
  isActive?: boolean;
}
