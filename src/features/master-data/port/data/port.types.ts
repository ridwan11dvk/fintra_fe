import type { ImportResponse } from "@railfinance/core/types";
import type { PortResponse } from "@railfinance/core/masterdata";

// Response type is single-sourced from @railfinance/ui
export type { PortResponse };

/** Alias kept for import-preview rows */
export type PortImportResponse = ImportResponse;

/**
 * Port Request - Payload for create and update operations
 */
export interface PortRequest {
  customsOfficeId: number;
  code: string;
  name: string;
  isActive?: boolean;
}
