// Response type is single-sourced from @railfinance/ui
export type { ProvinceResponse } from "@railfinance/core/masterdata";

/**
 * Province Request - Payload for create and update operations
 */
export interface ProvinceRequest {
  code?: string;
  name: string;
}
