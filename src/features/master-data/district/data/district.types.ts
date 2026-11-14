// Response type is single-sourced from @railfinance/ui
export type { DistrictResponse } from "@railfinance/core/masterdata";

/**
 * District Request - Payload for create and update operations
 */
export interface DistrictRequest {
  code?: string;
  name: string;
  provinceId: number;
  regencyId: number;
  isActive?: boolean;
}
