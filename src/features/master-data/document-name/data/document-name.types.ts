import type { LookupValueResponse } from "@railfinance/core/masterdata";

/**
 * Document Name Request - Payload for create and update operations
 */
export interface DocumentNameRequest {
  name: string;
  description?: string;
  isActive?: boolean;
}

export type DocumentNameResponse = LookupValueResponse;
