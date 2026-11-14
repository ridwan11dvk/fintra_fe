// Response type is single-sourced from @railfinance/ui
export type { TransactionCategoryResponse } from "@railfinance/core/masterdata";

/**
 * Transaction Category Request - Payload for create and update operations
 */
export interface TransactionCategoryRequest {
  name: string;
  description?: string;
  isActive?: boolean;
}
