// Response type is single-sourced from @railfinance/ui
export type { VillageResponse } from "@railfinance/core/masterdata";

/**
 * Village Request - Payload for create and update operations
 */
export interface VillageRequest {
  code?: string;
  name: string;
  postalCode?: string;
  provinceId: number;
  regencyId: number;
  districtId: number;
  isActive?: boolean;
}
