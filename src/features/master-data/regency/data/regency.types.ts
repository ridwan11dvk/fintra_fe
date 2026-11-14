// Response type is single-sourced from @railfinance/ui
export type { RegencyResponse } from "@railfinance/core/masterdata";

/**
 * Regency Request - Payload for create and update operations
 */
export interface RegencyRequest {
  code?: string;
  name: string;
  provinceId: number;
  isActive?: boolean;
}
