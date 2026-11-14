// Response type is single-sourced from @railfinance/ui
export type { CountryResponse } from "@railfinance/core/masterdata";

/**
 * Country Request - Payload for create and update operations
 */
export interface CountryRequest {
  name: string;
  iso2Code?: string;
  iso3Code?: string;
  dialCode?: string;
  isActive?: boolean;
}
